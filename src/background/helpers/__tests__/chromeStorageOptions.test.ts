import {
  readFromSessionStorage,
  writeToSessionStorage,
  deleteFromSessionStorage,
} from "../../../common/chromeStorageHelpers";
import { BooleanType } from "../../../common/types";
import {
  getSchema,
  storeSchema,
  getQueryEndpoint,
  storeQueryEndpoint,
  removeQueryEndpoint,
  getOperation,
  storeOperation,
  deleteOperation,
} from "../../helpers/chromeStorageOptions";

jest.mock("../../../common/chromeStorageHelpers");

describe("Chrome Storage Helpers", () => {
  beforeEach(() => {
    (readFromSessionStorage as jest.Mock).mockClear();
    (writeToSessionStorage as jest.Mock).mockClear();
    (deleteFromSessionStorage as jest.Mock).mockClear();
  });

  it("getSchema should call readFromSessionStorage with correct parameters", async () => {
    await getSchema("testHost", "testPath");
    expect(readFromSessionStorage).toHaveBeenCalledWith(
      "CACHED_SCHEMA",
      "testHost_testPath"
    );
  });

  it("storeSchema should call writeToSessionStorage with correct parameters", async () => {
    await storeSchema("testHost", "testPath", "testSchema");
    expect(writeToSessionStorage).toHaveBeenCalledWith(
      "CACHED_SCHEMA",
      "testHost_testPath",
      "testSchema"
    );
  });

  it("getQueryEndpoint should call readFromSessionStorage with correct parameters", async () => {
    await getQueryEndpoint(1, "testExpression");
    expect(readFromSessionStorage).toHaveBeenCalledWith(
      "QUERY_ENDPOINT",
      "1_testExpression"
    );
  });

  it("storeQueryEndpoint should call writeToSessionStorage with correct parameters", async () => {
    await storeQueryEndpoint(
      1,
      "testExpression",
      "testQuery",
      "testOrigin",
      "testPath"
    );
    expect(writeToSessionStorage).toHaveBeenCalledWith(
      "QUERY_ENDPOINT",
      "1_testExpression",
      "testQuery__testOrigin__testPath"
    );
  });

  it("removeQueryEndpoint should call deleteFromSessionStorage with correct parameters", async () => {
    await removeQueryEndpoint(1, "testExpression");
    expect(deleteFromSessionStorage).toHaveBeenCalledWith(
      "QUERY_ENDPOINT",
      "1_testExpression"
    );
  });

  it("getOperation should call readFromSessionStorage with correct parameters", async () => {
    await getOperation(1, "operationType_operationName");
    expect(readFromSessionStorage).toHaveBeenCalledWith(
      "OPERATION",
      "1_operationType_operationName"
    );
  });

  it("deleteOperation should call deleteFromSessionStorage with correct parameters", async () => {
    await deleteOperation(1, "operationType_operationName");
    expect(deleteFromSessionStorage).toHaveBeenCalledWith(
      "OPERATION",
      "1_operationType_operationName"
    );
  });

  it("storeOperation should call writeToSessionStorage with correct parameters", async () => {
    const value = {
      dynamicComponentDataKey: {
        dynamicExpression: "example expression",
        shouldRandomizeResponse: true,
        numberRangeStart: 1,
        numberRangeEnd: 100,
        arrayLength: 5,
        stringLength: 10,
        specialCharactersAllowed: true,
        mockResponse: "{data: {}}",
        statusCode: 200,
        responseDelay: 0,
        afterDecimals: 2,
        booleanType: BooleanType.Random,
      },
    };
    await storeOperation(1, "operationType_operationName", value);
    expect(writeToSessionStorage).toHaveBeenCalledWith(
      "OPERATION",
      "1_operationType_operationName",
      value
    );
  });
});
