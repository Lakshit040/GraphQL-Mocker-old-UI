import { parseIfGraphQLRequest, doesMockingRuleHold } from "../common/utils";
import {
  MessageType,
  GraphQLOperationType,
  DynamicComponentData,
} from "../common/types";
import { generateRandomizedResponse } from "./helpers/randomMockResponseGenerator";
import {
  storeQueryEndpoint,
  storeOperation,
  deleteOperation,
  getOperation,
} from "./helpers/chromeStorageOptions";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case MessageType.RequestIntercepted: {
      const tabId = sender.tab?.id;
      const frameId = sender.frameId;
      const { host, path, config, requestId } = msg.data;
      handleInterceptedRequest(
        tabId,
        frameId,
        host,
        path,
        config,
        requestId,
        sendResponse
      );
      const isResponseAsync = true;
      return isResponseAsync;
    }
    case MessageType.SetMockResponse: {
      setMockResponse(
        msg.data.operationType,
        msg.data.operationName,
        msg.data.dynamicResponseData
      );
      break;
    }
    case MessageType.UnSetMockResponse: {
      unSetMockResponse(msg.data.operationType, msg.data.operationName);
      break;
    }
  }

  const isResponseAsync = false;
  return isResponseAsync;
});

const handleInterceptedRequest = async (
  tabId: number | undefined,
  frameId: number | undefined,
  host: string,
  path: string,
  config: any,
  requestId: string,
  sendResponse: (response?: any) => void
): Promise<void> => {
  const reject = () => sendResponse({ response: null, statusCode: 200 });
  const resolve = (response: string, statusCode: number) =>
    sendResponse({ response, statusCode });

  if (tabId === undefined || frameId === undefined) {
    reject();
    return;
  }

  const parsed = parseIfGraphQLRequest(config);
  if (parsed === undefined) {
    reject();
    return;
  }

  const [operationType, operationName, query, variables] = parsed;
  const key = `${operationType}_${operationName}`;

  const mockResponseConfig = await getOperation(key);

  if (mockResponseConfig !== undefined) {
    for (const mockingRuleKey in mockResponseConfig) {
      await storeQueryEndpoint(mockingRuleKey, query, host, path);
      const mockingRule = (mockResponseConfig as any)[mockingRuleKey];
      if (doesMockingRuleHold(mockingRule.dynamicExpression, variables)) {
        if (query === "" && mockingRule.shouldRandomizeResponse) {
          reject();
          // TODO: notify frontend
          return;
        }
        const generatedRandomResponse = await generateRandomizedResponse(
          tabId,
          frameId,
          host,
          path,
          config,
          requestId,
          query,
          Number(mockingRule.numberStart) ?? 1,
          Number(mockingRule.numberEnd) ?? 1000,
          mockingRule.specialCharactersAllowed,
          Number(mockingRule.arrayLength) ?? 4,
          Number(mockingRule.stringLength) ?? 8,
          mockingRule.booleanType,
          Number(mockingRule.afterDecimals) ?? 2,
          mockingRule.mockResponse,
          mockingRule.shouldRandomizeResponse
        );
        if (mockingRule.responseDelay > 0) {
          setTimeout(
            () =>
              resolve(
                JSON.stringify(generatedRandomResponse, null, 2),
                mockingRule.statusCode
              ),
            mockingRule.responseDelay
          );
        } else {
          resolve(
            JSON.stringify(generatedRandomResponse, null, 2),
            mockingRule.statusCode
          );
        }

        return;
      }
    }
  }

  reject();
};

const setMockResponse = async (
  operationType: GraphQLOperationType,
  operationName: string,
  dynamicResponseData: Record<string, DynamicComponentData>
): Promise<void> => {
  try {
    await storeOperation(
      `${operationType}_${operationName}`,
      dynamicResponseData
    );
  } catch {
    return;
  }
};

const unSetMockResponse = async (
  operationType: GraphQLOperationType,
  operationName: string
): Promise<void> => {
  try {
    await deleteOperation(`${operationType}_${operationName}`);
  } catch {
    return;
  }
};
