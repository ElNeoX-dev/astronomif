import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, useGLTF, OrbitControls } from "@react-three/drei";
import CanvasLoader from "./Loader";
import * as THREE from "three";

const Saturn = () => {
  const Saturn = useGLTF("/models/Saturn/scene.gltf");
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive ref={ref} object={Saturn.scene} scale={1.0} position-y={0} />
  );
};

const Ring = () => {
  const stars = useGLTF("/models/Ring/scene.gltf");
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive ref={ref} object={stars.scene} scale={20.0} position-y={0} />
  );
};

const SaturnCanvas: React.FC = () => {
  return (
    <Canvas
      className="mb-2 rounded-xl"
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
        <Saturn />
        <Ring />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default SaturnCanvas;
