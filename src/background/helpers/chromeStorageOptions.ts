import {
  readFromSessionStorage,
  writeToSessionStorage,
  deleteFromSessionStorage,
} from "../../common/chromeStorageHelpers";
import { DynamicComponentData } from "../../common/types";

const Namespaces = {
  CachedSchema: "CACHED_SCHEMA",
  QueryEndpoint: "QUERY_ENDPOINT",
  MockBinding: "MOCK_BINDING",
  InvMockBinding: "INV_MOCK_BINDING",
  MockRules: "MOCK_RULES",
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

export const getMockBinding = async (tabId: number, key: string) => {
  return await readFromSessionStorage(
    Namespaces.MockBinding,
    `${tabId}_${key}`
  );
};

export const storeMockBinding = async (
  tabId: number,
  key: string,
  id: string
) => {
  await writeToSessionStorage(Namespaces.MockBinding, `${tabId}_${key}`, id);
};

export const deleteMockBinding = async (tabId: number, key: string) => {
  await deleteFromSessionStorage(Namespaces.MockBinding, `${tabId}_${key}`);
};

export const getInvMockBinding = async (tabId: number, id: string) => {
  return await readFromSessionStorage(
    Namespaces.InvMockBinding,
    `${tabId}_${id}`
  );
};

export const storeInvMockBinding = async (
  tabId: number,
  id: string,
  key: string
) => {
  await writeToSessionStorage(Namespaces.InvMockBinding, `${tabId}_${id}`, key);
};

export const deleteInvMockBinding = async (tabId: number, id: string) => {
  await deleteFromSessionStorage(Namespaces.InvMockBinding, `${tabId}_${id}`);
};

export const getMockRules = async (
  tabId: number,
  id: string
): Promise<Record<string, DynamicComponentData>> => {
  return (
    (await readFromSessionStorage(Namespaces.MockRules, `${tabId}_${id}`)) ?? {}
  );
};

export const storeMockRule = async (
  tabId: number,
  id: string,
  dynamicComponentId: string,
  dynamicComponentData: DynamicComponentData
) => {
  const mockRules = await getMockRules(tabId, id);
  mockRules[dynamicComponentId] = dynamicComponentData;
  await writeToSessionStorage(
    Namespaces.MockRules,
    `${tabId}_${id}`,
    mockRules
  );
};

export const deleteMockRule = async (
  tabId: number,
  id: string,
  dynamicComponentId: string
) => {
  const mockRules = await getMockRules(tabId, id);
  delete mockRules[dynamicComponentId];
  await writeToSessionStorage(
    Namespaces.MockRules,
    `${tabId}_${id}`,
    mockRules
  );
};

export const deleteMockRules = async (tabId: number, id: string) => {
  await deleteFromSessionStorage(Namespaces.MockRules, `${tabId}_${id}`);
};
