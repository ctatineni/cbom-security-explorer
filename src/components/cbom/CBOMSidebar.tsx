
import React from 'react';
import { Button } from '@/components/ui/button';
import { CBOMOverview } from './CBOMOverview';
import { CBOMNodeDetails } from './CBOMNodeDetails';

interface CBOMSidebarProps {
  selectedNode: any;
  cbomData: any;
  onNodeSelect: (nodeData: any) => void;
}

export const CBOMSidebar: React.FC<CBOMSidebarProps> = ({ 
  selectedNode, 
  cbomData, 
  onNodeSelect 
}) => {
  if (!selectedNode) {
    return (
      <CBOMOverview 
        cbomData={cbomData} 
        onNodeSelect={onNodeSelect} 
      />
    );
  }

  if (selectedNode.type === 'crypto' || selectedNode.name) {
    return (
      <div className="space-y-4">
        <CBOMNodeDetails 
          selectedNode={selectedNode} 
          cbomData={cbomData} 
        />
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onNodeSelect(null)}
        >
          Back to Overview
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => onNodeSelect(null)}
      >
        Back to Overview
      </Button>
    </div>
  );
};
