
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, Shield, AlertTriangle } from 'lucide-react';
import { generateMockAlgorithmsProtocols } from '@/utils/algorithmsMockData';

interface CBOMAlgorithmsProtocolsExpandedProps {
  selectedNode: any;
}

export const CBOMAlgorithmsProtocolsExpanded: React.FC<CBOMAlgorithmsProtocolsExpandedProps> = ({ 
  selectedNode 
}) => {
  const { algorithms, protocols } = generateMockAlgorithmsProtocols(
    selectedNode.name, 
    selectedNode.type === 'language'
  );
  
  const enabledSupportedAlgorithms = algorithms.filter(
    algo => algo.status === 'enabled' || algo.status === 'supported'
  );
  
  const enabledSupportedProtocols = protocols.filter(
    protocol => protocol.status === 'enabled' || protocol.status === 'supported'
  );

  const getSecurityIcon = (security: string) => {
    switch (security) {
      case 'secure': return <Shield className="h-4 w-4 text-green-600" />;
      case 'weak': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'vulnerable': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Key className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Enabled & Supported Algorithms & Protocols</h3>
      </div>

      {enabledSupportedAlgorithms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Algorithms ({enabledSupportedAlgorithms.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {enabledSupportedAlgorithms.map((algo, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getSecurityIcon(algo.security)}
                      <span className="font-medium">{algo.name}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{algo.type}</div>
                    {algo.description && (
                      <div className="text-xs text-gray-500">{algo.description}</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 ml-4">
                    <Badge 
                      variant={algo.status === 'enabled' ? 'default' : 'secondary'} 
                      className="text-xs justify-center"
                    >
                      {algo.status}
                    </Badge>
                    <Badge 
                      variant={
                        algo.security === 'secure' ? 'outline' :
                        algo.security === 'weak' ? 'secondary' : 'destructive'
                      }
                      className="text-xs justify-center"
                    >
                      {algo.security}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {enabledSupportedProtocols.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Protocols ({enabledSupportedProtocols.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {enabledSupportedProtocols.map((protocol, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getSecurityIcon(protocol.security)}
                      <span className="font-medium">{protocol.name}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{protocol.type}</div>
                    {protocol.description && (
                      <div className="text-xs text-gray-500">{protocol.description}</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 ml-4">
                    <Badge 
                      variant={protocol.status === 'enabled' ? 'default' : 'secondary'} 
                      className="text-xs justify-center"
                    >
                      {protocol.status}
                    </Badge>
                    <Badge 
                      variant={
                        protocol.security === 'secure' ? 'outline' :
                        protocol.security === 'weak' ? 'secondary' : 'destructive'
                      }
                      className="text-xs justify-center"
                    >
                      {protocol.security}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
