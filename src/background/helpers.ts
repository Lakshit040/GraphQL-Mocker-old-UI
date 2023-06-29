import _ from "lodash";
import {
  parse,
  DocumentNode,
  OperationDefinitionNode,
  SelectionSetNode,
  getIntrospectionQuery,
  buildClientSchema,
  printSchema,
  FragmentDefinitionNode
} from "graphql";
import { GraphQLSchema } from "graphql/type/schema";
import {
  MessageType,
  INVALID_MUTATION,
  INVALID_QUERY,
  INTERNAL_SERVER_ERROR,
  ERROR_GENERATING_RANDOM_RESPONSE,
  SUCCESS,
  SCHEMA_INTROSPECTION_ERROR,
  FIELD_NOT_FOUND,
  INVALID_MOCK_RESPONSE
} from "../common/types";
import {
  stringGenerator,
  intGenerator,
  floatGenerator,
  booleanGenerator,
  idGenerator,
} from "./randomGenerator";
import {
  generateTypeMapForQuery,
  generateTypeMapForResponse,
  giveTypeMaps
} from "./gqlFieldMapHelper";
interface SchemaConfig {
  schemaSDL: GraphQLSchema;
  schemaString: string;
}
interface GeneratedResponseConfig {
  data: object;
  message: string;
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
  shouldValidate: boolean,
  numRangeStart: number,
  numRangeEnd: number,
  isSpecialAllowed: boolean,
  arrayLength: number,
  stringLength: number,
  booleanValues: string,
  digitsAfterDecimal: number,
  mockResponse: string
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
      const typeMaps = giveTypeMaps(typeMap);

      const [fieldTypes, enumTypes, interfaceTypes, unionTypes] = typeMaps;

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

    if (shouldValidate) {
      try {
        const isValid = _.isEqual(
          generateTypeMapForResponse(JSON.parse(mockResponse).data).fields,
          generateTypeMapForQuery(schemaString, graphqlQuery)
        );
        return {
          data: JSON.parse(mockResponse).data,
          message: isValid ? SUCCESS : INVALID_MOCK_RESPONSE,
        };
      } catch {
        return {
          data: JSON.parse(mockResponse).data,
          message: INTERNAL_SERVER_ERROR,
        };
      }
    } else {
      const dynamicValueGenerator = (dataType: string): any => {
        dataType = dataType.replace(/!/g, "");
        switch (dataType) {
          case "String":
            return stringGenerator(stringLength, isSpecialAllowed);
          case "Number":
          case "Int":
            return intGenerator(numRangeStart, numRangeEnd);
          case "ID":
            return idGenerator(numRangeStart, numRangeEnd);
          case "Float":
            return floatGenerator(
              numRangeStart,
              numRangeEnd,
              digitsAfterDecimal
            );
          case "Boolean":
            return booleanGenerator(booleanValues);
          default: {
            if (dataType.startsWith("[")) {
              return _.times(arrayLength, () =>
                dynamicValueGenerator(
                  dataType.replace("[", "").replace("]", "")
                )
              );
            } else if (enumTypes.has(dataType)) {
              const enumValues = enumTypes.get(dataType)!;
              return enumValues[_.random(0, enumValues.length - 1)];
            } else {
              return stringGenerator(stringLength, isSpecialAllowed);
            }
          }
        }
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
          } else if (field.kind === "FragmentSpread") {
            const fragmentName = field.name.value;
            response[field.name.value] = generateMockResponse(
              typeMap.get(fragmentName).selectionSet,
              typeMap
            );
          } else {
            if (!typeMap.has(field.name.value)) {
              console.log(field.name.value);
              return { data: {}, message: FIELD_NOT_FOUND };
            }
            const typeName = typeMap.get(field.name.value);
  
            if ("selectionSet" in field && field.selectionSet !== undefined) {
              if (typeName?.includes("[")) {
                response[field.name.value] = _.times(arrayLength, () =>
                  generateMockResponse(field.selectionSet!, typeMap)
                );
              } else if (unionTypes.has(typeName!)) {
                response[field.name.value] = generateMockResponse(
                  field.selectionSet!,
                  typeMap
                );
              } else if (interfaceTypes.has(typeName)) {
                response[field.name.value] = generateMockResponse(
                  field.selectionSet,
                  typeMap
                );
              } else {
                response[field.name.value] = generateMockResponse(
                  field.selectionSet!,
                  typeMap
                );
              }
            } else {
              if (typeName?.includes("[")) {
                response[field.name.value] = _.times(arrayLength, () =>
                  dynamicValueGenerator(
                    typeName!.replace("[", "").replace("]", "")
                  )
                );
              } else {
                response[field.name.value] = dynamicValueGenerator(typeName!);
              }
            }
          }
        }
        return response;
      };
  
      const addFragmentToTypeMap = (fragment: FragmentDefinitionNode) => {
        const fragmentName = fragment.name.value;
        fieldTypes.set(fragmentName, fragment);
      };

      const generateNestedMockResponse = (
        queryDocument: DocumentNode,
        typeMap: Map<string, any>
      ): any => {
        const fragments = queryDocument.definitions.filter(
          (def) => def.kind === "FragmentDefinition"
        );
  
        fragments.forEach((fragment) => {
          addFragmentToTypeMap(fragment as FragmentDefinitionNode);
        });
        const operationDefinition: OperationDefinitionNode | undefined =
          queryDocument.definitions.find(
            (def) => def.kind === "OperationDefinition"
          ) as OperationDefinitionNode;

        if (!operationDefinition) {
          return {};
        }
        if (operationDefinition.operation === "query" || operationDefinition.operation === "mutation") {
          return generateMockResponse(
            operationDefinition.selectionSet,
            typeMap
          );
        }
        return {};
      };
      try {
        return {
          data: generateNestedMockResponse(parse(graphqlQuery), fieldTypes),
          message: SUCCESS,
        };
      } catch {
        return { data: {}, message: ERROR_GENERATING_RANDOM_RESPONSE };
      }
    }
  } catch (error) {
    return { data: {}, message: INTERNAL_SERVER_ERROR };
  }
};