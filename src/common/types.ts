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
  numberStart: string;
  numberEnd: string;
  arrayLength: string;
  stringLength: string;
  specialCharactersAllowed: boolean;
  mockResponse: string;
  statusCode: string;
  responseDelay: string;
  afterDecimals: string;
  booleanType: string;
}

export {
  TRUE,
  FALSE,
  RANDOM,
  ALL_CHARACTERS,
  NORMAL_CHARACTERS,
};