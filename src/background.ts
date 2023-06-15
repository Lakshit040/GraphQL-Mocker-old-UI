import { MessageType } from "./common/types";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  let isResponseAsync = false;

  let tabId = msg.data.tabId;

  switch (msg.type) {
    case MessageType.PanelMounted: {
      console.log(`${tabId}: Panel mounted`);
      break;
    }
  }

  return isResponseAsync;
});
