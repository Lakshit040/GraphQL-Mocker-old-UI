import { useState } from "react";

import { MessageType, GraphQLOperationType } from "../../common/types";

function setMockResponse(
  operationType: GraphQLOperationType,
  operationName: string,
  mockResponse: string,
  responseDelay: number
) {
  chrome.runtime.sendMessage({
    type: MessageType.SetMockResponse,
    data: {
      operationType,
      operationName,
      mockResponse,
      responseDelay,
    },
  });
}

function Label({ children }: any) {
  return (
    <label className="block text-sm text-gray-500 dark:text-gray-300">
      {children}
    </label>
  );
}

function Input({ type, value, onChange }: any) {
  return (
    <input
      className="block mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
      type={type}
      value={value}
      onChange={onChange}
    ></input>
  );
}

function InputComponent() {
  const [op, setOp] = useState(GraphQLOperationType.Query);
  const [name, setName] = useState("");
  const [res, setRes] = useState("");
  const [delay, setDelay] = useState(0);

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "query") {
      setOp(GraphQLOperationType.Query);
    } else {
      setOp(GraphQLOperationType.Mutation);
    }
  };

  const handleResponseChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setRes(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value.trim());
  };

  const handleDelayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _delay = +event.target.value;
    setDelay(!isNaN(_delay) ? _delay : 0);
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        <Label>Operation Type</Label>
        <select
          value={op === GraphQLOperationType.Query ? "query" : "mutation"}
          onChange={handleOptionChange}
        >
          <option value="query">Query</option>
          <option value="mutation">Mutation</option>
        </select>

        <div>
          <Label>Operation Name</Label>
          <Input type="text" value={name} onChange={handleNameChange} />
        </div>

        <button
          className="px-6 py-2 h-8 rounded-none font-small tracking-wide text-white transition-colors duration-300 transform bg-blue-600  hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
          onClick={() => setMockResponse(op, name, res, delay)}
        >
          Mock
        </button>
      </div>

      <div className="flex">
        <Label>Response Delay (ms)</Label>
        <Input
          type="number"
          value={delay.toString()}
          onChange={handleDelayChange}
        />
      </div>

      <div className="flex">
        <Label>Mock Response</Label>
        <textarea
          rows={4}
          value={res}
          onChange={handleResponseChange}
        ></textarea>
      </div>
    </div>
  );
}

export default InputComponent;
