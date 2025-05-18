// src/hooks/useMindMapData.ts
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NodeData, EdgeData, MindMapData } from '../types/mindmap';

const initialColors = [
  '#7df9ff', // Electric Blue
  '#ff5ecb', // Neon Pink
  '#fcf6bd', // Light Yellow
  '#ffbd44', // Soft Orange
];

let colorIndex = 0;

const getNextColor = () => {
  const color = initialColors[colorIndex % initialColors.length];
  colorIndex++;
  return color;
};

export const useMindMapData = () => {
  const [data, setData] = useState<MindMapData>({ nodes: [], edges: [] });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const addRootNode = useCallback((label: string = "Root Node") => {
    setData(prevData => {
      if (prevData.nodes.some(node => node.isRoot)) {
        // Prevent adding multiple root nodes or handle as desired (e.g., replace)
        alert("A root node already exists. Please reset or modify the existing root.");
        return prevData;
      }
      const newNode: NodeData = {
        id: uuidv4(),
        label,
        x: 0,
        y: 0,
        z: 0,
        fx: 0, // Fix root at center initially
        fy: 0,
        fz: 0,
        isRoot: true,
        color: getNextColor(),
      };
      return { ...prevData, nodes: [newNode] };
    });
  }, []);

  const addChildNode = useCallback((parentId: string, label: string = "New Idea") => {
    setData(prevData => {
      const parentNode = prevData.nodes.find(n => n.id === parentId);
      if (!parentNode) {
        console.error("Parent node not found for ID:", parentId);
        return prevData;
      }

      // Unfix parent node if it was fixed (like root initially, or dragged nodes)
      // This allows D3 to position it relative to its new child
      const updatedParentNodes = prevData.nodes.map(n =>
        n.id === parentId ? { ...n, fx: null, fy: null, fz: null } : n
      );

      const newNode: NodeData = {
        id: uuidv4(),
        label,
        // Attempt to position new node somewhat near parent for better initial visual
        x: parentNode.x || 0 + (Math.random() - 0.5) * 50,
        y: parentNode.y || 0 + (Math.random() - 0.5) * 50,
        z: parentNode.z || 0, // Keep z the same as parent for now
        color: getNextColor(),
      };
      const newEdge: EdgeData = {
        id: uuidv4(),
        source: parentId,
        target: newNode.id,
      };
      return { nodes: [...updatedParentNodes, newNode], edges: [...prevData.edges, newEdge] };
    });
  }, []);

  const updateNodeText = useCallback((nodeId: string, newLabel: string) => {
    setData(prevData => ({
      ...prevData,
      nodes: prevData.nodes.map(node =>
        node.id === nodeId ? { ...node, label: newLabel } : node
      ),
    }));
  }, []);

  const updateNodePosition = useCallback((nodeId: string, position: { x: number; y: number; z: number }) => {
    // This function is typically called during a drag operation.
    // It sets fx, fy, fz to fix the node's position, overriding D3 simulation for that node.
    setData(prevData => ({
      ...prevData,
      nodes: prevData.nodes.map(node =>
        node.id === nodeId ? { ...node, ...position, fx: position.x, fy: position.y, fz: position.z } : node
      ),
    }));
  }, []);

  const releaseNodeFix = useCallback((nodeId: string) => {
    // Called after a drag ends to allow D3 simulation to influence the node again.
    setData(prevData => ({
      ...prevData,
      nodes: prevData.nodes.map(node =>
        node.id === nodeId ? { ...node, fx: null, fy: null, fz: null } : node
      ),
    }));
  }, []);


  const resetLayout = useCallback(() => {
    colorIndex = 0; // Reset color index for new nodes
    setData({ nodes: [], edges: [] });
    setSelectedNodeId(null);
  }, []);

  return {
    data,
    setData, // Expose setData for direct manipulation (e.g., by force layout updates)
    selectedNodeId,
    setSelectedNodeId,
    addRootNode,
    addChildNode,
    updateNodeText,
    updateNodePosition,
    releaseNodeFix,
    resetLayout,
  };
};