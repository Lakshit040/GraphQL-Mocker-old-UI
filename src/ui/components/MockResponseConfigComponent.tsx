import { useState, useCallback } from "react";

import TopAlignedLabelAndInput from "./TopAlignedLabelAndInput";
import SvgButtonComponent from "./SvgButtonComponent";

import { GraphQLOperationType } from "../../common/types";
import { backgroundSetMockResponse } from "../helpers/utils";

const QUERY = "query";
const MUTATION = "mutation";

const MockResponseConfigComponent = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [areMocking, setAreMocking] = useState(false);

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
    setAreMocking((m) => !m);

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

  const handleDeleteButtonPressed = () => {};

  return (
    <div className="w-full shadow-md my-1">
      <div
        className={`flex items-center w-full p-2 text-left border border-gray-200 ${
          isExpanded ? "bg-gray-100" : ""
        }`}
      >
        <SvgButtonComponent
          className={`w-6 h-6 text-gray-500 shrink-0 ml-1 mr-2 ${
            isExpanded ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          onClick={handleHeadingClick}
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </SvgButtonComponent>

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

        <div className="grow flex flex-row-reverse">
          <SvgButtonComponent
            className="w-10 h-10 p-2 ml-1 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
            viewBox="0 0 32 32"
            onClick={handleDeleteButtonPressed}
          >
            <path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5  c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4  C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z" />
          </SvgButtonComponent>
          <SvgButtonComponent
            className="w-10 h-10 p-2 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
            viewBox="0 0 32 32"
            onClick={handleMockButtonPressed}
          >
            {areMocking ? (
              <path d="M5.92 24.096q0 0.832 0.576 1.408t1.44 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.44 0.576t-0.576 1.44v16.16zM18.016 24.096q0 0.832 0.608 1.408t1.408 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.408 0.576t-0.608 1.44v16.16z"></path>
            ) : (
              <path d="M5.92 24.096q0 1.088 0.928 1.728 0.512 0.288 1.088 0.288 0.448 0 0.896-0.224l16.16-8.064q0.48-0.256 0.8-0.736t0.288-1.088-0.288-1.056-0.8-0.736l-16.16-8.064q-0.448-0.224-0.896-0.224-0.544 0-1.088 0.288-0.928 0.608-0.928 1.728v16.16z" />
            )}
          </SvgButtonComponent>
        </div>
      </div>

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
