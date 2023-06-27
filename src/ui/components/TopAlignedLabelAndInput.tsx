interface TopAlignedLabelAndInputProps {
  htmlInputId: string;
  label: string;
  type?: string;
  value?: string | number | readonly string[];
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  divClassAppend?: string;
  divClassOverride?: string;
  isImportant?: boolean
  children?: React.ReactNode;
}

const TopAlignedLabelAndInput = ({
  htmlInputId,
  label,
  type,
  value,
  placeholder,
  onChange,
  divClassAppend,
  divClassOverride,
  isImportant,
  children,
}: TopAlignedLabelAndInputProps) => {
  /**
   * @remarks
   * A custom input component can be passed via the `children` prop.
   * The custom input component must have the tailwind class `peer`
   * assigned to it for the label to behave correctly when input is
   * focused.
   */
  if (children === undefined) {
    return (
      <div
        className={
          divClassOverride
            ? divClassOverride
            : `flex flex-col-reverse ${divClassAppend ? divClassAppend : ""}`
        }
      >
        <input
          type={type}
          id={htmlInputId}
          value={value}
          className="p-2.5 my-1 h-8 flex-grow w-96 text-sm text-gray-900 bg-gray-100 bg-transparent border rounded-xl border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder={placeholder} 
          onChange={onChange}
          required={isImportant}
        />
        <label
          htmlFor={htmlInputId}
          className="text-xs text-gray-500 peer-focus:text-blue-600"
        >
          {label}
        </label>
      </div>
    );
  } else {
    return (
      <div
        className={
          divClassOverride
            ? divClassOverride
            : `flex flex-col-reverse ${divClassAppend ? divClassAppend : ""}`
        }
      >
        {children}
        <label
          htmlFor={htmlInputId}
          className="text-xs text-gray-500 peer-focus:text-blue-600"
        >
          {label}
        </label>
      </div>
    );
  }
};

export default TopAlignedLabelAndInput;
