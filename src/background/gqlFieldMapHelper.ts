import {
  GraphQLObjectType,
  GraphQLFieldMap,
  GraphQLSchema,
  buildSchema,
  FieldNode,
  GraphQLNonNull,
  GraphQLList,
  DocumentNode,
  parse,
  visit,
  GraphQLInputObjectType,
  isEnumType,
  isUnionType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
} from "graphql";

export const getObjectFieldMap = (
  objectType: GraphQLObjectType
): Map<string, string> => {
  const fieldMap: Map<string, string> = new Map();
  const fields: GraphQLFieldMap<any, any> = objectType.getFields();
  Object.values(fields).forEach((field) => {
    fieldMap.set(field.name, String(field.type));
  });
  return fieldMap;
};

const getFieldTypes = (
  parentType: GraphQLObjectType,
  node: FieldNode
): Record<string, any> => {
  let typeMap: Record<string, any> = {};

  node.selectionSet?.selections.forEach((field) => {
    const fieldName = (field as FieldNode).name.value;
    let fieldType = parentType.getFields()[fieldName]?.type;

    if (!fieldType) {
      return;
    }

    typeMap[fieldName] = fieldType.toString();

    while (
      fieldType instanceof GraphQLNonNull ||
      fieldType instanceof GraphQLList
    ) {
      fieldType = fieldType.ofType;
    }

    if (
      fieldType instanceof GraphQLObjectType &&
      (field as FieldNode).selectionSet
    ) {
      typeMap[fieldName] = {
        type: dataTypeFormatter(typeMap[fieldName]),
        fields: getFieldTypes(fieldType, field as FieldNode),
      };
    } else {
      typeMap[fieldName] = {
        type: dataTypeFormatter(typeMap[fieldName]),
      };
    }
  });
  return typeMap;
};

export const generateTypeMapForResponse = (obj: any): Record<string, any> => {
  const type = typeof obj;

  if (obj === null) {
    return { type: "null" };
  } else if (Array.isArray(obj)) {
    const first = obj[0];
    let fields = first ? generateTypeMapForResponse(first) : { type: "array" };

    return { type: "array", fields: fields.fields };
  } else if (type === "object") {
    const fields: Record<string, any> = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fields[key] = generateTypeMapForResponse(obj[key]);
      }
    }
    return { type, fields };
  } else {
    return { type };
  }
};

export const dataTypeFormatter = (str: string): string => {
  str = str.toLowerCase().replace(/!/g, "");
  if (str.startsWith("[")) {
    return "array";
  } else if (str === "id" || str === "date") {
    return "string";
  } else if (str === "int" || str === "float") {
    return "number";
  } else {
    if (str !== "string") return "object";
    else return "string";
  }
};

export const generateTypeMapForQuery = (
  schemaStr: string,
  queryStr: string
): Record<string, any> => {
  const schema: GraphQLSchema = buildSchema(schemaStr);
  const query: DocumentNode = parse(queryStr);
  const typeMap: Record<string, any> = {};

  visit(query, {
    OperationDefinition(node) {
      const rootTypeName = "Query";
      const rootType = schema.getType(rootTypeName) as GraphQLObjectType;

      node.selectionSet?.selections.forEach((selection) => {
        const fieldName = (selection as FieldNode).name.value;
        let fieldType = rootType.getFields()[fieldName]?.type;

        if (!fieldType) {
          return;
        }

        while (
          fieldType instanceof GraphQLNonNull ||
          fieldType instanceof GraphQLList
        ) {
          fieldType = fieldType.ofType;
        }

        if (!(fieldType instanceof GraphQLObjectType)) {
          return;
        }

        typeMap[fieldName] = {
          type: dataTypeFormatter(
            rootType.getFields()[fieldName].type.toString()
          ),
          fields: getFieldTypes(fieldType, selection as FieldNode),
        };
      });
    },
  });
  return typeMap;
};

export const giveTypeMaps = (typeMap: any) => {

  const interfaceTypes: Map<string, any> = new Map();
  const fieldTypes: Map<string, any> = new Map();
  const enumTypes: Map<string, string[]> = new Map();
  const unionTypes: Map<string, any> = new Map();

  const addInputFields = (inputType: GraphQLInputObjectType): void => {
    const fields = inputType.getFields();
    Object.values(fields).forEach((field) => {
      if (!inputType.name.startsWith("__")) {
        fieldTypes.set(field.name, String(field.type).replace(/!/g, ""));
      }
      if (field.type instanceof GraphQLInputObjectType) {
        addInputFields(field.type);
      }
    });
  };

  Object.values(typeMap).forEach((graphQLType: any) => {
    if (isEnumType(graphQLType) && !graphQLType.name.startsWith("__")) {
      enumTypes.set(
        String(graphQLType),
        graphQLType.getValues().map((value) => value.value)
      );
    }
    if (isObjectType(graphQLType)) {
      const fields = graphQLType.getFields();
      Object.values(fields).forEach((field) => {
        if (!graphQLType.name.startsWith("__")) {
          fieldTypes.set(field.name, String(field.type).replace(/!/g, ""));
        }
      });
    }
    if (isInputObjectType(graphQLType)) {
      addInputFields(graphQLType);
    }
    if (isUnionType(graphQLType) && !graphQLType.name.startsWith("__")) {
      unionTypes.set(graphQLType.name, graphQLType);
    }
    if (isInterfaceType(graphQLType) && !graphQLType.name.startsWith("__")) {
      interfaceTypes.set(graphQLType.name, graphQLType);
    }
  });
  return [fieldTypes, enumTypes, unionTypes, interfaceTypes]
};
