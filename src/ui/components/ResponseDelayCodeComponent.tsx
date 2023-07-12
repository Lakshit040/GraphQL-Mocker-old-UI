import React from "react";
import TopAlignedLabelAndInput from "./TopAlignedLabelAndInput";

interface ResponseDelayCodeComponentProps {
  responseDelay: number;
  statusCode: number;
  shouldRandomizeResponse: boolean;
  onResponseDelayChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onShouldRandomizeResponseChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const ResponseDelayCodeComponent = ({
  responseDelay,
  statusCode,
  shouldRandomizeResponse,
  onResponseDelayChange,
  onStatusCodeChange,
  onShouldRandomizeResponseChange,
}: ResponseDelayCodeComponentProps) => {
  return (
    <>
      <div className="flex mr-4 xs:w-20 lg:w-80 md:w-60 sm:w-40">
        <TopAlignedLabelAndInput
          htmlInputId="inputResponseDelay"
          type="number"
          label="Response Delay (ms)"
          value={responseDelay}
          divClassAppend="my-2"
          onChange={onResponseDelayChange}
        />

        <TopAlignedLabelAndInput
          htmlInputId="inputStatusCode"
          type="number"
          label="Status Code"
          value={statusCode}
          divClassAppend="my-2 mx-4 mr-2"
          onChange={onStatusCodeChange}
        />
      </div>

      <div className="flex mt-2">
        <TopAlignedLabelAndInput
          htmlInputId="inputShouldRandomizeResponse"
          label="Randomize Response"
          divClassOverride="mb-2 flex flex-row-reverse justify-end"
        >
          <input
            type="checkbox"
            className="mx-1 h-4 w-auto border-gray-200 rounded text-blue-600 focus:ring-blue-500 peer"
            checked={shouldRandomizeResponse}
            onChange={onShouldRandomizeResponseChange}
          ></input>
        </TopAlignedLabelAndInput>
      </div>
    </>
  );
};
export default ResponseDelayCodeComponent;