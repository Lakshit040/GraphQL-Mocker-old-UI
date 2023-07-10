import {
  readFromSessionStorage,
  writeToSessionStorage,
  deleteFromSessionStorage,
} from "../../common/chromeStorageHelpers";
import { DynamicComponentData } from "../../common/types";

const Namespaces = {
  CachedSchema: "CACHED_SCHEMA",
  QueryEndpoint: "QUERY_ENDPOINT",
  Operation: "OPERATION",
};

export const getSchema = async (endpointHost: string, endpointPath: string) => {
  return await readFromSessionStorage(
    Namespaces.CachedSchema,
    `${endpointHost}_${endpointPath}`
  );
};

export const storeSchema = async (
  endpointHost: string,
  endpointPath: string,
  schemaString: string
) => {
  await writeToSessionStorage(
    Namespaces.CachedSchema,
    `${endpointHost}_${endpointPath}`,
    schemaString
  );
};

export const getQueryEndpoint = async (tabId: number, expressionId: string) => {
  return await readFromSessionStorage(
    Namespaces.QueryEndpoint,
    `${tabId}_${expressionId}`
  );
};

export const storeQueryEndpoint = async (
  tabId: number,
  expressionId: string,
  query: string,
  origin: string,
  path: string
) => {
  await writeToSessionStorage(
    Namespaces.QueryEndpoint,
    `${tabId}_${expressionId}`,
    `${query}__${origin}__${path}`
  );
};

export const removeQueryEndpoint = async (
  tabId: number,
  expressionId: string
) => {
  await deleteFromSessionStorage(
    Namespaces.QueryEndpoint,
    `${tabId}_${expressionId}`
  );
};

export const getOperation = async (tabId: number, key: string) => {
  return await readFromSessionStorage(Namespaces.Operation, `${tabId}_${key}`);
};

export const storeOperation = async (
  tabId: number,
  key: string,
  value: Record<string, DynamicComponentData>
) => {
  await writeToSessionStorage(Namespaces.Operation, `${tabId}_${key}`, value);
};

export const deleteOperation = async (tabId: number, key: string) => {
  await deleteFromSessionStorage(Namespaces.Operation, `${tabId}_${key}`);
};
