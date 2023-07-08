import { CreateSVG, DeleteSVG } from "./SvgComponents";
import React, { useCallback, useState, useContext } from "react";
import { MockConfigContext } from "./MockConfigComponent";
import ExpandedRowComponent from "./ExpandedRowComponent";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const handleDeleteRowButtonPressed = useCallback(() => {
    onDynamicRowComponentDelete(id);
  }, [id, onDynamicRowComponentDelete, onCheckboxChange]);
  const handleCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onCheckboxChange(id, event.target.checked);
    },
    [id, onCheckboxChange, onDynamicRowComponentDelete]
  );
  const handleRowExpanded = useCallback(() => {
    setIsExpanded((e) => !e);
  }, []);
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
                className="shrink-0 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
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
                    className="px-1 bg-gray-900 border-b border-gray-600 outline-none min-w-full"
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
                className="px-1 bg-gray-900 border-b border-gray-600 outline-none"
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
                className="px-1 bg-gray-900 border-b border-gray-600 outline-none"
              />
            </span>
          </div>
        </td>
        <td className="h-px w-px whitespace-nowrap">
          <div className="px-6 py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <a
                className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                href="#"
                onClick={handleRowExpanded}
              >
                {isExpanded ? "Collapse" : "Expand"}
              </a>
            </span>
          </div>
        </td>
        <td className="h-px w-px whitespace-nowrap">
          <div className="px-6 py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <a
                className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-red-600 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-red-500 dark:focus:ring-offset-gray-800"
                href="#"
                onClick={handleDeleteRowButtonPressed}
              >
                <DeleteSVG />
              </a>
            </span>
          </div>
        </td>
      </tr>
      <tr>
        <td
          colSpan={6}
          style={{ display: isExpanded ? "table-cell" : "none" }}
        >
          <ExpandedRowComponent />
        </td>
      </tr>
    </>
  );
};

export default React.memo(DynamicRowComponent);
