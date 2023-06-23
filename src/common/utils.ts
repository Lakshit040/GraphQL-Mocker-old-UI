import gql from "graphql-tag";

import { GraphQLOperationType } from "./types";

export function parseIfGraphQLRequest(
  config: any
): [GraphQLOperationType, string, string] | undefined {
  let body = config.body;
  if (body === undefined) {
    return undefined;
  }

  try {
    let bodyObject = JSON.parse(body);

    let operationName: string = bodyObject.operationName || "";
    let query = bodyObject.query;

    if (query !== undefined) {
      let { definitions } = gql(query);
      let firstDefinition = definitions.length > 0 ? definitions[0] : undefined;
      if (
        firstDefinition !== undefined &&
        firstDefinition.kind === "OperationDefinition"
      ) {
        let operationType =
          firstDefinition.operation === "query"
            ? GraphQLOperationType.Query
            : GraphQLOperationType.Mutation;
        operationName = firstDefinition.name?.value || operationName;

        return [operationType, operationName, query];
      }
    }
  } catch (err) {
    console.error(err);
  }

  return undefined;
}

export function guidGenerator() {
  let S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}
