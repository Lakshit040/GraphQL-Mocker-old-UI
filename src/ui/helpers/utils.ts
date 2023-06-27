import {
  MessageType,
  GraphQLOperationType,
  DynamicComponentData,
} from "../../common/types";

export function backgroundSetMockResponse(
  operationType: GraphQLOperationType,
  operationName: string,
  dynamicResponseData: Record<string, DynamicComponentData>
) {
  chrome.runtime.sendMessage({
    type: MessageType.SetMockResponse,
    data: {
      operationType,
      operationName,
      dynamicResponseData,
    },
  });
}

export function backgroundUnSetMockResponse(
  operationType: GraphQLOperationType,
  operationName: string
) {
  chrome.runtime.sendMessage({
    type: MessageType.UnSetMockResponse,
    data: { operationType, operationName },
  });
}
