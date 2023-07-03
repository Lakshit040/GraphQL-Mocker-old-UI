import _ from "lodash";
import {
  parse,
  getIntrospectionQuery,
  buildClientSchema,
  printSchema,
  buildSchema,
} from "graphql";
import {
  MessageType,
  INTERNAL_SERVER_ERROR,
  ERROR_GENERATING_RANDOM_RESPONSE,
  SUCCESS,
  SCHEMA_INTROSPECTION_ERROR,
  INVALID_MOCK_RESPONSE,
  VALID_RESPONSE,
  BooleanType,
} from "../../common/types";
import { DataSet } from "./randomDataTypeGenerator";
import giveRandomResponse from "./randomMockDataGenerator";
import { giveTypeMaps } from "./typeMapProvider";
import { queryResponseValidator } from "./queryResponseValidator";
import { storeSchema, getSchema } from "./chromeStorageOptions";

interface GeneratedResponseConfig {
  data: object;
  message: string;
  non_matching_fields?: string[];
}

const fetchJSONFromInjectedScript = async (
  tabId: number,
  frameId: number,
  url: string,
  config: any
) => {
  const msg = {
    type: MessageType.DoFetch,
    data: { url, config },
  };
  const responseJSONData = await chrome.tabs.sendMessage(tabId, msg, {
    frameId,
  });
  return responseJSONData;
};

export const generateRandomizedResponse = async (
  tabId: number,
  frameId: number,
  graphQLendpoint: string,
  requestConfig: any,
  graphqlQuery: string,
  numRangeStart: number,
  numRangeEnd: number,
  isSpecialAllowed: boolean,
  arrayLength: number,
  stringLength: number,
  booleanValues: BooleanType,
  digitsAfterDecimal: number,
  mockResponse: string,
  shouldRandomizeResponse: boolean
): Promise<GeneratedResponseConfig> => {
  try {
    let schemaString = await getSchema(graphQLendpoint);

    if (schemaString === undefined) {
      console.log("Storing the schemaString!!");
      const requestConfigCopy = { ...requestConfig };
      requestConfigCopy.body = JSON.stringify({
        query: getIntrospectionQuery(),
      });

      const introspectionResult = await fetchJSONFromInjectedScript(
        tabId!,
        frameId!,
        graphQLendpoint,
        requestConfigCopy
      );

      if (introspectionResult.errors || introspectionResult.error) {
        return { data: {}, message: SCHEMA_INTROSPECTION_ERROR };
      }
      const schemaSDL = buildClientSchema(introspectionResult.data);
      const schemaString = printSchema(schemaSDL);
      try {
        const hello = await storeSchema(graphQLendpoint, schemaString);
        console.log(hello)
      } catch (error) {
        console.error('storeTypeMaps failed: ', error);
      }
    }
    schemaString = await getSchema(graphQLendpoint);
    const schemaSDL = buildSchema(schemaString!);
    const typeMap = schemaSDL!.getTypeMap();

    const [fieldTypes, enumTypes, unionTypes, interfaceTypes] = await giveTypeMaps(typeMap);

    const queryDocument = parse(graphqlQuery);

    if (!shouldRandomizeResponse) {
      const errors = queryResponseValidator(
        JSON.parse(mockResponse!),
        fieldTypes
      );
      return {
        data: JSON.parse(mockResponse!).data,
        message: errors.length === 0 ? VALID_RESPONSE : INVALID_MOCK_RESPONSE,
        non_matching_fields: errors,
      };
    }
    const dataSet = {
      stringLength: stringLength ?? 8,
      arrayLength: arrayLength ?? 4,
      isSpecialAllowed: isSpecialAllowed ?? true,
      booleanValues: booleanValues ?? BooleanType.Random,
      numRangeEnd: numRangeEnd ?? 1000,
      numRangeStart: numRangeStart ?? 1,
      digitsAfterDecimal: digitsAfterDecimal ?? 2,
    } as DataSet;

    try {
      return {
        data: giveRandomResponse(
          queryDocument,
          fieldTypes,
          enumTypes,
          unionTypes,
          interfaceTypes,
          dataSet
        ),
        message: SUCCESS,
      };
    } catch {
      return { data: {}, message: ERROR_GENERATING_RANDOM_RESPONSE };
    }
  } catch (error) {
    return { data: {}, message: INTERNAL_SERVER_ERROR + " or Invalid JSON" };
  }
};
