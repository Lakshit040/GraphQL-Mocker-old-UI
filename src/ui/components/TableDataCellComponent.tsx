interface TableDataCellComponentProps {
  type: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value?: string;
  checked?: boolean;
  placeholder?: string;
}

const TableDataCellComponent = ({
  type,
  placeholder,
  onChange,
  value,
  checked,
}: TableDataCellComponentProps) => {
  if (checked === undefined) {
    return (
      <td className="h-px w-px whitespace-nowrap">
        <div className="px-6 py-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            <input
              type={type}
              placeholder={placeholder}
              className="px-1 py-1 bg-gray-900 border-b border-gray-600 outline-none"
              value={value}
              onChange={onChange}
            />
          </span>
        </div>
      </td>
    );
  } else {
    return (
      <td className="h-px w-px whitespace-nowrap">
        <div className="px-6 py-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            <input
              type={type}
              checked={checked}
              onChange={onChange}
              className="relative shrink-0 w-[3.25rem] h-7 bg-gray-100 checked:bg-none checked:bg-blue-600 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 border border-transparent ring-1 ring-transparent   ring-offset-white focus:outline-none appearance-none dark:bg-gray-700 dark:checked:bg-blue-600 dark:focus:ring-offset-gray-800

before:inline-block before:w-6 before:h-6 before:bg-white checked:before:bg-blue-200 before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-blue-200"
            />
          </span>
        </div>
      </td>
    );
  }
};

export default TableDataCellComponent;
