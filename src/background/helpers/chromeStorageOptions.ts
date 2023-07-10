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

export const getQueryEndpoint = async (expressionId: string) => {
  return await readFromSessionStorage(Namespaces.QueryEndpoint, expressionId);
};

export const storeQueryEndpoint = async (
  expressionId: string,
  query: string,
  origin: string,
  path: string
) => {
  await writeToSessionStorage(
    Namespaces.QueryEndpoint,
    expressionId,
    `${query}__${origin}__${path}`
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

export const getOperationDetails = async (key: string) => {
  return new Promise<any>((resolve) => {
    chrome.storage.session.get([key], (result) => {
      resolve(result[key] || {});
    })
  })
}

export const storeOperationDetails = async (key: string, value: any) => {
  return new Promise<any>((resolve) => {
    chrome.storage.session.set({[key] : value});
  })
}
