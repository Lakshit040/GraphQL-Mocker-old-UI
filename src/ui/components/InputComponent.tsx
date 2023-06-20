import { useState } from "react";
import TopAlignedLabelAndInput from "./TopAlignedLabelAndInput";

import { GraphQLOperationType } from "../../common/types";
import { backgroundSetMockResponse } from "../helpers/utils";

const QUERY = "query";
const MUTATION = "mutation";

const InputComponent = () => {
  const [operationType, setOperationType] = useState(
    GraphQLOperationType.Query
  );
  const [operationName, setOperationName] = useState("");
  const [mockResponse, setMockResponse] = useState("");
  const [responseDelay, setResponseDelay] = useState("");
  const [statusCode, setStatusCode] = useState("200");

  const handleOperationTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    event.target.value === QUERY
      ? setOperationType(GraphQLOperationType.Query)
      : setOperationType(GraphQLOperationType.Mutation);
  };

  const handleMockResponseChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMockResponse(event.target.value);
  };

  const handleOperationNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOperationName(event.target.value.trim());
  };

  const handleResponseDelayChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setResponseDelay(event.target.value.trim());
  };

  const handleStatusCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStatusCode(event.target.value.trim());
  };

  function handleMockButtonPressed() {
    const delay = +responseDelay;
    const status = +statusCode;
    backgroundSetMockResponse(
      operationType,
      operationName,
      mockResponse,
      isNaN(delay) ? 0 : delay,
      isNaN(status) ? 200 : status
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-stretch">
        <TopAlignedLabelAndInput
          htmlInputId="inputSelectOperationType"
          label="OperationType"
        >
          <select
            id="inputSelectOperationType"
            value={
              operationType === GraphQLOperationType.Query ? QUERY : MUTATION
            }
            className="h-8 w-full my-1 py-0 px-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500  peer"
            onChange={handleOperationTypeChange}
          >
            <option value={QUERY}>Query</option>
            <option value={MUTATION}>Mutation</option>
          </select>
        </TopAlignedLabelAndInput>

        <TopAlignedLabelAndInput
          htmlInputId="inputOperationName"
          type="text"
          label="Operation Name"
          value={operationName}
          classOverride="mx-4"
          onChange={handleOperationNameChange}
        />

        <button
          className="px-6 py-2 h-auto self-center rounded-sm font-small tracking-wide text-white transition-colors duration-300 transform bg-blue-600  hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
          onClick={handleMockButtonPressed}
        >
          Mock
        </button>
      </div>

      <div className="flex items-stretch">
        <TopAlignedLabelAndInput
          htmlInputId="inputResponseDelay"
          type="number"
          label="Response Delay (ms)"
          value={responseDelay}
          classOverride="my-2"
          onChange={handleResponseDelayChange}
        />

        <TopAlignedLabelAndInput
          htmlInputId="inputStatusCode"
          type="number"
          label="Status Code"
          value={statusCode}
          classOverride="my-2 mx-4"
          onChange={handleStatusCodeChange}
        />
      </div>

      <TopAlignedLabelAndInput
        htmlInputId="inputMockResponse"
        label="Mock Response"
      >
        <textarea
          id="inputMockResponse"
          value={mockResponse}
          className="my-1 py-3 px-4 w-full border border-gray-300 rounded-sm text-sm focus:border-blue-500 focus:ring-blue-500 peer"
          rows={4}
          onChange={handleMockResponseChange}
        ></textarea>
      </TopAlignedLabelAndInput>
    </div>
  );
};

export default InputComponent;
