interface LabelledInputComponentProps {
  htmlInputId: string;
  type: string;
  placeholder: string;
  value: string;
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const LabelledInputComponent = ({
  htmlInputId,
  type,
  placeholder,
  value,
  label,
  onChange,
}: LabelledInputComponentProps) => {
  return (
    <>
      <div className="sm:col-span-3">
        <label
          htmlFor={htmlInputId}
          className="inline-block text-sm  mt-2.5 text-gray-200"
        >
          {label}
        </label>
      </div>
      <div className="sm:col-span-9">
        <input
          id={htmlInputId}
          type={type}
          className="py-2 px-3 pr-11 block w-full border  shadow-sm text-sm rounded-lg outline-none bg-slate-900 border-gray-700 text-gray-400"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default LabelledInputComponent;
