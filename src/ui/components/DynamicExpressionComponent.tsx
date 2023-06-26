import { useState, useCallback, useEffect, useContext } from 'react'

import TopAlignedLabelAndInput from './TopAlignedLabelAndInput'
import SvgButtonComponent from './SvgButtonComponent'

import { MyContext } from './MockResponseConfigComponent'
interface DynamicComponentProps {
  id: string
  onDynamicExpressionDelete: (id: string) => void
}

const DynamicExpressionComponent = ({
  id,
  onDynamicExpressionDelete,
}: DynamicComponentProps) => {
  const [isRandomResponseExpanded, setIsRandomResponseExpanded] =
    useState(false)
  const [isMockResponseTextAreaFocused, setIsMockResponseTextAreaFocused] =
    useState(false)
  const [booleanTrue, setBooleanTrue] = useState(false)
  const [booleanFalse, setBooleanFalse] = useState(false)
  const [numberRangeStart, setNumberRangeStart] = useState(1)
  const [numberRangeEnd, setNumberRangeEnd] = useState(1000)
  const [afterDecimals, setAfterDecimals] = useState(0)
  const [arrayLength, setArrayLength] = useState(4)
  const [stringLength, setStringLength] = useState(8)
  const [specialCharactersAllowed, setSpecialCharactersAllowed] =
    useState(false)
  const [mockResponse, setMockResponse] = useState('')
  const [responseDelay, setResponseDelay] = useState(0)
  const [statusCode, setStatusCode] = useState(200)
  const [shouldRandomizeResponse, setShouldRandomizeResponse] = useState(false)
  const [shouldValidateResponse, setShouldValidateResponse] = useState(false)
  const [dynamicExpression, setDynamicExpression] = useState('')
  const [isExpressionMocking, setIsExpressionMocking] = useState(false)

  const { register, unregister } = useContext(MyContext)

  useEffect(() => {
    if (isExpressionMocking) {
      register(id, {
        dynamicExpression,
        shouldRandomizeResponse,
        shouldValidateResponse,
        numberRangeStart,
        numberRangeEnd,
        arrayLength,
        stringLength,
        specialCharactersAllowed,
        mockResponse,
        statusCode,
        responseDelay,
        afterDecimals,
        booleanTrue,
        booleanFalse,
      })
    }
    return () => unregister(id)
  }, [
    register,
    unregister,
    id,
    dynamicExpression,
    shouldRandomizeResponse,
    shouldValidateResponse,
    numberRangeStart,
    numberRangeEnd,
    arrayLength,
    stringLength,
    specialCharactersAllowed,
    mockResponse,
    statusCode,
    responseDelay,
    afterDecimals,
    booleanTrue,
    booleanFalse,
    isExpressionMocking
  ])

  const handleNumberRangeStartChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNumberRangeStart(Number(event.target.value.trim()))
    },
    []
  )
  const handleDynamicExpressionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDynamicExpression(event.target.value)
    },
    []
  )
  const handleRandomResponseToggle = useCallback(() => {
    setIsRandomResponseExpanded((e) => !e)
  }, [])

  const handleShouldValidateResponseChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShouldValidateResponse((r) => !r)
    },
    []
  )
  const handleNumberRangeEndChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNumberRangeEnd(Number(event.target.value.trim()))
    },
    []
  )
  const handleBooleanTrueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setBooleanTrue(event.target.checked)
      setBooleanFalse(false)
    },
    []
  )
  const handleBooleanFalseChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setBooleanFalse(event.target.checked)
      setBooleanTrue(false)
    },
    []
  )
  const handleAfterDecimalsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value.trim())
      setAfterDecimals(value >= 0 ? value : 0)
    },
    []
  )

  const handleArrayLengthChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value.trim())
      setArrayLength(value > 0 ? value : 1)
    },
    []
  )

  const handleStringLengthChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value.trim())
      setStringLength(value > 0 ? value : 1)
    },
    []
  )

  const handleSpecialCharactersAllowedChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSpecialCharactersAllowed(event.target.checked)
    },
    []
  )
  const handleResponseDelayChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setResponseDelay(Number(event.target.value.trim()))
    },
    []
  )

  const handleStatusCodeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStatusCode(Number(event.target.value.trim()))
    },
    []
  )

  const handleShouldRandomizeResponseChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShouldRandomizeResponse((r) => !r)
    },
    []
  )

  const handlePrettifyButtonPressed = () => {
    try {
      const prettified = JSON.stringify(JSON.parse(mockResponse), null, 2)
      setMockResponse(prettified)
    } catch (err) {}
  }

  const handleMockResponseChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMockResponse(event.target.value)
    },
    []
  )

  const handleMockResponseTextAreaFocused = useCallback(() => {
    setIsMockResponseTextAreaFocused(true)
  }, [])

  const handleMockResponseTextAreaBlurred = useCallback(() => {
    setIsMockResponseTextAreaFocused(false)
  }, [])
  const handleDeleteExpressionButtonPressed = useCallback(() => {
    onDynamicExpressionDelete(id)
  }, [id, onDynamicExpressionDelete])

  const [isExpressionExpanded, setIsExpressionExpanded] = useState(false)

  const handleExpressionHeadingClick = useCallback(() => {
    setIsExpressionExpanded((e) => !e)
  }, [])

  return (
    <div className="mb-4 border border-gray-200 shadow-sm">
      <div
        className={`flex items-center w-full p-2 text-left border border-gray-200 ${
          isExpressionExpanded ? 'bg-gray-100' : ''
        }`}
      >
        <SvgButtonComponent
          className={`w-6 h-6 text-gray-500 shrink-0 ml-1 mr-2 ${
            isExpressionExpanded ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          onClick={handleExpressionHeadingClick}
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </SvgButtonComponent>

        <TopAlignedLabelAndInput
          htmlInputId={`inputExpression`}
          type="text"
          label={`Expression`}
          value={dynamicExpression}
          placeholder="Give expression here..."
          divClassAppend="mx-4"
          onChange={handleDynamicExpressionChange}
        />

        <div className="grow flex flex-row-reverse">
          <SvgButtonComponent
            className="w-10 h-10 p-2 ml-1 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
            viewBox="0 0 32 32"
            onClick={handleDeleteExpressionButtonPressed}
          >
            <path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5  c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4  C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z" />
          </SvgButtonComponent>
          <SvgButtonComponent
            className="w-10 h-10 p-2 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
            viewBox="0 0 32 32"
            onClick={() => setIsExpressionMocking(!isExpressionMocking)}
          >
            {isExpressionMocking ? (
              <path d="M5.92 24.096q0 0.832 0.576 1.408t1.44 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.44 0.576t-0.576 1.44v16.16zM18.016 24.096q0 0.832 0.608 1.408t1.408 0.608h4.032q0.832 0 1.44-0.608t0.576-1.408v-16.16q0-0.832-0.576-1.44t-1.44-0.576h-4.032q-0.832 0-1.408 0.576t-0.608 1.44v16.16z"></path>
            ) : (
              <path d="M5.92 24.096q0 1.088 0.928 1.728 0.512 0.288 1.088 0.288 0.448 0 0.896-0.224l16.16-8.064q0.48-0.256 0.8-0.736t0.288-1.088-0.288-1.056-0.8-0.736l-16.16-8.064q-0.448-0.224-0.896-0.224-0.544 0-1.088 0.288-0.928 0.608-0.928 1.728v16.16z" />
            )}
          </SvgButtonComponent>
        </div>
      </div>
      <div
        className={
          isExpressionExpanded
            ? 'flex flex-col border border-gray-200 p-4'
            : 'hidden'
        }
      >
        <div className="flex items-stretch">
          <TopAlignedLabelAndInput
            htmlInputId="inputResponseDelay"
            type="number"
            label="Response Delay (ms)"
            value={responseDelay}
            divClassAppend="my-2"
            onChange={handleResponseDelayChange}
          />

          <TopAlignedLabelAndInput
            htmlInputId="inputStatusCode"
            type="number"
            label="Status Code"
            value={statusCode}
            divClassAppend="my-2 mx-4"
            onChange={handleStatusCodeChange}
          />
        </div>

        <div className="flex">
          <TopAlignedLabelAndInput
            htmlInputId="inputShouldRandomizeResponse"
            label="Randomize Response"
            divClassOverride="mb-2 flex flex-row-reverse justify-end"
          >
            <input
              type="checkbox"
              className="mx-1 h-4 w-auto border-gray-200 rounded text-blue-600 focus:ring-blue-500 peer"
              checked={shouldRandomizeResponse}
              onChange={handleShouldRandomizeResponseChange}
            ></input>
          </TopAlignedLabelAndInput>
          <div className="w-4"></div>
          <TopAlignedLabelAndInput
            htmlInputId="inputShouldValidateResponse"
            label="Validate Response"
            divClassOverride="mb-2 flex flex-row-reverse justify-end ml-2"
          >
            <input
              type="checkbox"
              className="mx-1 h-4 w-auto border-gray-200 rounded text-blue-600 focus:ring-blue-500 peer"
              checked={shouldValidateResponse}
              onChange={handleShouldValidateResponseChange}
            ></input>
          </TopAlignedLabelAndInput>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="flex items-center w-full p-2 text-gray-500 text-left border border-gray-200 bg-gray-100 rounded-lg shadow-sm"
          >
            <svg
              className={`w-6 h-6 shrink-0 ml-1 mr-2 ${
                isRandomResponseExpanded && shouldRandomizeResponse
                  ? 'rotate-180'
                  : ''
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleRandomResponseToggle}
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
            Random Response Configuration
          </button>
          <div
            className={
              isRandomResponseExpanded && shouldRandomizeResponse
                ? 'p-4 border border-gray-200 focus:ring-blue-600 rounded-lg shadow-sm'
                : 'hidden pointer-events-none'
            }
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <TopAlignedLabelAndInput
                  htmlInputId="inputRangeOfNumbersStart"
                  label="Numbers Range Start"
                  value={numberRangeStart}
                  type="number"
                  divClassAppend="my-2"
                  onChange={handleNumberRangeStartChange}
                />
                <TopAlignedLabelAndInput
                  htmlInputId="inputRangeOfNumbersEnd"
                  label="Numbers Range End"
                  value={numberRangeEnd}
                  type="number"
                  divClassAppend="my-2"
                  onChange={handleNumberRangeEndChange}
                />
              </div>
              <TopAlignedLabelAndInput
                htmlInputId="inputAfterDecimals"
                label="Digits After Decimal"
                value={afterDecimals}
                type="number"
                divClassAppend="my-2"
                onChange={handleAfterDecimalsChange}
              />
              <TopAlignedLabelAndInput
                htmlInputId="inputArrayLength"
                label="Array Length"
                value={arrayLength}
                type="number"
                divClassAppend="my-2"
                onChange={handleArrayLengthChange}
              />
              <TopAlignedLabelAndInput
                htmlInputId="inputStringLength"
                label="String Length"
                value={stringLength}
                type="number"
                divClassAppend="my-2"
                onChange={handleStringLengthChange}
              />

              <div className="grid grid-cols-3 gap-4">
                <TopAlignedLabelAndInput
                  htmlInputId="inputBooleansTrue"
                  label="All Booleans True"
                  divClassOverride="mb-2 flex flex-row-reverse justify-end ml-2"
                >
                  <input
                    type="checkbox"
                    className="mx-1 h-4 w-auto border-gray-200 rounded text-blue-600 focus:ring-blue-500 peer"
                    checked={booleanTrue}
                    onChange={handleBooleanTrueChange}
                  ></input>
                </TopAlignedLabelAndInput>
                <TopAlignedLabelAndInput
                  htmlInputId="inputBooleansFalse"
                  label="All Booleans False"
                  divClassOverride="mb-2 flex flex-row-reverse justify-end ml-2"
                >
                  <input
                    type="checkbox"
                    className="mx-1 h-4 w-auto border-gray-200 rounded text-blue-600 focus:ring-blue-500 peer"
                    checked={booleanFalse}
                    onChange={handleBooleanFalseChange}
                  ></input>
                </TopAlignedLabelAndInput>
                <TopAlignedLabelAndInput
                  htmlInputId="inputSpecialCharactersAllowed"
                  label="Special Characters Allowed"
                  divClassOverride="mb-2 flex flex-row-reverse justify-end ml-2"
                >
                  <input
                    type="checkbox"
                    className="mx-1 h-4 w-auto border-gray-200 rounded text-blue-600 focus:ring-blue-500 peer"
                    checked={specialCharactersAllowed}
                    onChange={handleSpecialCharactersAllowedChange}
                  ></input>
                </TopAlignedLabelAndInput>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse mt-4">
          <textarea
            id="inputMockResponse"
            value={mockResponse}
            className="my-1 py-1 px-1 w-full font-mono border border-gray-300 rounded-sm text-xs focus:border-blue-500 focus:ring-blue-500 input-mock-response"
            rows={4}
            onChange={handleMockResponseChange}
            onFocus={handleMockResponseTextAreaFocused}
            onBlur={handleMockResponseTextAreaBlurred}
            disabled={shouldRandomizeResponse}
          ></textarea>
          <div className="flex">
            <label
              htmlFor="inputMockResponse"
              className={`text-xs ${
                isMockResponseTextAreaFocused
                  ? 'text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Mock Response
            </label>
            <button
              className="px-1 h-auto ml-auto self-center tracking-wider rounded-sm text-xs text-gray-500 transition-colors duration-300 transform bg-white hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80"
              onClick={handlePrettifyButtonPressed}
            >
              {'{}'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DynamicExpressionComponent
