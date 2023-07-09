import React, { useCallback, useState, createContext } from "react";
import { DeleteSVG, CreateSVG } from "./SvgComponents";
import { v4 as uuidv4 } from "uuid";
import DynamicRowComponent from "./DynamicRowComponent";
import { GraphQLOperationType, CheckboxState } from "../../common/types";

const QUERY = "query";
const MUTATION = "mutation";

interface MockConfigProps {
  id: string;
  onDelete: (id: string) => void;
}
interface MockConfigContextType {
  operationName: string;
  operationType: GraphQLOperationType;
}
export const MockConfigContext = createContext<
  MockConfigContextType | undefined
>(undefined);

const MockConfigComponent = ({ id, onDelete }: MockConfigProps) => {
  const [operationName, setOperationName] = useState("");
  const [operationType, setOperationType] = useState(
    GraphQLOperationType.Query
  );
  const [checkedItems, setCheckedItems] = useState<CheckboxState>({});
  const [allChecked, setAllChecked] = useState(false); // Default is unchecked
  const [dynamicConfigKeys, setDynamicConfigKeys] = useState([uuidv4()]);
  const contextValue: MockConfigContextType = {
    operationName,
    operationType,
  };
  const handleCheckboxChange = useCallback((id: string, isChecked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [id]: isChecked }));
  }, []);

  const handleSelectAllCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      setCheckedItems((prev) => {
        const newState = { ...prev };
        for (let key in newState) {
          newState[key] = isChecked;
        }
        setAllChecked(isChecked);  
        return newState;
      });
    },
    []
  );

  const isAllChecked = Object.keys(checkedItems).length > 0 && Object.values(checkedItems).every((val) => val);

  const handleOperationTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      event.target.value === QUERY
        ? setOperationType(GraphQLOperationType.Query)
        : setOperationType(GraphQLOperationType.Mutation);
    },
    []
  );
  const handleOperationNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setOperationName(event.target.value.trim());
    },
    []
  );
  const handleDeleteMockConfig = useCallback(() => {
    onDelete(id);
  }, [id, onDelete, operationName, operationType]);
  const handleAddRuleButtonPressed = useCallback(() => {
    const newKey = uuidv4();
    setDynamicConfigKeys((keys) => [...keys, newKey]);
    setCheckedItems((items) => ({
      ...items,
      [newKey]: false,
    }));
  }, []);
  const handleDynamicComponentDelete = useCallback((id: string) => {
    setDynamicConfigKeys((keys) => keys.filter((key) => key !== id));
    setCheckedItems(prev => {
      const newState = {...prev};
      delete newState[id];
      return newState;
    });
  }, []);

  return (
    <MockConfigContext.Provider value={contextValue}>
      <div className="max-w-[85rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-6 mx-auto">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-4">
                    <input
                      className="border-b border-gray-600 bg-gray-900 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                      type="text"
                      placeholder="Operation Name"
                      value={operationName}
                      onChange={handleOperationNameChange}
                    />
                    <select
                      className="border-b border-gray-600 bg-gray-900 h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                      placeholder="Select Operation Type"
                      value={
                        operationType === GraphQLOperationType.Query
                          ? QUERY
                          : MUTATION
                      }
                      onChange={handleOperationTypeChange}
                    >
                      <option value={QUERY}>Query</option>
                      <option value={MUTATION}>Mutation</option>
                    </select>
                  </div>
                  <div>
                    <div className="inline-flex gap-x-2">
                      <a
                        className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-red-600 shadow-sm align-middle hover:bg-gray-50 outline-none transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-red-500 dark:focus:ring-offset-gray-800"
                        href="#"
                        onClick={handleDeleteMockConfig}
                      >
                        <DeleteSVG />
                      </a>
                      <a
                        className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 outline-none  transition-all text-sm dark:focus:ring-offset-gray-800"
                        href="#"
                        onClick={handleAddRuleButtonPressed}
                      >
                        <CreateSVG />
                      </a>
                    </div>
                  </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-slate-900">
                    <tr>
                      <th
                        scope="col"
                        className="pl-6 py-3 text-left"
                      >
                        <label
                          htmlFor="hs-at-with-checkboxes-main"
                          className="flex"
                        >
                          <input
                            type="checkbox"
                            checked={isAllChecked}
                            onChange={handleSelectAllCheckboxChange}
                            className="relative shrink-0 w-[3.25rem] h-7 bg-gray-100 checked:bg-none checked:bg-blue-600 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 border border-transparent ring-1 ring-transparent   ring-offset-white focus:outline-none appearance-none dark:bg-gray-700 dark:checked:bg-blue-600 dark:focus:ring-offset-gray-800

before:inline-block before:w-6 before:h-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-blue-200"
                            id="hs-at-with-checkboxes-main"
                          />
                          <span className="sr-only">Checkbox</span>
                        </label>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left"
                      >
                        <div className="flex items-center gap-x-2">
                          <span className="text-sm font-normal  tracking-wide text-gray-800 dark:text-gray-200 min-w-full">
                            Rule
                          </span>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left"
                      >
                        <div className="flex items-center gap-x-2">
                          <span className="text-sm font-normal tracking-wide text-gray-800 dark:text-gray-200">
                            Response Delay
                          </span>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left"
                      >
                        <div className="flex items-center gap-x-2">
                          <span className="text-sm font-normal tracking-wide text-gray-800 dark:text-gray-200">
                            Status Code
                          </span>
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left"
                      >
                        <div className="flex items-center gap-x-2">
                          <span className="text-sm font-normal tracking-wide text-gray-800 dark:text-gray-200">
                            Randomize 
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {dynamicConfigKeys.map((key) => (
                      <DynamicRowComponent
                        key={key}
                        id={key}
                        isChecked={checkedItems[key] || false}
                        onCheckboxChange={handleCheckboxChange}
                        onDynamicRowComponentDelete={
                          handleDynamicComponentDelete
                        }
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MockConfigContext.Provider>
  );
};
export default MockConfigComponent;
