import { useState, useCallback } from "react";

import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface AccordionComponentProps {
  heading: React.ReactNode;
  children: React.ReactNode;
}

const AccordionComponent = ({ heading, children }: AccordionComponentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChevronIconClick = useCallback(() => {
    setIsExpanded((e) => !e);
  }, []);

  return (
    <>
      <div
        className={`flex items-center w-full py-2 text-left border border-gray-300 overflow-auto rounded-xl ${
          isExpanded ? "bg-gray-100" : ""
        }`}
      >
        <ChevronDownIcon
          title={isExpanded ? "Collapse" : "Expand"}
          className={`w-10 h-10 p-2 rounded-full hover:bg-gray-200 text-gray-500 shrink-0 mx-2 ${
            isExpanded ? "rotate-180" : ""
          }`}
          onClick={handleChevronIconClick}
        />
        {heading}
      </div>
      <div className={isExpanded ? "" : "hidden"}>{children}</div>
    </>
  );
};

export default AccordionComponent;
