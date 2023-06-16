import { useState } from "react";

import { MessageType, GraphQLOperationType } from "../../common/types";

function setMockResponse(
  operationType: GraphQLOperationType,
  operationName: string,
  mockResponse: string,
  responseDelay: number
) {
  chrome.runtime.sendMessage({
    type: MessageType.SetMockResponse,
    data: {
      operationType,
      operationName,
      mockResponse,
      responseDelay,
    },
  });
}

function InputComponent() {
  const [op, setOp] = useState(GraphQLOperationType.Query);
  const [name, setName] = useState("");
  const [res, setRes] = useState("");
  const [delay, setDelay] = useState(0);

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

  const handleDelayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _delay = +event.target.value;
    setDelay(!isNaN(_delay) ? _delay : 0);
  };

  return (
    <div className="flex">
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

      <label className="label nameLabel" htmlFor="delayInput">
        Response Delay (ms)
      </label>
      <input
        type="number"
        className="input-field"
        id="delayInput"
        value={delay.toString()}
        onChange={handleDelayChange}
      />

      <button
        className="button"
        onClick={() => setMockResponse(op, name, res, delay)}
      >
        Generate Mock Response
      </button>
    </div>
  );
}

export default InputComponent;
