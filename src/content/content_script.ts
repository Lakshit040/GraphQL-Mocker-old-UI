const interceptScript = document.createElement("script");
interceptScript.src = chrome.runtime.getURL("js/inject.js");
document.head.prepend(interceptScript);

window.addEventListener("from-injected", (event) => {
  let { message, requestId } = (event as any).detail;
  chrome.runtime.sendMessage(message).then(({ response, statusCode }) => {
    let reply = new CustomEvent("from-content", {
      detail: { requestId, response, statusCode },
    });
    window.dispatchEvent(reply);
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Content script received message from background script");
  console.log(request);
});
