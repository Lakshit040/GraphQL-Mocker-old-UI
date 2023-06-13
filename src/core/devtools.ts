let listeners = new Map<
  number,
  (source: chrome.debugger.Debuggee, method: string, params?: Object) => void
>();

interface FetchRequestPausedParams {
  requestId: string;
}

export async function startMocking() {
  console.log("Mocking started");
  const debuggee: chrome.debugger.Debuggee = {
    tabId: chrome.devtools.inspectedWindow.tabId,
  };

  function _listener(
    source: chrome.debugger.Debuggee,
    method: string,
    params?: Object
  ) {
    console.log("Listener triggered");

    if (source.tabId !== chrome.devtools.inspectedWindow.tabId) return;
    if (method !== "Fetch.requestPaused") return;
    if (params === undefined) return;

    console.log("Intercepted a request! Mocking it now...");

    let fulfillParams = {
      requestId: (params as FetchRequestPausedParams).requestId,
      responseCode: 200,
      binaryResponseHeaders: btoa(
        "Content-Type: application/json; charset=utf-8"
      ),
      body: btoa(
        JSON.stringify({ data: { viewer: { login: "Darth Vader" } } })
      ),
    };

    chrome.debugger.sendCommand(
      debuggee,
      "Fetch.fulfillRequest",
      fulfillParams
    );
  }

  chrome.debugger.onEvent.addListener(_listener);
  listeners.set(chrome.devtools.inspectedWindow.tabId, _listener);

  await chrome.debugger.attach(debuggee, "1.0");
  await chrome.debugger.sendCommand(debuggee, "Fetch.enable", {
    patterns: [{ urlPattern: "*" }],
  });
}

export async function stopMocking() {
  console.log("Mocking stopped");

  const { tabId } = chrome.devtools.inspectedWindow;
  const debuggee: chrome.debugger.Debuggee = { tabId };

  let _listener = listeners.get(tabId);
  if (_listener === undefined) return;

  chrome.debugger.onEvent.removeListener(_listener);
  listeners.delete(tabId);

  await chrome.debugger.sendCommand(debuggee, "Fetch.disable");
  await chrome.debugger.detach(debuggee);
}
