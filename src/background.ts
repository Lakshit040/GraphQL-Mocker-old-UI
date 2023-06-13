import { MessageType, GraphQLOperationType } from "./common/types";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  let isResponseAsync = false;

  let tabId = msg.data.tabId;

  switch (msg.type) {
    case MessageType.PanelMounted: {
      console.log(`${tabId}: Panel mounted`);
      break;
    }
    case MessageType.StartMocking: {
      break;
    }
  }

  return isResponseAsync;
});

function startMocking(
  operationType: GraphQLOperationType,
  operationName: string,
  tabId: number
) {
  function _listener(details: chrome.webRequest.WebRequestBodyDetails) {
    let { url, method, requestBody } = details;
    if (requestBody === null) return;
  }

  chrome.webRequest.onBeforeRequest.addListener(
    _listener,
    { urls: ["http://*/*", "https://*/*"], tabId },
    ["requestBody"]
  );
}
