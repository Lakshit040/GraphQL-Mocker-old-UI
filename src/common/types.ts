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
const INVALID_QUERY = "invalid_query";
const INVALID_MUTATION = "invalid_mutation";
const INTERNAL_SERVER_ERROR = "internal_server_error";
const FIELD_NOT_FOUND = "field_not_found";
const ERROR_GENERATING_RANDOM_RESPONSE = "error_generating_random_response";
const SUCCESS = "success";
const SCHEMA_INTROSPECTION_ERROR = "schema_introspection_error";
const INVALID_MOCK_RESPONSE = "invalid_mock_response";
const VALID_RESPONSE = "valid_response";
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
  INTERNAL_SERVER_ERROR,
  INVALID_QUERY,
  FIELD_NOT_FOUND,
  ERROR_GENERATING_RANDOM_RESPONSE,
  SCHEMA_INTROSPECTION_ERROR,
  SUCCESS,
  INVALID_MUTATION,
  INVALID_MOCK_RESPONSE,
  VALID_RESPONSE
};
