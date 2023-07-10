const TableHeadingComponent = () => {
  return (
    <>
      <th
        scope="col"
        className="px-6 py-3 text-left"
      >
        <div className="flex items-center gap-x-2">
          <span className="text-sm relative font-normal  tracking-wide text-gray-800 dark:text-gray-200 min-w-full">
            Rule<span className="absolute top-0 left-8 text-red-600">*</span>
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
    </>
  );
};

export default TableHeadingComponent;
