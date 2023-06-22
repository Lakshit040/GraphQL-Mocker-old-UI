import { parseIfGraphQLRequest } from "./common/utils";
import { MessageType, GraphQLOperationType } from "./common/types";
import { fetchData } from "./ui/helpers/utils";
interface MockResponseConfiguration {
  mockResponse: string;
  responseDelay: number;
  responseStatus: number;
}

interface RandomResponseConfiguration {
  responseDelay: number;
  responseStatus: number;
}

let mockResponses: Map<string, MockResponseConfiguration> = new Map();
const randomResponses: Map<string, RandomResponseConfiguration> = new Map();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  let isResponseAsync = true;

  switch (msg.type) {
    case MessageType.RequestIntercepted: {
      let tabId = sender.tab?.id;
      handleInterceptedRequest(tabId, msg.data.config, sendResponse);
      break;
    }
    case MessageType.SetMockResponse: {
      setMockResponse(
        msg.data.operationType,
        msg.data.operationName,
        msg.data.mockResponse,
        msg.data.responseDelay,
        msg.data.statusCode,
        msg.data.randomize
      );
      break;
    }
  }
  return isResponseAsync;
});

async function handleInterceptedRequest(
  tabId: number | undefined,
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

  const [operationType, operationName, query] = parsed;
  const key = `${operationType}:${operationName}`;

  const randomResponseConfig = randomResponses.get(key);
  if (randomResponseConfig !== undefined) {
    const graphqlQuery = query;
    const generatedResponse = await fetchData(
      `https://api.github.com/graphql`,
      graphqlQuery
    );

    const { responseDelay, responseStatus } = randomResponseConfig;

    if (responseDelay > 0) {
      setTimeout(() => {
        resolve(JSON.stringify(generatedResponse, null, 2), responseStatus);
      });
    } else {
      resolve(JSON.stringify(generatedResponse, null, 2), responseStatus);
    }
    return;
  }

  const mockResponseConfig = mockResponses.get(key);
  if (mockResponseConfig !== undefined) {
    const { mockResponse, responseDelay, responseStatus } = mockResponseConfig;
    if (responseDelay > 0) {
      setTimeout(() => {
        resolve(mockResponse, responseStatus);
      }, responseDelay);
    } else {
      resolve(mockResponse, responseStatus);
    }
    return;
  }

  reject();
}

function setMockResponse(
  operationType: GraphQLOperationType,
  operationName: string,
  mockResponse: string,
  responseDelay: number,
  responseStatus: number,
  giveRandom: boolean
) {
  if (giveRandom) {
    randomResponses.set(`${operationType}:${operationName}`, {
      responseDelay,
      responseStatus,
    });
  } else {
    mockResponses.set(`${operationType}:${operationName}`, {
      mockResponse,
      responseDelay,
      responseStatus,
    });
  }
}
