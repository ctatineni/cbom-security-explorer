
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface CryptoNodeData {
  name: string;
  type: string;
  keySize: string;
  riskLevel: 'high' | 'medium' | 'low';
  deprecated?: boolean;
}

interface CryptoNodeProps {
  data: CryptoNodeData;
}

export const CryptoNode = memo(({ data }: CryptoNodeProps) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={`px-4 py-3 shadow-md rounded-lg border-2 bg-white min-w-[150px] ${getRiskColor(data.riskLevel)}`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <div className="flex items-center gap-2 mb-2">
        {getRiskIcon(data.riskLevel)}
        <div className="font-semibold text-sm">{data.name}</div>
      </div>
      
      <div className="text-xs text-gray-600">
        <div>Type: {data.type}</div>
        <div>Key Size: {data.keySize}</div>
        {data.deprecated && (
          <div className="text-red-600 font-medium">Deprecated</div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});
