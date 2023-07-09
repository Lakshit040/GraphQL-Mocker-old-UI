import { every } from "lodash";
import React, { useCallback } from "react";
import { PlayButtonSVG } from "./SvgComponents";

interface ExpandedRowComponentProps {
  arrayLength: string;
  setArrayLength: React.Dispatch<React.SetStateAction<string>>;
  stringLength: string;
  setStringLength: React.Dispatch<React.SetStateAction<string>>;
  numberStart: string;
  setNumberStart: React.Dispatch<React.SetStateAction<string>>;
  numberEnd: string;
  setNumberEnd: React.Dispatch<React.SetStateAction<string>>;
  mockResponse: string;
  setMockResponse: React.Dispatch<React.SetStateAction<string>>;
  booleanType: string;
  setBooleanType: React.Dispatch<React.SetStateAction<string>>;
  specialCharactersAllowed: boolean;
  setIsSpecialCharactersAllowed: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpandedRowComponent: React.FC<ExpandedRowComponentProps> = ({
  arrayLength,
  setArrayLength,
  stringLength,
  setStringLength,
  numberStart,
  setNumberStart,
  numberEnd,
  setNumberEnd,
  mockResponse,
  setMockResponse,
  booleanType,
  setBooleanType,
  specialCharactersAllowed,
  setIsSpecialCharactersAllowed
}) => {
  const handlePrettifyButtonPressed = useCallback(() => {
    try {
      setMockResponse(JSON.stringify(JSON.parse(mockResponse), null, 2));
    } catch {}
  }, [mockResponse]);
  const handleFastRandomizationButtonPressed = useCallback(() => {}, []);
  const handleArrayLengthChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setArrayLength(event.target.value.trim());
    },
    []
  );
  const handleStringLengthChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStringLength(event.target.value.trim());
    },
    []
  );
  const handleNumberStartChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNumberStart(event.target.value.trim());
    },
    []
  );
  const handleNumberEndChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNumberEnd(event.target.value.trim());
    },
    []
  );
  const handleMockResponseChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMockResponse(event.target.value);
    },
    []
  );
  const handleBooleanTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setBooleanType(event.target.value);
    },
    []
  );
  const handleSpecialCharactersChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSpecialCharactersAllowed(event.target.checked);
  }, [])
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
          <div className="sm:col-span-3">
            <label
              htmlFor="arrayLength"
              className="inline-block text-sm  mt-2.5 text-gray-200"
            >
              Array Length
            </label>
          </div>
          <div className="sm:col-span-9">
            <input
              id="arrayLength"
              type="text"
              className="py-2 px-3 pr-11 block w-full border  shadow-sm text-sm rounded-lg outline-none bg-slate-900 border-gray-700 text-gray-400"
              placeholder="4"
              value={arrayLength}
              onChange={handleArrayLengthChange}
            />
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="stringLength"
              className="inline-block text-sm  mt-2.5 text-gray-200"
            >
              String Length
            </label>
          </div>
          <div className="sm:col-span-9">
            <input
              id="stringLength"
              type="text"
              className="py-2 px-3 pr-11 block w-full border  shadow-sm text-sm rounded-lg outline-none bg-slate-900 border-gray-700 text-gray-400"
              placeholder="8"
              value={stringLength}
              onChange={handleStringLengthChange}
            />
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="numberStart"
              className="inline-block text-sm  mt-2.5 text-gray-200"
            >
              Number Start
            </label>
          </div>
          <div className="sm:col-span-9">
            <input
              id="numberStart"
              type="text"
              className="py-2 px-3 pr-11 block w-full border  shadow-sm text-sm rounded-lg outline-none bg-slate-900 border-gray-700 text-gray-400"
              placeholder="1"
              value={numberStart}
              onChange={handleNumberStartChange}
            />
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="numberEnd"
              className="inline-block text-sm  mt-2.5 text-gray-200"
            >
              Number End
            </label>
          </div>
          <div className="sm:col-span-9">
            <input
              id="numberEnd"
              type="text"
              className="py-2 px-3 pr-11 block w-full border  shadow-sm text-sm rounded-lg outline-none bg-slate-900 border-gray-700 text-gray-400"
              placeholder="1000"
              value={numberEnd}
              onChange={handleNumberEndChange}
            />
          </div>

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
              onChange={handleBooleanTypeChange}
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
                onChange={handleSpecialCharactersChange}
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
              onChange={handleMockResponseChange}
            ></textarea>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-x-2">
          <button
            type="button"
            className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 outline-none  focus:ring-offset-2 focus:ring-offset-white  transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
            onClick={handleFastRandomizationButtonPressed}
          >
            <PlayButtonSVG/>
          </button>
          <button
            type="button"
            className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 outline-none  focus:ring-offset-2 transition-all text-sm focus:ring-offset-gray-800"
            onClick={handlePrettifyButtonPressed}
          >
            Prettify
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(ExpandedRowComponent);
