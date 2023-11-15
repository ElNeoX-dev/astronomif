import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, useGLTF, OrbitControls } from "@react-three/drei";
import CanvasLoader from "./Loader";
import * as THREE from "three";

type CustomModelProps = {
  modelPath: string;
  type?: string; // Optional type prop
};

const CustomModel: React.FC<CustomModelProps> = ({ modelPath, type }) => {
  const model = useGLTF(modelPath);
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
    }
  });

  // Adjust scale and position based on type
  const scale = type === "galaxy" ? 2.0 : 1.0;
  const rotation = type === "galaxy" ? Math.PI / 6 : 0;

  return (
    <primitive
      ref={ref}
      object={model.scene}
      scale={scale}
      rotation-x={rotation}
    />
  );
};

const CustomCanvas: React.FC<CustomModelProps> = ({ modelPath, type }) => {
  // Adjust camera position based on type
  const cameraPosition = type === "galaxy" ? [-4, 3, 6] : [-80, 3, 6];

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: cameraPosition,
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} />
        <CustomModel modelPath={modelPath} type={type} />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default CustomCanvas;
