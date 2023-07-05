import {
  ALL_CHARACTERS,
  NORMAL_CHARACTERS,
  BooleanType,
} from "../../common/types";
import {random, uniqueId, sampleSize, times} from "lodash";
import { specificFieldGenerator } from "./specificFieldGenerator";

const stringGenerator = (
  stringLength: number,
  isSpecialAllowed: boolean
): string => {
  return sampleSize(
    isSpecialAllowed ? ALL_CHARACTERS : NORMAL_CHARACTERS,
    stringLength
  ).join("");
};

const intGenerator = (numberFrom: number, numberTo: number): number => {
  return random(numberFrom, numberTo);
};

const floatGenerator = (
  numberFrom: number,
  numberTo: number,
  noOfDecimals: number
): number => {
  return Number(random(numberFrom, numberTo, true).toFixed(noOfDecimals));
};

const booleanGenerator = (booleanValue: BooleanType): boolean => {
  return booleanValue === BooleanType.True
    ? true
    : booleanValue === BooleanType.False
    ? false
    : random() < 0.5;
};


export interface DataSet {
  stringLength: number;
  arrayLength: number;
  numRangeStart: number;
  numRangeEnd: number;
  digitsAfterDecimal: number;
  booleanValues: BooleanType;
  isSpecialAllowed: boolean;
}

const baseTypes = ["String", "Int", "Float", "Boolean", "Number"];

export const dynamicValueGenerator = (
  dataType: string,
  enumTypes: Map<string, any>,
  dataSet: DataSet,
  fieldName: string
): any => {
  fieldName = fieldName.toLowerCase();

  try {
    if (baseTypes.includes(dataType)) {
      const result = specificFieldGenerator(fieldName);
      if (result !== undefined) {
        return result;
      }
    }
  } catch {}

  dataType = dataType.replace(/!/g, "");
  switch (dataType) {
    case "String":
      return stringGenerator(dataSet.stringLength, dataSet.isSpecialAllowed);
    case "Number":
    case "Int":
      return intGenerator(dataSet.numRangeStart, dataSet.numRangeEnd);
    case "ID":
      return uniqueId();
    case "Float":
      return floatGenerator(
        dataSet.numRangeStart,
        dataSet.numRangeEnd,
        dataSet.digitsAfterDecimal
      );
    case "Boolean":
      return booleanGenerator(dataSet.booleanValues);
    default: {
      if (dataType.startsWith("[")) {
        return times(dataSet.arrayLength, () =>
          dynamicValueGenerator(
            dataType.replace("[", "").replace("]", ""),
            enumTypes,
            dataSet,
            fieldName
          )
        );
      } else if (enumTypes.has(dataType)) {
        const enumValues = enumTypes.get(dataType)!;
        return enumValues[random(0, enumValues.length - 1)];
      } else {
        return stringGenerator(dataSet.stringLength, dataSet.isSpecialAllowed);
      }
    }
  }
};
