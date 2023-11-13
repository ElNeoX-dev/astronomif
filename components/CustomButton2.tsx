import React, { useState } from "react";

interface CustomButton2Props {
  image: string;
  onClick: () => void;
  onMouseOver: () => void;
  onMouseOut: () => void;
}

const CustomButton2: React.FC<CustomButton2Props> = ({
  image,
  onClick,
  onMouseOver,
  onMouseOut,
}) => {
  return (
    <button
      className="btn"
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <img src={image} alt="button gif" />
    </button>
  );
};

export default CustomButton2;
