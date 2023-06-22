import { MessageType, GraphQLOperationType } from '../../common/types'
import _ from 'lodash'
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
} from 'graphql'
import { GraphQLSchema } from 'graphql/type/schema'

const ALL_CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
const NORMAL_CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const INVALID_QUERY = 'invalid_query'
const INTERNAL_SERVER_ERROR = 'internal_server_error'
const FIELD_NOT_FOUND = 'field_not_found'
const ERROR_GENERATING_RANDOM_RESPONSE = 'error_generating_random_response'
const SUCCESS = 'success'
const SCHEMA_INTROSPECTION_ERROR = 'schema_introspection_error'
interface DynamicResponseConfiguration {
  numberFrom?: number
  numberTo?: number
  noOfDecimals?: number
  isSpecial?: boolean
  stringLength?: number
  arrayLength?: number
  trueOrFalse?: boolean
}

//////////// MAPS DECLARATIONS ////////////////
const dynamicDataMap: Map<string, DynamicResponseConfiguration> = new Map()
const schemaConfigurationMap: Map<string, GraphQLSchema> = new Map()
const unionConfigurationMap: Map<string,Map<string, any>> = new Map()
const interfaceConfigurationMap: Map<string, Map<string, any>> = new Map()
const enumConfigurationMap: Map<string, Map<string, string[]>> = new Map()
const fieldConfigurationMap: Map<string, Map<string, any>> = new Map()

const stringGenerator = (
  rule: DynamicResponseConfiguration | undefined
): string => {
  if (rule === undefined) {
    return _.sampleSize(NORMAL_CHARACTERS, 8).join('')
  }
  return _.sampleSize(ALL_CHARACTERS, rule.stringLength ?? 8).join('')
}

const intGenerator = (
  rule: DynamicResponseConfiguration | undefined
): number => {
  if (rule === undefined) {
    return _.random(1, 1000)
  } else {
    return _.random(
      rule.numberFrom ?? 1,
      rule.numberTo ?? (rule.numberFrom ?? 1) + 1000
    )
  }
}

const floatGenerator = (
  rule: DynamicResponseConfiguration | undefined
): number => {
  if (rule === undefined) {
    return Number(_.random(1, 1000, true).toFixed(2))
  } else {
    return Number(
      _.random(
        rule.numberFrom ?? 1,
        rule.numberTo ?? (rule.numberFrom ?? 1) + 1000,
        true
      ).toFixed(rule.noOfDecimals ?? 2)
    )
  }
}

const booleanGenerator = (
  rule: DynamicResponseConfiguration | undefined
): boolean => {
  if (rule === undefined || rule.trueOrFalse === undefined) {
    return _.random() < 0.5
  }
  return rule.trueOrFalse
}

const idGenerator = (
  rule: DynamicResponseConfiguration | undefined
): string => {
  if (rule === undefined) {
    return String(_.random(1, 1000))
  } else {
    return String(
      _.random(
        rule.numberFrom ?? 1,
        rule.numberTo ?? (rule.numberFrom ?? 1) + 1000
      )
    )
  }
}

const validateQuery = async (
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

export function backgroundSetMockResponse(
  operationType: GraphQLOperationType,
  operationName: string,
  mockResponse: string,
  responseDelay: number,
  statusCode: number,
  randomize: boolean
) {
  chrome.runtime.sendMessage({
    type: MessageType.SetMockResponse,
    data: {
      operationType,
      operationName,
      mockResponse,
      responseDelay,
      statusCode,
      randomize,
    },
  })
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

export const fetchData = async (
  graphQLendpoint: string,
  graphqlQuery: string
) => {
  try {
    const arrayRule = dynamicDataMap.get('array')
    const arrayLen = arrayRule ? arrayRule.arrayLength ?? 4 : 4

    if (schemaConfigurationMap.get(graphQLendpoint) === undefined) {
      const response = await fetch(graphQLendpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer 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`,
        },
        body: JSON.stringify({ query: getIntrospectionQuery() }),
      })

      const introspectionResult = await response.json()

      if (introspectionResult.errors || introspectionResult.error) {
        return { data: {}, message: SCHEMA_INTROSPECTION_ERROR }
      }
      const schema = buildClientSchema(introspectionResult.data)
      const typeMap = schema!.getTypeMap()

      const res = await validateQuery(schema!, graphqlQuery)
      if (res === INVALID_QUERY) {
        return { data: {}, message: INVALID_QUERY }
      } else if (res === INTERNAL_SERVER_ERROR) {
        return { data: {}, message: INTERNAL_SERVER_ERROR }
      }

      const interfaceTypes: Map<string, any> = new Map()
      const fieldTypes: Map<string, any> = new Map()
      const enumTypes: Map<string, string[]> = new Map()
      const unionTypes: Map<string, any> = new Map()

      Object.values(typeMap).forEach((graphQLType: any) => {
        if (isEnumType(graphQLType) && !graphQLType.name.startsWith('__')) {
          enumTypes.set(
            String(graphQLType),
            graphQLType.getValues().map((value) => value.value)
          )
        }
        if (isObjectType(graphQLType)) {
          const fields: GraphQLFieldMap<any, any> = graphQLType.getFields()
          Object.values(fields).forEach((field) => {
            if (
              !graphQLType.name.startsWith('__') &&
              graphQLType.name !== 'Mutation'
            ) {
              fieldTypes.set(field.name, String(field.type).replace(/!/g, ''))
            }
          })
        }
        if (isUnionType(graphQLType) && !graphQLType.name.startsWith('__')) {
          unionTypes.set(graphQLType.name, graphQLType)
        }
        if (isInterfaceType(graphQLType) && !graphQLType.name.startsWith('__')) {
          interfaceTypes.set(graphQLType.name, graphQLType)
        }
      })

      schemaConfigurationMap.set(graphQLendpoint, schema)
      interfaceConfigurationMap.set(graphQLendpoint, interfaceTypes)
      unionConfigurationMap.set(graphQLendpoint, unionTypes)
      enumConfigurationMap.set(graphQLendpoint, enumTypes)
      fieldConfigurationMap.set(graphQLendpoint, fieldTypes);
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
          return stringGenerator(dynamicDataMap.get('string'))
        case 'number':
        case 'int':
          return intGenerator(dynamicDataMap.get('int'))
        case 'id':
          return idGenerator(dynamicDataMap.get('id'))
        case 'float':
          return floatGenerator(dynamicDataMap.get('float'))
        case 'boolean':
          return booleanGenerator(dynamicDataMap.get('boolean'))
        default: {
          if (dataType.startsWith('[')) {
            const arrayRule = dynamicDataMap.get('array')
            const arrayLen = arrayRule ? arrayRule.arrayLength ?? 4 : 4
            return _.times(arrayLen, () =>
              dynamicValueGenerator(dataType.replace('[', '').replace(']', ''))
            )
          } else if (enumTypes.has(dataType)) {
            const enumValues = enumTypes.get(dataType)!
            return enumValues[_.random(0, enumValues.length)]
          } else {
            return {}
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
              response[field.name.value] = _.times(arrayLen, () =>
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
              response[field.name.value] = _.times(arrayLen, () =>
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
      const rootQuery: OperationDefinitionNode | undefined =
        queryDocument.definitions.find(
          (def) =>
            def.kind === 'OperationDefinition' && def.operation === 'query'
        ) as OperationDefinitionNode

      if (!rootQuery) {
        return { data: {}, message: INVALID_QUERY }
      }
      return generateMockResponse(rootQuery.selectionSet, typeMap)
    }

    try {
      const data = generateNestedMockResponse(parse(graphqlQuery), fieldTypes)

      return { data: data, message: SUCCESS }
    } catch {
      return { data: {}, message: ERROR_GENERATING_RANDOM_RESPONSE }
    }
  } catch (error) {
    return { data: {}, message: INTERNAL_SERVER_ERROR }
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
