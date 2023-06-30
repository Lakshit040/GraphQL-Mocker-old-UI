import { DocumentNode, GraphQLError, GraphQLSchema, validate } from "graphql";

const responseTypeMap: Map<string, string> = new Map();

export const queryResponseValidator = (
  response: any,
  queryDocument: DocumentNode,
  schema: GraphQLSchema,
  fieldTypes: Map<string, any>,
  enumTypes: Map<string, string[]>,
  interfaceTypes: Map<string, any>,
  unionTypes: Map<string, any>
) => {
  const getResponseFieldMap = (obj: any) => {
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        responseTypeMap.set(key, `[${typeof obj[key][0]}]`);
        if (obj[key].length > 0 && typeof obj[key][0] !== "object") {
        } else if (obj[key].length > 0) {
          getResponseFieldMap(obj[key][0]);
        }
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        responseTypeMap.set(key, typeof obj[key]);
        getResponseFieldMap(obj[key]);
      } else {
        responseTypeMap.set(key, typeof obj[key]);
      }
    }
  };

  const queryErrors = () => {
    let errors: string[] = [];
    const errorsGenerated: readonly GraphQLError[] = validate(
      schema,
      queryDocument
    );
    if (errorsGenerated.length > 0) {
      errors = errorsGenerated.map(error => error.message).join('#').split('#');
    }
    return errors;
  };
  return queryErrors();
};
