const interceptScript = document.createElement("script");
interceptScript.src = chrome.runtime.getURL("js/inject.js");
document.head.prepend(interceptScript);

window.addEventListener("from-injected", (event) => {
  console.log("Content script received message from injected script");
  chrome.runtime.sendMessage((event as any).detail);
});
