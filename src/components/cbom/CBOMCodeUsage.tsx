
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCode, Code } from 'lucide-react';
import { CBOMExpandableModal } from './CBOMExpandableModal';
import { CBOMCodeUsageExpanded } from './CBOMCodeUsageExpanded';

interface CBOMCodeUsageProps {
  usageLocations: any[];
}

export const CBOMCodeUsage: React.FC<CBOMCodeUsageProps> = ({ 
  usageLocations 
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Code Usage
          </CardTitle>
          <CBOMExpandableModal 
            title="Code Usage Locations"
            triggerText="View All"
          >
            <CBOMCodeUsageExpanded usageLocations={usageLocations} />
          </CBOMExpandableModal>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {usageLocations.slice(0, 2).map((location, index) => (
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
              <pre className="whitespace-pre-wrap break-all line-clamp-3">{location.usage}</pre>
            </div>
          </div>
        ))}
        {usageLocations.length > 2 && (
          <div className="text-xs text-gray-500 text-center">
            Showing 2 of {usageLocations.length} locations
          </div>
        )}
      </CardContent>
    </Card>
  );
};
