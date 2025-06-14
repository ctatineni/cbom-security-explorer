
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building, Layers, Eye, TrendingUp } from 'lucide-react';

interface FlowIndicatorProps {
  title: string;
  description: string;
  nextStep: string;
  nextStepDescription: string;
  onNextStep: () => void;
  stats?: {
    label: string;
    value: number;
    color: string;
  }[];
}

export const FlowIndicator: React.FC<FlowIndicatorProps> = ({
  title,
  description,
  nextStep,
  nextStepDescription,
  onNextStep,
  stats = []
}) => {
  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">{title}</h3>
            <p className="text-sm text-blue-700 mb-3">{description}</p>
            
            {stats.length > 0 && (
              <div className="flex gap-4 mb-3">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Next:</span>
              <Button
                onClick={onNextStep}
                size="sm"
                className="flex items-center gap-2"
              >
                {nextStep}
                <ArrowRight className="h-3 w-3" />
              </Button>
              <span className="text-xs text-gray-500">{nextStepDescription}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              Analysis Complete
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
