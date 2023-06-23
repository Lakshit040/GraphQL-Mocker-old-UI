import { parseIfGraphQLRequest } from './common/utils'
import { MessageType, GraphQLOperationType } from './common/types'
import { fetchData } from './ui/helpers/utils'

interface GeneratedResponseConfiguration {
  mockResponse: string
  responseDelay: number
  responseStatus: number
  randomize: boolean
  shouldValidate: boolean
  numRangeStart: number
  numRangeEnd: number
  stringLength: number
  arrayLength: number
  booleanValues: number
  isSpecialAllowed: boolean
  digitsAfterDecimal: number
}

const generatedResponses: Map<string, GeneratedResponseConfiguration> =
  new Map()

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
        msg.data.randomize,
        msg.data.shouldValidate,
        msg.data.numRangeStart,
        msg.data.numRangeEnd,
        msg.data.stringLength,
        msg.data.arrayLength,
        msg.data.booleanValues,
        msg.data.isSpecialAllowed,
        msg.data.digitsAfterDecimal
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
  const key = `${operationType}_${operationName}`

  const generatedResponseConfig = generatedResponses.get(key)

  if (generatedResponseConfig !== undefined) {
    const { mockResponse, responseDelay, responseStatus, randomize, numRangeStart, numRangeEnd, isSpecialAllowed, shouldValidate, arrayLength, stringLength, booleanValues, digitsAfterDecimal} =
      generatedResponseConfig
    if (randomize) {
      const randomResponse = await fetchData('', query, shouldValidate, numRangeStart, numRangeEnd, isSpecialAllowed, arrayLength, stringLength, booleanValues, digitsAfterDecimal)
      if (responseDelay > 0) {
        setTimeout(() =>
          resolve(JSON.stringify(randomResponse, null, 2), responseStatus)
        )
      } else {
        resolve(JSON.stringify(randomResponse, null, 2), responseStatus)
      }
    } else {
      if (responseDelay > 0) {
        setTimeout(() =>
          resolve(JSON.stringify(mockResponse, null, 2), responseStatus)
        )
      } else {
        resolve(JSON.stringify(mockResponse, null, 2), responseStatus)
      }
    }
  }

  reject()
}

function setMockResponse(
  operationType: GraphQLOperationType,
  operationName: string,
  mockResponse: string,
  responseDelay: number,
  responseStatus: number,
  randomize: boolean,
  shouldValidate: boolean,
  numRangeStart: number,
  numRangeEnd: number,
  stringLength: number,
  arrayLength: number,
  booleanValues: number,
  isSpecialAllowed: boolean,
  digitsAfterDecimal: number
) {
  generatedResponses.set(`${operationType}_${operationName}`, {
    mockResponse,
    responseDelay,
    responseStatus,
    randomize,
    shouldValidate,
    numRangeStart,
    numRangeEnd,
    stringLength,
    arrayLength,
    booleanValues,
    isSpecialAllowed,
    digitsAfterDecimal,
  })
}
