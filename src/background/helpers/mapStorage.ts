export const storeTypeMaps = (graphQLendpoint: string, typeMapStore: any, isEmpty: boolean = false) => {
  return new Promise((resolve, reject) => {
    try {
      // Convert Maps to objects
      const storedValue = {
        isEmpty,
        typeMapStore: {
          enumTypes: Object.fromEntries(typeMapStore.enumTypes),
          fieldTypes: Object.fromEntries(typeMapStore.fieldTypes),
          unionTypes: Object.fromEntries(typeMapStore.unionTypes),
          interfaceTypes: Object.fromEntries(typeMapStore.interfaceTypes),
        },
      };
      
      chrome.storage.local.set({ [graphQLendpoint]: storedValue }, () => {
        console.log("TypeMap stored successfully!");
        resolve(storedValue);
      });
    } catch (error) {
      console.error("TypeMap not stored!!", error);
      reject(error);
    }
  });
};

export const getTypeMaps = async (graphQLEndpoint: string) => {
  return new Promise<any>((resolve) => {
    try {
      chrome.storage.local.get(graphQLEndpoint, (result) => {
        if (chrome.runtime.lastError) {
          console.log("Error retrieving typemap!!");
          resolve(undefined);
        } else {
          // Convert objects back to Maps
          if (result && result[graphQLEndpoint]) {
            const retrieved = result[graphQLEndpoint];
            const { typeMapStore } = retrieved;
            retrieved.typeMapStore = {
              enumTypes: new Map(Object.entries(typeMapStore.enumTypes)),
              fieldTypes: new Map(Object.entries(typeMapStore.fieldTypes)),
              unionTypes: new Map(Object.entries(typeMapStore.unionTypes)),
              interfaceTypes: new Map(Object.entries(typeMapStore.interfaceTypes)),
            };
            resolve(retrieved);
          } else {
            resolve(undefined);
          }
        }
      });
    } catch {
      console.log('Error retriving')
      resolve(undefined);
    }
  });
};
