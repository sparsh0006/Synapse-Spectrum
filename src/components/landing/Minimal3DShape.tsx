// src/components/landing/Minimal3DShape.tsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei'; // OrbitControls removed for simplicity unless needed
import * as THREE from 'three';

function RotatingCube({ color = '#ff5ecb' }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.05; // Slower rotation
      meshRef.current.rotation.y += delta * 0.07;
    }
  });
  return (
    <Box ref={meshRef} args={[1, 1, 1]} scale={1.5}> {/* Slightly larger */}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2} // Adjusted intensity
        toneMapped={false}
        roughness={0.4}
        metalness={0.1}
      />
    </Box>
  );
}
export default function Minimal3DShape({ className = "", shapeColor = "#7df9ff" }) {
  return (
    <div className={`w-full h-full ${className} pointer-events-none`}> {/* Added pointer-events-none */}
      <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}> {/* Adjusted camera */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <RotatingCube color={shapeColor} />
      </Canvas>
    </div>
  );
}