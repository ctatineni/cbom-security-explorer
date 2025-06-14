
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Code, Building, Layers, ArrowRight, Lightbulb, Target, Zap } from 'lucide-react';

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
    <Card className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-purple-900">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
            <Layers className="h-5 w-5 text-white" />
          </div>
          Components Analysis Ready
          <Badge variant="outline" className="text-purple-700 border-purple-300 bg-purple-100">
            <Zap className="h-3 w-3 mr-1" />
            Available
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{totalLibraries}</div>
            <div className="text-sm text-blue-700 font-medium">Libraries</div>
          </div>
          
          <div className="text-center p-4 bg-white rounded-xl border border-purple-200 shadow-sm">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Code className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">{totalLanguages}</div>
            <div className="text-sm text-purple-700 font-medium">Languages</div>
          </div>
          
          <div className="text-center p-4 bg-white rounded-xl border border-green-200 shadow-sm">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Building className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">{totalComponents}</div>
            <div className="text-sm text-green-700 font-medium">Total</div>
          </div>
        </div>

        {/* Insights box */}
        <div className="bg-white rounded-xl p-4 border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-amber-800 mb-2">Deep Analysis Available</div>
              <ul className="text-sm text-amber-700 space-y-1.5">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  Cross-application library usage patterns
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  Programming language distribution analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  Component dependency relationships
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                  Risk assessment for frameworks & libraries
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action section */}
        <div className="bg-white rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium text-purple-800">Explore Components</div>
                <div className="text-sm text-purple-600">Dive into detailed component analysis</div>
              </div>
            </div>
            <Button
              onClick={onViewComponents}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 shadow-md"
            >
              Analyze Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
