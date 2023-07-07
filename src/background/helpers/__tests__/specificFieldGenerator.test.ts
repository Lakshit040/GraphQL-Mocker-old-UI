import { specificFieldGenerator } from "../specificFieldGenerator";

describe('specificFieldGenerator function', () => {
  it.each([
    "name",
    "gender",
    "age",
    "animal",
    "color",
    "company",
    "domain",
    "email",
    "ip",
    "profession",
    "twitter",
    "url",
    "address",
    "altitude",
    "areacode",
    "city",
    "coordinates",
    "country",
    "depth",
    "latitude",
    "longitude",
    "phone",
    "postal",
    "postcode",
    "province",
    "state",
    "street",
    "date",
    "day",
    "currency",
    "birthday"
  ])('should generate non-undefined values for field "%s"', (field) => {
    const result = specificFieldGenerator(field);
    expect(result).toBeDefined();
  });

  it('should return undefined for an unknown field', () => {
    const result = specificFieldGenerator("unknown_field");
    expect(result).toBeUndefined();
  });
});
