// src/hooks/useForceLayout.ts
import { useEffect, useRef } from 'react';
import * as d3 from 'd3-force';
import { NodeData, EdgeData, MindMapData } from '../types/mindmap';

interface ForceLayoutProps {
  data: MindMapData;
  setData: React.Dispatch<React.SetStateAction<MindMapData>>;
  canvasSize: { width: number; height: number };
}

export const useForceLayout = ({ data, setData, canvasSize }: ForceLayoutProps) => {
  const simulationRef = useRef<d3.Simulation<NodeData, EdgeData>>();

  useEffect(() => {
    if (!data.nodes.length) return;

    // For simplicity, we'll use a 2D force layout (x, y) and map to 3D space later
    // D3's force layout typically operates in 2D.
    // You can extend this to 3D if you find a suitable D3 3D force plugin or implement it.
    // For now, z will remain largely static or manually set.
    const nodesCopy = data.nodes.map(n => ({ ...n }));
    const edgesCopy = data.edges.map(e => ({ ...e }));

    simulationRef.current = d3.forceSimulation<NodeData, EdgeData>(nodesCopy)
      .force("link", d3.forceLink<NodeData, EdgeData>(edgesCopy)
                      .id((d: any) => d.id)
                      .distance(100) // Increased distance
                      .strength(0.5)) // Strength of links
      .force("charge", d3.forceManyBody().strength(-600)) // Increased repulsion
      .force("center", d3.forceCenter(0, 0)) // Centered in 2D plane
      .force("collide", d3.forceCollide().radius(50).strength(0.7)) // Prevent overlap
      .on("tick", () => {
        setData(prev => ({
          // Important: Create new arrays for React to detect changes
          nodes: simulationRef.current!.nodes().map(n => ({...(n as NodeData)})),
          edges: prev.edges, // Edges don't change positionally from the tick
        }));
      });

      // Apply initial fixed positions
      nodesCopy.forEach(node => {
        if (node.fx != null) (node as any).fx = node.fx;
        if (node.fy != null) (node as any).fy = node.fy;
      });


    return () => {
      simulationRef.current?.stop();
    };
  }, [data.nodes.length, data.edges.length, setData, canvasSize]); // Re-run if node/edge count changes

  // Allow manual reheat of simulation
  const reheatSimulation = () => {
    simulationRef.current?.alpha(0.3).restart();
  };

  return { reheatSimulation };
};