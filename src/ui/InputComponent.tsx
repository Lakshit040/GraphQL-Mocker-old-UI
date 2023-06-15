import { useState } from "react";
import "./InputComponent.css";

import { MessageType, GraphQLOperationType } from "../common/types";

function setMockResponse(
  operationType: GraphQLOperationType,
  operationName: string,
  mockResponse: string
) {
  chrome.runtime.sendMessage({
    type: MessageType.SetMockResponse,
    data: {
      operationType,
      operationName,
      mockResponse,
    },
  });
}

function InputComponent() {
  const [op, setOp] = useState(GraphQLOperationType.Query);
  const [name, setName] = useState("");
  const [res, setRes] = useState("");

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "query") {
      setOp(GraphQLOperationType.Query);
    } else {
      setOp(GraphQLOperationType.Mutation);
    }
  };

  const handleResponseChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setRes(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value.trim());
  };

  return (
    <>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label className="label" htmlFor="dropdown">
              Operation
            </label>

            <select
              value={op === GraphQLOperationType.Query ? "query" : "mutation"}
              className="input-field"
              id="dropdown"
              onChange={handleOptionChange}
            >
              <option value="query">Query</option>
              <option value="mutation">Mutation</option>
            </select>

            <label className="label nameLabel" htmlFor="textInput">
              Operation Name
            </label>
            <input
              type="text"
              className="input-field"
              id="textInput"
              value={name}
              onChange={handleNameChange}
            />

            <label className="label nameLabel" htmlFor="textarea">
              Sample Response
            </label>

            <textarea
              className="input-field"
              id="textarea"
              rows={4}
              value={res}
              onChange={handleResponseChange}
            ></textarea>
            <button
              className="button"
              onClick={() => setMockResponse(op, name, res)}
            >
              Generate Mock Response
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col text-center">
          <h2>Generated Mock Response</h2>
        </div>
      </div>
    </>
  );
}

export default InputComponent;
