import { useState, useCallback, createContext, useRef } from 'react';

import TopAlignedLabelAndInput from './TopAlignedLabelAndInput';
import SvgButtonComponent from './SvgButtonComponent';
import DynamicExpressionComponent from './DynamicExpressionComponent';
import { GraphQLOperationType} from '../../common/types';
import {
  backgroundSetMockResponse,
  backgroundUnSetMockResponse,
} from '../helpers/utils';
import { guidGenerator } from '../../common/utils';
import { DynamicComponentData } from '../../common/types';

const QUERY = 'query';
const MUTATION = 'mutation';

interface MockResponseConfigProps {
  id: string;
  onDelete: (id: string) => void;
}

interface MyContextProps {
  register: (id: string, dynamicData: DynamicComponentData) => void;
  unregister: (id: string) => void;
  onMockingRuleStarted: () => void;
}

export const MyContext = createContext<MyContextProps>({
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
  const [operationName, setOperationName] = useState('');

  const [isExpanded, setIsExpanded] = useState(false);
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
    setAreMocking(r => !r)
  };

  const handleAddExpressionButtonPressed = useCallback(() => {
    setDynamicResponseConfigKeys((keys) => [...keys, guidGenerator()]);
  }, []);

  const handleDeleteDynamicExpressionConfig = useCallback((id: string) => {
    backgroundUnSetMockResponse(operationType, operationName)
    setAreMocking(false)
    setDynamicResponseConfigKeys((keys) => keys.filter((key) => key !== id));
  }, []);

  const handleHeadingClick = useCallback(() => {
    setIsExpanded((e) => !e);
  }, []);

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
  }, [id, onDelete]);

  return (
    <MyContext.Provider value={{ register, unregister, onMockingRuleStarted }}>
      <div className="w-full my-1 mb-4 border-none">
        <div
          className={`flex items-center w-full p-2 text-left border border-gray-400 rounded-xl ${
            isExpanded ? 'bg-gray-100' : ''
          }`}
        >
          <SvgButtonComponent
            title={isExpanded ? 'Collapse the mock config' : 'Expand the mock config'}
            className={`w-6 h-6 text-gray-500 shrink-0 ml-1 mr-2 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            viewBox="0 0 20 20"
            onClick={handleHeadingClick}
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </SvgButtonComponent>

          <TopAlignedLabelAndInput
            divClassAppend='mr-12'
            htmlInputId="inputSelectOperationType"
            label="Operation Type"
          >
            <select
              id="inputSelectOperationType"
              value={
                operationType === GraphQLOperationType.Query ? QUERY : MUTATION
              }
              className="h-8 flex-grow w-64 my-1 py-0 px-1 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500  peer"
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
            divClassAppend="mx-4"
            onChange={handleOperationNameChange}
          />

          <div className="grow flex flex-row-reverse">
            <SvgButtonComponent
            title="Delete the mock config"
              className="w-10 h-10 p-2 ml-1 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
              viewBox="0 0 32 32"
              onClick={handleDeleteMockResponseConfig}
            >
              <path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5  c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4  C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z" />
            </SvgButtonComponent>
            <SvgButtonComponent
              title={areMocking ? 'Stop mocking this config' : 'Start mocking this config'}
              className="w-10 h-10 p-2 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
              viewBox="0 0 32 32"
              onClick={onMockingRuleStarted}
            >
              {areMocking ? (
                <path d="M5.92 24.096q0 0.832 0.576 1.408t1.44 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.44 0.576t-0.576 1.44v16.16zM18.016 24.096q0 0.832 0.608 1.408t1.408 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.408 0.576t-0.608 1.44v16.16z"></path>
              ) : (
                <path d="M5.92 24.096q0 1.088 0.928 1.728 0.512 0.288 1.088 0.288 0.448 0 0.896-0.224l16.16-8.064q0.48-0.256 0.8-0.736t0.288-1.088-0.288-1.056-0.8-0.736l-16.16-8.064q-0.448-0.224-0.896-0.224-0.544 0-1.088 0.288-0.928 0.608-0.928 1.728v16.16z" />
              )}
            </SvgButtonComponent>
          </div>
        </div>

        <div className={isExpanded ? 'p-5 border border-t-0 border-gray-300 rounded-xl' : 'hidden'}>
          {dynamicResponseConfigKeys.map((key) => (
            <DynamicExpressionComponent
              key={key}
              id={key}
              onDynamicExpressionDelete={handleDeleteDynamicExpressionConfig}
            />
          ))}
          <button
            className="antialiased font-sans bg-white hover:bg-gray-200 text-gray-800 font-normal py-2 px-4 border border-gray-400 rounded-xl shadow"
            onClick={handleAddExpressionButtonPressed}
            title = "Add a new rule"
          >
            Add New Rule
          </button>
        </div>
      </div>
    </MyContext.Provider>
  );
};

export default MockResponseConfigComponent;
