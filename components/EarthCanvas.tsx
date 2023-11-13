import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, useGLTF, OrbitControls } from "@react-three/drei";
import CanvasLoader from "./Loader";
import * as THREE from "three";

const Earth = () => {
  const earth = useGLTF("/models/Earth/scene.gltf");
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive ref={ref} object={earth.scene} scale={1.0} position-y={0} />
  );
};

const Background = () => {
  const stars = useGLTF("/models/Background_1/scene.gltf");
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  return <primitive ref={ref} object={stars.scene} scale={8.0} position-y={0} />;
};

const EarthCanvas: React.FC = () => {
  return (
    <Canvas
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
        <OrbitControls enableZoom={false} />
        <Earth />
        <Background />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;
