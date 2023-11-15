interface CustomInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setIsFocused: React.Dispatch<React.SetStateAction<Boolean>>;
}

const CustomInput: React.FC<CustomInputProps> = ({
  onChange,
  setIsFocused,
}) => {
  return (
    <input
      type="text"
      className="input self-center sliding-cursor-input"
      placeholder="Astronomic search 🪐"
      onChange={onChange}
      onFocus={() => setTimeout(() => setIsFocused(true), 500)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

export default CustomInput;
