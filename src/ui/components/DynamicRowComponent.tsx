import { ChevronDownSVG, ChevronUpSVG, DeleteSVG } from "./SvgComponents";
import React, { useCallback, useState, useContext, useEffect } from "react";
import { MockConfigContext } from "./MockConfigComponent";
import ExpandedRowComponent from "./ExpandedRowComponent";
import {
  getOperationDetails,
  storeOperationDetails,
} from "../../background/helpers/chromeStorageOptions";
import { dynamicDataConverter } from "../helpers/utils";

interface DynamicRowComponentProps {
  id: string;
  isChecked: boolean;
  onCheckboxChange: (id: string, isChecked: boolean) => void;
  onDynamicRowComponentDelete: (id: string) => void;
}

const DynamicRowComponent = ({
  id,
  isChecked,
  onCheckboxChange,
  onDynamicRowComponentDelete,
}: DynamicRowComponentProps) => {
  const mockConfigContext = useContext(MockConfigContext);
  const curOperationName = mockConfigContext?.operationName;
  const curOperationType = mockConfigContext?.operationType;
  const [arrayLength, setArrayLength] = useState("");
  const [dynamicRule, setDynamicRule] = useState("");
  const [responseDelay, setResponseDelay] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const [stringLength, setStringLength] = useState("");
  const [numberStart, setNumberStart] = useState("");
  const [numberEnd, setNumberEnd] = useState("");
  const [mockResponse, setMockResponse] = useState("");
  const [booleanType, setBooleanType] = useState("RANDOM");
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldRandomize, setShouldRandomize] = useState(true);
  const [specialCharactersAllowed, setIsSpecialCharactersAllowed] =
    useState(true);

  const handleDeleteRowButtonPressed = useCallback(() => {
    onDynamicRowComponentDelete(id);
  }, [id, onDynamicRowComponentDelete, onCheckboxChange]);
  const handleCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const key = `${curOperationType}_${curOperationName}`;
      if (isChecked) {
        console.log("Checked id: ", id);
        // let storedValue = await getOperationDetails(key);
        // storedValue = { ...storedValue, [id]: dataSet };
        // await storeOperationDetails(key, storedValue);
        console.log("Information Stored for id: ", id);
      } else {
        try {
          console.log("Unchecked id: ", id);
          // let storedValue = await getOperationDetails(key);
          // delete storedValue[id];
          console.log("Deleted id: ", id);
          // await storeOperationDetails(key, storedValue);
        } catch {}
      }
      onCheckboxChange(id, event.target.checked);
    },
    [id, onCheckboxChange, onDynamicRowComponentDelete]
  );
  
  const handleRowExpanded = useCallback(() => {
    setIsExpanded((e) => !e);
  }, []);
  const handleShouldRandomizeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShouldRandomize(event.target.checked);
    },
    []
  );

  const handleDynamicRuleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDynamicRule(event.target.value);
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

  return (
    <>
      <tr>
        <td className="h-px w-px whitespace-nowrap">
          <div className="pl-6 py-2">
            <label
              htmlFor={`hs-at-with-checkboxes-${id}`}
              className="flex"
            >
              <input
                type="checkbox"
                className="relative shrink-0 w-[3.25rem] h-7 bg-gray-100 checked:bg-none checked:bg-blue-600 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 border border-transparent ring-1 ring-transparent   ring-offset-white focus:outline-none appearance-none dark:bg-gray-700 dark:checked:bg-blue-600 dark:focus:ring-offset-gray-800

before:inline-block before:w-6 before:h-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-blue-200"
                id={`hs-at-with-checkboxes-${id}`}
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <span className="sr-only">Checkbox</span>
            </label>
          </div>
        </td>
        <td className="h-px w-px whitespace-nowrap">
          <div className="px-6 py-2">
            <div className="flex items-center gap-x-2">
              <div className="grow">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <input
                    type="text"
                    placeholder="id == '5', *, age > 18 && count != 5"
                    className="px-1 py-1 bg-gray-900 border-b border-gray-600 outline-none min-w-full"
                    value={dynamicRule}
                    onChange={handleDynamicRuleChange}
                  />
                </span>
              </div>
            </div>
          </div>
        </td>
        <td className="h-px w-px whitespace-nowrap">
          <div className="px-6 py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <input
                type="text"
                placeholder="0"
                className="px-1 py-1 bg-gray-900 border-b border-gray-600 outline-none"
                value={responseDelay}
                onChange={handleResponseDelayChange}
              />
            </span>
          </div>
        </td>
        <td className="h-px w-px whitespace-nowrap">
          <div className="px-6 py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <input
                type="text"
                placeholder="200"
                className="px-1 py-1 bg-gray-900 border-b border-gray-600 outline-none"
                value={statusCode}
                onChange={handleStatusCodeChange}
              />
            </span>
          </div>
        </td>
        <td className="h-px w-px whitespace-nowrap">
          <div className="px-6 py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                id="hs-account-activity"
                checked={shouldRandomize}
                onChange={handleShouldRandomizeChange}
                className="relative shrink-0 w-[3.25rem] h-7 bg-gray-100 checked:bg-none checked:bg-blue-600 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 border border-transparent ring-1 ring-transparent   ring-offset-white focus:outline-none appearance-none dark:bg-gray-700 dark:checked:bg-blue-600 dark:focus:ring-offset-gray-800

before:inline-block before:w-6 before:h-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-blue-200"
              />
            </span>
          </div>
        </td>
        <td className="h-px w-px whitespace-nowrap">
          <div className="px-6 py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <div className="flex space-x-2">
                <a
                  className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-red-600 shadow-sm align-middle hover:bg-gray-50 outline-none   transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-red-500 dark:focus:ring-offset-gray-800"
                  href="#"
                  onClick={handleRowExpanded}
                >
                  {isExpanded ? <ChevronUpSVG /> : <ChevronDownSVG />}
                </a>
                <a
                  className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-red-600 shadow-sm align-middle hover:bg-gray-50 outline-none   transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-red-500 dark:focus:ring-offset-gray-800"
                  href="#"
                  onClick={handleDeleteRowButtonPressed}
                >
                  <DeleteSVG />
                </a>
              </div>
            </span>
          </div>
        </td>
      </tr>
      <tr>
        <td
          colSpan={6}
          style={{ display: isExpanded ? "table-cell" : "none" }}
        >
          <ExpandedRowComponent
            arrayLength={arrayLength}
            setArrayLength={setArrayLength}
            stringLength={stringLength}
            setStringLength={setStringLength}
            numberStart={numberStart}
            setNumberStart={setNumberStart}
            numberEnd={numberEnd}
            setNumberEnd={setNumberEnd}
            mockResponse={mockResponse}
            setMockResponse={setMockResponse}
            booleanType={booleanType}
            setBooleanType={setBooleanType}
            specialCharactersAllowed={specialCharactersAllowed}
            setIsSpecialCharactersAllowed={setIsSpecialCharactersAllowed}
          />
        </td>
      </tr>
    </>
  );
};

export default React.memo(DynamicRowComponent);
