import { useState, useCallback } from "react";
import TopAlignedLabelAndInput from "./TopAlignedLabelAndInput";

import { GraphQLOperationType } from "../../common/types";
import { backgroundSetMockResponse } from "../helpers/utils";

const QUERY = "query";
const MUTATION = "mutation";

const MockResponseConfigComponent = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [operationType, setOperationType] = useState(
    GraphQLOperationType.Query
  );
  const [operationName, setOperationName] = useState("");
  const [mockResponse, setMockResponse] = useState("");
  const [responseDelay, setResponseDelay] = useState("");
  const [statusCode, setStatusCode] = useState("200");
  const [shouldRandomizeResponse, setShouldRandomizeResponse] = useState(false);

  const [isMockResponseTextAreaFocused, setIsMockResponseTextAreaFocused] =
    useState(false);

  const handleHeadingClick = useCallback(() => {
    setIsExpanded((e) => !e);
  }, []);

  const handleOperationTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      event.target.value === QUERY
        ? setOperationType(GraphQLOperationType.Query)
        : setOperationType(GraphQLOperationType.Mutation);
    },
    []
  );

  const handleMockResponseChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMockResponse(event.target.value);
    },
    []
  );

  const handleMockResponseTextAreaFocused = useCallback(() => {
    setIsMockResponseTextAreaFocused(true);
  }, []);

  const handleMockResponseTextAreaBlurred = useCallback(() => {
    setIsMockResponseTextAreaFocused(false);
  }, []);

  const handleOperationNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setOperationName(event.target.value.trim());
    },
    []
  );

  const handleResponseDelayChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setResponseDelay(event.target.value.trim());
    },
    []
  );

  const handleStatusCodeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStatusCode(event.target.value.trim());
    },
    []
  );

  const handleShouldRandomizeResponseChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShouldRandomizeResponse((r) => !r);
    },
    []
  );

  const handlePrettifyButtonPressed = () => {
    try {
      const prettified = JSON.stringify(JSON.parse(mockResponse), null, 2);
      setMockResponse(prettified);
    } catch (err) {}
  };

  const handleMockButtonPressed = () => {
    const delay = +responseDelay;
    const status = +statusCode;
    backgroundSetMockResponse(
      operationType,
      operationName,
      mockResponse,
      isNaN(delay) ? 0 : delay,
      isNaN(status) ? 200 : status,
      shouldRandomizeResponse
    );
  };

  return (
    <div className="w-4/5 shadow-md my-1">
      {/* <h2> */}
      <button
        type="button"
        className={`flex items-center w-full p-2 text-gray-500 text-left border border-gray-200 ${
          isExpanded ? "bg-gray-100" : ""
        }`}
      >
        <svg
          className={`w-6 h-6 shrink-0 ml-1 mr-2 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleHeadingClick}
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <TopAlignedLabelAndInput
          htmlInputId="inputSelectOperationType"
          label="Operation Type"
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
          divClassAppend="mx-4"
          onChange={handleOperationNameChange}
        />

        <button
          className="px-6 py-2 h-auto ml-auto mr-1 self-center rounded-sm font-small tracking-wide text-white transition-colors duration-300 transform bg-blue-600  hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
          onClick={handleMockButtonPressed}
        >
          Mock
        </button>
      </button>
      {/* </h2> */}

      <div
        className={
          isExpanded ? "p-5 border border-t-0 border-gray-200" : "hidden"
        }
      >
        <div className="flex flex-col">
          <div className="flex items-stretch">
            <TopAlignedLabelAndInput
              htmlInputId="inputResponseDelay"
              type="number"
              label="Response Delay (ms)"
              value={responseDelay}
              divClassAppend="my-2"
              onChange={handleResponseDelayChange}
            />

            <TopAlignedLabelAndInput
              htmlInputId="inputStatusCode"
              type="number"
              label="Status Code"
              value={statusCode}
              divClassAppend="my-2 mx-4"
              onChange={handleStatusCodeChange}
            />
          </div>

          <TopAlignedLabelAndInput
            htmlInputId="inputShouldRandomizeResponse"
            label="Randomize Response"
            divClassOverride="mb-2 flex flex-row-reverse justify-end"
          >
            <input
              type="checkbox"
              className="mx-1 h-4 w-auto border-gray-200 rounded text-blue-600 focus:ring-blue-500 peer"
              checked={shouldRandomizeResponse}
              onChange={handleShouldRandomizeResponseChange}
            ></input>
          </TopAlignedLabelAndInput>

          <div className="flex flex-col-reverse">
            <textarea
              id="inputMockResponse"
              value={mockResponse}
              className="my-1 py-1 px-1 w-full font-mono border border-gray-300 rounded-sm text-xs focus:border-blue-500 focus:ring-blue-500 input-mock-response"
              rows={4}
              onChange={handleMockResponseChange}
              onFocus={handleMockResponseTextAreaFocused}
              onBlur={handleMockResponseTextAreaBlurred}
              disabled={shouldRandomizeResponse}
            ></textarea>
            <div className="flex">
              <label
                htmlFor="inputMockResponse"
                className={`text-xs ${
                  isMockResponseTextAreaFocused
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Mock Response
              </label>
              <button
                className="px-1 h-auto ml-auto self-center tracking-wider rounded-sm text-xs text-gray-500 transition-colors duration-300 transform bg-white hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80"
                onClick={handlePrettifyButtonPressed}
              >
                {"{}"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockResponseConfigComponent;
