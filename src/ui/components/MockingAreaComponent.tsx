import React from "react";

interface MockingAreaComponentProps {
  mockResponse: string;
  shouldRandomizeResponse: boolean;
  isMockResponseTextAreaFocused: boolean;
  onMockResponseChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onMockResponseTextAreaFocused: () => void;
  onMockResponseTextAreaBlurred: () => void;
  onPrettifyButtonPressed: () => void;
}

const MockingAreaComponent = ({
  mockResponse,
  shouldRandomizeResponse,
  isMockResponseTextAreaFocused,
  onMockResponseChange,
  onMockResponseTextAreaBlurred,
  onMockResponseTextAreaFocused,
  onPrettifyButtonPressed,
}: MockingAreaComponentProps) => {
  return (
    <div className="flex flex-col-reverse mt-4">
      <textarea
        id="inputMockResponse"
        value={mockResponse}
        className="my-1 py-1 px-1 w-full font-mono border border-gray-300 rounded-sm text-xs focus:border-blue-500 focus:ring-blue-500 input-mock-response"
        rows={4}
        onChange={onMockResponseChange}
        onFocus={onMockResponseTextAreaFocused}
        onBlur={onMockResponseTextAreaBlurred}
        disabled={shouldRandomizeResponse}
      ></textarea>
      <div className="flex">
        <label
          htmlFor="inputMockResponse"
          className={`text-xs ${
            isMockResponseTextAreaFocused ? "text-blue-600" : "text-gray-500"
          }`}
        >
          Mock Response
        </label>
        <button
          className="px-1 h-auto ml-auto self-center tracking-wider rounded-sm text-xs text-gray-500 transition-colors duration-300 transform bg-white hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80"
          onClick={onPrettifyButtonPressed}
        >
          {"{}"}
        </button>
      </div>
    </div>
  );
};

export default MockingAreaComponent;