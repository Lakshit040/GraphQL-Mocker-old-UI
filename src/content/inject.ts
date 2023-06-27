import { proxy } from "ajax-hook";
import { MessageType } from "../common/types";
import { guidGenerator } from "../common/utils";

interface HijackedResponse {
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

const hijackedRequests = new Map();

function hijack(url: string, config?: RequestInit) {
  return new Promise<HijackedResponse>((resolve, reject) => {
    if (!/.*graphql.*/.test(url) || config?.method?.toLowerCase() !== "post")
      return reject();

    const requestId = guidGenerator();
    hijackedRequests.set(requestId, [resolve, reject]);

    const message = {
      type: MessageType.RequestIntercepted,
      data: { url, config },
    };
    const event = new CustomEvent("request-intercepted", {
      detail: { data: message, requestId },
    });
    window.dispatchEvent(event);
  });
}

// Capture XMLHttpRequests
proxy({
  onRequest: (config, handler) =>
    hijack(config.url, config)
      .then(({ response, statusCode }) => {
        return handler.resolve({
          config,
          status: statusCode,
          headers: [],
          response,
        });
      })
      .catch(() => handler.next(config)),
  onResponse: (response, handler) => {
    handler.resolve(response);
  },
});

// Capture fetch requests
const __oldFetch__: (
  input: RequestInfo | URL,
  init?: RequestInit
) => Promise<Response> = window.fetch;
window.fetch = (req, config = undefined) => {
  return hijack(req as string, config)
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
  if (!hijackedRequests.has(requestId)) return;

  const [resolve, reject] = hijackedRequests.get(requestId);

  if (response) {
    resolve({ response, statusCode });
  } else {
    reject();
  }

  hijackedRequests.delete(requestId);
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
