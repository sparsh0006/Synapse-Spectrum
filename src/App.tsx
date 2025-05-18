// src/App.tsx
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Sidebar from './components/ui/Sidebar';
import { useMindMapData } from './hooks/useMindMapData';
// import { useForceLayout } from './hooks/useForceLayout'; // REMOVE THIS IMPORT
import { exportMindMapAsImage } from './lib/exportUtils';
import Loader from './components/ui/Loader';
import NeonButton from './components/ui/NeonButton';
import { NodeData, NodeStatus } from './types/mindmap';

const Scene = React.lazy(() => import('./components/canvas/Scene'));

function App() {
  const {
    data,
    // setData, // setData is now primarily used internally by useMindMapData for radial layout
    selectedNodeId,
    setSelectedNodeId,
    addRootNode,
    addChildNode,
    updateNodeText,
    updateNodeDetails,
    updateNodePosition,
    releaseNodeFix,
    deleteNode,
    resetLayout,
  } = useMindMapData();

  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appContainerRef = useRef<HTMLDivElement>(null);
  // const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight }); // Not needed for radial

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Removing canvasSize useEffect as D3 layout is gone
  // useEffect(() => {
  //   const handleResize = () => {
  //     setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
  //   };
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  // REMOVE useForceLayout hook and reheatSimulation
  // const { reheatSimulation } = useForceLayout({ data, setData, canvasSize });

  const handleAddRootNode = () => {
    addRootNode("My Mind Map");
    // No reheatSimulation needed
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(prevId => (prevId === nodeId ? null : nodeId));
  };

  const handleNodeDoubleClick = (nodeId: string, currentLabel: string) => {
    const newLabel = prompt("Edit Task Title:", currentLabel);
    if (newLabel !== null && newLabel.trim() !== "") {
      updateNodeText(nodeId, newLabel.trim());
    }
  };

  useEffect(() => {
    const handleDeselectClick = (event: MouseEvent) => {
      // @ts-ignore
      if (event.target === appContainerRef.current || event.target === canvasRef.current) {
        setSelectedNodeId(null);
      }
    };
    const currentAppContainer = appContainerRef.current;
    currentAppContainer?.addEventListener('click', handleDeselectClick);
    return () => {
      currentAppContainer?.removeEventListener('click', handleDeselectClick);
    };
  }, [setSelectedNodeId, canvasRef, appContainerRef]);

  const handleAddChildToSelected = () => {
    if (selectedNodeId) {
      addChildNode(selectedNodeId, "New Task");
      // No reheatSimulation needed
    } else {
      alert("Please select a parent node first.");
    }
  };

  const handleExportImage = () => {
    exportMindMapAsImage(document.documentElement);
  };

  const handleResetLayout = () => {
    if (window.confirm("Are you sure you want to reset the entire layout? All nodes will be removed.")) {
        resetLayout();
    }
  };

  const handleNodeDrag = (nodeId: string, position: { x: number; y: number; z: number }) => {
    updateNodePosition(nodeId, position);
  };

  const handleDragEnd = (nodeId: string) => {
    // releaseNodeFix is less critical now, but MindMapNode might still call it.
    // For a pure calculated layout, dragging simply sets the new x,y,z.
    releaseNodeFix(nodeId); // Can be kept or removed based on MindMapNode's final drag logic
  };

  const handleDeleteSelectedNode = () => {
    if (selectedNodeId) {
      const nodeToDelete = data.nodes.find(n => n.id === selectedNodeId);
      if (nodeToDelete && window.confirm(`Are you sure you want to delete "${nodeToDelete.label}" and its connections?`)) {
        deleteNode(selectedNodeId);
        // No reheatSimulation needed
      }
    } else {
      alert("Please select a node to delete.");
    }
  };

  const handleEditNodeDetails = () => {
    // ... (function remains the same as before) ...
    if (!selectedNodeId) {
      alert("Please select a node to edit its details.");
      return;
    }
    const nodeToEdit = data.nodes.find(n => n.id === selectedNodeId);
    if (!nodeToEdit) return;

    const newDescription = prompt("Enter task description:", nodeToEdit.description || "");
    const newStatusInput = prompt("Enter status (todo, inprogress, done):", nodeToEdit.status || "todo");
    const newDueDate = prompt("Enter due date (e.g., YYYY-MM-DD):", nodeToEdit.dueDate || "");
    const detailsToUpdate: Partial<Pick<NodeData, 'description' | 'status' | 'dueDate'>> = {};
    if (newDescription !== null) detailsToUpdate.description = newDescription;
    if (newStatusInput !== null) {
        const validStatuses: NodeStatus[] = ['todo', 'inprogress', 'done'];
        if (validStatuses.includes(newStatusInput.toLowerCase() as NodeStatus)) {
            detailsToUpdate.status = newStatusInput.toLowerCase() as NodeStatus;
        } else {
            alert(`Invalid status: "${newStatusInput}". Please use todo, inprogress, or done.`);
        }
    }
    if (newDueDate !== null) detailsToUpdate.dueDate = newDueDate;
    if (Object.keys(detailsToUpdate).length > 0) updateNodeDetails(selectedNodeId, detailsToUpdate);
  };


  if (isLoading) {
    return <Loader />;
  }

  const selectedNodeDetails = selectedNodeId ? data.nodes.find(n => n.id === selectedNodeId) : null;

  return (
    <div ref={appContainerRef} className="w-screen h-screen relative">
      <Sidebar
        onAddRootNode={handleAddRootNode}
        onExportImage={handleExportImage}
        onResetLayout={handleResetLayout}
        hasRootNode={data.nodes.some(n => n.isRoot)}
      />
      {selectedNodeId && (
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 p-3 bg-neon-purple-indigo/70 backdrop-blur-md rounded-lg shadow-xl w-64 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h3 className="text-neon-pink text-sm font-semibold mb-1 sticky top-0 bg-neon-purple-indigo/90 py-1 px-2 -mx-3 -mt-3 rounded-t-lg z-10">
                Selected: {selectedNodeDetails?.label || 'Node'}
            </h3>
            <NeonButton onClick={handleAddChildToSelected} glowColorClass="shadow-neon-electric-blue" className="w-full text-xs py-1.5">
                Add Child Task
            </NeonButton>
            <NeonButton onClick={handleEditNodeDetails} glowColorClass="shadow-neon-light-yellow" className="w-full text-xs py-1.5">
                Edit Task Details
            </NeonButton>
            <NeonButton onClick={handleDeleteSelectedNode} glowColorClass="shadow-neon-pink" className="w-full text-xs py-1.5 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
                Delete Selected
            </NeonButton>
            {selectedNodeDetails && (
                <div className="mt-2 text-xs text-neon-light-yellow space-y-1 p-2 border border-neon-electric-blue/50 rounded">
                    <p><strong>Title:</strong> {selectedNodeDetails.label}</p>
                    <p><strong>Desc:</strong> {selectedNodeDetails.description || <span className="italic text-gray-400">N/A</span>}</p>
                    <p><strong>Status:</strong> {selectedNodeDetails.status || <span className="italic text-gray-400">N/A</span>}</p>
                    <p><strong>Due:</strong> {selectedNodeDetails.dueDate || <span className="italic text-gray-400">N/A</span>}</p>
                </div>
            )}
        </div>
      )}
      <Suspense fallback={<Loader />}>
        <Scene
          canvasRef={canvasRef}
          data={data} // Pass the data which now has calculated positions
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