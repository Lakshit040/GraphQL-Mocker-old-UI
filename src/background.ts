import { parseIfGraphQLRequest } from "./common/utils";
import { MessageType, GraphQLOperationType } from "./common/types";

interface MockResponseConfiguration {
  mockResponse: string;
  responseDelay: number;
}

let mockResponses: Map<string, MockResponseConfiguration> = new Map();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  let isResponseAsync = true;

  switch (msg.type) {
    case MessageType.PanelMounted: {
      let tabId = msg.data.tabId;
      console.log(`${tabId}: Panel mounted`);
      break;
    }
    case MessageType.RequestIntercepted: {
      let tabId = sender.tab?.id;
      console.log(
        `${tabId}: Intercepted a request! ${msg.data.url} ${msg.data.config.method}`
      );
      handleInterceptedRequest(tabId, msg.data.config, sendResponse);
      break;
    }
    case MessageType.SetMockResponse: {
      console.log(`Got a request to set mock response!`);
      setMockResponse(
        msg.data.operationType,
        msg.data.operationName,
        msg.data.mockResponse,
        msg.data.responseDelay
      );
      break;
    }
  }

  return isResponseAsync;
});

function handleInterceptedRequest(
  tabId: number | undefined,
  config: any,
  sendResponse: (response?: any) => void
) {
  let reject = () => sendResponse({ response: null });
  let resolve = (response: string) => sendResponse({ response });

  if (tabId === undefined) {
    reject();
    return;
  }

  let parsed = parseIfGraphQLRequest(config);
  if (parsed === undefined) {
    reject();
    return;
  }

  let [operationType, operationName] = parsed;
  console.log("Parse GraphQL operation", operationType, operationName);

  let key = `${operationType}:${operationName}`;
  let mockResponseConfig = mockResponses.get(key);
  if (mockResponseConfig !== undefined) {
    console.log("Found a mock response! Sending it as the response!");
    let { mockResponse, responseDelay } = mockResponseConfig;
    if (responseDelay > 0) {
      setTimeout(() => {
        resolve(mockResponse);
      }, responseDelay);
    } else {
      resolve(mockResponseConfig.mockResponse);
    }
    return;
  }

  reject();
}

function setMockResponse(
  operationType: GraphQLOperationType,
  operationName: string,
  mockResponse: string,
  responseDelay: number
) {
  mockResponses.set(`${operationType}:${operationName}`, {
    mockResponse,
    responseDelay,
  });
}
