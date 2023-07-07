import { useState, useCallback } from "react";

import MockResponseConfigComponent from "./components/MockResponseConfigComponent";

import { PlusIcon } from "@heroicons/react/24/solid";

import { v4 as uuidv4 } from "uuid";

function App() {
  const [mockResponseConfigKeys, setMockResponseConfigKeys] = useState(
    [] as string[]
  );

  const handleAddButtonPressed = useCallback(() => {
    setMockResponseConfigKeys((keys) => [...keys, uuidv4()]);
  }, []);

  const handleDeleteMockResponseConfig = useCallback((id: string) => {
    setMockResponseConfigKeys((keys) => keys.filter((key) => key !== id));
  }, []);

  return (
    <div className="h-auto w-4/5 flex mt-4 ml-40 mr-40 mb-4 flex-col items-center border border-gray-300 rounded-xl">
      <div className="w-4/5 shrink-0 flex px-2 pb-0 mt-4">
        <h1 className="text-gray-900 self-center text-xl ">
          Mock GraphQL Requests
        </h1>
        <PlusIcon
          title="Add new operation"
          className="w-10 h-10 p-2 shrink-0 rounded-full ml-auto text-gray-900 hover:bg-gray-100"
          onClick={handleAddButtonPressed}
        />
      </div>

      <div className="grow w-4/5 flex flex-col items-center p-2">
        {mockResponseConfigKeys.map((key) => (
          <MockResponseConfigComponent
            key={key}
            id={key}
            onDelete={handleDeleteMockResponseConfig}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
