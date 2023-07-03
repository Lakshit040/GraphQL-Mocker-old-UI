import _ from "lodash";
import {
  parse,
  getIntrospectionQuery,
  buildClientSchema,
  printSchema,
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
  BooleanType,
} from "../../common/types";
import { DataSet } from "./randomDataTypeGenerator";
import giveRandomResponse from "./randomMockDataGenerator";
import { giveTypeMaps } from "./typeMapProvider";
import { queryResponseValidator } from "./queryResponseValidator";
import { storeTypeMaps, getTypeMaps } from "./mapStorage";

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
  booleanValues: string,
  digitsAfterDecimal: number,
  mockResponse: string,
  shouldRandomizeResponse: boolean
): Promise<GeneratedResponseConfig> => {
  try {
    let typeMaps = await getTypeMaps(graphQLendpoint);
    console.log(typeMaps.isEmpty);
    if (typeMaps === undefined || typeMaps.isEmpty === false) {
      console.log("Storing the typeMaps!!");
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
      const typeMap = schemaSDL!.getTypeMap();
      // console.log(schemaString);
      const typeMapStore = await giveTypeMaps(typeMap);
      console.log(typeMapStore);
      try {
        await storeTypeMaps(graphQLendpoint, typeMapStore, false);
      } catch (error) {
        console.error('storeTypeMaps failed: ', error);
      }
    }

    let store = await getTypeMaps(graphQLendpoint);
    let storedData = store?.typeMapStore;
    
    if (storedData !== undefined) {
      console.log("Storage hurray!!");
      console.log(storedData);
    }
    const queryDocument = parse(graphqlQuery);

    if (!shouldRandomizeResponse) {
      const errors = queryResponseValidator(
        JSON.parse(mockResponse!),
        store.fieldTypes
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
          storedData.fieldTypes,
          storedData.enumTypes,
          storedData.unionTypes,
          storedData.interfaceTypes,
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
