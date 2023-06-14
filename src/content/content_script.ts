const interceptScript = document.createElement("script");
interceptScript.src = chrome.runtime.getURL("js/inject.js");
document.head.prepend(interceptScript);

window.addEventListener("from-injected", (event) => {
  console.log("Content script received message from injected script");
  let { message, requestId } = (event as any).detail;
  chrome.runtime.sendMessage(message);

  let reply = new CustomEvent("from-content", {
    detail: { requestId, response: null },
  });
  window.dispatchEvent(reply);
});
