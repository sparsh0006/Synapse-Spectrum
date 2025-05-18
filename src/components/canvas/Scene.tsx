// src/components/canvas/Scene.tsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei'; // Re-enabled OrbitControls
import MindMapNode from './MindMapNode';
import NodeConnection from './NodeConnection';
import Effects from './Effects';
import { NodeData, EdgeData, MindMapData } from '../../types/mindmap';

interface SceneProps {
  data: MindMapData;
  onNodeClick: (nodeId: string) => void;
  onNodeDoubleClick: (nodeId: string, currentLabel: string) => void;
  onNodeDrag: (nodeId: string, position: { x: number; y: number; z: number }) => void;
  onDragEnd: (nodeId: string) => void;
  selectedNodeId: string | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const Scene: React.FC<SceneProps> = ({
  data,
  onNodeClick,
  onNodeDoubleClick,
  onNodeDrag,
  onDragEnd,
  selectedNodeId,
  canvasRef
}) => {
  const { nodes, edges } = data;

  return (
    <Canvas
      ref={canvasRef}
      camera={{ position: [0, 0, 150], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[100, 100, 100]} intensity={1} color="#7df9ff" />
      <pointLight position={[-100, -100, -100]} intensity={0.5} color="#ff5ecb" />
      <directionalLight position={[0, 50, 50]} intensity={0.8} />
      <Suspense fallback={null}>
        {nodes.map(node => (
          <MindMapNode
            key={node.id}
            nodeData={node}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeDrag={onNodeDrag}
            onDragEnd={onDragEnd}
            isSelected={node.id === selectedNodeId}
          />
        ))}
        {edges.map(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) {
            return null;
          }
          return (
            <NodeConnection
              key={edge.id}
              sourceNode={sourceNode}
              targetNode={targetNode}
            />
          );
        })}
        <Effects />
      </Suspense>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={20}
        maxDistance={1000}
      />
      {/* If you have <Stats />, ensure no text around it either */}
    </Canvas>
  );
};

export default Scene;