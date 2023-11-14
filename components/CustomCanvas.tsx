import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, useGLTF, OrbitControls } from "@react-three/drei";
import CanvasLoader from "./Loader";
import * as THREE from "three";

type CustomModelProps = {
  modelPath: string;
};

const CustomModel: React.FC<CustomModelProps> = ({ modelPath }) => {
  const model = useGLTF(modelPath);
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  return (
    <primitive ref={ref} object={model.scene} scale={1.0} position-y={0} />
  );
};

const CustomCanvas: React.FC<CustomModelProps> = ({ modelPath }) => {
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
        <CustomModel modelPath={modelPath} />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default CustomCanvas;
