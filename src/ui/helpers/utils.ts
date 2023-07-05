import {
  MessageType,
  GraphQLOperationType,
  DynamicComponentData,
} from "../../common/types";

export const TopAlignedLabelAndInputClass = "p-2.5 my-1 h-8 flex-grow xs:w-14 sm:w-25 md:w-40 lg:w-80 text-sm text-gray-900 bg-gray-100 bg-transparent border rounded-xl border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer";

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
