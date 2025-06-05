
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap } from 'lucide-react';

export const ApplicationNode = memo(({ data }) => {
  return (
    <div className="px-6 py-4 shadow-lg rounded-lg border-2 border-blue-500 bg-blue-50 min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <div className="font-bold text-lg">{data.label}</div>
        </div>
        
        <div className="text-sm text-gray-600">
          <div>Version: {data.version}</div>
          <div className="font-medium text-blue-600">Risk: {data.risk}</div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});
