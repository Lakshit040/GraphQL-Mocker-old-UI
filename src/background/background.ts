import { parseIfGraphQLRequest, doesMockingRuleHold } from "../common/utils";
import {
  MessageType,
  GraphQLOperationType,
  DynamicComponentData,
  TRUE,
  FALSE,
  RANDOM,
  BooleanType,
} from "../common/types";
import { generateRandomizedResponse } from "./helpers";

const mockResponseConfigMap: Map<
  string,
  Record<string, DynamicComponentData>
> = new Map();

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

  const mockResponseConfig = mockResponseConfigMap.get(key);

  if (mockResponseConfig !== undefined) {
    for (const mockingRuleKey in mockResponseConfig) {
      const mockingRule = mockResponseConfig[mockingRuleKey];
      if (doesMockingRuleHold(mockingRule.dynamicExpression, variables)) {
        const booleanValue =
          mockingRule.booleanType === BooleanType.True
            ? TRUE
            : mockingRule.booleanType === BooleanType.False
            ? FALSE
            : RANDOM;
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
          booleanValue,
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

const setMockResponse = (
  operationType: GraphQLOperationType,
  operationName: string,
  dynamicResponseData: Record<string, DynamicComponentData>
): void => {
  mockResponseConfigMap.set(
    `${operationType}_${operationName}`,
    dynamicResponseData
  );
};

const unSetMockResponse = (
  operationType: GraphQLOperationType,
  operationName: string
): void => {
  try {
    mockResponseConfigMap.delete(`${operationType}_${operationName}`);
  } catch {
    return;
  }
};
