import { DynamicComponentData } from "../../common/types";

export const storeSchema = (graphQLendpoint: string, schemaString: string) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set({ [graphQLendpoint]: schemaString }, () => {
        resolve(schemaString);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getSchema = (graphQLEndpoint: string) => {
  return new Promise<string | undefined>((resolve) => {
    try {
      chrome.storage.local.get([graphQLEndpoint], (result) => {
        if (chrome.runtime.lastError) {
          resolve(undefined);
        } else {
          resolve(result[graphQLEndpoint] as string | undefined);
        }
      });
    } catch (error) {
      resolve(undefined);
    }
  });
};

export const getQueryEndpoint = (expressionId: string) => {
  return new Promise<string | undefined>((resolve, reject) => {
    try {
      chrome.storage.local.get([expressionId], (result) => {
        if (chrome.runtime.lastError) {
          resolve(undefined);
        } else {
          resolve(result[expressionId] as string | undefined);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const storeQueryEndpoint = (
  expressionId: string,
  query: string,
  endpoint: string
) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(
        { [expressionId]: `${query}__${endpoint}` },
        () => {
          resolve(`${query}__${endpoint}`);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

export const removeQueryEndpoint = (expressionId: string) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.remove(expressionId, () => {
        resolve(expressionId);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const storeOperation = (
  key: string,
  value: Record<string, DynamicComponentData>
) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(value);
      }
    });
  });
};

export const getOperation = (key: string) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        resolve(undefined);
      } else {
        resolve(result[key]);
      }
    });
  });
};

export const deleteOperation = (key: string) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove([key], () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(undefined);
      }
    });
  });
};
