"use client";
interface CustomButtonProps {
  children?: React.ReactNode;
  setState: React.Dispatch<React.SetStateAction<Boolean>>;
  state: Boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  setState,
  state,
}) => {
  return (
    <button
      className={`btn ${state ? "active" : ""}`}
      onClick={() => {
        setState(!state);
      }}
    >
      {children}
    </button>
  );
};

export default CustomButton;
