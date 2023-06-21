import { parseIfGraphQLRequest } from "./common/utils";
import { MessageType, GraphQLOperationType } from "./common/types";
import {
  parse,
  DocumentNode,
  OperationDefinitionNode,
  SelectionSetNode,
  GraphQLFieldMap,
  isObjectType,
  getIntrospectionQuery,
  buildClientSchema,
  graphql,
  ExecutionResult,
  isEnumType,
  isUnionType,
  GraphQLObjectType,
  isInterfaceType,
} from "graphql";
import { GraphQLSchema } from "graphql/type/schema";
interface MockResponseConfiguration {
  mockResponse: string;
  responseDelay: number;
  responseStatus: number;
}

interface RandomResponseConfiguration {
  responseDelay: number;
  responseStatus: number;
}

const randomResponse = {
  data: {},
};

const toVerify: boolean = false;

let mockResponses: Map<string, MockResponseConfiguration> = new Map();
const randomResponses: Map<string, RandomResponseConfiguration> = new Map();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  let isResponseAsync = true;

  switch (msg.type) {
    case MessageType.RequestIntercepted: {
      let tabId = sender.tab?.id;
      handleInterceptedRequest(tabId, msg.data.config, sendResponse);
      break;
    }
    case MessageType.SetMockResponse: {
      setMockResponse(
        msg.data.operationType,
        msg.data.operationName,
        msg.data.mockResponse,
        msg.data.responseDelay,
        msg.data.statusCode,
        msg.data.randomize
      );
      break;
    }
  }
  return isResponseAsync;
});

async function handleInterceptedRequest(
  tabId: number | undefined,
  config: any,
  sendResponse: (response?: any) => void
) {
  let reject = () => sendResponse({ response: null, statusCode: 200 });
  let resolve = (response: string, statusCode: number) =>
    sendResponse({ response, statusCode });

  if (tabId === undefined) {
    reject();
    return;
  }

  let parsed = parseIfGraphQLRequest(config);
  if (parsed === undefined) {
    reject();
    return;
  }

  const [operationType, operationName, query] = parsed;
  const key = `${operationType}:${operationName}`;

  const randomResponseConfig = randomResponses.get(key);
  if (randomResponseConfig !== undefined) {
    const graphqlQuery = query;
    const generatedResponse = await fetchData(
      `https://api.github.com/graphql`,
      graphqlQuery
    );

    const { responseDelay, responseStatus } = randomResponseConfig;

    if (responseDelay > 0) {
      setTimeout(() => {
        resolve(JSON.stringify(generatedResponse, null, 2), responseStatus);
      });
    } else {
      resolve(JSON.stringify(generatedResponse, null, 2), responseStatus);
    }
    return;
  }

  const mockResponseConfig = mockResponses.get(key);
  if (mockResponseConfig !== undefined) {
    const { mockResponse, responseDelay, responseStatus } = mockResponseConfig;
    if (responseDelay > 0) {
      setTimeout(() => {
        resolve(mockResponse, responseStatus);
      }, responseDelay);
    } else {
      resolve(mockResponse, responseStatus);
    }
    return;
  }

  reject();
}

function setMockResponse(
  operationType: GraphQLOperationType,
  operationName: string,
  mockResponse: string,
  responseDelay: number,
  responseStatus: number,
  giveRandom: boolean
) {
  if (giveRandom) {
    randomResponses.set(`${operationType}:${operationName}`, {
      responseDelay,
      responseStatus,
    });
  } else {
    mockResponses.set(`${operationType}:${operationName}`, {
      mockResponse,
      responseDelay,
      responseStatus,
    });
  }
}

async function validateQuery(
  schema: GraphQLSchema,
  query: string
): Promise<number> {
  try {
    const result: ExecutionResult = await graphql({ schema, source: query });
    if (result.errors) {
      return 2;
    } else {
      return 1;
    }
  } catch (error) {
    return 3;
  }
}

const startDate = new Date(2000, 0, 1); // January 1, 2000
const endDate = new Date(2023, 11, 31); // December 31, 2023

async function fetchData(graphQLendpoint: string, graphqlQuery: string) {
  try {
    const endpoint = graphQLendpoint;
    const introspectionQuery = getIntrospectionQuery();

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer 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`,
      },
      body: JSON.stringify({ query: introspectionQuery }),
    });

    const introspectionResult = await response.json();

    if (introspectionResult.errors || introspectionResult.error) {
      return randomResponse;
    }

    const schema = buildClientSchema(introspectionResult.data);

    const typeMap = schema.getTypeMap();

    if (toVerify) {
      const res = await validateQuery(schema, graphqlQuery);
      if (res === 2) {
        return randomResponse;
      } else if (res === 3) {
        return randomResponse;
      }
    }
    const interfaceTypes: Map<string, any> = new Map();
    const fieldTypes: Map<string, any> = new Map();
    const enumTypes: Map<string, string[]> = new Map();
    const unionTypes: Map<string, any> = new Map();

    Object.values(typeMap).forEach((graphQLType: any) => {
      if (isEnumType(graphQLType) && !graphQLType.name.startsWith("__")) {
        enumTypes.set(
          String(graphQLType),
          graphQLType.getValues().map((value) => value.value)
        );
      }
      if (isObjectType(graphQLType)) {
        const fields: GraphQLFieldMap<any, any> = graphQLType.getFields();
        Object.values(fields).forEach((field) => {
          if (
            !graphQLType.name.startsWith("__") &&
            graphQLType.name !== "Mutation"
          ) {
            fieldTypes.set(
              field.name,
              String(field.type).replace(new RegExp("!", "g"), "")
            );
          }
        });
      }
      if (isUnionType(graphQLType) && !graphQLType.name.startsWith("__")) {
        unionTypes.set(graphQLType.name, graphQLType);
      }
      if (isInterfaceType(graphQLType) && !graphQLType.name.startsWith("__")) {
        interfaceTypes.set(graphQLType.name, graphQLType);
      }
    });

    const generateRandomValue = (str: string): any => {
      const typeName = str.replace("!", "");
      switch (typeName) {
        case "ID":
          return String(Math.floor(Math.random() * 1000) + 1);
        case "String":
          return [...Array(10)]
            .map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26)))
            .join("");
        case "Boolean":
          return Math.random() < 0.5;
        case "Number":
          return Math.floor(Math.random() * 10000) + 1;
        case "Float":
          return Math.random() * 90 + 10;
        case "Int":
          return Math.floor(Math.random() * (1000 - 10 + 1)) + 10;
        case "Date": {
          const date = new Date(
            startDate.getTime() +
              Math.random() * (endDate.getTime() - startDate.getTime())
          );
          return date.toISOString().split("T")[0];
        }
        default: {
          if (enumTypes.has(typeName)) {
            const enumValues = enumTypes.get(typeName)!;
            return enumValues[Math.floor(Math.random() * enumValues.length)];
          } else if (typeName.startsWith("[")) {
            return Array.from({ length: 2 }, () =>
              generateRandomValue(typeName.replace("[", "").replace("]", ""))
            );
          } else {
            return {};
          }
        }
      }
    };
    const getObjectFieldMap = (
      objectType: GraphQLObjectType
    ): Map<string, string> => {
      const fieldMap: Map<string, string> = new Map();
      const fields: GraphQLFieldMap<any, any> = objectType.getFields();
      Object.values(fields).forEach((field) => {
        fieldMap.set(field.name, String(field.type));
      });
      return fieldMap;
    };
    const generateMockResponse = (
      selectionSet: SelectionSetNode,
      typeMap: Map<string, any>
    ) => {
      const response: any = {};

      for (const field of selectionSet.selections) {
        if (field.kind === "InlineFragment") {
          response[field.typeCondition!.name.value] = generateMockResponse(
            field.selectionSet!,
            typeMap
          );
        } else {
          if (!typeMap.has(field.name.value)) {
            return {};
          }
          const typeName = typeMap.get(field.name.value);

          if ("selectionSet" in field && field.selectionSet !== undefined) {
            if (typeName?.includes("[")) {
              response[field.name.value] = Array.from({ length: 2 }, () =>
                generateMockResponse(field.selectionSet!, typeMap)
              );
            } else if (unionTypes.has(typeName!)) {
              const possibleTypes = schema.getPossibleTypes(
                unionTypes.get(typeName!)
              );
              const randomType =
                possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
              response[field.name.value] = generateMockResponse(
                field.selectionSet!,
                getObjectFieldMap(randomType)
              );
            } else if (interfaceTypes.has(typeName)) {
              const possibleTypes = schema.getPossibleTypes(
                interfaceTypes.get(typeName)
              );
              const randomType =
                possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
              response[field.name.value] = generateMockResponse(
                field.selectionSet,
                getObjectFieldMap(randomType)
              );
            } else {
              response[field.name.value] = generateMockResponse(
                field.selectionSet!,
                typeMap
              );
            }
          } else {
            if (typeName?.includes("[")) {
              response[field.name.value] = Array.from({ length: 2 }, () =>
                generateRandomValue(typeName!.replace("[", "").replace("]", ""))
              );
            } else {
              response[field.name.value] = generateRandomValue(typeName!);
            }
          }
        }
      }
      return response;
    };

    const generateNestedMockResponse = (
      queryDocument: DocumentNode,
      typeMap: Map<string, any>
    ): any => {
      const rootQuery: OperationDefinitionNode | undefined =
        queryDocument.definitions.find(
          (def) =>
            def.kind === "OperationDefinition" && def.operation === "query"
        ) as OperationDefinitionNode;

      if (!rootQuery) {
        return randomResponse;
      }
      return generateMockResponse(rootQuery.selectionSet, typeMap);
    };

    try {
      const data = generateNestedMockResponse(parse(graphqlQuery), fieldTypes);

      randomResponse.data = data;
      return randomResponse;
    } catch {
      return randomResponse;
    }
  } catch (error) {
    return randomResponse;
  }
}
