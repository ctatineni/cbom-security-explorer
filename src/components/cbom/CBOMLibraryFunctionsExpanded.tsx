
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Code2 } from 'lucide-react';

interface CBOMLibraryFunctionsExpandedProps {
  functions: any[];
}

export const CBOMLibraryFunctionsExpanded: React.FC<CBOMLibraryFunctionsExpandedProps> = ({ 
  functions 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Library Functions</h3>
      </div>
      
      <div className="grid gap-4">
        {functions.map((func, index) => (
          <Card key={index} className="border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Code2 className="h-4 w-4 text-blue-600" />
                {func.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-700">
                <strong>Purpose:</strong> {func.purpose}
              </div>
              <div className="text-sm">
                <strong className="text-gray-700">Used in:</strong>
                <div className="mt-1 flex flex-wrap gap-1">
                  {func.usedIn.map((service: string, serviceIndex: number) => (
                    <span 
                      key={serviceIndex}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              {func.description && (
                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                  {func.description}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
