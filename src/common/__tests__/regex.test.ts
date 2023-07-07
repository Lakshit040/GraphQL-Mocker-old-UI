import { describe, it, expect } from "@jest/globals";
import { CONDITION_REGEX, OBJECT_REGEX, ARRAY_REGEX } from "../regex";

describe("regex constants", () => {
  it("condition regex", () => {
    const expression = "a == b && c == d";
    const matches = expression.match(CONDITION_REGEX)!;
    const extractedConditions = matches.map((match) =>
      match.replace(/[()]/g, "").trim()
    );
    expect(extractedConditions).toEqual(["a == b", "c == d"]);
  });

  it("object regex", () => {
    const expression = "a == {b: 1}";
    const matches = expression.match(OBJECT_REGEX)!;
    expect(matches[2]).toEqual("{b: 1}");
  });

  it("array regex", () => {
    const expression = "a == [1, 2, 3]";
    const matches = expression.match(ARRAY_REGEX)!;
    expect(matches[2]).toEqual("[1, 2, 3]");
  });
});
