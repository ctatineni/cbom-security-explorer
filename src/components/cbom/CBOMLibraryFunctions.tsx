
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface CBOMLibraryFunctionsProps {
  functions: any[];
}

export const CBOMLibraryFunctions: React.FC<CBOMLibraryFunctionsProps> = ({ 
  functions 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Library Functions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {functions.map((func, index) => (
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
  );
};
