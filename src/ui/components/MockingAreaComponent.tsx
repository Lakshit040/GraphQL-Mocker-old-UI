import React, { useCallback } from "react";
import { PlayIcon, CodeBracketIcon } from "@heroicons/react/24/solid";

interface MockingAreaComponentProps {
  id: string;
  mockResponse: string;
  shouldRandomizeResponse: boolean;
  isMockResponseTextAreaFocused: boolean;
  onMockResponseChange: (
    event: React.ChangeEvent<HTMLTextAreaElement> | string
  ) => void;
  onMockResponseTextAreaFocused: () => void;
  onMockResponseTextAreaBlurred: () => void;
  onPrettifyButtonPressed: () => void;
  onGenerateResponseHereButtonPressed: (id: string) => void;
}

const MockingAreaComponent = ({
  id,
  mockResponse,
  shouldRandomizeResponse,
  isMockResponseTextAreaFocused,
  onMockResponseChange,
  onMockResponseTextAreaBlurred,
  onMockResponseTextAreaFocused,
  onPrettifyButtonPressed,
  onGenerateResponseHereButtonPressed,
}: MockingAreaComponentProps) => {
  const handleRandomizeHere = useCallback(() => {
    onGenerateResponseHereButtonPressed(id);
  }, [id, onGenerateResponseHereButtonPressed]);

  return (
    <div className="flex flex-col-reverse mt-4">
      <textarea
        id="inputMockResponse"
        value={mockResponse}
        className="my-2 py-1 px-1 w-full font-mono border border-gray-300 rounded-lg text-xs focus:border-blue-500 focus:ring-blue-500 input-mock-response"
        rows={4}
        onChange={onMockResponseChange}
        onFocus={onMockResponseTextAreaFocused}
        onBlur={onMockResponseTextAreaBlurred}
        disabled={shouldRandomizeResponse}
      ></textarea>
      <div className="flex justify-between">
        <label
          htmlFor="inputMockResponse"
          className={`text-xs ${
            isMockResponseTextAreaFocused ? "text-blue-600" : "text-gray-400"
          }`}
        >
          Mock Response
        </label>
        <div className="flex">
          <PlayIcon
            title="Randomize here"
            className="w-5 h-5 p-1 shrink-0 rounded-full text-gray-400 hover:bg-gray-200"
            onClick={handleRandomizeHere}
          />
          <CodeBracketIcon
            title="Prettify"
            className="w-5 h-5 p-1 shrink-0 rounded-full text-gray-400 hover:bg-gray-200"
            onClick={onPrettifyButtonPressed}
          />
        </div>
      </div>
    </div>
  );
};

export default MockingAreaComponent;
