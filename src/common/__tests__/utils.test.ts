import { describe, it, expect } from "@jest/globals";
import { parseIfGraphQLRequest } from "../utils";
import { GraphQLOperationType } from "../types";

describe("Test parseIfGraphQLRequest function", () => {
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
});
