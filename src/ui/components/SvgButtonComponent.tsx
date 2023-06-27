interface SvgButtonComponentProps {
  title: string
  className?: string;
  viewBox?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const SvgButtonComponent = ({
  title,
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
      <title>{title}</title>
      {children}
    </svg>
  );
};

export default SvgButtonComponent;
