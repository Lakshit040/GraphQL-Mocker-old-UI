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
      handleInterceptedRequest(
        tabId,
        frameId,
        msg.data.url,
        msg.data.config,
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
  url: string,
  config: any,
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
      await storeQueryEndpoint(mockingRuleKey, query, url);
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
          url,
          config,
          query,
          mockingRule.numberRangeStart,
          mockingRule.numberRangeEnd,
          mockingRule.specialCharactersAllowed,
          mockingRule.arrayLength,
          mockingRule.stringLength,
          mockingRule.booleanType,
          mockingRule.afterDecimals,
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
