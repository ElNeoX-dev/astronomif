"use client";

import { useEffect } from "react";

interface MouseEffectProps {}

const MouseEffect: React.FC<MouseEffectProps> = ({}) => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const moveX = ((clientX - width / 2) / width) * 50;
      const moveY = ((clientY - height / 2) / height) * 50;

      document.getElementById(
        "background"
      )!.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return <></>;
};

export default MouseEffect;
