const interceptScript = document.createElement("script");
interceptScript.src = chrome.runtime.getURL("js/inject.js");
document.head.prepend(interceptScript);

window.addEventListener("from-injected", async (event) => {
  let { message, requestId } = (event as any).detail;
  try {
    const { response, statusCode} : {response: any, statusCode: number} = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
    // Handle the response and perform actions here
    let reply = new CustomEvent("from-content", {
      detail: { requestId, response, statusCode },
    });
    window.dispatchEvent(reply);
  } catch (error) {
    // Handle any errors that occur during message passing
    console.error(error);
  }
});
