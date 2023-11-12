interface CustomButtonProps {
  image: string;
  onClick: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ image, onClick }) => {
  return (
    <button className="btn" onClick={onClick}>
      <img src={image} alt="button gif" />
    </button>
  );
};

export default CustomButton;
