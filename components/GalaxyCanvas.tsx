import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, useGLTF, OrbitControls } from "@react-three/drei";
import CanvasLoader from "./Loader";
import * as THREE from "three";

interface GalaxyProps {
  hoverState: Boolean;
  activeState: Boolean;
}

const Galaxy: React.FC<GalaxyProps> = ({ hoverState, activeState }) => {
  const galaxy = useGLTF("/models/Milky_Way/scene.gltf");
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      if (hoverState) {
        ref.current.rotation.y -= 0.02;
      } else if (activeState) {
        ref.current.rotation.y -= 0.01;
      } else {
        ref.current.rotation.y -= 0.005;
      }
    }
  });

  return (
    <primitive
      ref={ref}
      object={galaxy.scene}
      scale={2.0}
      position-y={0}
      rotation-x={Math.PI / 6}
    />
  );
};

interface GalaxyCanvasProps extends GalaxyProps {
  setHoverState: React.Dispatch<React.SetStateAction<Boolean>>;
  setActiveState: React.Dispatch<React.SetStateAction<Boolean>>;
}

const GalaxyCanvas: React.FC<GalaxyCanvasProps> = ({
  hoverState,
  setHoverState,
  activeState,
  setActiveState,
}) => {
  const handleMouseEnter = () => {
    setHoverState(true);
  };
  const handleMouseLeave = () => {
    setHoverState(false);
  };
  return (
    <Canvas
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      shadows
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} enablePan={false} />
        <Galaxy hoverState={hoverState} activeState={activeState} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default GalaxyCanvas;
