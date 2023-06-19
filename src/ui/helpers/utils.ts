import { MessageType, GraphQLOperationType } from "../../common/types";

export function backgroundSetMockResponse(
  operationType: GraphQLOperationType,
  operationName: string,
  mockResponse: string,
  responseDelay: number
) {
  chrome.runtime.sendMessage({
    type: MessageType.SetMockResponse,
    data: {
      operationType,
      operationName,
      mockResponse,
      responseDelay,
    },
  });
}
