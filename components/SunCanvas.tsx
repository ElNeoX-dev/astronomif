import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "./Loader";

const Sun = () => {
  const sun = useGLTF("/models/Sun/scene.gltf");

  return (
    <primitive object={sun.scene} scale={1} position-y={0} rotation-y={0} />
  );
};

const SunCanvas: React.FC = () => {
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
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Sun />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default SunCanvas;
