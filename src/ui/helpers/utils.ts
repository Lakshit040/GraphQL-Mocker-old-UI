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

export const dynamicDataConverter = (dataSet: any): any => {
  dataSet.arrayLength = (isNaN(dataSet.arrayLength) ? 4 : Number(dataSet.arrayLength));
  dataSet.stringLength = (isNaN(dataSet.stringLength) ? 8 : Number(dataSet.stringLength));
  dataSet.numberStart = (isNaN(dataSet.numberStart) ? 1 : Number(dataSet.numberStart));
  dataSet.numberEnd = (isNaN(dataSet.numberEnd) ? 1000 : Number(dataSet.numberEnd));
  return dataSet;
};
