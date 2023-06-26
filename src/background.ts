import { parseIfGraphQLRequest, doesMockingRuleHold } from "./common/utils";
import { MessageType, GraphQLOperationType } from "./common/types";
import { fetchData } from "./ui/helpers/utils";
import { DynamicComponentData, TRUE, FALSE, RANDOM } from "./common/types";

const mockResponseConfigMap: Map<
  string,
  Record<string, DynamicComponentData>
> = new Map();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  let isResponseAsync = true;

  switch (msg.type) {
    case MessageType.RequestIntercepted: {
      let tabId = sender.tab?.id;
      handleInterceptedRequest(
        tabId,
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
  return isResponseAsync;
});

async function handleInterceptedRequest(
  tabId: number | undefined,
  url: string,
  config: any,
  sendResponse: (response?: any) => void
) {
  let reject = () => sendResponse({ response: null, statusCode: 200 });
  let resolve = (response: string, statusCode: number) =>
    sendResponse({ response, statusCode });

  if (tabId === undefined) {
    reject();
    return;
  }

  let parsed = parseIfGraphQLRequest(config);
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
          const generatedRandomResponse = await fetchData(
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
                JSON.stringify(generatedRandomResponse, null, 2),
                mockingRule.statusCode
              )
            );
          } else {
            resolve(
              JSON.stringify(generatedRandomResponse, null, 2),
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
  console.log("Our Storage: ", mockResponseConfigMap);
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
  console.log("Our Storage: ", mockResponseConfigMap);
};
