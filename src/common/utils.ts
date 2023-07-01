import gql from "graphql-tag";
import jsep from "jsep";
import _ from "lodash";
import { GraphQLOperationType } from "./types";

export const parseIfGraphQLRequest = (
  config: any
): [GraphQLOperationType, string, string, object] | undefined => {
  const body = config.body;
  if (body === undefined) {
    return undefined;
  }
  try {
    const bodyObject = JSON.parse(body);

    const query = bodyObject.query;
    const variables = bodyObject.variables || {};
    if (query !== undefined) {
      const { definitions } = gql(query);
      const firstDefinition =
        definitions.length > 0 ? definitions[0] : undefined;
      if (
        firstDefinition !== undefined &&
        firstDefinition.kind === "OperationDefinition"
      ) {
        const operationType =
          firstDefinition.operation === "query"
            ? GraphQLOperationType.Query
            : GraphQLOperationType.Mutation;
        const operationName =
          firstDefinition.name?.value || bodyObject.operationName || "";

        return [operationType, operationName, query, variables];
      }
    }
  } catch (err) {
    console.error(err);
  }

  return undefined;
};

export const doesMockingRuleHold = (
  dynamicExpression: string,
  variableValues: any
): boolean => {
  if (dynamicExpression.trim() === "*") {
    return true;
  }

  const expr = dynamicExpression;

  let str = expr.replace(/[\s\n]/g, "");

  const map: Map<string, string> = new Map();

  for (const [key, value] of Object.entries(variableValues)) {
    if (typeof value === "object") {
      const str = JSON.stringify(value).replace(/[\n\s]/g, "");
      map.set(str, key);
    }
  }

  const arr = Array.from(map.entries());
  for (const [key, value] of arr) {
    str = str.replace(key, "1");
    variableValues[value] = 1;
  }

  try {
    const ast = jsep(str);
    const evaluate = (node: any): any => {
      switch (node.type) {
        case "BinaryExpression":
          return evalBinaryExpression(node);
        case "Literal":
          return node.value;
        case "Identifier":
          return variableValues[node.name];
        default:
          return undefined;
      }
    };

    const evalBinaryExpression = (node: any): any => {
      const left = evaluate(node.left);
      const right = evaluate(node.right);

      switch (node.operator) {
        case "==" || "===":
          return left == right;
        case "!=" || "!==":
          return left != right;
        case "&&":
          return left && right;
        case "||":
          return left || right;
        case ">=":
          return left >= right;
        case "<=":
          return left <= right;
        case "<":
          return left < right;
        case ">":
          return left > right;
        default:
          return false;
      }
    };
    return evaluate(ast);
  } catch {
    return false;
  }
};

export function guidGenerator() {
  let S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

  return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}
