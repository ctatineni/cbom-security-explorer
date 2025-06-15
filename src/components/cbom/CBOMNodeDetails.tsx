
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle } from 'lucide-react';
import { CBOMAlgorithmsProtocols } from './CBOMAlgorithmsProtocols';
import { CBOMCodeUsage } from './CBOMCodeUsage';
import { CBOMLibraryFunctions } from './CBOMLibraryFunctions';
import { CBOMRecommendations } from './CBOMRecommendations';

interface CBOMNodeDetailsProps {
  selectedNode: any;
  cbomData: any;
}

export const CBOMNodeDetails: React.FC<CBOMNodeDetailsProps> = ({ 
  selectedNode, 
  cbomData 
}) => {
  const isLibraryOrLanguage = selectedNode.type === 'library' || 
                             (selectedNode.type === 'language') ||
                             (selectedNode.name && cbomData?.libraries?.some(lib => lib.name === selectedNode.name));

  // Extract service information from cbomData if available
  const getServiceContext = () => {
    // Try to find the current service context from cbomData
    if (cbomData?.service) {
      return {
        serviceName: cbomData.service.name,
        programmingLanguage: cbomData.service.programmingLanguage
      };
    }
    
    // Fallback to selectedNode information
    return {
      serviceName: selectedNode.serviceName || selectedNode.name,
      programmingLanguage: selectedNode.programmingLanguage || selectedNode.language
    };
  };

  const serviceContext = getServiceContext();

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
        <CBOMAlgorithmsProtocols 
          selectedNode={selectedNode}
          serviceName={serviceContext.serviceName}
          programmingLanguage={serviceContext.programmingLanguage}
        />
      )}

      {/* Code Usage Locations */}
      {selectedNode.usageLocations && (
        <CBOMCodeUsage usageLocations={selectedNode.usageLocations} />
      )}

      {/* Library Functions */}
      {selectedNode.functions && (
        <CBOMLibraryFunctions functions={selectedNode.functions} />
      )}

      {selectedNode.recommendations && (
        <CBOMRecommendations recommendations={selectedNode.recommendations} />
      )}
    </div>
  );
};
