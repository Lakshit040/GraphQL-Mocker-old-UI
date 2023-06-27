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
  chrome.runtime.sendMessage({
    type: MessageType.SetMockResponse,
    data: {
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
  chrome.runtime.sendMessage({
    type: MessageType.UnSetMockResponse,
    data: { operationType, operationName },
  });
};
