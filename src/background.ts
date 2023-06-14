import { MessageType } from "./common/types";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  let isResponseAsync = false;

  switch (msg.type) {
    case MessageType.PanelMounted: {
      let tabId = msg.data.tabId;
      console.log(`${tabId}: Panel mounted`);
      break;
    }
    case MessageType.RequestIntercepted: {
      let tabId = sender.tab?.id;
      console.log(
        `${tabId}: Intercepted a request! ${msg.data.url} ${msg.data.config.method}`
      );
      break;
    }
  }

  return isResponseAsync;
});
