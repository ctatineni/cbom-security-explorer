
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Code, Building, Layers, ArrowRight, Lightbulb, Target } from 'lucide-react';

interface ComponentsViewGuideProps {
  totalComponents: number;
  totalLibraries: number;
  totalLanguages: number;
  onViewComponents: () => void;
}

export const ComponentsViewGuide: React.FC<ComponentsViewGuideProps> = ({
  totalComponents,
  totalLibraries,
  totalLanguages,
  onViewComponents
}) => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Layers className="h-5 w-5" />
          Components Analysis Available
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <Package className="h-6 w-6 text-blue-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-blue-600">{totalLibraries}</div>
            <div className="text-xs text-gray-600">Libraries</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <Code className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-purple-600">{totalLanguages}</div>
            <div className="text-xs text-gray-600">Languages</div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border">
            <Building className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <div className="text-xl font-bold text-green-600">{totalComponents}</div>
            <div className="text-xs text-gray-600">Total Components</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border-l-4 border-l-yellow-400">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-yellow-800">What you can discover:</div>
              <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                <li>• Which libraries are used across multiple applications</li>
                <li>• Programming language distribution and usage patterns</li>
                <li>• Component dependencies and relationships</li>
                <li>• Risk assessment for libraries and frameworks</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-purple-700">Deep dive into component usage</span>
          </div>
          <Button
            onClick={onViewComponents}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            Analyze Components
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
