// src/components/canvas/NodeConnection.tsx
import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { NodeData } from '../../types/mindmap';

interface NodeConnectionProps {
  sourceNode: NodeData | undefined;
  targetNode: NodeData | undefined;
}

const NodeConnection: React.FC<NodeConnectionProps> = ({ sourceNode, targetNode }) => {
  const points = useMemo(() => {
    if (!sourceNode || !targetNode) {
        return [new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)]; // Default for safety
    }
    return [
      new THREE.Vector3(sourceNode.x || 0, sourceNode.y || 0, sourceNode.z || 0),
      new THREE.Vector3(targetNode.x || 0, targetNode.y || 0, targetNode.z || 0),
    ];
  }, [sourceNode, targetNode]);

  if (!sourceNode || !targetNode) {
    return null; // Render nothing if nodes are missing
  }

  return (
    <Line
      points={points}
      color="#ff5ecb"
      lineWidth={2}
      dashed={false}
    />
  );
};

export default React.memo(NodeConnection);