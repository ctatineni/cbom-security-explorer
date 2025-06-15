
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key } from 'lucide-react';
import { CBOMExpandableModal } from './CBOMExpandableModal';
import { CBOMAlgorithmsProtocolsExpanded } from './CBOMAlgorithmsProtocolsExpanded';

interface CBOMAlgorithmsProtocolsProps {
  selectedNode: any;
  serviceName?: string;
  programmingLanguage?: string;
}

export const CBOMAlgorithmsProtocols: React.FC<CBOMAlgorithmsProtocolsProps> = ({ 
  selectedNode,
  serviceName,
  programmingLanguage
}) => {
  // This will be replaced with actual API call to fetch algorithms and protocols
  // based on the service's programming language and libraries
  const mockAlgorithms = [
    {
      name: "AES-256-GCM",
      type: "Symmetric Encryption",
      status: "enabled",
      security: "secure",
      source: selectedNode.name || "System Library"
    },
    {
      name: "RSA-2048",
      type: "Asymmetric Encryption", 
      status: "supported",
      security: "secure",
      source: selectedNode.name || "System Library"
    }
  ];

  const mockProtocols = [
    {
      name: "TLS 1.3",
      type: "Transport Security",
      status: "enabled", 
      security: "secure",
      source: selectedNode.name || "System Library"
    }
  ];

  const enabledSupportedAlgorithms = mockAlgorithms;
  const enabledSupportedProtocols = mockProtocols;

  if (enabledSupportedAlgorithms.length === 0 && enabledSupportedProtocols.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Enabled & Supported Algorithms & Protocols
          </CardTitle>
          <CBOMExpandableModal 
            title="Enabled & Supported Algorithms & Protocols"
            triggerText="View All"
          >
            <CBOMAlgorithmsProtocolsExpanded 
              selectedNode={selectedNode}
              serviceName={serviceName}
              programmingLanguage={programmingLanguage}
            />
          </CBOMExpandableModal>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {enabledSupportedAlgorithms.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">
              Algorithms ({enabledSupportedAlgorithms.length})
            </div>
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {enabledSupportedAlgorithms.slice(0, 3).map((algo, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div className="text-sm font-medium">{algo.name}</div>
                    <div className="text-xs text-gray-500">{algo.type}</div>
                    <div className="text-xs text-blue-600">Source: {algo.source}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={algo.status === 'enabled' ? 'default' : 'secondary'} 
                      className="text-xs"
                    >
                      {algo.status}
                    </Badge>
                    <Badge 
                      variant={
                        algo.security === 'secure' ? 'outline' :
                        algo.security === 'weak' ? 'secondary' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {algo.security}
                    </Badge>
                  </div>
                </div>
              ))}
              {enabledSupportedAlgorithms.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{enabledSupportedAlgorithms.length - 3} more algorithms
                </div>
              )}
            </div>
          </div>
        )}

        {enabledSupportedProtocols.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">
              Protocols ({enabledSupportedProtocols.length})
            </div>
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {enabledSupportedProtocols.slice(0, 3).map((protocol, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div className="text-sm font-medium">{protocol.name}</div>
                    <div className="text-xs text-gray-500">{protocol.type}</div>
                    <div className="text-xs text-blue-600">Source: {protocol.source}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={protocol.status === 'enabled' ? 'default' : 'secondary'} 
                      className="text-xs"
                    >
                      {protocol.status}
                    </Badge>
                    <Badge 
                      variant={
                        protocol.security === 'secure' ? 'outline' :
                        protocol.security === 'weak' ? 'secondary' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {protocol.security}
                    </Badge>
                  </div>
                </div>
              ))}
              {enabledSupportedProtocols.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{enabledSupportedProtocols.length - 3} more protocols
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
