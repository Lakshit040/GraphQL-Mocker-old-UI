import { useState, useCallback, useEffect, useContext } from "react";
import { XMarkIcon, PlayIcon, PauseIcon } from "@heroicons/react/24/solid";

import AccordionComponent from "./AccordionComponent";
import TopAlignedLabelAndInput from "./TopAlignedLabelAndInput";
import { ContextForDynamicComponents } from "./MockResponseConfigComponent";

import { TRUE, FALSE, RANDOM, BooleanType } from "../../common/types";

interface DynamicComponentProps {
  id: string;
  onDynamicExpressionDelete: (id: string) => void;
}

const DynamicExpressionComponent = ({
  id,
  onDynamicExpressionDelete,
}: DynamicComponentProps) => {
  const [isMockResponseTextAreaFocused, setIsMockResponseTextAreaFocused] =
    useState(false);

  const [booleanType, setBooleanType] = useState(BooleanType.Random);
  const [numberRangeStart, setNumberRangeStart] = useState(1);
  const [numberRangeEnd, setNumberRangeEnd] = useState(1000);
  const [afterDecimals, setAfterDecimals] = useState(0);
  const [arrayLength, setArrayLength] = useState(4);
  const [stringLength, setStringLength] = useState(8);
  const [specialCharactersAllowed, setSpecialCharactersAllowed] =
    useState(false);
  const [mockResponse, setMockResponse] = useState("");
  const [responseDelay, setResponseDelay] = useState(0);
  const [statusCode, setStatusCode] = useState(200);
  const [shouldRandomizeResponse, setShouldRandomizeResponse] = useState(false);
  const [shouldValidateResponse, setShouldValidateResponse] = useState(false);
  const [dynamicExpression, setDynamicExpression] = useState("");
  const [isExpressionMocking, setIsExpressionMocking] = useState(false);

  const { register, unregister } = useContext(ContextForDynamicComponents);

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
        booleanType,
      });
    }
    return () => unregister(id);
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
    booleanType,
    mockResponse,
    statusCode,
    responseDelay,
    afterDecimals,
    isExpressionMocking,
  ]);

  const handleExpressionMockingPlayPause = useCallback(() => {
    setIsExpressionMocking((e) => !e);
  }, []);

  const handleNumberRangeStartChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNumberRangeStart(Number(event.target.value.trim()));
    },
    []
  );
  const handleDynamicExpressionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setDynamicExpression(event.target.value);
    },
    []
  );

  const handleShouldValidateResponseChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShouldValidateResponse((r) => !r);
    },
    []
  );
  const handleNumberRangeEndChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNumberRangeEnd(Number(event.target.value.trim()));
    },
    []
  );

  const handleBooleanTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const currBooleanValue = event.target.value;
      if (currBooleanValue === TRUE) {
        setBooleanType(BooleanType.True);
      } else if (currBooleanValue === FALSE) {
        setBooleanType(BooleanType.False);
      } else {
        setBooleanType(BooleanType.Random);
      }
    },
    []
  );

  const handleAfterDecimalsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value.trim());
      setAfterDecimals(value >= 0 ? value : 0);
    },
    []
  );

  const handleArrayLengthChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value.trim());
      setArrayLength(value > 0 ? value : 1);
    },
    []
  );

  const handleStringLengthChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value.trim());
      setStringLength(value > 0 ? value : 1);
    },
    []
  );

  const handleSpecialCharactersAllowedChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSpecialCharactersAllowed(event.target.checked);
    },
    []
  );
  const handleResponseDelayChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setResponseDelay(Number(event.target.value.trim()));
    },
    []
  );

  const handleStatusCodeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStatusCode(Number(event.target.value.trim()));
    },
    []
  );

  const handleShouldRandomizeResponseChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShouldRandomizeResponse((r) => !r);
    },
    []
  );

  const handlePrettifyButtonPressed = () => {
    try {
      const prettified = JSON.stringify(JSON.parse(mockResponse), null, 2);
      setMockResponse(prettified);
    } catch (err) {}
  };

  const handleMockResponseChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMockResponse(event.target.value);
    },
    []
  );

  const handleMockResponseTextAreaFocused = useCallback(() => {
    setIsMockResponseTextAreaFocused(true);
  }, []);

  const handleMockResponseTextAreaBlurred = useCallback(() => {
    setIsMockResponseTextAreaFocused(false);
  }, []);
  const handleDeleteExpressionButtonPressed = useCallback(() => {
    onDynamicExpressionDelete(id);
  }, [id, onDynamicExpressionDelete]);

  return (
    <div className="mb-4 border-none rounded-xl overflow-auto">
      <AccordionComponent
        heading={
          <>
            <TopAlignedLabelAndInput
              htmlInputId={`inputRule`}
              type="text"
              label={`Rule`}
              value={dynamicExpression}
              placeholder={`id == "22", *, age > 18 && (count == 5 || visible == true)`}
              divClassAppend="mx-4"
              onChange={handleDynamicExpressionChange}
            />

            <div className="grow flex flex-row-reverse mr-2">
              <XMarkIcon
                title="Delete"
                className="w-10 h-10 p-2 mx-1 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
                onClick={handleDeleteExpressionButtonPressed}
              />
              {isExpressionMocking ? (
                <PauseIcon
                  title="Stop mocking"
                  className="w-10 h-10 p-2 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
                  onClick={handleExpressionMockingPlayPause}
                />
              ) : (
                <PlayIcon
                  title="Start mocking"
                  className="w-10 h-10 p-2 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
                  onClick={handleExpressionMockingPlayPause}
                />
              )}
            </div>
          </>
        }
      >
        <div className="flex flex-col border border-gray-200 p-4 rounded-xl overflow-auto">
          <div className="flex mr-4 xs:w-20 lg:w-80 md:w-60 sm:w-40">
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
              divClassAppend="my-2 mx-4 mr-2"
              onChange={handleStatusCodeChange}
            />
          </div>

          <div className="flex mt-4">
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
            <AccordionComponent
              heading={
                <span className="text-gray-500">
                  Random Response Configuration
                </span>
              }
            >
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

                <div className="grid grid-cols-2 gap-4 overflow-auto items-center">
                  <TopAlignedLabelAndInput
                    divClassAppend="mr-12 w-[50%]"
                    htmlInputId="inputSelectBooleanType"
                    label="Booleans Type"
                  >
                    <select
                      id="inputSelectBooleanType"
                      value={
                        booleanType === BooleanType.True
                          ? TRUE
                          : booleanType === BooleanType.False
                          ? FALSE
                          : RANDOM
                      }
                      className="h-8 flex-grow w-auto my-1 py-0 px-1 bg-gray-100 border rounded-xl border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500  peer"
                      onChange={handleBooleanTypeChange}
                    >
                      <option value={TRUE}>True</option>
                      <option value={FALSE}>False</option>
                      <option value={RANDOM}>Random</option>
                    </select>
                  </TopAlignedLabelAndInput>
                  <TopAlignedLabelAndInput
                    htmlInputId="inputSpecialCharactersAllowed"
                    label="Special Characters Allowed"
                    divClassOverride="mb-2 mt-4 w-[50%] flex flex-row-reverse justify-end ml-2"
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
            </AccordionComponent>
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
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Mock Response
              </label>
              <button
                className="px-1 h-auto ml-auto self-center tracking-wider rounded-sm text-xs text-gray-500 transition-colors duration-300 transform bg-white hover:bg-gray-200 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80"
                onClick={handlePrettifyButtonPressed}
              >
                {"{}"}
              </button>
            </div>
          </div>
        </div>
      </AccordionComponent>
    </div>
  );
};

export default DynamicExpressionComponent;
