import { useState, useCallback } from "react";
import { PlayIcon, PauseIcon, TrashIcon } from "@heroicons/react/24/solid";
import MockingAreaComponent from "./MockingAreaComponent";
import AccordionComponent from "./AccordionComponent";
import TopAlignedLabelAndInput from "./TopAlignedLabelAndInput";
import RandomResponseConfigComponent from "./RandomResponseConfigComponent";
import ResponseDelayCodeComponent from "./ResponseDelayCodeComponent";
import useDynamicComponentHook from "./useDynamicCustomHook";
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
      const { tabId } = chrome.devtools.inspectedWindow;
      const response = await fastRandomize(tabId, id);
      if (response !== undefined) {
        dynamicHook.handleGenerateResponseHere(
          JSON.stringify(response, null, 2)
        );
      }
    },
    [dynamicHook]
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
              onChange={dynamicHook.handleInputChange("dynamicExpression")}
            />

            <div className="grow flex flex-row-reverse mr-2">
              <TrashIcon
                title="Delete rule"
                className="w-10 h-10 p-2 mx-1 shrink-0 rounded-full text-gray-400 hover:bg-gray-600"
                onClick={handleDeleteExpressionButtonPressed}
              />
              {isExpressionMocking ? (
                <PauseIcon
                  title="Deactivate rule"
                  className="w-10 h-10 p-2 shrink-0 rounded-full text-gray-400 hover:bg-gray-600"
                  onClick={handleExpressionMockingPlayPause}
                />
              ) : (
                <PlayIcon
                  title="Activate rule"
                  className="w-10 h-10 p-2 shrink-0 rounded-full text-gray-400 hover:bg-gray-600"
                  onClick={handleExpressionMockingPlayPause}
                />
              )}
            </div>
          </>
        }
      >
        <div className="flex flex-col border border-gray-700 p-4 rounded-xl overflow-auto">
          <ResponseDelayCodeComponent
            responseDelay={dynamicHook.responseDelay}
            statusCode={dynamicHook.statusCode}
            shouldRandomizeResponse={dynamicHook.shouldRandomizeResponse}
            onResponseDelayChange={dynamicHook.handleInputChange(
              "responseDelay"
            )}
            onShouldRandomizeResponseChange={dynamicHook.handleCheckboxChange(
              "shouldRandomizeResponse"
            )}
            onStatusCodeChange={dynamicHook.handleInputChange("statusCode")}
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
              onAfterDecimalsChange={dynamicHook.handleInputChange(
                "afterDecimals"
              )}
              onArrayLengthChange={dynamicHook.handleInputChange("arrayLength")}
              onNumberRangeEndChange={dynamicHook.handleInputChange(
                "numberRangeEnd"
              )}
              onNumberRangeStartChange={dynamicHook.handleInputChange(
                "numberRangeStart"
              )}
              onSpecialCharactersAllowedChange={dynamicHook.handleCheckboxChange(
                "specialCharactersAllowed"
              )}
              onStringLengthChange={dynamicHook.handleInputChange(
                "stringLength"
              )}
            />
          </div>
          <MockingAreaComponent
            id={id}
            mockResponse={dynamicHook.mockResponse}
            isMockResponseTextAreaFocused={isMockResponseTextAreaFocused}
            shouldRandomizeResponse={dynamicHook.shouldRandomizeResponse}
            onMockResponseChange={dynamicHook.handleInputChange("mockResponse")}
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
