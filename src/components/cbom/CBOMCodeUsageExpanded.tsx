
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCode, Code } from 'lucide-react';

interface CBOMCodeUsageExpandedProps {
  usageLocations: any[];
}

export const CBOMCodeUsageExpanded: React.FC<CBOMCodeUsageExpandedProps> = ({ 
  usageLocations 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileCode className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Code Usage Locations</h3>
      </div>
      
      <div className="grid gap-4">
        {usageLocations.map((location, index) => (
          <Card key={index} className="border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Code className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{location.file}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Line {location.line}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                Function: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{location.function}</span>
              </div>
              <div className="bg-gray-900 text-green-400 p-4 rounded-md text-sm font-mono overflow-x-auto">
                <pre className="whitespace-pre-wrap">{location.usage}</pre>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
