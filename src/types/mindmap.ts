// src/types/mindmap.ts
export interface NodeData {
  id: string;
  label: string;
  x?: number;
  y?: number;
  z?: number; // For 3D positioning
  fx?: number | null; // Fixed x position for D3
  fy?: number | null; // Fixed y position for D3
  fz?: number | null; // Fixed z position for D3 (if using 3D force)
  isRoot?: boolean;
  color?: string; // Optional: if nodes have specific colors
}

export interface EdgeData {
  id: string;
  source: string; // ID of the source node
  target: string; // ID of the target node
}

export interface MindMapData {
  nodes: NodeData[];
  edges: EdgeData[];
}