import {
  parse,
  getIntrospectionQuery,
  buildClientSchema,
  printSchema,
  buildSchema,
} from "graphql";
import { MessageType } from "../../common/types";
import giveRandomResponse from "./randomMockDataGenerator";
import { giveTypeMaps } from "./typeMapProvider";
import { queryResponseValidator } from "./queryResponseValidator";
import { storeSchema, getSchema } from "./chromeStorageOptions";

interface GeneratedResponseConfig {
  data: object;
  message?: string;
  non_matching_fields?: string[];
  field_not_found?: string;
  missing_fields?: string[];
}

export const fetchJSONFromInjectedScript = async (
  tabId: number,
  frameId: number,
  url: string,
  body: string,
  requestId: string
) => {
  const msg = {
    type: MessageType.DoFetch,
    data: { url, body, originalRequestId: requestId },
  };
  const responseJSONData = await chrome.tabs.sendMessage(tabId, msg, {
    frameId,
  });
  return responseJSONData;
};

export const generateRandomizedResponse = async (
  tabId: number,
  frameId: number,
  endpointHost: string,
  endpointPath: string,
  requestConfig: any,
  requestId: string,
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
  if (!(shouldRandomizeResponse || graphqlQuery !== "")) {
    return { data: JSON.parse(mockResponse).data };
  }

  try {
    let schemaString = await getSchema(endpointHost, endpointPath);

    if (schemaString === undefined) {
      const requestBody = JSON.stringify({
        query: getIntrospectionQuery(),
      });

      try {
        const introspectionResult = await fetchJSONFromInjectedScript(
          tabId!,
          frameId!,
          endpointPath,
          requestBody,
          requestId
        );

        const schemaSDL = buildClientSchema(introspectionResult.data);
        const schemaString = printSchema(schemaSDL);

        await storeSchema(endpointHost, endpointPath, schemaString);
      } catch {
        try {
          return {
            data: JSON.parse(mockResponse).data,
            message: "SCHEMA_INTROSPECTION_FAILED",
          };
        } catch {
          return { data: {}, message: "SCHEMA_INTROSPECTION_FAILED" };
        }
      }
    }
    schemaString = await getSchema(endpointHost, endpointPath);
    const schemaSDL = buildSchema(schemaString!);
    const typeMap = schemaSDL!.getTypeMap();

    const [fieldTypes, enumTypes, unionTypes, interfaceTypes] =
      await giveTypeMaps(typeMap);
    let queryDocument;
    try{
      queryDocument = parse(graphqlQuery);
    }
    catch{
      return {data: {}, message: "QUERY_PARSING_ERROR"}
    }

    if (!shouldRandomizeResponse) {
      const response = queryResponseValidator(
        JSON.parse(mockResponse!).data,
        fieldTypes
      );
      let data = {};
      try {
        data = JSON.parse(mockResponse).data;
      } catch {}
      return {
        data: data,
        message:
          response.errors.length === 0 && response.fieldNotFound.length === 0
            ? "VALID_RESPONSE"
            : "INVALID_MOCK_RESPONSE",
        non_matching_fields: response.errors,
        field_not_found: response.fieldNotFound,
      };
    }
    const dataSet = {
      stringLength: stringLength ?? 8,
      arrayLength: arrayLength ?? 4,
      isSpecialAllowed: isSpecialAllowed ?? true,
      booleanValues: booleanValues ?? "RANDOM",
      numRangeEnd: numRangeEnd ?? 1000,
      numRangeStart: numRangeStart ?? 1,
      digitsAfterDecimal: digitsAfterDecimal ?? 2,
    };

    try {
      const response = giveRandomResponse(
        queryDocument,
        fieldTypes,
        enumTypes,
        unionTypes,
        interfaceTypes,
        dataSet
      );
      if (typeof response === "string") {
        return {
          data: {},
          message: "FIELD_NOT_FOUND",
          field_not_found: response,
        };
      }
      return {
        data: response,
        message: "SUCCESS",
      };
    } catch {
      return { data: {}, message: "ERROR_GENERATING_RANDOM_RESPONSE" };
    }
  } catch (error) {
    return { data: {}, message: "INTERNAL_SERVER_ERROR" };
  }
};
