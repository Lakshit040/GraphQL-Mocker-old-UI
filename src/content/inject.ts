import { MessageType } from "../common/types";
import { guidGenerator } from "../common/utils";

interface CapturedResponse {
  response: string | null;
  statusCode: number;
}

interface MockResponseEventDetail {
  requestId: string;
  response: string | null;
  statusCode: number;
}

interface DoFetchEventDetail {
  requestId: string;
  data: {
    url: string;
    config?: RequestInit;
  };
}

const capturedRequests = new Map();

const capture = (url: string, config?: RequestInit) => {
  return new Promise<CapturedResponse>((resolve, reject) => {
    if (!/.*graphql.*/.test(url) || config?.method?.toLowerCase() !== "post")
      return reject();

    const requestId = guidGenerator();
    capturedRequests.set(requestId, [resolve, reject]);

    const message = {
      type: MessageType.RequestIntercepted,
      data: { url, config: JSON.parse(JSON.stringify(config)) },
    };
    const event = new CustomEvent("request-intercepted", {
      detail: { data: message, requestId },
    });
    window.dispatchEvent(event);
  });
};

// Capture fetch requests
const __oldFetch__: (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response> = window.fetch;
window.fetch = (req, config = undefined) => {
  return capture(req as string, config)
    .then(({ response, statusCode }) => {
      return new Response(response, {
        headers: new Headers([]),
        status: statusCode,
      });
    })
    .catch(() => __oldFetch__(req, config));
};

window.addEventListener("mock-response", (event) => {
  const { requestId, response, statusCode } = (event as any)
    .detail as MockResponseEventDetail;
  if (!capturedRequests.has(requestId)) return;

  const [resolve, reject] = capturedRequests.get(requestId);

  if (response) {
    resolve({ response, statusCode });
  } else {
    reject();
  }

  capturedRequests.delete(requestId);
});

window.addEventListener("do-fetch", async (event) => {
  const { requestId, data } = (event as any).detail as DoFetchEventDetail;
  const { url, config } = data;

  const response = await __oldFetch__(url, config);
  const responseJSON = await response.json();

  const reply = new CustomEvent("fetch-response", {
    detail: { requestId, data: responseJSON },
  });
  window.dispatchEvent(reply);
});
