import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    chrome.runtime.sendMessage({ popupMounted: true });
  }, []);

  return (
    <div className="App">
      Hello World
    </div>
  );
}

export default App;