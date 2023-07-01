import { DynamicComponentData } from "../../common/types";

class operationExpressionObject {
  private static instance: operationExpressionObject;
  private data: { [key: string]: DynamicComponentData };

  private constructor() {
    this.data = {};
  }

  public static getInstance(): operationExpressionObject {
    if (!operationExpressionObject.instance) {
      operationExpressionObject.instance = new operationExpressionObject();
    }
    return operationExpressionObject.instance;
  }

  public setValue(key: string, value: DynamicComponentData): void {
    this.data[key] = value;
  }

  public getValue(key: string): DynamicComponentData | undefined {
    return this.data[key];
  }

  public deleteValue(key: string): void {
    delete this.data[key];
  }
}

export const sharedObject = operationExpressionObject.getInstance();
