
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight, Building, Package } from 'lucide-react';

interface SearchSummaryProps {
  query: string;
  totalApplications: number;
  totalComponents: number;
  onNavigateToApplications: () => void;
  onNavigateToComponents: () => void;
}

export const SearchSummary: React.FC<SearchSummaryProps> = ({
  query,
  totalApplications,
  totalComponents,
  onNavigateToApplications,
  onNavigateToComponents
}) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Search Results for:</span>
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            "{query}"
          </Badge>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div 
            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={onNavigateToApplications}
          >
            <Building className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium text-sm">Applications View</div>
              <div className="text-xs text-gray-600">{totalApplications} applications found</div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
          </div>
          
          <div 
            className="flex items-center gap-2 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={onNavigateToComponents}
          >
            <Package className="h-5 w-5 text-purple-600" />
            <div>
              <div className="font-medium text-sm">Components Analysis</div>
              <div className="text-xs text-gray-600">{totalComponents} components found</div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
          </div>
        </div>
        
        <div className="mt-3 text-xs text-blue-700">
          💡 <strong>Tip:</strong> Start with Applications to explore your services, then dive into Components for detailed library and language analysis.
        </div>
      </CardContent>
    </Card>
  );
};
