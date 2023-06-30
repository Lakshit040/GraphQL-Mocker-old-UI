import _ from "lodash";
import {
  parse,
  getIntrospectionQuery,
  buildClientSchema,
  printSchema,
  graphql,
  buildSchema,
} from "graphql";
import { GraphQLSchema } from "graphql/type/schema";
import {
  MessageType,
  INTERNAL_SERVER_ERROR,
  ERROR_GENERATING_RANDOM_RESPONSE,
  SUCCESS,
  SCHEMA_INTROSPECTION_ERROR,
  INVALID_MOCK_RESPONSE,
  VALID_RESPONSE,
} from "../../common/types";
import { DataSet } from "./randomDataTypeGenerator";
import giveRandomResponse from "./randomResponseGenerator";
import { giveTypeMaps } from "./gqlFieldMapHelper";
import { queryResponseValidator } from "./queryResponseValidator";
interface SchemaConfig {
  schemaSDL: GraphQLSchema;
  schemaString: string;
}
interface GeneratedResponseConfig {
  data: object;
  message: string;
  non_matching_fields?: string[];
}

const schemaConfigurationMap: Map<string, SchemaConfig> = new Map();
const unionConfigurationMap: Map<string, Map<string, any>> = new Map();
const interfaceConfigurationMap: Map<string, Map<string, any>> = new Map();
const enumConfigurationMap: Map<string, Map<string, string[]>> = new Map();
const fieldConfigurationMap: Map<string, Map<string, any>> = new Map();

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
  booleanValues: string,
  digitsAfterDecimal: number,
  mockResponse: string,
  shouldRandomizeResponse: boolean
): Promise<GeneratedResponseConfig> => {
  try {
    if (schemaConfigurationMap.get(graphQLendpoint) === undefined) {
      const requestConfigCopy = { ...requestConfig };
      requestConfigCopy.body = JSON.stringify({
        query: getIntrospectionQuery(),
      });

      const introspectionResult = await fetchJSONFromInjectedScript(
        tabId,
        frameId,
        graphQLendpoint,
        requestConfigCopy
      );

      if (introspectionResult.errors || introspectionResult.error) {
        return { data: {}, message: SCHEMA_INTROSPECTION_ERROR };
      }
      const schemaSDL = buildClientSchema(introspectionResult.data);
      const schemaString = printSchema(schemaSDL);

      const typeMap = schemaSDL!.getTypeMap();

      const [fieldTypes, enumTypes, interfaceTypes, unionTypes] =
        giveTypeMaps(typeMap);

      schemaConfigurationMap.set(graphQLendpoint, { schemaSDL, schemaString });
      interfaceConfigurationMap.set(graphQLendpoint, interfaceTypes);
      unionConfigurationMap.set(graphQLendpoint, unionTypes);
      enumConfigurationMap.set(graphQLendpoint, enumTypes);
      fieldConfigurationMap.set(graphQLendpoint, fieldTypes);
    }

    const { schemaSDL, schemaString } =
      schemaConfigurationMap.get(graphQLendpoint)!;
    const fieldTypes = fieldConfigurationMap.get(graphQLendpoint)!;
    const unionTypes = unionConfigurationMap.get(graphQLendpoint)!;
    const enumTypes = enumConfigurationMap.get(graphQLendpoint)!;
    const interfaceTypes = interfaceConfigurationMap.get(graphQLendpoint)!;

    const queryDocument = parse(graphqlQuery);

    if (!shouldRandomizeResponse) {
      const errors = queryResponseValidator(
        JSON.parse(mockResponse),
        fieldTypes
      );
      return {
        data: JSON.parse(mockResponse).data,
        message: VALID_RESPONSE,
        non_matching_fields: errors,
      };
    }
    const dataSet = {
      stringLength: stringLength,
      arrayLength: arrayLength,
      isSpecialAllowed: isSpecialAllowed,
      booleanValues: booleanValues,
      numRangeEnd: numRangeEnd,
      numRangeStart: numRangeStart,
      digitsAfterDecimal: digitsAfterDecimal,
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
