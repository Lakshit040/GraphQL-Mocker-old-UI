import { useState, useCallback, useEffect } from "react";
import AccordionComponent from "./AccordionComponent";
import TopAlignedLabelAndInput from "./TopAlignedLabelAndInput";
import DynamicExpressionComponent from "./DynamicExpressionComponent";
import { TrashIcon } from "@heroicons/react/24/solid";
import { GraphQLOperationType, DynamicComponentData } from "../../common/types";
import {
  backgroundBindMock,
  backgroundUnbindMock,
  backgroundSetMockResponse,
  backgroundUnSetMockResponse,
} from "../helpers/utils";
import { v4 as uuidv4 } from "uuid";
import { removeQueryEndpoint } from "../../background/helpers/chromeStorageOptions";

const QUERY = "query";
const MUTATION = "mutation";

interface MockResponseConfigProps {
  id: string;
  onDelete: (id: string) => void;
}

const MockResponseConfigComponent = ({
  id,
  onDelete,
}: MockResponseConfigProps) => {
  const [operationType, setOperationType] = useState(
    GraphQLOperationType.Query
  );
  const [operationName, setOperationName] = useState("");

  const [dynamicResponseConfigKeys, setDynamicResponseConfigKeys] = useState([
    uuidv4(),
  ]);

  useEffect(() => {
    backgroundBindMock(id, operationType, operationName);
  }, [id, operationType, operationName]);

  const handleAddExpressionButtonPressed = useCallback(() => {
    setDynamicResponseConfigKeys((keys) => [...keys, uuidv4()]);
  }, []);

  const handleDeleteDynamicExpressionConfig = useCallback(
    (dynamicComponentId: string) => {
      backgroundUnSetMockResponse(id, dynamicComponentId);
      removeQueryEndpoint(
        chrome.devtools.inspectedWindow.tabId,
        dynamicComponentId
      );
      setDynamicResponseConfigKeys((keys) =>
        keys.filter((key) => key !== dynamicComponentId)
      );
    },
    [id]
  );

  const handleDynamicExpressionConfigChanged = useCallback(
    (dynamicComponentId: string, data: DynamicComponentData) => {
      if (!(data.dynamicExpression === "")) {
        backgroundSetMockResponse(id, dynamicComponentId, data);
      }
    },
    [id]
  );

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

  const handleDeleteMockResponseConfig = useCallback(() => {
    backgroundUnbindMock(id);
    onDelete(id);
  }, [id, onDelete]);

  return (
    <div className="w-full my-1 border-none overflow-auto">
      <AccordionComponent
        heading={
          <>
            <TopAlignedLabelAndInput
              htmlInputId="inputSelectOperationType"
              label="Operation Type"
              divClassAppend="lg:mr-12 sm:mr-4"
            >
              <select
                id="inputSelectOperationType"
                value={
                  operationType === GraphQLOperationType.Query
                    ? QUERY
                    : MUTATION
                }
                className="h-8 flex-grow xs:w-16 md:w-32 lg:w-64 my-1 py-0 px-1 bg-transparent border border-gray-700 rounded-xl text-white text-sm focus:ring-blue-500 focus:border-blue-500  peer"
                onChange={handleOperationTypeChange}
              >
                <option value={QUERY}>Query</option>
                <option value={MUTATION}>Mutation</option>
              </select>
            </TopAlignedLabelAndInput>

            <TopAlignedLabelAndInput
              htmlInputId="inputOperationName"
              type="text"
              label="Operation Name"
              value={operationName}
              placeholder="getCountry, createUser..."
              divClassAppend="mx-4"
              onChange={handleOperationNameChange}
            />

            <div className="grow flex flex-row-reverse mr-2">
              <TrashIcon
                title="Delete config"
                className="w-10 h-10 p-2 mx-1 shrink-0 rounded-full text-gray-400 hover:bg-gray-600"
                onClick={handleDeleteMockResponseConfig}
              />
            </div>
          </>
        }
      >
        <div className="p-5 border border-t-0 border-gray-700 rounded-xl">
          {dynamicResponseConfigKeys.map((key) => (
            <DynamicExpressionComponent
              key={key}
              id={key}
              onDynamicExpressionDelete={handleDeleteDynamicExpressionConfig}
              onDynamicExpressionChanged={handleDynamicExpressionConfigChanged}
            />
          ))}
          <button
            className="antialiased font-sans bg-transparent hover:bg-gray-600 text-white font-normal mt-2 py-2 px-4 border border-gray-400 rounded-lg"
            onClick={handleAddExpressionButtonPressed}
          >
            Add New Rule
          </button>
        </div>
      </AccordionComponent>
    </div>
  );
};

export default MockResponseConfigComponent;
