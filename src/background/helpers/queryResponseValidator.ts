import { DocumentNode, GraphQLSchema } from "graphql";

const responseTypeMap: Map<string, string> = new Map();

export const queryResponseValidator = (
  response: any,
  fieldTypes: Map<string, any>
): string[] => {
  const getResponseFieldMap = (obj: any) => {
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        responseTypeMap.set(key, `[${typeof obj[key][0]}]`);
        if (obj[key].length > 0 && typeof obj[key][0] !== "object") {
        } else if (obj[key].length > 0) {
          getResponseFieldMap(obj[key][0]);
        }
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        responseTypeMap.set(key, String(typeof obj[key]));
        getResponseFieldMap(obj[key]);
      } else {
        responseTypeMap.set(key, String(typeof obj[key]));
      }
    }
  };

  getResponseFieldMap(response);
  const errors: string[] = [];
  for (const [key, value] of responseTypeMap) {
    if (value.startsWith("[")) {
      // response type is array
      if (fieldTypes.has(key)) {
        const fieldValue = fieldTypes.get(key);
        if (typeof fieldValue === "string" && fieldValue.charAt(0) !== "[") {
          errors.push(`${key} must be an array`);
        }
      }
    } else {
      // base types check
      if (fieldTypes.has(key)) {
        let fieldValue = fieldTypes.get(key);
        if (typeof fieldValue === "string") {
          fieldValue = fieldValue.toLowerCase();
          if (fieldValue === "int" || fieldValue === "float") {
            fieldValue = "number";
          } else if (
            fieldValue === "id" ||
            fieldValue === "date" ||
            fieldValue === "url"
          ) {
            fieldValue = "string";
          }
          if (
            fieldValue === "string" ||
            fieldValue === "number" ||
            fieldValue === "boolean"
          ) {
            if (fieldValue !== value) {
              errors.push(
                `${key} must be a ${fieldValue} and you provided a ${value}`
              );
            }
          }
        }
      }
    }
  }

  if (errors.length === 0) {
    return [];
  } else {
    return errors;
  }
};
