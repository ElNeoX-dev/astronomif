"use client";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, useGLTF, OrbitControls } from "@react-three/drei";
import CanvasLoader from "./Loader";
import * as THREE from "three";

interface EarthProps {
  hoverState: Boolean;
  activeState: Boolean;
}

const Earth: React.FC<EarthProps> = ({ hoverState, activeState }) => {
  const earth = useGLTF("/models/Earth/scene.gltf");
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      if (hoverState) {
        ref.current.rotation.y += 0.02;
      } else if (activeState) {
        ref.current.rotation.y += 0.01;
      } else {
        ref.current.rotation.y += 0.005;
      }
    }
  });

  return (
    <primitive ref={ref} object={earth.scene} scale={1.0} position-y={0} />
  );
};

const Background: React.FC<EarthProps> = ({ hoverState, activeState }) => {
  const stars = useGLTF("/models/Background_1/scene.gltf");
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      if (activeState) {
        ref.current.rotation.y += 0.01;
      } else {
        ref.current.rotation.y += 0.005;
      }
    }
  });

  return (
    <primitive ref={ref} object={stars.scene} scale={8.0} position-y={0} />
  );
};

interface EarthCanvasProps extends EarthProps {
  setHoverState: React.Dispatch<React.SetStateAction<Boolean>>;
  setActiveState: React.Dispatch<React.SetStateAction<Boolean>>;
}

const EarthCanvas: React.FC<EarthCanvasProps> = ({
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
        position: [-80, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} enablePan={false} />
        <Earth hoverState={hoverState} activeState={activeState} />
        <Background hoverState={hoverState} activeState={activeState} />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
