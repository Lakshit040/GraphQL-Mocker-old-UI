import { MessageType, GraphQLOperationType } from '../../common/types'
import { isEqual } from 'lodash'
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

const randomResponse = {
  data: {},
}

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

function getTypeInfo(obj: any): Record<string, any> {
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
  return isEqual(responseString, queryString)
}

async function validateQuery(
  schema: GraphQLSchema,
  query: string
): Promise<number> {
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

const startDate = new Date(2000, 0, 1) // January 1, 2000
const endDate = new Date(2023, 11, 31) // December 31, 2023

export const fetchData = async (graphQLendpoint: string, graphqlQuery: string) => {
  try {
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
    if (res === 2) {
      return randomResponse
    } else if (res === 3) {
      return randomResponse
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

    const generateRandomValue = (str: string): any => {
      const typeName = str.replace('!', '')
      switch (typeName) {
        case 'ID':
          return String(Math.floor(Math.random() * 1000) + 1)
        case 'String':
          return [...Array(10)]
            .map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26)))
            .join('')
        case 'Boolean':
          return Math.random() < 0.5
        case 'Number':
          return Math.floor(Math.random() * 10000) + 1
        case 'Float':
          return Math.random() * 90 + 10
        case 'Int':
          return Math.floor(Math.random() * (1000 - 10 + 1)) + 10
        case 'Date': {
          const date = new Date(
            startDate.getTime() +
              Math.random() * (endDate.getTime() - startDate.getTime())
          )
          return date.toISOString().split('T')[0]
        }
        default: {
          if (enumTypes.has(typeName)) {
            const enumValues = enumTypes.get(typeName)!
            return enumValues[Math.floor(Math.random() * enumValues.length)]
          } else if (typeName.startsWith('[')) {
            return Array.from({ length: 2 }, () =>
              generateRandomValue(typeName.replace('[', '').replace(']', ''))
            )
          } else {
            return {}
          }
        }
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
              response[field.name.value] = Array.from({ length: 2 }, () =>
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
              response[field.name.value] = Array.from({ length: 2 }, () =>
                generateRandomValue(typeName!.replace('[', '').replace(']', ''))
              )
            } else {
              response[field.name.value] = generateRandomValue(typeName!)
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
