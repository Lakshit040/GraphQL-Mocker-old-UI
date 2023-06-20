interface TopAlignedLabelAndInputProps {
  htmlInputId: string;
  label: string;
  type?: string;
  value?: string | number | readonly string[];
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  divClassAppend?: string;
  divClassOverride?: string;
  labelClassOverride?: string;
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
  labelClassOverride,
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
          className="py-0 px-0 my-1 h-8 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder={placeholder}
          onChange={onChange}
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
