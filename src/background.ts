chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let isResponseAsync = false;

  console.log(request.msg);

  return isResponseAsync;
});
