import { useState, useEffect } from "react";
import "./App.css";

import { MessageType } from "../common/types";


function App() {
  useEffect(() => {
    chrome.runtime.sendMessage({ type: MessageType.PanelMounted, data: {tabId: chrome.devtools.inspectedWindow.tabId} });
  }, []);

  const [capturing, setCapturing] = useState(false);

  function handleClick() {
    setCapturing(!capturing);
  }

  return (
    <div className={`App App${capturing ? "Stop" : "Start"}Capturing`} onClick={handleClick}>
      <div className="CaptureStatus">
        {capturing ? "Stop" : "Start"} Capturing
      </div>
    </div>
  );
}

export default App;