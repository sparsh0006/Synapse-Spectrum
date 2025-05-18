// src/hooks/useMindMapData.ts
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NodeData, EdgeData, MindMapData, NodeStatus } from '../types/mindmap';

const initialColors = [
  '#7df9ff', '#ff5ecb', '#fcf6bd', '#ffbd44', '#00ff9f', '#ff8c00',
  '#da70d6', '#87cefa', '#c71585', '#20b2aa', '#ffa07a', '#b0c4de',
  '#32cd32', '#ff69b4', '#ffd700', '#00ced1', '#ff4500', '#4682b4' // More
];
let colorIndex = 0;
const getNextColor = () => {
  const color = initialColors[colorIndex % initialColors.length];
  colorIndex++;
  return color;
};

// --- Layout Constants ---
// For children of the ROOT node
const X_SPREAD_ROOT_CHILDREN = 100; // How much horizontal space each root child gets
const Y_OFFSET_ROOT_CHILDREN = -90; // How far down root's children are

// For children of SUB-NODES (non-root nodes)
const RADIAL_DISTANCE_SUB_CHILDREN_BASE = 45;    // Base radial distance for sub-node children
const RADIAL_MIN_SPACE_SUB_CHILDREN = 20;      // Min circumferential space for sub-node children
const Y_OFFSET_SUB_CHILDREN_CLUSTER = -45;   // How far down the center of the radial cluster is from its sub-node parent

const Z_OFFSET_PER_LEVEL = 90;          // Depth separation per level (consistent)
const ANGLE_OFFSET_RADIAL = -Math.PI / 2; // Start radial layouts at the top

const calculateHybridLayoutPositions = (
  currentNodes: NodeData[],
  currentEdges: EdgeData[]
): NodeData[] => {
  if (!currentNodes.length) return [];

  const nodesCopy = currentNodes.map(n => ({ ...n }));
  const positionedNodes = new Map<string, NodeData>();

  function layoutChildrenOf(parentId: string, parentX: number, parentY: number, parentZ: number, isParentTheRootNode: boolean) {
    const childrenEdges = currentEdges.filter(edge => edge.source === parentId);
    const childrenCount = childrenEdges.length;
    if (childrenCount === 0) return;

    // Sort children for stable layout
    const sortedChildren = childrenEdges
      .map(edge => nodesCopy.find(n => n.id === edge.target))
      .filter(n => n !== undefined)
      .sort((a, b) => (a!.id || '').localeCompare(b!.id || '')) as NodeData[];

    if (isParentTheRootNode) {
      // --- Horizontal Layout for Children of ROOT ---
      const totalWidth = (childrenCount - 1) * X_SPREAD_ROOT_CHILDREN;
      let currentChildX = parentX - totalWidth / 2;
      const childY = parentY + Y_OFFSET_ROOT_CHILDREN;
      const childZ = parentZ + Z_OFFSET_PER_LEVEL;

      sortedChildren.forEach(childNode => {
        const finalChildX = childrenCount === 1 ? parentX : currentChildX;
        const positionedChild = { ...childNode, x: finalChildX, y: childY, z: childZ };
        positionedNodes.set(childNode.id, positionedChild);
        layoutChildrenOf(childNode.id, finalChildX, childY, childZ, false); // Next level's parent is not root
        currentChildX += X_SPREAD_ROOT_CHILDREN;
      });
    } else {
      // --- Compact Radial Layout for Children of SUB-NODES ---
      const circumferenceNeeded = childrenCount * RADIAL_MIN_SPACE_SUB_CHILDREN;
      const radiusFromCircumference = circumferenceNeeded / (2 * Math.PI);
      const radialDistance = Math.max(RADIAL_DISTANCE_SUB_CHILDREN_BASE, radiusFromCircumference);
      
      const clusterCenterY = parentY + Y_OFFSET_SUB_CHILDREN_CLUSTER;
      const childZ = parentZ + Z_OFFSET_PER_LEVEL;

      sortedChildren.forEach((childNode, index) => {
        const angle = ANGLE_OFFSET_RADIAL + (index / childrenCount) * (2 * Math.PI);
        const childX = parentX + radialDistance * Math.cos(angle);
        const childYPos = clusterCenterY + radialDistance * Math.sin(angle);
        
        const positionedChild = { ...childNode, x: childX, y: childYPos, z: childZ };
        positionedNodes.set(childNode.id, positionedChild);
        layoutChildrenOf(childNode.id, childX, childYPos, childZ, false); // Next level's parent is not root
      });
    }
  }

  // Start layout from root node(s)
  const roots = nodesCopy.filter(n => n.isRoot || !currentEdges.some(e => e.target === n.id));
  roots.forEach((root, index) => {
    const rootX = index * (X_SPREAD_ROOT_CHILDREN * (initialColors.length / 2)); // Stagger multiple roots if any
    const positionedRoot = { ...root, x: rootX, y: 0, z: 0 };
    positionedNodes.set(root.id, positionedRoot);
    layoutChildrenOf(root.id, rootX, 0, 0, true); // Pass true as this root is the parent
  });
  
  // Fallback for any unpositioned nodes (should ideally not happen with tree)
  nodesCopy.forEach(node => {
      if(!positionedNodes.has(node.id)){
          positionedNodes.set(node.id, {...node, x: Math.random()*100, y:Math.random()*100, z: Z_OFFSET_PER_LEVEL * 3});
      }
  });

  return currentNodes.map(originalNode => positionedNodes.get(originalNode.id) || originalNode);
};

export const useMindMapData = () => {
  const [data, setData] = useState<MindMapData>({ nodes: [], edges: [] });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const applyLayout = (currentNodes: NodeData[], currentEdges: EdgeData[]): NodeData[] => {
    return calculateHybridLayoutPositions(currentNodes, currentEdges);
  };

  const addRootNode = useCallback((label: string = "Root Node") => {
    setData(prevData => {
      if (prevData.nodes.some(node => node.isRoot)) {
        alert("A root node already exists."); return prevData;
      }
      const newNode: NodeData = {
        id: uuidv4(), label, isRoot: true,
        color: getNextColor(), description: "", status: 'todo', dueDate: ""
      };
      const newNodesWithRoot = [...prevData.nodes, newNode];
      const laidOutNodes = applyLayout(newNodesWithRoot, prevData.edges);
      return { nodes: laidOutNodes, edges: prevData.edges };
    });
  }, []);

  const addChildNode = useCallback((parentId: string, label: string = "New Task") => {
    setData(prevData => {
      const parentNode = prevData.nodes.find(n => n.id === parentId);
      if (!parentNode) return prevData;
      const newNodeId = uuidv4();
      const newNode: NodeData = {
        id: newNodeId, label,
        color: getNextColor(), description: "", status: 'todo', dueDate: ""
      };
      const newEdge: EdgeData = { id: uuidv4(), source: parentId, target: newNodeId };
      const newNodesWithChild = [...prevData.nodes, newNode];
      const newEdgesWithChild = [...prevData.edges, newEdge];
      const laidOutNodes = applyLayout(newNodesWithChild, newEdgesWithChild);
      return { nodes: laidOutNodes, edges: newEdgesWithChild };
    });
  }, []);

  const updateNodeText = useCallback((nodeId: string, newLabel: string) => { /* ... no change ... */
    setData(prevData => ({ ...prevData, nodes: prevData.nodes.map(node => node.id === nodeId ? { ...node, label: newLabel } : node) }));
  }, []);
  const updateNodeDetails = useCallback((nodeId: string, details: Partial<Pick<NodeData, 'description' | 'status' | 'dueDate'>>) => { /* ... no change ... */
    setData(prevData => ({ ...prevData, nodes: prevData.nodes.map(node => node.id === nodeId ? { ...node, ...details } : node) }));
  }, []);

  // Dragging updates the specific node, then its direct children get a local radial re-layout
  const updateNodePosition = useCallback((nodeId: string, position: { x: number; y: number; z: number }) => {
    setData(prevData => {
      let updatedNodes = prevData.nodes.map(node =>
        node.id === nodeId ? { ...node, ...position } : node
      );
      const draggedNode = updatedNodes.find(n => n.id === nodeId);
      if (draggedNode) {
          const childrenEdges = prevData.edges.filter(edge => edge.source === nodeId);
          const childrenCount = childrenEdges.length;
          if (childrenCount > 0) {
              const R_DIST_DRAG_CHILD = RADIAL_DISTANCE_SUB_CHILDREN_BASE * 0.9; // Slightly tighter for drag follow
              const Z_CHILD_DRAG_OFFSET = Z_OFFSET_PER_LEVEL;
              const Y_CLUSTER_DRAG_OFFSET = Y_OFFSET_SUB_CHILDREN_CLUSTER;

              const sortedChildrenEdges = [...childrenEdges].sort((a,b) => (a.target || '').localeCompare(b.target || ''));
              updatedNodes = updatedNodes.map(n => {
                  const edge = sortedChildrenEdges.find(e => e.target === n.id);
                  if (edge) {
                      const childIndex = sortedChildrenEdges.indexOf(edge);
                      const angle = ANGLE_OFFSET_RADIAL + (childIndex / childrenCount) * (2 * Math.PI);
                      return {
                          ...n,
                          x: (draggedNode.x || 0) + R_DIST_DRAG_CHILD * Math.cos(angle),
                          y: ((draggedNode.y || 0) + Y_CLUSTER_DRAG_OFFSET) + R_DIST_DRAG_CHILD * Math.sin(angle),
                          z: (draggedNode.z || 0) + Z_CHILD_DRAG_OFFSET,
                      };
                  }
                  return n;
              });
          }
      }
      return { ...prevData, nodes: updatedNodes };
    });
  }, []);

  const releaseNodeFix = useCallback((_nodeId: string) => { /* no-op */ }, []);

  const deleteNode = useCallback((nodeIdToDelete: string) => {
    setData(prevData => {
      const nodeExists = prevData.nodes.find(n => n.id === nodeIdToDelete);
      if (!nodeExists) return prevData;
      const remainingNodes = prevData.nodes.filter(node => node.id !== nodeIdToDelete);
      const remainingEdges = prevData.edges.filter(edge => edge.source !== nodeIdToDelete && edge.target !== nodeIdToDelete);
      const laidOutNodes = applyLayout(remainingNodes, remainingEdges);
      return { nodes: laidOutNodes, edges: remainingEdges };
    });
    setSelectedNodeId(currentSelectedId => (currentSelectedId === nodeIdToDelete ? null : currentSelectedId));
  }, []);

  const resetLayout = useCallback(() => {
    colorIndex = 0; setData({ nodes: [], edges: [] }); setSelectedNodeId(null);
  }, []);

  return {
    data, setData, selectedNodeId, setSelectedNodeId, addRootNode, addChildNode,
    updateNodeText, updateNodeDetails, updateNodePosition, releaseNodeFix, deleteNode, resetLayout,
  };
};