import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    chrome.runtime.sendMessage({ msg: "Hi from App.tsx!" });
  }, []);

  return (
    <div className="App">
      Hello World
    </div>
  );
}

export default App;