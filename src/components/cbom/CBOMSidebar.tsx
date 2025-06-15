
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  Key,
  Clock,
  Zap,
  FileCode,
  Code
} from 'lucide-react';
import { generateMockAlgorithmsProtocols } from '@/utils/algorithmsMockData';

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
    // Calculate metrics from the service data
    const totalCryptoAlgorithms = cbomData?.cryptoAlgorithms?.length || 0;
    const totalLibraries = cbomData?.libraries?.length || 0;
    
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totalCryptoAlgorithms}
                </div>
                <div className="text-sm text-gray-500">Algorithms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {totalLibraries}
                </div>
                <div className="text-sm text-gray-500">Libraries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Critical
              </span>
              <Badge variant="destructive">{cbomData?.metrics?.critical || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                Warnings
              </span>
              <Badge variant="secondary">{cbomData?.metrics?.warnings || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Secure
              </span>
              <Badge variant="outline">{cbomData?.metrics?.secure || 0}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              size="sm"
              onClick={() => onNodeSelect(cbomData?.application)}
            >
              <Zap className="h-4 w-4 mr-2" />
              Service Details
            </Button>
            {cbomData?.cryptoAlgorithms?.slice(0, 3).map((algo) => (
              <Button 
                key={algo.id}
                variant="ghost" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => onNodeSelect(algo)}
              >
                <Shield className="h-4 w-4 mr-2" />
                {algo.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderNodeDetails = () => {
    // Check if this is a library or programming language node
    const isLibraryOrLanguage = selectedNode.type === 'library' || 
                               (selectedNode.type === 'language') ||
                               (selectedNode.name && cbomData?.libraries?.some(lib => lib.name === selectedNode.name));

    if (selectedNode.type === 'crypto' || selectedNode.name) {
      return (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {selectedNode.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Type</div>
                  <div className="font-medium">{selectedNode.type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Key Size</div>
                  <div className="font-medium">{selectedNode.keySize}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-2">Risk Level</div>
                <Badge 
                  variant={
                    selectedNode.riskLevel === 'high' ? 'destructive' :
                    selectedNode.riskLevel === 'medium' ? 'secondary' : 'outline'
                  }
                >
                  {selectedNode.riskLevel}
                </Badge>
              </div>

              {selectedNode.deprecated && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Deprecated Algorithm</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    This algorithm is deprecated and should be replaced with a modern alternative.
                  </p>
                </div>
              )}

              <div>
                <div className="text-sm text-gray-500 mb-2">Purpose</div>
                <p className="text-sm">{selectedNode.purpose}</p>
              </div>
            </CardContent>
          </Card>

          {/* Show Algorithms & Protocols for Libraries/Languages */}
          {isLibraryOrLanguage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Enabled & Supported Algorithms & Protocols
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
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

                  return (
                    <>
                      {enabledSupportedAlgorithms.length > 0 && (
                        <div>
                          <div className="text-sm font-medium mb-2">
                            Algorithms ({enabledSupportedAlgorithms.length})
                          </div>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {enabledSupportedAlgorithms.map((algo, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div>
                                  <div className="text-sm font-medium">{algo.name}</div>
                                  <div className="text-xs text-gray-500">{algo.type}</div>
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
                          </div>
                        </div>
                      )}

                      {enabledSupportedProtocols.length > 0 && (
                        <div>
                          <div className="text-sm font-medium mb-2">
                            Protocols ({enabledSupportedProtocols.length})
                          </div>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {enabledSupportedProtocols.map((protocol, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div>
                                  <div className="text-sm font-medium">{protocol.name}</div>
                                  <div className="text-xs text-gray-500">{protocol.type}</div>
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
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Code Usage Locations */}
          {selectedNode.usageLocations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  Code Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedNode.usageLocations.map((location, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">{location.file}</span>
                      <span className="text-xs text-gray-500">Line {location.line}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      Function: <span className="font-mono bg-gray-100 px-1 rounded">{location.function}</span>
                    </div>
                    <div className="bg-gray-900 text-green-400 p-3 rounded-md text-xs font-mono overflow-x-auto">
                      <pre className="whitespace-pre-wrap break-all">{location.usage}</pre>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Library Functions */}
          {selectedNode.functions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Library Functions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedNode.functions.map((func, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-3">
                    <div className="font-medium text-sm">{func.name}</div>
                    <div className="text-xs text-gray-600 mb-1">{func.purpose}</div>
                    <div className="text-xs text-gray-500">
                      Used in: {func.usedIn.join(', ')}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {selectedNode.recommendations && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  {selectedNode.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {renderNodeDetails()}
      
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
