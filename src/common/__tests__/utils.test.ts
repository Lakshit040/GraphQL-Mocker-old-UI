import { describe, it, expect } from "@jest/globals";
import { parseIfGraphQLRequest } from "../utils";
import { GraphQLOperationType } from "../types";

describe("parseIfGraphQLRequest function", () => {
  const operationName = "getUserFirstFiveRepos";
  const query = `
  query getUserFirstFiveRepos($username: String!){
    user(login:$username) {
      name
      location
      repositories(first: 5) {
        edges {
          node {
            name
          }
        }
      }
    }
  } 
`;
  const variables = { username: "darthvader" };

  const EMPTY_STRING = "";

  it("basic request", () => {
    const config = {
      body: JSON.stringify({
        query,
        variables,
      }),
    };

    const result = parseIfGraphQLRequest(config);
    expect(result).not.toBeUndefined();

    const [_operationType, _operationName, _query, _variables] = result!;
    expect(_operationType).toEqual(GraphQLOperationType.Query);
    expect(_operationName).toEqual(operationName);
    expect(_query).toEqual(query);
    expect(_variables).toEqual(variables);
  });

  it("request without query", () => {
    const config = {
      body: JSON.stringify({
        operationName,
        variables,
      }),
    };

    const result = parseIfGraphQLRequest(config);
    expect(result).not.toBeUndefined();

    const [_operationType, _operationName, _query, _variables] = result!;
    expect(_operationType).toEqual(GraphQLOperationType.Query);
    expect(_operationName).toEqual(operationName);
    expect(_query).toEqual(EMPTY_STRING);
    expect(_variables).toEqual(variables);
  });

  it("request with no body", () => {
    const config = {};

    const result = parseIfGraphQLRequest(config);
    expect(result).toBeUndefined();

    const config2 = {
      body: "",
    };

    const result2 = parseIfGraphQLRequest(config2);
    expect(result2).toBeUndefined();
  });

  it("not a GraphQL request", () => {
    const config = {
      body: JSON.stringify({
        custom: query,
      }),
    };

    const result = parseIfGraphQLRequest(config);
    expect(result).toBeUndefined();
  });

  it("invalid GraphQL request", () => {
    const config = {
      body: JSON.stringify({
        query: "invalid query",
      }),
    };

    const result = parseIfGraphQLRequest(config);
    expect(result).toBeUndefined();
  });
});
