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
    stringLength ?? 8
  ).join("");
};

export const intGenerator = (numberFrom: number, numberTo: number): number => {
  return _.random(numberFrom ?? 1, numberTo ?? (numberFrom ?? 1) + 1000);
};

export const floatGenerator = (
  numberFrom: number,
  numberTo: number,
  noOfDecimals: number
): number => {
  return Number(
    _.random(
      numberFrom ?? 1,
      numberTo ?? (numberFrom ?? 1) + 1000,
      true
    ).toFixed(noOfDecimals ?? 2)
  );
};

export const booleanGenerator = (booleanValue: string): boolean => {
  return booleanValue === TRUE
    ? true
    : booleanValue === FALSE
    ? false
    : _.random() < 0.5;
};

export const idGenerator = (numberFrom: number, numberTo: number): string => {
  return _.random(
    numberFrom ?? 1,
    numberTo ?? (numberFrom ?? 1) + 1000
  ).toString();
};

