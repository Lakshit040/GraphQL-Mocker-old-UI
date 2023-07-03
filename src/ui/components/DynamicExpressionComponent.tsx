import { useState, useCallback, useEffect, useContext } from "react";
import { PlayIcon, PauseIcon, TrashIcon } from "@heroicons/react/24/solid";
import MockingAreaComponent from "./MockingAreaComponent";
import AccordionComponent from "./AccordionComponent";
import TopAlignedLabelAndInput from "./TopAlignedLabelAndInput";
import { ContextForDynamicComponents } from "./MockResponseConfigComponent";
import RandomResponseConfigComponent from "./RandomResponseConfigComponent";
import ResponseDelayCodeComponent from "./ResponseDelayCodeComponent";
import useDynamicComponentHook from "./DynamicComponentCustomHook";
import { generateRandomizedResponse } from "../../background/helpers/randomMockResponseGenerator";
import { fastRandomize } from "../../background/helpers/fastRandomization";
interface DynamicComponentProps {
  id: string;
  onDynamicExpressionDelete: (id: string) => void;
  onDynamicExpressionPlayPause: (id: string) => void;
}

const DynamicExpressionComponent = ({
  id,
  onDynamicExpressionDelete,
  onDynamicExpressionPlayPause,
}: DynamicComponentProps) => {
  const [isMockResponseTextAreaFocused, setIsMockResponseTextAreaFocused] =
    useState(false);

  const dynamicHook = useDynamicComponentHook();
  const [isExpressionMocking, setIsExpressionMocking] = useState(false);

  const { register, unregister } = useContext(ContextForDynamicComponents);

  useEffect(() => {
    if (isExpressionMocking) {
      register(id, {
        dynamicExpression: dynamicHook.dynamicExpression,
        shouldRandomizeResponse: dynamicHook.shouldRandomizeResponse,
        numberRangeStart: dynamicHook.numberRangeStart,
        numberRangeEnd: dynamicHook.numberRangeEnd,
        arrayLength: dynamicHook.arrayLength,
        stringLength: dynamicHook.stringLength,
        specialCharactersAllowed: dynamicHook.specialCharactersAllowed,
        mockResponse: dynamicHook.mockResponse,
        statusCode: dynamicHook.statusCode,
        responseDelay: dynamicHook.responseDelay,
        afterDecimals: dynamicHook.afterDecimals,
        booleanType: dynamicHook.booleanType,
      });
    }
    return () => unregister(id);
  }, [
    register,
    unregister,
    id,
    dynamicHook.dynamicExpression,
    dynamicHook.shouldRandomizeResponse,
    dynamicHook.numberRangeStart,
    dynamicHook.numberRangeEnd,
    dynamicHook.arrayLength,
    dynamicHook.stringLength,
    dynamicHook.specialCharactersAllowed,
    dynamicHook.booleanType,
    dynamicHook.mockResponse,
    dynamicHook.statusCode,
    dynamicHook.responseDelay,
    dynamicHook.afterDecimals,
    isExpressionMocking,
  ]);

  const handleExpressionMockingPlayPause = useCallback(() => {
    onDynamicExpressionPlayPause(id);
    setIsExpressionMocking((e) => !e);
  }, [id, onDynamicExpressionPlayPause]);

  const handleMockResponseTextAreaFocused = useCallback(() => {
    setIsMockResponseTextAreaFocused(true);
  }, []);

  const handleMockResponseTextAreaBlurred = useCallback(() => {
    setIsMockResponseTextAreaFocused(false);
  }, []);
  const handleDeleteExpressionButtonPressed = useCallback(() => {
    onDynamicExpressionDelete(id);
  }, [id, onDynamicExpressionDelete]);

  const handleResponseHere = useCallback(
    async (id: string) => {
      const response = await fastRandomize(id);
      if (response !== undefined) {
        dynamicHook.handleMockResponseChange(JSON.stringify(response, null, 2));
      }
    },
    [dynamicHook.handleMockResponseChange]
  );

  return (
    <div className="my-2 border-none rounded-xl overflow-auto">
      <AccordionComponent
        heading={
          <>
            <TopAlignedLabelAndInput
              htmlInputId={`inputRule`}
              type="text"
              label={`Rule`}
              value={dynamicHook.dynamicExpression}
              placeholder={`id == "22", *, age > 18 && count == 5`}
              onChange={dynamicHook.handleDynamicExpressionChange}
            />

            <div className="grow flex flex-row-reverse mr-2">
              <TrashIcon
                title="Delete rule"
                className="w-10 h-10 p-2 mx-1 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
                onClick={handleDeleteExpressionButtonPressed}
              />
              {isExpressionMocking ? (
                <PauseIcon
                  title="Deactivate rule"
                  className="w-10 h-10 p-2 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
                  onClick={handleExpressionMockingPlayPause}
                />
              ) : (
                <PlayIcon
                  title="Activate rule"
                  className="w-10 h-10 p-2 shrink-0 rounded-full text-gray-500 hover:bg-gray-200"
                  onClick={handleExpressionMockingPlayPause}
                />
              )}
            </div>
          </>
        }
      >
        <div className="flex flex-col border border-gray-200 p-4 rounded-xl overflow-auto">
          <ResponseDelayCodeComponent
            responseDelay={dynamicHook.responseDelay}
            statusCode={dynamicHook.statusCode}
            shouldRandomizeResponse={dynamicHook.shouldRandomizeResponse}
            onResponseDelayChange={dynamicHook.handleResponseDelayChange}
            onShouldRandomizeResponseChange={
              dynamicHook.handleShouldRandomizeResponseChange
            }
            onStatusCodeChange={dynamicHook.handleStatusCodeChange}
          />

          <div
            className={dynamicHook.shouldRandomizeResponse ? "mt-2" : "hidden"}
          >
            <RandomResponseConfigComponent
              booleanType={dynamicHook.booleanType}
              arrayLength={dynamicHook.arrayLength}
              stringLength={dynamicHook.stringLength}
              numberRangeEnd={dynamicHook.numberRangeEnd}
              numberRangeStart={dynamicHook.numberRangeStart}
              afterDecimals={dynamicHook.afterDecimals}
              specialCharactersAllowed={dynamicHook.specialCharactersAllowed}
              onBooleanTypeChange={dynamicHook.handleBooleanTypeChange}
              onAfterDecimalsChange={dynamicHook.handleAfterDecimalsChange}
              onArrayLengthChange={dynamicHook.handleArrayLengthChange}
              onNumberRangeEndChange={dynamicHook.handleNumberRangeEndChange}
              onNumberRangeStartChange={
                dynamicHook.handleNumberRangeStartChange
              }
              onSpecialCharactersAllowedChange={
                dynamicHook.handleSpecialCharactersAllowedChange
              }
              onStringLengthChange={dynamicHook.handleStringLengthChange}
            />
          </div>
          <MockingAreaComponent
            id={id}
            mockResponse={dynamicHook.mockResponse}
            isMockResponseTextAreaFocused={isMockResponseTextAreaFocused}
            shouldRandomizeResponse={dynamicHook.shouldRandomizeResponse}
            onMockResponseChange={dynamicHook.handleMockResponseChange}
            onMockResponseTextAreaBlurred={handleMockResponseTextAreaBlurred}
            onMockResponseTextAreaFocused={handleMockResponseTextAreaFocused}
            onPrettifyButtonPressed={dynamicHook.handlePrettifyButtonPressed}
            onGenerateResponseHereButtonPressed={handleResponseHere}
          />
        </div>
      </AccordionComponent>
    </div>
  );
};

export default DynamicExpressionComponent;
