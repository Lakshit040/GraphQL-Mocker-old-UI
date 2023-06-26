import { parseIfGraphQLRequest } from './common/utils'
import { MessageType, GraphQLOperationType } from './common/types'
import { fetchData } from './ui/helpers/utils'
import { DynamicComponentData, TRUE, FALSE, RANDOM } from './common/types'
import { checkExpressionIsValid } from './ui/helpers/utils'


const generatedResponses: Map<
  string,
  Record<string, DynamicComponentData>
> = new Map()

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
        msg.data.dynamicResponseData
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

  const [operationType, operationName, query, variables] = parsed
  const key = `${operationType}_${operationName}`

  const generatedResponseConfig = generatedResponses.get(key)

  if (generatedResponseConfig !== undefined) {
    console.log('Found a key with the response!!')
    for (const dataRecord in generatedResponseConfig) {
      if (generatedResponseConfig.hasOwnProperty(dataRecord)) {
        const responseDataRecord = generatedResponseConfig[dataRecord]
        if (
          checkExpressionIsValid(
            responseDataRecord.dynamicExpression,
            variables
          )
        ) {
          // match with the expression
          console.log('Valid expression found!!')
          if (responseDataRecord.shouldRandomizeResponse) {
            const booleanValue = responseDataRecord.booleanTrue
              ? TRUE
              : responseDataRecord.booleanFalse
              ? FALSE
              : RANDOM
            const generatedRandomResponse = await fetchData(
              'https://api.github.com/graphql',
              query,
              responseDataRecord.shouldValidateResponse,
              responseDataRecord.numberRangeStart,
              responseDataRecord.numberRangeEnd,
              responseDataRecord.specialCharactersAllowed,
              responseDataRecord.arrayLength,
              responseDataRecord.stringLength,
              booleanValue,
              responseDataRecord.afterDecimals
            )
            if (responseDataRecord.responseDelay > 0) {
              setTimeout(() =>
                resolve(
                  JSON.stringify(generatedRandomResponse, null, 2),
                  responseDataRecord.statusCode
                )
              )
            } else {
              resolve(
                JSON.stringify(generatedRandomResponse, null, 2),
                responseDataRecord.statusCode
              )
            }
          } else {
            if (responseDataRecord.responseDelay > 0) {
              setTimeout(() =>
                resolve(
                  JSON.stringify(responseDataRecord.mockResponse, null, 2),
                  responseDataRecord.statusCode
                )
              )
            } else {
              resolve(
                JSON.stringify(responseDataRecord.mockResponse, null, 2),
                responseDataRecord.statusCode
              )
            }
          }
          return
        }
      }
    }

    return
  }
  reject()
}

function setMockResponse(
  operationType: GraphQLOperationType,
  operationName: string,
  dynamicResponseData: Record<string, DynamicComponentData>
) {
  console.log('Received the data from the user inputs')
  generatedResponses.set(
    `${operationType}_${operationName}`,
    dynamicResponseData
  )
  console.log('Now, we have stored all the data in our data base!!')
  console.log('Our Storage: ', generatedResponses);
}
