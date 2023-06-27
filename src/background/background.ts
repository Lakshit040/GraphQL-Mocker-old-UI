import { parseIfGraphQLRequest, doesMockingRuleHold } from "../common/utils";
import {
  MessageType,
  GraphQLOperationType,
  DynamicComponentData,
  TRUE,
  FALSE,
  RANDOM,
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
      break;
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

  const isResponseAsync = true;
  return isResponseAsync;
});

async function handleInterceptedRequest(
  tabId: number | undefined,
  frameId: number | undefined,
  url: string,
  config: any,
  sendResponse: (response?: any) => void
) {
  const reject = () => sendResponse({ response: null, statusCode: 200 });
  const resolve = (response: string, statusCode: number) =>
    sendResponse({ response, statusCode });

  if (tabId === undefined || frameId === undefined) {
    reject();
    return;
  }

  chrome.tabs.sendMessage(tabId, { data: "something" }, { frameId });

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
        if (mockingRule.shouldRandomizeResponse) {
          const booleanValue = mockingRule.booleanTrue
            ? TRUE
            : mockingRule.booleanFalse
            ? FALSE
            : RANDOM;
          const randomlyGeneratedResponse = await generateRandomizedResponse(
            tabId,
            frameId,
            url,
            config,
            query,
            mockingRule.shouldValidateResponse,
            mockingRule.numberRangeStart,
            mockingRule.numberRangeEnd,
            mockingRule.specialCharactersAllowed,
            mockingRule.arrayLength,
            mockingRule.stringLength,
            booleanValue,
            mockingRule.afterDecimals
          );
          if (mockingRule.responseDelay > 0) {
            setTimeout(() =>
              resolve(
                JSON.stringify(randomlyGeneratedResponse, null, 2),
                mockingRule.statusCode
              )
            );
          } else {
            resolve(
              JSON.stringify(randomlyGeneratedResponse, null, 2),
              mockingRule.statusCode
            );
          }
        } else {
          if (mockingRule.responseDelay > 0) {
            setTimeout(() =>
              resolve(
                JSON.stringify(JSON.parse(mockingRule.mockResponse), null, 2),
                mockingRule.statusCode
              )
            );
          } else {
            resolve(
              JSON.stringify(JSON.parse(mockingRule.mockResponse), null, 2),
              mockingRule.statusCode
            );
          }
        }
        return;
      }
    }

    return;
  }
  reject();
}

function setMockResponse(
  operationType: GraphQLOperationType,
  operationName: string,
  dynamicResponseData: Record<string, DynamicComponentData>
) {
  mockResponseConfigMap.set(
    `${operationType}_${operationName}`,
    dynamicResponseData
  );
}

const unSetMockResponse = (
  operationType: GraphQLOperationType,
  operationName: string
) => {
  try {
    mockResponseConfigMap.delete(`${operationType}_${operationName}`);
  } catch {
    return;
  }
};
