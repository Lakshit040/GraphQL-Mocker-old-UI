import {
  ALL_CHARACTERS,
  NORMAL_CHARACTERS,
  TRUE,
  FALSE,
} from "../common/types";
import _ from "lodash";

export const stringGenerator = (
  stringLength: number,
  isSpecialAllowed: boolean
): string => {
  return _.sampleSize(
    isSpecialAllowed ? ALL_CHARACTERS : NORMAL_CHARACTERS,
    stringLength
  ).join("");
};

export const intGenerator = (numberFrom: number, numberTo: number): number => {
  return _.random(numberFrom, numberTo);
};

export const floatGenerator = (
  numberFrom: number,
  numberTo: number,
  noOfDecimals: number
): number => {
  return Number(_.random(numberFrom, numberTo, true).toFixed(noOfDecimals));
};

export const booleanGenerator = (booleanValue: string): boolean => {
  return booleanValue === TRUE
    ? true
    : booleanValue === FALSE
    ? false
    : _.random() < 0.5;
};

export const idGenerator = (): string => {
  return _.uniqueId("id");
};

export interface DataSet {
  stringLength: number;
  arrayLength: number;
  numRangeStart: number;
  numRangeEnd: number;
  digitsAfterDecimal: number;
  booleanValues: string;
  isSpecialAllowed: boolean
}

export const dynamicValueGenerator = (
  dataType: string,
  enumTypes: Map<string, any>,
  dataSet: DataSet
): any => {
  dataType = dataType.replace(/!/g, "");
  switch (dataType) {
    case "String":
      return stringGenerator(dataSet.stringLength, dataSet.isSpecialAllowed);
    case "Number":
    case "Int":
      return intGenerator(dataSet.numRangeStart, dataSet.numRangeEnd);
    case "ID":
      return idGenerator();
    case "Float":
      return floatGenerator(dataSet.numRangeStart, dataSet.numRangeEnd, dataSet.digitsAfterDecimal);
    case "Boolean":
      return booleanGenerator(dataSet.booleanValues);
    default: {
      if (dataType.startsWith("[")) {
        return _.times(dataSet.arrayLength, () =>
          dynamicValueGenerator(dataType.replace("[", "").replace("]", ""), enumTypes, dataSet)
        );
      } else if (enumTypes.has(dataType)) {
        const enumValues = enumTypes.get(dataType)!;
        return enumValues[_.random(0, enumValues.length - 1)];
      } else {
        return stringGenerator(dataSet.stringLength, dataSet.isSpecialAllowed);
      }
    }
  }
};
