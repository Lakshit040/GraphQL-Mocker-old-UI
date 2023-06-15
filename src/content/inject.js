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
      .then(({ response }) => {
        return handler.resolve({
          config,
          status: 200,
          headers: [],
          response,
        });
      })
      .catch(() => handler.next(config)),
  onResponse: (response, handler) => {
    handler.resolve(response);
  },
});

if (window.fetch) {
  const f = window.fetch;
  window.fetch = (req, config = undefined) => {
    return hijack(req, config)
      .then(({ response }) => {
        return new Response(response, {
          headers: new Headers([]),
          status: 200,
        });
      })
      .catch(() => f(req, config));
  };
}

window.addEventListener("from-content", (event) => {
  console.log("Injected script received message from content script");

  let { requestId, response } = event.detail;
  if (!hijackedRequests.has(requestId)) return;

  let [resolve, reject] = hijackedRequests.get(requestId);

  if (response) {
    console.log("Injected script got response", response);
    resolve({ response });
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
