interface SvgButtonComponentProps {
  className?: string;
  viewBox?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const SvgButtonComponent = ({
  className,
  viewBox,
  onClick,
  children,
}: SvgButtonComponentProps) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      {children}
    </svg>
  );
};

export default SvgButtonComponent;
