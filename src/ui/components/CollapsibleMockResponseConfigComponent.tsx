import { useState, useCallback } from "react";
import MockResponseConfigComponent from "./MockResponseConfigComponent";

const CollapsibleMockResponseConfigComponent = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleHeadingClick = useCallback(() => {
    setIsExpanded((e) => !e);
  }, []);

  return (
    <div className="w-4/5 shadow-md my-1">
      <h2 id="accordion-collapse-heading">
        <button
          type="button"
          className={`flex items-center w-full p-2 font-medium text-left text-gray-500 border border-gray-200 ${
            isExpanded ? "bg-gray-100" : ""
          }`}
        >
          <svg
            className={`w-6 h-6 shrink-0 mx-1 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleHeadingClick}
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span>Mock Response Config</span>
        </button>
      </h2>

      <div
        id="accordion-collapse-body"
        className={
          isExpanded ? "p-5 border border-t-0 border-gray-200" : "hidden"
        }
      >
        <MockResponseConfigComponent />
      </div>
    </div>
  );
};

export default CollapsibleMockResponseConfigComponent;
