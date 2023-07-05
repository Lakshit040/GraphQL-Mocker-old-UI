const getInternalKey = (namespace: string, key: string) => {
  return `${namespace}_${key}`;
};

export const readFromSessionStorage = async (
  namespace: string,
  key: string
): Promise<any | undefined> => {
  const internalKey = getInternalKey(namespace, key);
  const result = await chrome.storage.session.get(internalKey);
  return result[internalKey];
};

export const writeToSessionStorage = async (
  namespace: string,
  key: string,
  value: any
): Promise<void> => {
  const internalKey = getInternalKey(namespace, key);

  const toSet: any = {};
  toSet[internalKey] = value;

  await chrome.storage.session.set(toSet);
};

export const deleteFromSessionStorage = async (
  namespace: string,
  key: string
): Promise<void> => {
  await chrome.storage.session.remove(getInternalKey(namespace, key));
};
