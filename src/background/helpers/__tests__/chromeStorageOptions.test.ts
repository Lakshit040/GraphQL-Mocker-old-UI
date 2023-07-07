import {
  readFromSessionStorage,
  writeToSessionStorage,
  deleteFromSessionStorage,
} from "../../../common/chromeStorageHelpers";
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
    await getQueryEndpoint("testExpression");
    expect(readFromSessionStorage).toHaveBeenCalledWith(
      "QUERY_ENDPOINT",
      "testExpression"
    );
  });

  it("storeQueryEndpoint should call writeToSessionStorage with correct parameters", async () => {
    await storeQueryEndpoint(
      "testExpression",
      "testQuery",
      "testOrigin",
      "testPath"
    );
    expect(writeToSessionStorage).toHaveBeenCalledWith(
      "QUERY_ENDPOINT",
      "testExpression",
      "testQuery__testOrigin__testPath"
    );
  });

  it("removeQueryEndpoint should call deleteFromSessionStorage with correct parameters", async () => {
    await removeQueryEndpoint("testExpression");
    expect(deleteFromSessionStorage).toHaveBeenCalledWith(
      "QUERY_ENDPOINT",
      "testExpression"
    );
  });

});
