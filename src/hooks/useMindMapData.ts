// src/hooks/useMindMapData.ts
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NodeData, EdgeData, MindMapData, NodeStatus } from '../types/mindmap';

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
        alert("A root node already exists. Please reset or modify it.");
        return prevData;
      }
      const newNode: NodeData = {
        id: uuidv4(),
        label,
        x: 0, y: 0, z: 0,
        fx: 0, fy: 0, fz: 0,
        isRoot: true,
        color: getNextColor(),
        description: "", // Initialize new fields
        status: 'todo',
        dueDate: ""
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
      const updatedParentNodes = prevData.nodes.map(n =>
        n.id === parentId ? { ...n, fx: null, fy: null, fz: null } : n
      );
      const newNode: NodeData = {
        id: uuidv4(),
        label,
        x: parentNode.x || 0 + (Math.random() - 0.5) * 50,
        y: parentNode.y || 0 + (Math.random() - 0.5) * 50,
        z: parentNode.z || 0,
        color: getNextColor(),
        description: "", // Initialize new fields
        status: 'todo',
        dueDate: ""
      };
      const newEdge: EdgeData = { id: uuidv4(), source: parentId, target: newNode.id };
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

  // Function to update detailed task information
  const updateNodeDetails = useCallback((nodeId: string, details: Partial<Pick<NodeData, 'description' | 'status' | 'dueDate'>>) => {
    setData(prevData => ({
      ...prevData,
      nodes: prevData.nodes.map(node =>
        node.id === nodeId ? { ...node, ...details } : node
      ),
    }));
  }, []);


  const updateNodePosition = useCallback((nodeId: string, position: { x: number; y: number; z: number }) => {
    setData(prevData => ({
      ...prevData,
      nodes: prevData.nodes.map(node =>
        node.id === nodeId ? { ...node, ...position, fx: position.x, fy: position.y, fz: position.z } : node
      ),
    }));
  }, []);

  const releaseNodeFix = useCallback((nodeId: string) => {
    setData(prevData => ({
      ...prevData,
      nodes: prevData.nodes.map(node =>
        node.id === nodeId ? { ...node, fx: null, fy: null, fz: null } : node
      ),
    }));
  }, []);

  const deleteNode = useCallback((nodeIdToDelete: string) => {
    setData(prevData => {
      const nodeExists = prevData.nodes.find(n => n.id === nodeIdToDelete);
      if (!nodeExists) return prevData; // Node already deleted or never existed

      // Prevent deleting the root node if it's the only node
      // if (nodeExists.isRoot && prevData.nodes.length === 1) {
      //   alert("Cannot delete the only root node. Reset layout to start over.");
      //   return prevData;
      // }
      // More robust deletion logic might be needed for complex scenarios (e.g., re-parenting children)
      // For now, simple removal of node and its connected edges.

      const newNodes = prevData.nodes.filter(node => node.id !== nodeIdToDelete);
      const newEdges = prevData.edges.filter(edge => edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete);

      return { nodes: newNodes, edges: newEdges };
    });
    // Deselect the node if it was the one deleted
    setSelectedNodeId(currentSelectedId => (currentSelectedId === nodeIdToDelete ? null : currentSelectedId));
  }, []);

  const resetLayout = useCallback(() => {
    colorIndex = 0;
    setData({ nodes: [], edges: [] });
    setSelectedNodeId(null);
  }, []);

  return {
    data,
    setData,
    selectedNodeId,
    setSelectedNodeId,
    addRootNode,
    addChildNode,
    updateNodeText,
    updateNodeDetails, // <-- Export new function
    updateNodePosition,
    releaseNodeFix,
    deleteNode,         // <-- Export new function
    resetLayout,
  };
};