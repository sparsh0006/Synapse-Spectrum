// src/App.tsx
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Sidebar from './components/ui/Sidebar';
import { useMindMapData } from './hooks/useMindMapData';
import { useForceLayout } from './hooks/useForceLayout';
import { exportMindMapAsImage } from './lib/exportUtils';
import Loader from './components/ui/Loader';
import NeonButton from './components/ui/NeonButton'; // Ensure NeonButton is imported

const Scene = React.lazy(() => import('./components/canvas/Scene'));

function App() {
  const {
    data,
    setData,
    selectedNodeId, // We'll log this
    setSelectedNodeId,
    addRootNode,
    addChildNode, // We'll log around this
    updateNodeText,
    updateNodePosition,
    releaseNodeFix,
    resetLayout,
  } = useMindMapData();

  // --- START DEBUG LOG ---
  console.log("App.tsx - Current selectedNodeId:", selectedNodeId);
  console.log("App.tsx - Current nodes:", data.nodes);
  // --- END DEBUG LOG ---

  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { reheatSimulation } = useForceLayout({ data, setData, canvasSize });

  const handleAddRootNode = () => {
    addRootNode("My Mind Map");
    reheatSimulation();
  };

  const handleNodeClick = (nodeId: string) => {
    // --- START DEBUG LOG ---
    console.log("App.tsx - handleNodeClick - Node ID clicked:", nodeId);
    // --- END DEBUG LOG ---
    setSelectedNodeId(prevId => {
      const newId = prevId === nodeId ? null : nodeId;
      // --- START DEBUG LOG ---
      console.log("App.tsx - handleNodeClick - New selectedNodeId will be:", newId);
      // --- END DEBUG LOG ---
      return newId;
    });
  };

  const handleNodeDoubleClick = (nodeId: string, currentLabel: string) => {
    const newLabel = prompt("Enter new node label:", currentLabel);
    if (newLabel !== null && newLabel.trim() !== "") {
      updateNodeText(nodeId, newLabel.trim());
    }
  };

  useEffect(() => {
    const handleCanvasClick = (event: MouseEvent) => {
      // @ts-ignore
      if (event.target === canvasRef.current) {
        // --- START DEBUG LOG ---
        console.log("App.tsx - Canvas clicked, deselecting node.");
        // --- END DEBUG LOG ---
        setSelectedNodeId(null);
      }
    };
    const currentCanvas = canvasRef.current;
    currentCanvas?.addEventListener('click', handleCanvasClick);
    return () => {
      currentCanvas?.removeEventListener('click', handleCanvasClick);
    };
  }, [selectedNodeId, setSelectedNodeId, canvasRef]);

  const handleAddChildToSelected = () => {
    // --- START DEBUG LOG ---
    console.log("App.tsx - handleAddChildToSelected - Button clicked. Selected ID:", selectedNodeId);
    // --- END DEBUG LOG ---
    if (selectedNodeId) {
      addChildNode(selectedNodeId, "New Child"); // This calls the function from the hook
      reheatSimulation();
    } else {
      alert("Please select a parent node first. (From handleAddChildToSelected)");
      console.warn("App.tsx - handleAddChildToSelected - No node selected to add child to."); // DEBUG
    }
  };

  const handleExportImage = () => {
    exportMindMapAsImage(canvasRef.current);
  };

  const handleResetLayout = () => {
    resetLayout();
  };

  const handleNodeDrag = (nodeId: string, position: { x: number; y: number; z: number }) => {
    updateNodePosition(nodeId, position);
  };

  const handleDragEnd = (nodeId: string) => {
    releaseNodeFix(nodeId);
    reheatSimulation();
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-screen h-screen relative bg-neon-purple-indigo" style={{
        backgroundImage: `
            linear-gradient(rgba(43, 1, 76, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(43, 1, 76, 0.5) 1px, transparent 1px)
        `,
        backgroundSize: '25px 25px',
    }}>
      <Sidebar
        onAddRootNode={handleAddRootNode}
        onExportImage={handleExportImage}
        onResetLayout={handleResetLayout}
        hasRootNode={data.nodes.some(n => n.isRoot)}
      />

      {selectedNodeId && (
        <div className="absolute top-4 right-4 z-10 p-2 bg-neon-purple-indigo bg-opacity-50 backdrop-blur-md rounded-lg shadow-xl">
            <NeonButton onClick={handleAddChildToSelected} glowColorClass="shadow-neon-electric-blue" className="text-sm">
                Add Child to Selected
            </NeonButton>
        </div>
      )}

      <Suspense fallback={<Loader />}>
        <Scene
          canvasRef={canvasRef}
          data={data}
          onNodeClick={handleNodeClick}
          onNodeDoubleClick={handleNodeDoubleClick}
          onNodeDrag={handleNodeDrag}
          onDragEnd={handleDragEnd}
          selectedNodeId={selectedNodeId}
        />
      </Suspense>
    </div>
  );
}

export default App;