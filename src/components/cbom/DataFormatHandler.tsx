
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Database, AlertCircle } from 'lucide-react';

interface DataSource {
  type: 'single' | 'multiple' | 'github';
  format: string;
  lastUpdated: string;
  serviceCount: number;
  status: 'active' | 'processing' | 'error';
}

interface DataFormatHandlerProps {
  dataSources: DataSource[];
  selectedSource: DataSource | null;
  onSourceSelect: (source: DataSource) => void;
}

export const DataFormatHandler: React.FC<DataFormatHandlerProps> = ({
  dataSources,
  selectedSource,
  onSourceSelect
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'processing': return 'Processing';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'single': return <FileText className="h-4 w-4" />;
      case 'multiple': return <Database className="h-4 w-4" />;
      case 'github': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Data Sources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {dataSources.map((source, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedSource === source 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSourceSelect(source)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getIcon(source.type)}
                <span className="text-sm font-medium">{source.format}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(source.status)}`}></div>
                <span className="text-xs text-gray-600">{getStatusText(source.status)}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{source.serviceCount} services</span>
              <span>Updated {source.lastUpdated}</span>
            </div>
            
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {source.type === 'single' ? 'Per-Service JSON' : 
                 source.type === 'multiple' ? 'Multi-Service JSON' : 'GitHub Scan'}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
