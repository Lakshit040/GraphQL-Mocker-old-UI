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
    <div className="flex flex-col">
      <div className="flex">
        <label>Operation Type</label>
        <select
          value={op === GraphQLOperationType.Query ? "query" : "mutation"}
          onChange={handleOptionChange}
        >
          <option value="query">Query</option>
          <option value="mutation">Mutation</option>
        </select>

        <label>Operation Name</label>
        <input type="text" value={name} onChange={handleNameChange} />

        <button onClick={() => setMockResponse(op, name, res, delay)}>
          Generate Mock Response
        </button>
      </div>

      <div className="flex">
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
      </div>

      <div className="flex">
        <label>Mock Response</label>
        <textarea
          rows={4}
          value={res}
          onChange={handleResponseChange}
        ></textarea>
      </div>
    </div>
  );
}

export default InputComponent;
