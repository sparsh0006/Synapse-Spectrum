// src/components/ui/Sidebar.tsx
import React from 'react';
import NeonButton from './NeonButton';

interface SidebarProps {
  onAddRootNode: () => void;
  onExportImage: () => void;
  onResetLayout: () => void;
  hasRootNode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  onAddRootNode,
  onExportImage,
  onResetLayout,
  hasRootNode,
}) => {
  return (
    <div className="absolute top-4 left-4 z-10 p-4 bg-neon-purple-indigo bg-opacity-50 backdrop-blur-md rounded-lg shadow-xl">
      <div className="flex flex-col space-y-3">
        <NeonButton
          onClick={onAddRootNode}
          disabled={hasRootNode}
          glowColorClass="shadow-neon-pink"
          className="bg-gradient-to-r from-neon-pink to-purple-600 text-white disabled:from-gray-600 disabled:to-gray-700"
        >
          Add Root Node
        </NeonButton>
        <NeonButton
          onClick={onExportImage}
          disabled={!hasRootNode}
          glowColorClass="shadow-neon-blue"
          className="bg-gradient-to-r from-neon-electric-blue to-blue-600 text-neon-purple-indigo disabled:from-gray-600 disabled:to-gray-700"
        >
          Export as Image
        </NeonButton>
        <NeonButton
          onClick={onResetLayout}
          glowColorClass="shadow-neon-light-yellow"
          className="bg-gradient-to-r from-red-500 to-red-700 text-white"
        >
          Reset Layout
        </NeonButton>
      </div>
    </div>
  );
};

export default Sidebar;