interface TopAlignedLabelAndInputProps {
  type: string;
  htmlInputId: string;
  value?: string | number | readonly string[];
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  classOverride?: string;
  children: React.ReactNode;
}

const TopAlignedLabelAndInput = ({
  type,
  value,
  placeholder,
  onChange,
  htmlInputId,
  children,
  classOverride,
}: TopAlignedLabelAndInputProps) => {
  return (
    <div
      className={`flex flex-col-reverse ${classOverride ? classOverride : ""}`}
    >
      <input
        type={type}
        id={htmlInputId}
        value={value}
        className="py-0 px-0 my-1 h-8 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        onChange={onChange}
      />
      <label
        htmlFor={htmlInputId}
        className="text-xs text-gray-500 peer-focus:text-blue-600"
      >
        {children}
      </label>
    </div>
  );
};

export default TopAlignedLabelAndInput;
