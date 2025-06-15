
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Zap,
  Shield
} from 'lucide-react';

interface CBOMOverviewProps {
  cbomData: any;
  onNodeSelect: (nodeData: any) => void;
}

export const CBOMOverview: React.FC<CBOMOverviewProps> = ({ 
  cbomData, 
  onNodeSelect 
}) => {
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
};
