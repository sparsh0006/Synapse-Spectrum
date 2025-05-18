// src/components/canvas/Scene.tsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
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
      // Adjusted camera for better depth viewing
      camera={{ position: [0, 75, 300], fov: 55 }} // Further back, slightly higher, wider FOV
      style={{ background: 'transparent' }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <ambientLight intensity={0.6} /> {/* Slightly brighter ambient light */}
      <pointLight position={[150, 150, 200]} intensity={1.2} color="#7df9ff" />
      <pointLight position={[-150, -150, 100]} intensity={0.7} color="#ff5ecb" />
      <directionalLight position={[0, 100, 150]} intensity={1} /> {/* Stronger directional light */}

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
        minDistance={20}       // Can zoom in reasonably close
        maxDistance={2000}     // Allow zooming out much further to see the depth
      />
    </Canvas>
  );
};

export default Scene;