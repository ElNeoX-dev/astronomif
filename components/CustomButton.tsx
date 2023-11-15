interface CustomButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  state: Boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  children,
  state,
}) => {
  return (
    <button className="btn" onClick={onClick}>
      {children}
    </button>
  );
};

export default CustomButton;
