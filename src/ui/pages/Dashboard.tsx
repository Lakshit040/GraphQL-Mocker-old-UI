import { useState, useCallback } from "react";

import MockResponseConfigComponent from "../components/MockResponseConfigComponent";

import { PlusIcon } from "@heroicons/react/24/solid";

import { v4 as uuidv4 } from "uuid";

function Dashboard() {
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
    <div className="h-full flex m-4 flex-col items-center">
      <div className="w-full shrink-0 flex px-2 pb-0">
        <h1 className="text-white self-center text-xl tracking-wide">
          Mock GraphQL Requests
        </h1>
        <PlusIcon
          className="w-10 h-10 p-2 shrink-0 rounded-full ml-auto text-gray-400 hover:bg-gray-100"
          onClick={handleAddButtonPressed}
        />
      </div>

      <div className="grow w-full flex flex-col items-center p-2">
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

export default Dashboard;
