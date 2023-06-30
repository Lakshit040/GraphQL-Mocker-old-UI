import { useState, useCallback } from "react";
import { BooleanType, TRUE, FALSE } from "../../common/types";

const useDynamicComponentHook = () => {
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
  const [dynamicExpression, setDynamicExpression] = useState("");

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

  const handleShouldRandomizeResponseChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShouldRandomizeResponse((r) => !r);
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
      return currBooleanValue === TRUE
        ? setBooleanType(BooleanType.True)
        : currBooleanValue === FALSE
        ? setBooleanType(BooleanType.False)
        : setBooleanType(BooleanType.Random);
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
  const handleMockResponseChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMockResponse(event.target.value);
    },
    []
  );

  const handlePrettifyButtonPressed = () => {
    try {
      const prettified = JSON.stringify(
        JSON.parse(mockResponse),
        null,
        2
      );
      setMockResponse(prettified);
    } catch (err) {}
  };

  return {
    booleanType,
    numberRangeStart,
    numberRangeEnd,
    afterDecimals,
    arrayLength,
    stringLength,
    specialCharactersAllowed,
    mockResponse,
    responseDelay,
    statusCode,
    shouldRandomizeResponse,
    dynamicExpression,
    handleBooleanTypeChange,
    handleNumberRangeStartChange,
    handleNumberRangeEndChange,
    handleAfterDecimalsChange,
    handleArrayLengthChange,
    handleStringLengthChange,
    handleSpecialCharactersAllowedChange,
    handleMockResponseChange,
    handleResponseDelayChange,
    handleStatusCodeChange,
    handleShouldRandomizeResponseChange,
    handleDynamicExpressionChange,
    handlePrettifyButtonPressed
  };
};

export default useDynamicComponentHook;
