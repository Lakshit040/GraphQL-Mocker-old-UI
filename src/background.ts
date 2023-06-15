import { parseIfGraphQLRequest } from "./common/utils";
import { MessageType, GraphQLOperationType } from "./common/types";

let mockResponses: Map<string, string> = new Map();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  let isResponseAsync = false;

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
        msg.data.mockResponse
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
  let mockResponse = mockResponses.get(key);
  if (mockResponse !== undefined) {
    console.log("Found a mock response! Sending it as the response!");
    resolve(mockResponse);
    return;
  }

  reject();
}

function setMockResponse(
  operationType: GraphQLOperationType,
  operationName: string,
  mockResponse: string
) {
  mockResponses.set(`${operationType}:${operationName}`, mockResponse);
}
