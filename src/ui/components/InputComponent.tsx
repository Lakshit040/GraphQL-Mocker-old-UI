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

function FloatingLabelAndInput({
  type,
  value,
  onChange,
  htmlInputId,
  children,
  classOverride,
}: any) {
  return (
    <div
      className={`flex flex-col-reverse ${classOverride ? classOverride : ""}`}
    >
      <input
        type={type}
        id={htmlInputId}
        value={value}
        className="py-0 px-0 my-1 h-8 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        onChange={onChange}
      />
      <label
        htmlFor={htmlInputId}
        className="text-xs text-gray-500 peer-focus:text-blue-600"
      >
        {children}
      </label>
    </div>
  );
}

function InputComponent() {
  const [op, setOp] = useState(GraphQLOperationType.Query);
  const [name, setName] = useState("");
  const [res, setRes] = useState("");
  const [delay, setDelay] = useState("");

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
    setDelay(event.target.value.trim());
  };

  function handleMockButtonPressed() {
    let _delay = +delay;
    setMockResponse(op, name, res, isNaN(_delay) ? 0 : _delay);
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-stretch">
        <div className="flex flex-col-reverse">
          <select
            id="inputSelectOperationType"
            value={op === GraphQLOperationType.Query ? "query" : "mutation"}
            className="h-8 w-full my-1 py-0 px-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500  peer"
            onChange={handleOptionChange}
          >
            <option value="query">Query</option>
            <option value="mutation">Mutation</option>
          </select>
          <label
            htmlFor="inputSelectOperationType"
            className="text-xs text-gray-500 peer-focus:text-blue-600"
          >
            Operation Type
          </label>
        </div>

        <FloatingLabelAndInput
          type="text"
          htmlInputId="inputOperationName"
          value={name}
          classOverride="mx-4"
          onChange={handleNameChange}
        >
          Operation Name
        </FloatingLabelAndInput>

        <button
          className="px-6 py-2 h-auto self-center rounded-sm font-small tracking-wide text-white transition-colors duration-300 transform bg-blue-600  hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
          onClick={handleMockButtonPressed}
        >
          Mock
        </button>
      </div>

      <FloatingLabelAndInput
        type="number"
        htmlInputId="inputResponseDelay"
        value={delay}
        classOverride="my-2"
        onChange={handleDelayChange}
      >
        Response Delay (ms)
      </FloatingLabelAndInput>

      <div className="flex flex-col-reverse">
        <textarea
          id="inputMockResponse"
          value={res}
          className="my-1 py-3 px-4 w-full border border-gray-300 rounded-sm text-sm focus:border-blue-500 focus:ring-blue-500 peer"
          rows={4}
          onChange={handleResponseChange}
        ></textarea>
        <label
          htmlFor="inputMockResponse"
          className="text-xs text-gray-500 peer-focus:text-blue-600"
        >
          Mock Response
        </label>
      </div>
    </div>
  );
}

export default InputComponent;
