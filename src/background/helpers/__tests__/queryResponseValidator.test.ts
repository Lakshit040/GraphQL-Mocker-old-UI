import { queryResponseValidator } from "../queryResponseValidator";

describe('queryResponseValidator function', () => {
  const mockFieldTypes = new Map<string, any>();
  mockFieldTypes.set('name', 'String');
  mockFieldTypes.set('age', 'Int');
  mockFieldTypes.set('address', 'Object');
  mockFieldTypes.set('active', 'Boolean');
  mockFieldTypes.set('scores', '[Float]');

  it('should return empty errors and fieldNotFound for non-object response', () => {
    const result = queryResponseValidator('This is not an object', mockFieldTypes);
    expect(result.errors).toEqual([]);
    expect(result.fieldNotFound).toEqual([]);
  });

  it('should return empty errors and fieldNotFound for empty string response', () => {
    const result = queryResponseValidator('', mockFieldTypes);
    expect(result.errors).toEqual([]);
    expect(result.fieldNotFound).toEqual([]);
  });

  it('should validate the response against the given field types', () => {
    const mockResponse = {
      name: 'John Doe',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'Anywhere',
        country: 'USA'
      },
      active: true,
      scores: [85.6, 90.2, 88.5]
    };

    const result = queryResponseValidator(mockResponse, mockFieldTypes);
    expect(result.errors).toEqual([]);
    expect(result.fieldNotFound).toEqual(['street', 'city', 'country']);
  });
});
