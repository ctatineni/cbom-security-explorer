
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

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
    <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon and status */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-emerald-900 text-lg">{title}</h3>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-100">
                <Sparkles className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            </div>
            
            <p className="text-emerald-700 mb-4 leading-relaxed">{description}</p>
            
            {/* Stats */}
            {stats.length > 0 && (
              <div className="flex gap-6 mb-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center bg-white rounded-lg px-4 py-2 shadow-sm border">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Next step action */}
            <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-emerald-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <div>
                  <div className="font-medium text-gray-900">Ready for next step</div>
                  <div className="text-sm text-gray-600">{nextStepDescription}</div>
                </div>
              </div>
              
              <Button
                onClick={onNextStep}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-md"
              >
                {nextStep}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
