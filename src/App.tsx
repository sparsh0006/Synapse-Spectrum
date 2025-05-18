// src/App.tsx
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Sidebar from './components/ui/Sidebar';
import { useMindMapData } from './hooks/useMindMapData';
import { useForceLayout } from './hooks/useForceLayout';
import { exportMindMapAsImage } from './lib/exportUtils';
import Loader from './components/ui/Loader';
import NeonButton from './components/ui/NeonButton';

const Scene = React.lazy(() => import('./components/canvas/Scene'));

function App() {
  const {
    data,
    setData,
    selectedNodeId,
    setSelectedNodeId,
    addRootNode,
    addChildNode,
    updateNodeText,
    updateNodePosition,
    releaseNodeFix,
    resetLayout,
  } = useMindMapData();

  const [isLoading, setIsLoading] = useState(true);
  const [canvasSize, setCanvasSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    addRootNode('My Mind Map');
    reheatSimulation();
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId((prevId) => (prevId === nodeId ? null : nodeId));
  };

  const handleNodeDoubleClick = (nodeId: string, currentLabel: string) => {
    const newLabel = prompt('Enter new node label:', currentLabel);
    if (newLabel !== null && newLabel.trim() !== '') {
      updateNodeText(nodeId, newLabel.trim());
    }
  };

  useEffect(() => {
    const handleCanvasClick = (event: MouseEvent) => {
      // @ts-ignore
      if (event.target === canvasRef.current) {
        setSelectedNodeId(null);
      }
    };

    const currentCanvas = canvasRef.current;
    currentCanvas?.addEventListener('click', handleCanvasClick);
    return () => {
      currentCanvas?.removeEventListener('click', handleCanvasClick);
    };
  }, [selectedNodeId]);

  const handleAddChildToSelected = () => {
    if (selectedNodeId) {
      addChildNode(selectedNodeId, 'New Child');
      reheatSimulation();
    } else {
      alert('Please select a parent node first.');
    }
  };

  const handleExportImage = () => {
    exportMindMapAsImage(canvasRef.current);
  };

  const handleResetLayout = () => {
    resetLayout();
  };

  const handleNodeDrag = (
    nodeId: string,
    position: { x: number; y: number; z: number }
  ) => {
    updateNodePosition(nodeId, position);
  };

  const handleDragEnd = (nodeId: string) => {
    releaseNodeFix(nodeId);
    reheatSimulation();
  };

  // const handleDeleteSelectedNode = () => { /* Future feature */ };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-screen h-screen relative">
      <Sidebar
        onAddRootNode={handleAddRootNode}
        onExportImage={handleExportImage}
        onResetLayout={handleResetLayout}
        hasRootNode={data.nodes.some((n) => n.isRoot)}
      />

      {selectedNodeId && (
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 p-2 bg-neon-purple-indigo bg-opacity-50 backdrop-blur-md rounded-lg shadow-xl">
          <NeonButton
            onClick={handleAddChildToSelected}
            glowColorClass="shadow-neon-electric-blue"
            className="text-sm"
          >
            Add Child to Selected
          </NeonButton>
          {/* Add Delete button here if implemented */}
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
