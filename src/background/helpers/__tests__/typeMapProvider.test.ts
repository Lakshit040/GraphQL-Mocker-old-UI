import {
        GraphQLInputObjectType,
        GraphQLInterfaceType,
        GraphQLEnumType,
        GraphQLUnionType,
        GraphQLObjectType,
        GraphQLNonNull,
        GraphQLString,
      } from "graphql";
      
      import { giveTypeMaps } from "../typeMapProvider";
      
      describe("giveTypeMaps function", () => {
        it("should correctly map input types", async () => {
          const typeMap = {
            myInputType: new GraphQLInputObjectType({
              name: "myInputType",
              fields: { field1: { type: new GraphQLNonNull(GraphQLString) } },
            }),
          };
      
          const [fieldTypes, enumTypes, unionTypes, interfaceTypes] =
            await giveTypeMaps(typeMap);
      
          expect(fieldTypes.get("field1")).toEqual("String");
        });
      
        it("should correctly map enum types", async () => {
          const typeMap = {
            myEnumType: new GraphQLEnumType({
              name: "myEnumType",
              values: { Value1: { value: "Value1" }, Value2: { value: "Value2" } },
            }),
          };
      
          const [fieldTypes, enumTypes, unionTypes, interfaceTypes] =
            await giveTypeMaps(typeMap);
      
          expect(enumTypes.get("myEnumType")).toEqual(["Value1", "Value2"]);
        });
      
        it("should correctly map object types", async () => {
          const typeMap = {
            myObjectType: new GraphQLObjectType({
              name: "myObjectType",
              fields: { field1: { type: new GraphQLNonNull(GraphQLString) } },
            }),
          };
      
          const [fieldTypes, enumTypes, unionTypes, interfaceTypes] =
            await giveTypeMaps(typeMap);
      
          expect(fieldTypes.get("field1")).toEqual("String");
        });
      
        it("should correctly map union types", async () => {
          const typeMap = {
            myUnionType: new GraphQLUnionType({
              name: "myUnionType",
              types: [
                new GraphQLObjectType({
                  name: "Type1",
                  fields: { field1: { type: new GraphQLNonNull(GraphQLString) } },
                }),
              ],
              resolveType() {
                return "Type1";
              },
            }),
          };
      
          const [fieldTypes, enumTypes, unionTypes, interfaceTypes] =
            await giveTypeMaps(typeMap);
      
          expect(unionTypes.has("myUnionType")).toEqual(true);
        });
      
        it("should correctly map interface types", async () => {
          const typeMap = {
            myInterfaceType: new GraphQLInterfaceType({
              name: "myInterfaceType",
              fields: { field1: { type: new GraphQLNonNull(GraphQLString) } },
              resolveType() {
                return "Type1";
              },
            }),
          };
      
          const [fieldTypes, enumTypes, unionTypes, interfaceTypes] =
            await giveTypeMaps(typeMap);
      
          expect(interfaceTypes.has("myInterfaceType")).toEqual(true);
          expect(fieldTypes.get("field1")).toEqual("String");
        });
      });
      