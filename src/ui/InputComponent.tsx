import "./InputComponent.css";

export default function InputComponent() {
  return (
    <>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label className="label" htmlFor="dropdown">Operation</label>
            <select className="input-field" id="dropdown">
              <option>Query</option>
              <option>Mutation</option>
            </select>
            <label className="label nameLabel" htmlFor="textInput">Operation Name</label>
            <input type="text" className="input-field" id="textInput" />
            <label className="label nameLabel" htmlFor="textarea">Sample Response</label>
            <textarea className="input-field" id="textarea" rows={Number("4")}></textarea>
            <button className="button">Generate Mock Response</button>
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

