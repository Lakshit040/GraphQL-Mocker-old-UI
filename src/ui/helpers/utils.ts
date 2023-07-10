import {
  MessageType,
  GraphQLOperationType,
  DynamicComponentData,
} from "../../common/types";

export const backgroundSetMockResponse = (
  operationType: GraphQLOperationType,
  operationName: string,
  dynamicResponseData: Record<string, DynamicComponentData>
): void => {
  const { tabId } = chrome.devtools.inspectedWindow;
  chrome.runtime.sendMessage({
    type: MessageType.SetMockResponse,
    data: {
      tabId,
      operationType,
      operationName,
      dynamicResponseData,
    },
  });
};

export const backgroundUnSetMockResponse = (
  operationType: GraphQLOperationType,
  operationName: string
): void => {
  const { tabId } = chrome.devtools.inspectedWindow;
  chrome.runtime.sendMessage({
    type: MessageType.UnSetMockResponse,
    data: { tabId, operationType, operationName },
  });
};
