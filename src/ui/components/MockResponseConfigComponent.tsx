import { useState, useCallback, createContext, useRef } from "react";

import AccordionComponent from "./AccordionComponent";
import TopAlignedLabelAndInput from "./TopAlignedLabelAndInput";
import DynamicExpressionComponent from "./DynamicExpressionComponent";
import { PlayIcon, PauseIcon, TrashIcon } from "@heroicons/react/24/solid";

import { GraphQLOperationType, DynamicComponentData } from "../../common/types";
import {
  backgroundSetMockResponse,
  backgroundUnSetMockResponse,
} from "../helpers/utils";
import { guidGenerator } from "../../common/utils";
import { removeQueryEndpoint } from "../../background/helpers/chromeStorageOptions";

const QUERY = "query";
const MUTATION = "mutation";

interface MockResponseConfigProps {
  id: string;
  onDelete: (id: string) => void;
}

interface ContextDynamicComponentProps {
  register: (id: string, dynamicData: DynamicComponentData) => void;
  unregister: (id: string) => void;
  onMockingRuleStarted: () => void;
}

export const ContextForDynamicComponents =
  createContext<ContextDynamicComponentProps>({
    register: () => {},
    unregister: () => {},
    onMockingRuleStarted: () => {},
  });

const MockResponseConfigComponent = ({
  id,
  onDelete,
}: MockResponseConfigProps) => {
  const [operationType, setOperationType] = useState(
    GraphQLOperationType.Query
  );
  const [operationName, setOperationName] = useState("");

  const [areMocking, setAreMocking] = useState(false);
  const [childrenData, setChildrenData] = useState<
    Record<string, DynamicComponentData>
  >({});
  const childrenDataRef = useRef<Record<string, DynamicComponentData>>({});
  const [dynamicResponseConfigKeys, setDynamicResponseConfigKeys] = useState([
    guidGenerator(),
  ]);

  const register = (id: string, dynamicData: DynamicComponentData) => {
    childrenDataRef.current[id] = dynamicData;
    setChildrenData({ ...childrenDataRef.current });
  };

  const unregister = (id: string) => {
    delete childrenDataRef.current[id];
    setChildrenData({ ...childrenDataRef.current });
  };

  const onMockingRuleStarted = () => {
    if (areMocking) {
      backgroundUnSetMockResponse(operationType, operationName);
    } else {
      backgroundSetMockResponse(operationType, operationName, childrenData);
    }
    setAreMocking((r) => !r);
  };

  const handleAddExpressionButtonPressed = useCallback(() => {
    backgroundUnSetMockResponse(operationType, operationName);
    setAreMocking(false);
    setDynamicResponseConfigKeys((keys) => [...keys, guidGenerator()]);
  }, []);

  const handleDeleteDynamicExpressionConfig = useCallback(
    async (id: string) => {
      backgroundUnSetMockResponse(operationType, operationName);
      setAreMocking(false);
      await removeQueryEndpoint(id);
      setDynamicResponseConfigKeys((keys) => keys.filter((key) => key !== id));
    },
    [operationName, operationType]
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
    backgroundUnSetMockResponse(operationType, operationName);
    onDelete(id);
  }, [id, onDelete, operationName, operationType]);

  const handlePlayPauseDynamicExpressionConfig = useCallback(() => {
    backgroundUnSetMockResponse(operationType, operationName);
    setAreMocking(false);
  }, [operationType, operationName]);

  return (
    <ContextForDynamicComponents.Provider
      value={{ register, unregister, onMockingRuleStarted }}
    >
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
                  className="h-8 flex-grow xs:w-16 md:w-32 lg:w-64 my-1 py-0 px-1 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500  peer"
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
                  className="w-10 h-10 p-2 mx-1 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
                  onClick={handleDeleteMockResponseConfig}
                />

                {areMocking ? (
                  <PauseIcon
                  title="Stop mocking"
                  className="w-10 h-10 p-2 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
                  onClick={onMockingRuleStarted}
                />
                ) : (
                  <PlayIcon
                  title="Start mocking"
                  className="w-10 h-10 p-2 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
                  onClick={onMockingRuleStarted}
                />
                )}
              </div>
            </>
          }
        >
          <div className="p-5 border border-t-0 border-gray-300 rounded-xl">
            {dynamicResponseConfigKeys.map((key) => (
              <DynamicExpressionComponent
                key={key}
                id={key}
                onDynamicExpressionDelete={handleDeleteDynamicExpressionConfig}
                onDynamicExpressionPlayPause={
                  handlePlayPauseDynamicExpressionConfig
                }
              />
            ))}
            <button
              className="antialiased font-sans bg-white hover:bg-gray-200 text-gray-800 font-normal mt-2 py-2 px-4 border border-gray-400 rounded-lg"
              onClick={handleAddExpressionButtonPressed}
            >
              Add New Rule
            </button>
          </div>
        </AccordionComponent>
      </div>
    </ContextForDynamicComponents.Provider>
  );
};

export default MockResponseConfigComponent;
