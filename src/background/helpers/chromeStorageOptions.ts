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

export const getSchema = async (graphQLEndpoint: string) => {
  return await readFromSessionStorage(Namespaces.CachedSchema, graphQLEndpoint);
};

export const storeSchema = async (
  graphQLendpoint: string,
  schemaString: string
) => {
  await writeToSessionStorage(
    Namespaces.CachedSchema,
    graphQLendpoint,
    schemaString
  );
};

export const getQueryEndpoint = async (expressionId: string) => {
  return await readFromSessionStorage(Namespaces.QueryEndpoint, expressionId);
};

export const storeQueryEndpoint = async (
  expressionId: string,
  query: string,
  endpoint: string
) => {
  await writeToSessionStorage(
    Namespaces.QueryEndpoint,
    expressionId,
    `${query}__${endpoint}`
  );
};

export const removeQueryEndpoint = async (expressionId: string) => {
  await deleteFromSessionStorage(Namespaces.QueryEndpoint, expressionId);
};

export const getOperation = async (key: string) => {
  return await readFromSessionStorage(Namespaces.Operation, key);
};

export const storeOperation = async (
  key: string,
  value: Record<string, DynamicComponentData>
) => {
  await writeToSessionStorage(Namespaces.Operation, key, value);
};

export const deleteOperation = async (key: string) => {
  await deleteFromSessionStorage(Namespaces.Operation, key);
};
