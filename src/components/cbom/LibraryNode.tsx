
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Package, ExternalLink } from 'lucide-react';

interface LibraryNodeData {
  name: string;
  version: string;
  license: string;
  hasVulnerabilities?: boolean;
}

interface LibraryNodeProps {
  data: LibraryNodeData;
}

export const LibraryNode = memo(({ data }: LibraryNodeProps) => {
  return (
    <div className="px-4 py-3 shadow-md rounded-lg border-2 border-purple-500 bg-purple-50 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <div className="flex items-center gap-2 mb-2">
        <Package className="h-4 w-4 text-purple-600" />
        <div className="font-semibold text-sm">{data.name}</div>
      </div>
      
      <div className="text-xs text-gray-600">
        <div>Version: {data.version}</div>
        <div>License: {data.license}</div>
        {data.hasVulnerabilities && (
          <div className="text-red-600 font-medium flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            Vulnerabilities
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});
