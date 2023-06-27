import { proxy } from "ajax-hook";
import { MessageType } from "../common/types";
import { guidGenerator } from "../common/utils";

let hijackedRequests = new Map();

function hijack(url, config) {
  return new Promise((resolve, reject) => {
    if (!/.*graphql.*/.test(url) || config.method?.toLowerCase() !== "post")
      return reject();

    let requestId = guidGenerator();
    hijackedRequests.set(requestId, [resolve, reject]);

    let message = {
      type: MessageType.RequestIntercepted,
      data: { url, config },
    };
    let event = new CustomEvent("from-injected", {
      detail: { message, requestId },
    });
    window.dispatchEvent(event);
  });
}

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

let __oldFetch__ = undefined;
if (window.fetch) {
  const f = window.fetch;
  __oldFetch__ = f;
  window.fetch = (req, config = undefined) => {
    return hijack(req, config)
      .then(({ response, statusCode }) => {
        return new Response(response, {
          headers: new Headers([]),
          status: statusCode,
        });
      })
      .catch(() => f(req, config));
  };
}

window.addEventListener("from-content", (event) => {
  let { requestId, response, statusCode } = event.detail;
  if (!hijackedRequests.has(requestId)) return;

  let [resolve, reject] = hijackedRequests.get(requestId);

  if (response) {
    resolve({ response, statusCode });
  } else {
    reject();
  }

  hijackedRequests.delete(requestId);
});

window.addEventListener("do-fetch", async (event) => {
  const { requestId, data } = event.detail;
  const { url, config } = data;

  const response = await __oldFetch__(url, config);
  const responseJSON = await response.json();

  const reply = new CustomEvent("fetch-response", {
    detail: { requestId, data: responseJSON },
  });
  window.dispatchEvent(reply);
});
