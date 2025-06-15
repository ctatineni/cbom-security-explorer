
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, Shield, AlertTriangle, Info } from 'lucide-react';

interface CBOMAlgorithmsProtocolsExpandedProps {
  selectedNode: any;
  serviceName?: string;
  programmingLanguage?: string;
}

export const CBOMAlgorithmsProtocolsExpanded: React.FC<CBOMAlgorithmsProtocolsExpandedProps> = ({ 
  selectedNode,
  serviceName,
  programmingLanguage
}) => {
  // This will be replaced with actual API call to fetch algorithms and protocols
  // based on the service's programming language and libraries
  const serviceData = {
    serviceName: serviceName || selectedNode.name,
    serviceType: selectedNode.type || 'Service',
    programmingLanguage: programmingLanguage || 'Unknown',
    framework: undefined
  };

  const mockAlgorithms = [
    {
      name: "AES-256-GCM",
      type: "Symmetric Encryption",
      status: "enabled",
      security: "secure",
      description: "Advanced Encryption Standard with Galois/Counter Mode for authenticated encryption",
      source: selectedNode.name || "System Library",
      usageContext: "Data encryption and authentication",
      version: "256-bit"
    },
    {
      name: "RSA-2048",
      type: "Asymmetric Encryption", 
      status: "supported",
      security: "secure",
      description: "RSA public-key cryptosystem with 2048-bit key size",
      source: selectedNode.name || "System Library",
      usageContext: "Key exchange and digital signatures",
      version: "2048-bit"
    }
  ];

  const mockProtocols = [
    {
      name: "TLS 1.3",
      type: "Transport Security",
      status: "enabled", 
      security: "secure",
      description: "Transport Layer Security protocol version 1.3 for secure communication",
      source: selectedNode.name || "System Library",
      usageContext: "Secure network communication",
      version: "1.3",
      port: 443
    }
  ];

  const enabledSupportedAlgorithms = mockAlgorithms;
  const enabledSupportedProtocols = mockProtocols;

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
        <h3 className="text-lg font-semibold">
          Algorithms & Protocols for {serviceData.serviceName}
        </h3>
      </div>

      {/* Service Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium text-blue-900">Service</div>
              <div className="text-blue-700">{serviceData.serviceName}</div>
            </div>
            <div>
              <div className="font-medium text-blue-900">Type</div>
              <div className="text-blue-700">{serviceData.serviceType}</div>
            </div>
            <div>
              <div className="font-medium text-blue-900">Language</div>
              <div className="text-blue-700">{serviceData.programmingLanguage}</div>
            </div>
            {serviceData.framework && (
              <div>
                <div className="font-medium text-blue-900">Framework</div>
                <div className="text-blue-700">{serviceData.framework}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {enabledSupportedAlgorithms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Algorithms ({enabledSupportedAlgorithms.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {enabledSupportedAlgorithms.map((algo, index) => (
                <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSecurityIcon(algo.security)}
                      <span className="font-medium text-lg">{algo.name}</span>
                      {algo.version && (
                        <Badge variant="outline" className="text-xs">
                          {algo.version}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{algo.type}</div>
                    <div className="text-sm text-gray-700 mb-3">{algo.description}</div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Info className="h-3 w-3 text-blue-500" />
                        <span className="font-medium">Source:</span>
                        <span className="text-blue-600">{algo.source}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Info className="h-3 w-3 text-purple-500" />
                        <span className="font-medium">Usage:</span>
                        <span className="text-purple-600">{algo.usageContext}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
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
            <div className="grid gap-4">
              {enabledSupportedProtocols.map((protocol, index) => (
                <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSecurityIcon(protocol.security)}
                      <span className="font-medium text-lg">{protocol.name}</span>
                      {protocol.version && (
                        <Badge variant="outline" className="text-xs">
                          v{protocol.version}
                        </Badge>
                      )}
                      {protocol.port && (
                        <Badge variant="outline" className="text-xs">
                          Port {protocol.port}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{protocol.type}</div>
                    <div className="text-sm text-gray-700 mb-3">{protocol.description}</div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Info className="h-3 w-3 text-blue-500" />
                        <span className="font-medium">Source:</span>
                        <span className="text-blue-600">{protocol.source}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Info className="h-3 w-3 text-purple-500" />
                        <span className="font-medium">Usage:</span>
                        <span className="text-purple-600">{protocol.usageContext}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
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
