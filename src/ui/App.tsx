import { useState, useEffect } from "react";
import "./App.css";

import { MessageType, GraphQLOperationType } from "../common/types";

function setMockResponse(operationType: GraphQLOperationType, operationName: string, mockResponse: string) {
  chrome.runtime.sendMessage({
    type: MessageType.SetMockResponse,
    data: {
      operationType,
      operationName,
      mockResponse
    }
  });
}

function App() {
  useEffect(() => {
    chrome.runtime.sendMessage({ type: MessageType.PanelMounted, data: {tabId: chrome.devtools.inspectedWindow.tabId} });
  }, []);

  const [capturing, setCapturing] = useState(false);

  function handleClick() {
    setMockResponse(GraphQLOperationType.Query, "getViewerLogin", JSON.stringify({
      data: { viewer: { login: "Darth Vader" } }
    }));
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