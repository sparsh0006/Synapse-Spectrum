// src/types/mindmap.ts
export type NodeStatus = 'todo' | 'inprogress' | 'done';

export interface NodeData {
  id: string;
  label: string; // This will be the "Task Title"
  x?: number;
  y?: number;
  z?: number;
  fx?: number | null;
  fy?: number | null;
  fz?: number | null;
  isRoot?: boolean;
  color?: string;

  // New fields for task details
  description?: string;
  status?: NodeStatus;
  dueDate?: string; // Store as string for simplicity with prompt, can be ISO date string
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