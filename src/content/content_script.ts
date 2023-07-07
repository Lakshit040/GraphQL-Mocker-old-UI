import { MessageType } from "../common/types";
import { v4 as uuidv4 } from "uuid";

interface CustomEventDetail {
  requestId: string;
  data: any;
}

const fetchRequestsMap: Map<string, (response?: any) => void> = new Map();

const interceptScript = document.createElement("script");
interceptScript.src = chrome.runtime.getURL("js/inject.js");
document.head.prepend(interceptScript);

window.addEventListener("request-intercepted", (event) => {
  const { data, requestId } = (event as any).detail as CustomEventDetail;
  chrome.runtime.sendMessage(data).then(({ response, statusCode }) => {
    const reply = new CustomEvent("mock-response", {
      detail: { requestId, response, statusCode },
    });
    window.dispatchEvent(reply);
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case MessageType.DoFetch: {
      const requestId = uuidv4();
      fetchRequestsMap.set(requestId, sendResponse);
      const forward = new CustomEvent("do-fetch", {
        detail: { requestId, data: msg.data },
      });
      window.dispatchEvent(forward);
      break;
    }
  }

  const isResponseAsync = true;
  return isResponseAsync;
});

window.addEventListener("fetch-response", (event) => {
  const { requestId, data } = (event as any).detail as CustomEventDetail;
  const sendResponse = fetchRequestsMap.get(requestId);
  if (sendResponse !== undefined) {
    sendResponse(data);
    fetchRequestsMap.delete(requestId);
  }
});
