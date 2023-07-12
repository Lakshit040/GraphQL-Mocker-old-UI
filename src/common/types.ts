export enum MessageType {
  PanelMounted,
  RequestIntercepted,
  SetMockResponse,
  UnSetMockResponse,
  DoFetch,
  FetchResponse,
}

export enum GraphQLOperationType {
  Query,
  Mutation,
}

export enum BooleanType {
  True,
  False,
  Random,
}

const TRUE = "true";
const FALSE = "false";
const RANDOM = "random";
const ALL_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
const NORMAL_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export interface DynamicComponentData {
  dynamicExpression: string;
  shouldRandomizeResponse: boolean;
  numberRangeStart: number;
  numberRangeEnd: number;
  arrayLength: number;
  stringLength: number;
  specialCharactersAllowed: boolean;
  mockResponse: string;
  statusCode: number;
  responseDelay: number;
  afterDecimals: number;
  booleanType: BooleanType;
}

export {
  TRUE,
  FALSE,
  RANDOM,
  ALL_CHARACTERS,
  NORMAL_CHARACTERS,
};
