// src/components/canvas/MindMapNode.tsx
import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { NodeData } from '../../types/mindmap';

interface MindMapNodeProps {
  nodeData: NodeData;
  onNodeClick: (nodeId: string) => void;
  onNodeDoubleClick: (nodeId: string, currentLabel: string) => void;
  onNodeDrag: (nodeId: string, position: { x: number; y: number; z: number }) => void;
  onDragEnd: (nodeId: string) => void;
  isSelected: boolean;
}

const MindMapNode: React.FC<MindMapNodeProps> = ({
  nodeData,
  onNodeClick,
  onNodeDoubleClick,
  onNodeDrag,
  onDragEnd,
  isSelected,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const dragInfo = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    didMove: false,
  });

  const position = useMemo(() => new THREE.Vector3(nodeData.x || 0, nodeData.y || 0, nodeData.z || 0), [nodeData.x, nodeData.y, nodeData.z]);

  useFrame(() => {
    if (meshRef.current) {
        meshRef.current.position.lerp(position, 0.1);
        if (isHovered || isSelected) {
            meshRef.current.scale.set(1.2, 1.2, 1.2);
        } else {
            meshRef.current.scale.set(1, 1, 1);
        }
    }
  });

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    dragInfo.current = {
      isDragging: true,
      startX: event.clientX,
      startY: event.clientY,
      didMove: false,
    };
    // console.log(`MindMapNode (${nodeData.label}): POINTER DOWN`); // Keep for debugging if needed
  };

  const handlePointerMove = (event: any) => {
    event.stopPropagation();
    if (dragInfo.current.isDragging) {
      const deltaX = Math.abs(event.clientX - dragInfo.current.startX);
      const deltaY = Math.abs(event.clientY - dragInfo.current.startY);
      const moveThreshold = 3;

      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        dragInfo.current.didMove = true;
      }

      if (dragInfo.current.didMove) {
        // console.log(`MindMapNode (${nodeData.label}): POINTER MOVE - DRAGGING`); // Keep for debugging if needed
        const { movementX, movementY } = event;
        const factor = 0.1;
        const newPosition = {
          x: meshRef.current.position.x + movementX * factor,
          y: meshRef.current.position.y - movementY * factor,
          z: meshRef.current.position.z
        };
        meshRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);
        onNodeDrag(nodeData.id, newPosition);
      }
    }
  };

  const handlePointerUp = (event: any) => {
    event.stopPropagation();
    (event.target as HTMLElement).releasePointerCapture(event.pointerId);
    // console.log(`MindMapNode (${nodeData.label}): POINTER UP. Did move: ${dragInfo.current.didMove}`); // Keep for debugging

    if (dragInfo.current.isDragging && dragInfo.current.didMove) {
      onDragEnd(nodeData.id);
    }
    // Reset drag state *after* click/dblclick might have used it
    // The click/dblclick handlers will check dragInfo.current.didMove
    // For safety, we can reset isDragging here, but didMove is key for click handlers
    // dragInfo.current = { isDragging: false, startX: 0, startY: 0, didMove: false }; // We will reset fully after click
  };

  const nodeColor = nodeData.color || '#7df9ff';

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        console.log(`MindMapNode (${nodeData.label}): MESH CLICKED! dragInfo.didMove: ${dragInfo.current.didMove}`); // DEBUG
        if (!dragInfo.current.didMove) {
          console.log(`MindMapNode (${nodeData.label}): Calling onNodeClick prop with ID: ${nodeData.id}`); // DEBUG
          onNodeClick(nodeData.id);
        } else {
          console.log(`MindMapNode (${nodeData.label}): Click ignored because it was a drag.`); // DEBUG
        }
        // Reset drag info fully after a click sequence has completed
        dragInfo.current = { isDragging: false, startX: 0, startY: 0, didMove: false };
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        console.log(`MindMapNode (${nodeData.label}): MESH DOUBLE-CLICKED! dragInfo.didMove: ${dragInfo.current.didMove}`); // DEBUG
        if (!dragInfo.current.didMove) {
            console.log(`MindMapNode (${nodeData.label}): Calling onNodeDoubleClick prop with ID: ${nodeData.id}`); // DEBUG
            onNodeDoubleClick(nodeData.id, nodeData.label);
        } else {
            console.log(`MindMapNode (${nodeData.label}): Double-click ignored because it was a drag.`); // DEBUG
        }
        // Reset drag info fully after a double click sequence has completed
        dragInfo.current = { isDragging: false, startX: 0, startY: 0, didMove: false };
      }}
      onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setIsHovered(false); }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <boxGeometry args={[12, 12, 12]} />
      <meshStandardMaterial
        color={nodeColor}
        emissive={nodeColor}
        emissiveIntensity={isHovered || isSelected ? 2 : 1}
        roughness={0.4}
        metalness={0.1}
        toneMapped={false}
      />
      <Text
        position={[0, 12, 0]}
        fontSize={3}
        color={isSelected ? '#fcf6bd' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000000"
      >
        {nodeData.label}
      </Text>
    </mesh>
  );
};

export default React.memo(MindMapNode);