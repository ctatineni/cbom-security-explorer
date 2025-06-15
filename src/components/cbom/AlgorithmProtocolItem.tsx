
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';

interface AlgorithmProtocolItemProps {
  item: {
    name: string;
    type: string;
    status: string;
    security: string;
    description: string;
  };
}

export const AlgorithmProtocolItem: React.FC<AlgorithmProtocolItemProps> = ({ item }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enabled':
        return <Badge className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="h-3 w-3 mr-1" />Enabled</Badge>;
      case 'supported':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300"><Shield className="h-3 w-3 mr-1" />Supported</Badge>;
      case 'deprecated':
        return <Badge className="bg-red-100 text-red-800 border-red-300"><XCircle className="h-3 w-3 mr-1" />Deprecated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSecurityBadge = (security: string) => {
    switch (security) {
      case 'secure':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Secure</Badge>;
      case 'weak':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300"><AlertTriangle className="h-3 w-3 mr-1" />Weak</Badge>;
      case 'vulnerable':
        return <Badge className="bg-red-100 text-red-800 border-red-300"><AlertTriangle className="h-3 w-3 mr-1" />Vulnerable</Badge>;
      default:
        return <Badge variant="outline">{security}</Badge>;
    }
  };

  return (
    <div className="border rounded-lg p-3 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-sm">{item.name}</div>
        <div className="flex items-center gap-2">
          {getStatusBadge(item.status)}
          {getSecurityBadge(item.security)}
        </div>
      </div>
      <div className="text-xs text-gray-600 mb-1">
        <Badge variant="outline" className="text-xs">{item.type}</Badge>
      </div>
      <div className="text-xs text-gray-500">{item.description}</div>
    </div>
  );
};
