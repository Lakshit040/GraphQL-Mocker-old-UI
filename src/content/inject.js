import { proxy } from "ajax-hook";
import { MessageType } from "../common/types";

let hijackedRequests = new Map();

function hijack(url, config) {
  return new Promise((resolve, reject) => {
    if (!/.*graphql.*/.test(url) || config.method?.toLowerCase() !== "post")
      return reject();

    console.log(`Hijacking possible graphql request ${config.method} ${url}`);

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
  onResponse: (response, statusCode, handler) => {
    handler.resolve(response, statusCode);
  },
});

if (window.fetch) {
  const f = window.fetch;
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
  console.log("Injected script received message from content script");

  let { requestId, response, statusCode} = event.detail;
  if (!hijackedRequests.has(requestId)) return;

  let [resolve, reject] = hijackedRequests.get(requestId);

  if (response) {
    console.log("Injected script got response", response);
    console.log('Status code: ', statusCode)
    resolve({ response, statusCode });
  } else {
    reject();
  }

  hijackedRequests.delete(requestId);
});

function guidGenerator() {
  let S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}
