export const storeSchema = (graphQLendpoint: string, schemaString: string) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set({ [graphQLendpoint]: schemaString }, () => {
        console.log("TypeMap stored successfully!");
        resolve(schemaString)
      });
    } catch (error) {
      console.error("TypeMap not stored!!", error);
      reject(error);
    }
  });
};

export const getSchema = (graphQLEndpoint: string) => {
  return new Promise<string | undefined>((resolve) => {
    try {
      chrome.storage.local.get([graphQLEndpoint], (result) => {
        if (chrome.runtime.lastError) {
          console.log("Error retrieving schema!");
          resolve(undefined);
        } else {
          resolve(result[graphQLEndpoint] as string | undefined);
        }
      });
    } catch (error) {
      console.error('Caught error in getSchema: ', error);
      resolve(undefined);
    }
  });
};

export const getQueryEndpoint = (expressionId: string) => {
  return new Promise<string | undefined>((resolve) => {
    try{
      chrome.storage.local.get([expressionId], (result) => {
        if(chrome.runtime.lastError){
          console.log("Error retrieving endpoint!");
          resolve(undefined);
        }
        else{
          resolve(result[expressionId] as string | undefined);
        }
      })
    }
    catch(error) {
      console.log('Caught error in getQueryEndpoint: ', error);
    }
  })
}

export const storeQueryEndpoint = (expressionId: string, query: string, endpoint: string) => {
  return new Promise((resolve, reject) => {
    try{
      chrome.storage.local.set({[expressionId] : `${query}__${endpoint}`}, () => {
        console.log('Expression-Query-Endpoint stored');
        resolve(`${query}__${endpoint}`);
      })
    }
    catch(error){
      console.log('Query not stored!', error);
      reject(error);
    }
  })
}