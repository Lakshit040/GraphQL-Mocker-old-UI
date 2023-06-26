import { MessageType, GraphQLOperationType } from '../../common/types'
import _ from 'lodash'
import {Parser} from 'expr-eval'
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
  GraphQLList,
  FieldNode,
  visit,
  buildSchema,
  GraphQLNonNull,
  isInputObjectType,
  GraphQLInputFieldMap,
  GraphQLInputObjectType,
} from 'graphql'
import { GraphQLSchema } from 'graphql/type/schema'
import {
  TRUE,
  FALSE,
  RANDOM,
  INVALID_QUERY,
  INVALID_MUTATION,
  INTERNAL_SERVER_ERROR,
  ERROR_GENERATING_RANDOM_RESPONSE,
  SUCCESS,
  SCHEMA_INTROSPECTION_ERROR,
  FIELD_NOT_FOUND,
  ALL_CHARACTERS,
  NORMAL_CHARACTERS,
  DynamicComponentData,
} from '../../common/types'

//////////// MAPS DECLARATIONS ////////////////
const schemaConfigurationMap: Map<string, GraphQLSchema> = new Map()
const unionConfigurationMap: Map<string, Map<string, any>> = new Map()
const interfaceConfigurationMap: Map<string, Map<string, any>> = new Map()
const enumConfigurationMap: Map<string, Map<string, string[]>> = new Map()
const fieldConfigurationMap: Map<string, Map<string, any>> = new Map()

export function backgroundSetMockResponse(
  operationType: GraphQLOperationType,
  operationName: string,
  dynamicResponseData: Record<string, DynamicComponentData>
) {
  chrome.runtime.sendMessage({
    type: MessageType.SetMockResponse,
    data: {
      operationType,
      operationName,
      dynamicResponseData,
    },
  })
}

const stringGenerator = (
  stringLength: number,
  isSpecialAllowed: boolean
): string => {
  if (isSpecialAllowed)
    return _.sampleSize(ALL_CHARACTERS, stringLength ?? 8).join('')
  return _.sampleSize(NORMAL_CHARACTERS, stringLength ?? 8).join('')
}

const intGenerator = (numberFrom: number, numberTo: number): number => {
  return _.random(numberFrom ?? 1, numberTo ?? (numberFrom ?? 1) + 1000)
}

const floatGenerator = (
  numberFrom: number,
  numberTo: number,
  noOfDecimals: number
): number => {
  return Number(
    _.random(
      numberFrom ?? 1,
      numberTo ?? (numberFrom ?? 1) + 1000,
      true
    ).toFixed(noOfDecimals ?? 2)
  )
}

const booleanGenerator = (booleanValue: number): boolean => {
  if (booleanValue === TRUE) {
    return true
  } else if (booleanValue === FALSE) {
    return false
  } else {
    return _.random() < 0.5
  }
}

const idGenerator = (numberFrom: number, numberTo: number): string => {
  return String(_.random(numberFrom ?? 1, numberTo ?? (numberFrom ?? 1) + 1000))
}

const queryValidator = async (
  schema: GraphQLSchema,
  query: string
): Promise<string> => {
  try {
    const result: ExecutionResult = await graphql({ schema, source: query })
    if (result.errors) {
      return INVALID_QUERY
    } else {
      return ''
    }
  } catch (error) {
    return INTERNAL_SERVER_ERROR
  }
}

const getObjectFieldMap = (
  objectType: GraphQLObjectType
): Map<string, string> => {
  const fieldMap: Map<string, string> = new Map()
  const fields: GraphQLFieldMap<any, any> = objectType.getFields()
  Object.values(fields).forEach((field) => {
    fieldMap.set(field.name, String(field.type))
  })
  return fieldMap
}
// fetchData('', query, shouldValidate, numRangeStart, numRangeEnd, isSpecialAllowed, arrayLength, stringLength, booleanValues, digitsAfterDecimal)
export const fetchData = async (
  graphQLendpoint: string,
  graphqlQuery: string,
  shouldValidate: boolean,
  numRangeStart: number,
  numRangeEnd: number,
  isSpecialAllowed: boolean,
  arrayLength: number,
  stringLength: number,
  booleanValues: number,
  digitsAfterDecimal: number
) => {
  try {
    if (schemaConfigurationMap.get(graphQLendpoint) === undefined) {
      const response = await fetch(graphQLendpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer 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`,
        },
        body: JSON.stringify({ query: getIntrospectionQuery() }),
      })

      const introspectionResult = await response.json()

      if (introspectionResult.errors || introspectionResult.error) {
        return { data: {}, message: SCHEMA_INTROSPECTION_ERROR }
      }
      const schema = buildClientSchema(introspectionResult.data)
      const typeMap = schema!.getTypeMap()

      // const res = await queryValidator(schema!, graphqlQuery)
      // if (res === INVALID_QUERY) {
      //   return { data: {}, message: INVALID_QUERY }
      // } else if (res === INTERNAL_SERVER_ERROR) {
      //   return { data: {}, message: INTERNAL_SERVER_ERROR }
      // }

      const interfaceTypes: Map<string, any> = new Map()
      const fieldTypes: Map<string, any> = new Map()
      const enumTypes: Map<string, string[]> = new Map()
      const unionTypes: Map<string, any> = new Map()

      const addInputFields = (inputType: GraphQLInputObjectType) => {
        const fields = inputType.getFields()
        Object.values(fields).forEach((field) => {
          if (!inputType.name.startsWith('__')) {
            fieldTypes.set(field.name, String(field.type).replace(/!/g, ''))
          }
          if (field.type instanceof GraphQLInputObjectType) {
            addInputFields(field.type)
          }
        })
      }
      Object.values(typeMap).forEach((graphQLType: any) => {
        if (isEnumType(graphQLType) && !graphQLType.name.startsWith('__')) {
          enumTypes.set(
            String(graphQLType),
            graphQLType.getValues().map((value) => value.value)
          )
        }
        if (isObjectType(graphQLType)) {
          const fields = graphQLType.getFields()
          Object.values(fields).forEach((field) => {
            if (!graphQLType.name.startsWith('__')) {
              fieldTypes.set(field.name, String(field.type).replace(/!/g, ''))
            }
          })
        }
        if (isInputObjectType(graphQLType)) {
          addInputFields(graphQLType)
        }
        if (isUnionType(graphQLType) && !graphQLType.name.startsWith('__')) {
          unionTypes.set(graphQLType.name, graphQLType)
        }
        if (
          isInterfaceType(graphQLType) &&
          !graphQLType.name.startsWith('__')
        ) {
          interfaceTypes.set(graphQLType.name, graphQLType)
        }
      })

      schemaConfigurationMap.set(graphQLendpoint, schema)
      interfaceConfigurationMap.set(graphQLendpoint, interfaceTypes)
      unionConfigurationMap.set(graphQLendpoint, unionTypes)
      enumConfigurationMap.set(graphQLendpoint, enumTypes)
      fieldConfigurationMap.set(graphQLendpoint, fieldTypes)
    }

    const schema = schemaConfigurationMap.get(graphQLendpoint)!
    const fieldTypes = fieldConfigurationMap.get(graphQLendpoint)!
    const unionTypes = unionConfigurationMap.get(graphQLendpoint)!
    const enumTypes = enumConfigurationMap.get(graphQLendpoint)!
    const interfaceTypes = interfaceConfigurationMap.get(graphQLendpoint)!

    const dynamicValueGenerator = (dataType: string): any => {
      dataType = dataType.toLowerCase().replace(/!/g, '')
      switch (dataType) {
        case 'string':
          return stringGenerator(stringLength, isSpecialAllowed)
        case 'number':
        case 'int':
          return intGenerator(numRangeStart, numRangeEnd)
        case 'id':
          return idGenerator(numRangeStart, numRangeEnd)
        case 'float':
          return floatGenerator(numRangeStart, numRangeEnd, digitsAfterDecimal)
        case 'boolean':
          return booleanGenerator(booleanValues)
        default: {
          if (dataType.startsWith('[')) {
            return _.times(arrayLength, () =>
              dynamicValueGenerator(dataType.replace('[', '').replace(']', ''))
            )
          } else if (enumTypes.has(dataType)) {
            const enumValues = enumTypes.get(dataType)!
            return enumValues[_.random(0, enumValues.length)]
          } else {
            return stringGenerator(stringLength, isSpecialAllowed)
          }
        }
      }
    }

    const generateMockResponse = (
      selectionSet: SelectionSetNode,
      typeMap: Map<string, any>
    ) => {
      const response: any = {}

      for (const field of selectionSet.selections) {
        if (field.kind === 'InlineFragment') {
          response[field.typeCondition!.name.value] = generateMockResponse(
            field.selectionSet!,
            typeMap
          )
        } else {
          if (!typeMap.has(field.name.value)) {
            return { data: {}, message: FIELD_NOT_FOUND }
          }
          const typeName = typeMap.get(field.name.value)

          if ('selectionSet' in field && field.selectionSet !== undefined) {
            if (typeName?.includes('[')) {
              response[field.name.value] = _.times(arrayLength, () =>
                generateMockResponse(field.selectionSet!, typeMap)
              )
            } else if (unionTypes.has(typeName!)) {
              const possibleTypes = schema!.getPossibleTypes(
                unionTypes.get(typeName!)
              )
              const randomType =
                possibleTypes[Math.floor(Math.random() * possibleTypes.length)]
              response[field.name.value] = generateMockResponse(
                field.selectionSet!,
                getObjectFieldMap(randomType)
              )
            } else if (interfaceTypes.has(typeName)) {
              const possibleTypes = schema!.getPossibleTypes(
                interfaceTypes.get(typeName)
              )
              const randomType =
                possibleTypes[Math.floor(Math.random() * possibleTypes.length)]
              response[field.name.value] = generateMockResponse(
                field.selectionSet,
                getObjectFieldMap(randomType)
              )
            } else {
              response[field.name.value] = generateMockResponse(
                field.selectionSet!,
                typeMap
              )
            }
          } else {
            if (typeName?.includes('[')) {
              response[field.name.value] = _.times(arrayLength, () =>
                dynamicValueGenerator(
                  typeName!.replace('[', '').replace(']', '')
                )
              )
            } else {
              response[field.name.value] = dynamicValueGenerator(typeName!)
            }
          }
        }
      }
      return response
    }

    const generateNestedMockResponse = (
      queryDocument: DocumentNode,
      typeMap: Map<string, any>
    ): any => {
      const operationDefinition: OperationDefinitionNode | undefined =
        queryDocument.definitions.find(
          (def) => def.kind === 'OperationDefinition'
        ) as OperationDefinitionNode

      if (!operationDefinition) {
        return {}
      }

      if (operationDefinition.operation === 'query') {
        return generateMockResponse(operationDefinition.selectionSet, typeMap)
      }

      if (operationDefinition.operation === 'mutation') {
        // for a mutation operation, treat the output selection set just like a query
        // no special handling for the input, as it would normally be specified by the user
        return generateMockResponse(operationDefinition.selectionSet, typeMap)
      }

      // fallback in case the operation is neither a query nor a mutation
      return {}
    }

    try {
      return {
        data: generateNestedMockResponse(parse(graphqlQuery), fieldTypes),
        message: SUCCESS,
      }
    } catch {
      return { data: {}, message: ERROR_GENERATING_RANDOM_RESPONSE }
    }
  } catch (error) {
    return { data: {}, message: String(error) }
  }
}

////////////////QUERY VALIDATION PART////////////////
const getFieldTypes = (
  parentType: GraphQLObjectType,
  node: FieldNode
): Record<string, any> => {
  let typeMap: Record<string, any> = {}

  node.selectionSet?.selections.forEach((field) => {
    const fieldName = (field as FieldNode).name.value
    let fieldType = parentType.getFields()[fieldName]?.type

    if (!fieldType) {
      return
    }

    typeMap[fieldName] = fieldType.toString()

    while (
      fieldType instanceof GraphQLNonNull ||
      fieldType instanceof GraphQLList
    ) {
      fieldType = fieldType.ofType
    }

    if (
      fieldType instanceof GraphQLObjectType &&
      (field as FieldNode).selectionSet
    ) {
      typeMap[fieldName] = {
        type: formatter(typeMap[fieldName]),
        fields: getFieldTypes(fieldType, field as FieldNode),
      }
    } else {
      typeMap[fieldName] = {
        type: formatter(typeMap[fieldName]),
      }
    }
  })
  return typeMap
}

const formatter = (str: string) => {
  str = str.toLowerCase().replace(/!/g, '')
  if (str.startsWith('[')) {
    return 'array'
  } else if (str === 'id' || str === 'date') {
    return 'string'
  } else if (str === 'int' || str === 'float') {
    return 'number'
  } else {
    if (str !== 'string') return 'object'
    else return 'string'
  }
}

const generateTypeMapForQuery = (
  schemaStr: string,
  queryStr: string
): Record<string, any> => {
  const schema: GraphQLSchema = buildSchema(schemaStr)
  const query: DocumentNode = parse(queryStr)
  let typeMap: Record<string, any> = {}

  visit(query, {
    OperationDefinition(node) {
      const rootTypeName = 'Query'
      const rootType = schema.getType(rootTypeName) as GraphQLObjectType

      node.selectionSet?.selections.forEach((selection) => {
        const fieldName = (selection as FieldNode).name.value
        let fieldType = rootType.getFields()[fieldName]?.type

        if (!fieldType) {
          return
        }

        while (
          fieldType instanceof GraphQLNonNull ||
          fieldType instanceof GraphQLList
        ) {
          fieldType = fieldType.ofType
        }

        if (!(fieldType instanceof GraphQLObjectType)) {
          return
        }

        typeMap[fieldName] = {
          type: formatter(rootType.getFields()[fieldName].type.toString()),
          fields: getFieldTypes(fieldType, selection as FieldNode),
        }
      })
    },
  })
  return typeMap
}

const generateTypeMapForResponse = (obj: any): Record<string, any> => {
  const type = typeof obj

  if (obj === null) {
    return { type: 'null' }
  } else if (Array.isArray(obj)) {
    const first = obj[0]
    let fields = first ? generateTypeMapForResponse(first) : { type: 'array' }

    return { type: 'array', fields: fields.fields }
  } else if (type === 'object') {
    const fields: Record<string, any> = {}

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fields[key] = generateTypeMapForResponse(obj[key])
      }
    }

    return { type, fields }
  } else {
    return { type }
  }
}

const validate = (responseString: string, queryString: string): boolean => {
  return _.isEqual(responseString, queryString)
}

export const checkExpressionIsValid = (
  dynamicExpression: string,
  variableValues: any
): boolean => {
  const parser = new Parser();
  return Boolean(parser.evaluate(dynamicExpression, variableValues))
}
