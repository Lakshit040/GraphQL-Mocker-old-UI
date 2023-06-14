import { proxy } from "ajax-hook";
import { MessageType } from "../common/types";

function hijack(url, config) {
  return new Promise((resolve, reject) => {
    if (!/.*graphql.*/.test(url)) return reject();

    console.log(`Hijacking possible graphql request ${config.method} ${url}`);

    let message = {
      type: MessageType.RequestIntercepted,
      data: { url, config },
    };
    let event = new CustomEvent("from-injected", {
      detail: message,
    });
    window.dispatchEvent(event);

    // chrome.runtime.sendMessage(
    //   window.__GRAPHQL_MOCKER_EXTENSION_ID__,
    //   {
    //     type: MessageType.RequestIntercepted,
    //     data: { url, config },
    //   },
    //   {},
    //   (response) => {
    //     if (response) resolve(response);
    //     else reject();
    //   }
    // );
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
