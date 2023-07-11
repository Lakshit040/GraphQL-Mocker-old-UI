import React from "react";
import TopAlignedLabelAndInput from "./TopAlignedLabelAndInput";
import AccordionComponent from "./AccordionComponent";
import { BooleanType, TRUE, FALSE, RANDOM } from "../../common/types";

interface RandomResponseConfigProps {
  booleanType: BooleanType;
  numberRangeStart: number;
  numberRangeEnd: number;
  afterDecimals: number;
  arrayLength: number;
  stringLength: number;
  specialCharactersAllowed: boolean;
  onNumberRangeStartChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onNumberRangeEndChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBooleanTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onAfterDecimalsChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onArrayLengthChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStringLengthChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSpecialCharactersAllowedChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const RandomResponseConfigComponent = ({
  booleanType,
  numberRangeStart,
  numberRangeEnd,
  afterDecimals,
  arrayLength,
  stringLength,
  specialCharactersAllowed,
  onNumberRangeStartChange,
  onNumberRangeEndChange,
  onBooleanTypeChange,
  onAfterDecimalsChange,
  onArrayLengthChange,
  onStringLengthChange,
  onSpecialCharactersAllowedChange,
}: RandomResponseConfigProps) => {
  return (
    <AccordionComponent
      heading={
        <span className="text-gray-400">Random Response Configuration</span>
      }
    >
      <div className="border rounded-xl p-4 grid grid-cols-2 gap-4">
        <TopAlignedLabelAndInput
          htmlInputId="inputRangeOfNumbersStart"
          label="Numbers Range Start"
          value={numberRangeStart}
          type="number"
          divClassAppend="my-1"
          onChange={onNumberRangeStartChange}
        />
        <TopAlignedLabelAndInput
          htmlInputId="inputRangeOfNumbersEnd"
          label="Numbers Range End"
          value={numberRangeEnd}
          type="number"
          divClassAppend="my-1"
          onChange={onNumberRangeEndChange}
        />
        <TopAlignedLabelAndInput
          htmlInputId="inputAfterDecimals"
          label="Digits After Decimal"
          value={afterDecimals}
          type="number"
          divClassAppend="my-1"
          onChange={onAfterDecimalsChange}
        />
        <TopAlignedLabelAndInput
          htmlInputId="inputArrayLength"
          label="Array Length"
          value={arrayLength}
          type="number"
          divClassAppend="my-1"
          onChange={onArrayLengthChange}
        />
        <TopAlignedLabelAndInput
          htmlInputId="inputStringLength"
          label="String Length"
          value={stringLength}
          type="number"
          divClassAppend="my-1"
          onChange={onStringLengthChange}
        />

        <div className="grid grid-cols-2 gap-4 overflow-auto items-center">
          <TopAlignedLabelAndInput
            divClassAppend="w-[50%]"
            htmlInputId="inputSelectBooleanType"
            label="Booleans Type"
          >
            <select
              id="inputSelectBooleanType"
              value={
                booleanType === BooleanType.True
                  ? TRUE
                  : booleanType === BooleanType.False
                  ? FALSE
                  : RANDOM
              }
              className="h-8 flex-grow w-auto my-1 py-0 px-1 bg-gray-800 border rounded-xl border-gray-700 text-white text-sm focus:ring-blue-500 focus:border-blue-500  peer"
              onChange={onBooleanTypeChange}
            >
              <option value={RANDOM}>Random</option>
              <option value={TRUE}>True</option>
              <option value={FALSE}>False</option>
            </select>
          </TopAlignedLabelAndInput>
          <TopAlignedLabelAndInput
            htmlInputId="inputSpecialCharactersAllowed"
            label="Special Characters Allowed"
            divClassOverride="mb-2 mt-4 w-[50%] flex flex-row-reverse justify-end"
          >
            <input
              type="checkbox"
              className="mx-1 h-4 w-auto border-gray-700 rounded text-blue-600 focus:ring-blue-500 peer"
              checked={specialCharactersAllowed}
              onChange={onSpecialCharactersAllowedChange}
            ></input>
          </TopAlignedLabelAndInput>
        </div>
      </div>
    </AccordionComponent>
  );
};

export default RandomResponseConfigComponent;
