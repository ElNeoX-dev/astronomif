import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, useGLTF, OrbitControls } from "@react-three/drei";
import CanvasLoader from "./Loader";
import * as THREE from "three";

const Galaxy = () => {
  const galaxy = useGLTF("/models/Galaxy/scene.gltf");
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
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

const GalaxyCanvas: React.FC = () => {
  return (
    <Canvas
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
        <Galaxy />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default GalaxyCanvas;
