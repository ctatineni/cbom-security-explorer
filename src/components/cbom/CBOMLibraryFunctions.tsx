
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { CBOMExpandableModal } from './CBOMExpandableModal';
import { CBOMLibraryFunctionsExpanded } from './CBOMLibraryFunctionsExpanded';

interface CBOMLibraryFunctionsProps {
  functions: any[];
}

export const CBOMLibraryFunctions: React.FC<CBOMLibraryFunctionsProps> = ({ 
  functions 
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Library Functions
          </CardTitle>
          <CBOMExpandableModal 
            title="Library Functions"
            triggerText="View All"
          >
            <CBOMLibraryFunctionsExpanded functions={functions} />
          </CBOMExpandableModal>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {functions.slice(0, 3).map((func, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-3">
            <div className="font-medium text-sm">{func.name}</div>
            <div className="text-xs text-gray-600 mb-1 line-clamp-2">{func.purpose}</div>
            <div className="text-xs text-gray-500">
              Used in: {func.usedIn.slice(0, 2).join(', ')}
              {func.usedIn.length > 2 && ` +${func.usedIn.length - 2} more`}
            </div>
          </div>
        ))}
        {functions.length > 3 && (
          <div className="text-xs text-gray-500 text-center">
            Showing 3 of {functions.length} functions
          </div>
        )}
      </CardContent>
    </Card>
  );
};
