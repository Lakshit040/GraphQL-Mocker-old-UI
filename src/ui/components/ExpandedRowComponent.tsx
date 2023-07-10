import React, { useCallback } from "react";
import { PlayButtonSVG } from "./SvgComponents";
import LabelledInputComponent from "./LabelledInputComponent";
interface ExpandedRowComponentProps {
  id: string;
  arrayLength: string;
  stringLength: string;
  numberStart: string;
  numberEnd: string;
  mockResponse: string;
  booleanType: string;
  specialCharactersAllowed: boolean;
  onArrayLengthChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStringLengthChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNumberStartChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNumberEndChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBooleanTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onMockResponseChange: (
    event: React.ChangeEvent<HTMLTextAreaElement> | string
  ) => void;
  onPrettifyButtonPressed: () => void;
  onGenerateResponseHereButtonPressed: (id: string) => void;
  onSpecialCharactersAllowedChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const ExpandedRowComponent: React.FC<ExpandedRowComponentProps> = ({
  id,
  arrayLength,
  stringLength,
  numberStart,
  numberEnd,
  mockResponse,
  booleanType,
  specialCharactersAllowed,
  onArrayLengthChange,
  onBooleanTypeChange,
  onNumberEndChange,
  onNumberStartChange,
  onStringLengthChange,
  onGenerateResponseHereButtonPressed,
  onMockResponseChange,
  onPrettifyButtonPressed,
  onSpecialCharactersAllowedChange,
}) => {
  const handleRandomizeHere = useCallback(() => {
    onGenerateResponseHereButtonPressed(id);
  }, [id, onGenerateResponseHereButtonPressed]);

  return (
    <div className="max-w-4xl px-4 py-6 sm:px-4 lg:px-4 lg:py-8 mx-auto bg-slate-900">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-200">
          Configure Your Reponse
        </h2>
        <p className="text-sm text-gray-400">
          Manage your responses as per your choice.
        </p>
      </div>
      <form>
        <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
          <LabelledInputComponent
            value={arrayLength}
            onChange={onArrayLengthChange}
            htmlInputId="arrayLength"
            placeholder="4"
            type="text"
            label="Array Length"
          />
          <LabelledInputComponent
            value={stringLength}
            onChange={onStringLengthChange}
            htmlInputId="stringLength"
            placeholder="8"
            type="text"
            label="String Length"
          />
          <LabelledInputComponent
            value={numberStart}
            onChange={onNumberStartChange}
            htmlInputId="numberStart"
            placeholder="1"
            type="text"
            label="Number Start"
          />
          <LabelledInputComponent
            value={numberEnd}
            onChange={onNumberEndChange}
            htmlInputId="numberEnd"
            placeholder="1000"
            type="text"
            label="Number End"
          />
          <div className="sm:col-span-3">
            <label
              htmlFor="booleanType"
              className="inline-block text-sm  mt-2.5 text-gray-200"
            >
              Boolean Type
            </label>
          </div>
          <div className="sm:col-span-9">
            <select
              value={booleanType}
              className="py-2 px-3 pr-11 block w-full border  shadow-sm text-sm rounded-lg outline-none bg-slate-900 border-gray-700 text-gray-400"
              onChange={onBooleanTypeChange}
            >
              <option value={"RANDOM"}>Random</option>
              <option value={"TRUE"}>True</option>
              <option value={"FALSE"}>False</option>
            </select>
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="specialCharactersAllowed"
              className="inline-block text-sm  mt-2.5 text-gray-200"
            >
              Special Characters
            </label>
          </div>
          <div className="sm:col-span-9">
            <input
              type="checkbox"
              className="relative shrink-0 w-[3.25rem] h-7 bg-gray-100 checked:bg-none checked:bg-blue-600 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 border border-transparent ring-1 ring-transparent   ring-offset-white focus:outline-none appearance-none dark:bg-gray-700 dark:checked:bg-blue-600 dark:focus:ring-offset-gray-800

before:inline-block before:w-6 before:h-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-blue-200"
              id="specialCharactersAllowed"
              checked={specialCharactersAllowed}
              onChange={onSpecialCharactersAllowedChange}
            />
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="mockResponse"
              className="inline-block text-sm text-gray-800 mt-2.5 dark:text-gray-200"
            >
              Mock Response
            </label>
          </div>
          <div className="sm:col-span-9">
            <textarea
              id="mockResponse"
              className="py-2 px-3 block w-full border  rounded-lg text-sm outline-none bg-slate-900 border-gray-700 text-gray-400"
              rows={6}
              placeholder="Give your response..."
              value={mockResponse}
              onChange={onMockResponseChange}
            ></textarea>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-x-2">
          <button
            type="button"
            title="Randomize here"
            className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 outline-none  focus:ring-offset-2 focus:ring-offset-white  transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
            onClick={handleRandomizeHere}
          >
            <PlayButtonSVG />
          </button>
          <button
            type="button"
            title="Prettify response"
            className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 outline-none  focus:ring-offset-2 transition-all text-sm focus:ring-offset-gray-800"
            onClick={onPrettifyButtonPressed}
          >
            Prettify
          </button>
        </div>
      </form>
    </div>
  );
};
export default React.memo(ExpandedRowComponent);
