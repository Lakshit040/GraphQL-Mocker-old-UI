import { parseIfGraphQLRequest } from './common/utils'
import { MessageType, GraphQLOperationType } from './common/types'
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
interface MockResponseConfiguration {
  mockResponse: string
  responseDelay: number
  responseStatus: number
}

interface RandomResponseConfiguration {
  responseDelay: number
  responseStatus: number
}

let mockResponses: Map<string, MockResponseConfiguration> = new Map()
const randomResponses: Map<string, RandomResponseConfiguration> = new Map()

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  let isResponseAsync = true

  switch (msg.type) {
    case MessageType.RequestIntercepted: {
      let tabId = sender.tab?.id
      handleInterceptedRequest(tabId, msg.data.config, sendResponse)
      break
    }
    case MessageType.SetMockResponse: {
      setMockResponse(
        msg.data.operationType,
        msg.data.operationName,
        msg.data.mockResponse,
        msg.data.responseDelay,
        msg.data.statusCode,
        msg.data.randomize
      )
      break
    }
  }
  return isResponseAsync
})

async function handleInterceptedRequest(
  tabId: number | undefined,
  config: any,
  sendResponse: (response?: any) => void
) {
  let reject = () => sendResponse({ response: null, statusCode: 200 })
  let resolve = (response: string, statusCode: number) =>
    sendResponse({ response, statusCode })

  if (tabId === undefined) {
    reject()
    return
  }

  let parsed = parseIfGraphQLRequest(config)
  if (parsed === undefined) {
    reject()
    return
  }

  const [operationType, operationName, query] = parsed
  const key = `${operationType}:${operationName}`

  const randomResponseConfig = randomResponses.get(key)
  if (randomResponseConfig !== undefined) {
    const generatedResponse = await fetchData(
      `https://api.github.com/graphql`,
      query
    )

    const { responseDelay, responseStatus } = randomResponseConfig

    if (responseDelay > 0) {
      setTimeout(() => {
        resolve(JSON.stringify(generatedResponse, null, 2), responseStatus)
      })
    } else {
      resolve(JSON.stringify(generatedResponse, null, 2), responseStatus)
    }
    return
  }

  const mockResponseConfig = mockResponses.get(key)
  if (mockResponseConfig !== undefined) {
    const { mockResponse, responseDelay, responseStatus } = mockResponseConfig
    if (responseDelay > 0) {
      setTimeout(() => {
        resolve(mockResponse, responseStatus)
      }, responseDelay)
    } else {
      resolve(mockResponse, responseStatus)
    }
    return
  }

  reject()
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
    })
  } else {
    mockResponses.set(`${operationType}:${operationName}`, {
      mockResponse,
      responseDelay,
      responseStatus,
    })
  }
}

const randomResponse = {
  data: {},
}

const ALL_CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
const NORMAL_CHARACTERS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
interface DynamicResponseConfiguration {
  numberFrom?: number
  numberTo?: number
  noOfDecimals?: number
  isSpecial?: boolean
  stringLength?: number
  arrayLength?: number
  trueOrFalse?: boolean
}

const dynamicDataMap: Map<string, DynamicResponseConfiguration> = new Map()

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
    const start = rule.numberFrom ?? 1
    const end = rule.numberTo ?? start + 1000
    return _.random(start, end)
  }
}

const floatGenerator = (
  rule: DynamicResponseConfiguration | undefined
): number => {
  if (rule === undefined) {
    return Number(_.random(1, 1000, true).toFixed(2))
  } else {
    const start = rule.numberFrom ?? 1
    const end = rule.numberTo ?? start + 1000
    const afterDecimals = rule.noOfDecimals ?? 2
    return Number(_.random(start, end, true).toFixed(afterDecimals))
  }
}

const booleanGenerator = (
  rule: DynamicResponseConfiguration | undefined
): boolean => {
  if (rule === undefined || rule.trueOrFalse === undefined) {
    return _.random() < 0.5
  }
  if (rule.trueOrFalse) {
    return true
  } else {
    return false
  }
}

const idGenerator = (
  rule: DynamicResponseConfiguration | undefined
): string => {
  if (rule === undefined) {
    return String(_.random(1, 1000))
  } else {
    const start = rule.numberFrom ?? 1
    const end = rule.numberTo ?? start + 1000
    return String(_.random(start, end))
  }
}

const validateQuery = async (
  schema: GraphQLSchema,
  query: string
): Promise<number> => {
  try {
    const result: ExecutionResult = await graphql({ schema, source: query })
    if (result.errors) {
      return 2
    } else {
      return 1
    }
  } catch (error) {
    return 3
  }
}

const fetchData = async (graphQLendpoint: string, graphqlQuery: string) => {
  try {
    const arrayRule = dynamicDataMap.get('array')
    const arrayLen = arrayRule ? arrayRule.arrayLength ?? 4 : 4
    const endpoint = graphQLendpoint
    const introspectionQuery = getIntrospectionQuery()

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer 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`,
      },
      body: JSON.stringify({ query: introspectionQuery }),
    })

    const introspectionResult = await response.json()

    if (introspectionResult.errors || introspectionResult.error) {
      return randomResponse
    }

    const schema = buildClientSchema(introspectionResult.data)

    const typeMap = schema.getTypeMap()

    const res = await validateQuery(schema, graphqlQuery)
    if (res === 2 || res === 3) {
      return randomResponse
    }

    const interfaceTypes: Map<string, any> = new Map()
    const fieldTypes: Map<string, any> = new Map()
    const enumTypes: Map<string, string[]> = new Map()
    const unionTypes: Map<string, any> = new Map()

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
            return enumValues[Math.floor(Math.random() * enumValues.length)]
          } else {
            return {}
          }
        }
      }
    }

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
            fieldTypes.set(
              field.name,
              String(field.type).replace(new RegExp('!', 'g'), '')
            )
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
            return {}
          }
          const typeName = typeMap.get(field.name.value)

          if ('selectionSet' in field && field.selectionSet !== undefined) {
            if (typeName?.includes('[')) {
              response[field.name.value] = _.times(arrayLen, () =>
                generateMockResponse(field.selectionSet!, typeMap)
              )
            } else if (unionTypes.has(typeName!)) {
              const possibleTypes = schema.getPossibleTypes(
                unionTypes.get(typeName!)
              )
              const randomType =
                possibleTypes[Math.floor(Math.random() * possibleTypes.length)]
              response[field.name.value] = generateMockResponse(
                field.selectionSet!,
                getObjectFieldMap(randomType)
              )
            } else if (interfaceTypes.has(typeName)) {
              const possibleTypes = schema.getPossibleTypes(
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
        return randomResponse
      }
      return generateMockResponse(rootQuery.selectionSet, typeMap)
    }

    try {
      const data = generateNestedMockResponse(parse(graphqlQuery), fieldTypes)

      randomResponse.data = data
      return randomResponse
    } catch {
      return randomResponse
    }
  } catch (error) {
    return randomResponse
  }
}

// QUERY VALIDATION PART

const getFieldTypes = (
  parentType: GraphQLObjectType,
  node: FieldNode
): Record<string, any> => {
  let typeMap: Record<string, any> = {}

  node.selectionSet?.selections.forEach((field) => {
    const fieldName = (field as FieldNode).name.value
    let fieldType = parentType.getFields()[fieldName]?.type

    if (!fieldType) {
      console.log(
        `Field '${fieldName}' does not exist on type '${parentType.name}'.`
      )
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

const generateQueryTypeMap = (
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
          console.log(
            `Field '${fieldName}' does not exist on type '${rootTypeName}'.`
          )
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

const getTypeInfo = (obj: any): Record<string, any> => {
  const type = typeof obj

  if (obj === null) {
    return { type: 'null' }
  } else if (Array.isArray(obj)) {
    const first = obj[0]
    let fields = first ? getTypeInfo(first) : { type: 'array' }

    return { type: 'array', fields: fields.fields }
  } else if (type === 'object') {
    const fields: Record<string, any> = {}

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fields[key] = getTypeInfo(obj[key])
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
