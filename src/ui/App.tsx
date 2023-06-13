import { useEffect } from "react";
import "./App.css";

import { MessageType } from "../common/types";

function App() {
  useEffect(() => {
    chrome.runtime.sendMessage({ type: MessageType.PanelMounted, data: {tabId: chrome.devtools.inspectedWindow.tabId} });
  }, []);

  return (
    <div className="App">
      Hello World
    </div>
  );
}

export default App;