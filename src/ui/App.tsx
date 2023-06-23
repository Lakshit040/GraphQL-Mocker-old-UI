import { useState, useCallback } from "react";

import MockResponseConfigComponent from "./components/MockResponseConfigComponent";
import { guidGenerator } from "../common/utils";

function App() {
  const [mockResponseConfigKeys, setMockResponseConfigKeys] = useState(
    [] as string[]
  );

  const handleAddButtonPressed = useCallback(() => {
    setMockResponseConfigKeys((keys) => [...keys, guidGenerator()]);
  }, []);

  return (
    <div className="h-full flex flex-col items-center">
      <div className="w-4/5 shrink-0 flex py-2 px-2 pb-0">
        <h2 className="text-gray-900 self-center text-lg tracking-wide">
          Mock GraphQL Requests
        </h2>
        <svg
          className="w-8 h-8 p-2 shrink-0 rounded-full ml-auto text-gray-500 hover:bg-gray-100"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleAddButtonPressed}
        >
          <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
        </svg>
      </div>

      <div className="grow w-4/5 flex flex-col items-center p-2">
        {mockResponseConfigKeys.map((key) => (
          <MockResponseConfigComponent key={key} />
        ))}
      </div>
    </div>
  );
}

export default App;
