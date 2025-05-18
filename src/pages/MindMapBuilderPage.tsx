// src/pages/MindMapBuilderPage.tsx
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Sidebar from '../components/ui/Sidebar'; // Adjusted path
import { useMindMapData } from '../hooks/useMindMapData'; // Adjusted path
import { exportMindMapAsImage } from '../lib/exportUtils'; // Adjusted path
import Loader from '../components/ui/Loader'; // Adjusted path
import NeonButton from '../components/ui/NeonButton'; // Adjusted path
import { NodeData, NodeStatus } from '../types/mindmap'; // Adjusted path

const Scene = React.lazy(() => import('../components/canvas/Scene')); // Adjusted path

export default function MindMapBuilderPage() {
  const {
    data,
    // setData, // Not directly used if layout is fully in hook
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

  useEffect(() => {
    // This loader is for the Mind Map page itself if it's heavy
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Removed useForceLayout and reheatSimulation as we're using a calculated layout

  const handleAddRootNode = () => {
    addRootNode("My Mind Map");
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
    const currentAppContainer = appContainerRef.current; // Use appContainerRef for listening
    currentAppContainer?.addEventListener('click', handleDeselectClick);
    return () => {
      currentAppContainer?.removeEventListener('click', handleDeselectClick);
    };
  }, [setSelectedNodeId, canvasRef, appContainerRef]); // Dependencies are correct

  const handleAddChildToSelected = () => {
    if (selectedNodeId) {
      addChildNode(selectedNodeId, "New Task");
    } else {
      alert("Please select a parent node first.");
    }
  };

  const handleExportImage = () => {
    // Using document.documentElement to try and capture the full page including body background
    exportMindMapAsImage(document.documentElement);
    // If the above doesn't work well, you can revert to appContainerRef.current:
    // exportMindMapAsImage(appContainerRef.current);
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
    // releaseNodeFix is less critical for non-D3 layouts but kept if MindMapNode expects it
    releaseNodeFix(nodeId);
  };

  const handleDeleteSelectedNode = () => {
    if (selectedNodeId) {
      const nodeToDelete = data.nodes.find(n => n.id === selectedNodeId);
      if (nodeToDelete && window.confirm(`Are you sure you want to delete "${nodeToDelete.label}" and all its connections?`)) {
        deleteNode(selectedNodeId);
        // selectedNodeId will be cleared in the hook if it was the deleted node
      }
    } else {
      alert("Please select a node to delete.");
    }
  };

  const handleEditNodeDetails = () => {
    if (!selectedNodeId) {
      alert("Please select a node to edit its details.");
      return;
    }
    const nodeToEdit = data.nodes.find(n => n.id === selectedNodeId);
    if (!nodeToEdit) return;

    const desc = prompt("Description:", nodeToEdit.description || "");
    const statusIn = prompt("Status (todo, inprogress, done):", nodeToEdit.status || "todo");
    const due = prompt("Due Date (YYYY-MM-DD):", nodeToEdit.dueDate || "");

    const detailsToUpdate: Partial<Pick<NodeData, 'description' | 'status' | 'dueDate'>> = {};

    if (desc !== null) {
      detailsToUpdate.description = desc;
    }
    if (statusIn !== null) {
      const validStatuses: NodeStatus[] = ['todo', 'inprogress', 'done'];
      if (validStatuses.includes(statusIn.toLowerCase() as NodeStatus)) {
        detailsToUpdate.status = statusIn.toLowerCase() as NodeStatus;
      } else {
        alert(`Invalid status: "${statusIn}". Please use todo, inprogress, or done.`);
      }
    }
    if (due !== null) {
      // You might want to add date validation here if using a stricter format
      detailsToUpdate.dueDate = due;
    }

    if (Object.keys(detailsToUpdate).length > 0) {
        updateNodeDetails(selectedNodeId, detailsToUpdate);
    }
  };

  if (isLoading) {
    // Ensure Loader is visible against the correct background for this page
    return <div className="mindmap-app-bg w-screen h-screen flex justify-center items-center"><Loader /></div>;
  }

  const selectedNodeDetails = selectedNodeId ? data.nodes.find(n => n.id === selectedNodeId) : null;

  return (
    // This main div gets the specific background class for the mind map application
    <div ref={appContainerRef} className="w-screen h-screen relative mindmap-app-bg">
      <Sidebar
        onAddRootNode={handleAddRootNode}
        onExportImage={handleExportImage}
        onResetLayout={handleResetLayout}
        hasRootNode={data.nodes.some(n => n.isRoot)}
      />

      {/* UI for selected node actions and details */}
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

      <Suspense fallback={<div className="mindmap-app-bg w-screen h-screen flex justify-center items-center"><Loader /></div>}>
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