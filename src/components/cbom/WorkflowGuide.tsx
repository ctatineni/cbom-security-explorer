
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Search, Building, Layers, Eye, CheckCircle } from 'lucide-react';

interface WorkflowGuideProps {
  currentStep: 'search' | 'applications' | 'services' | 'overview' | 'components';
  onStepClick?: (step: string) => void;
}

export const WorkflowGuide: React.FC<WorkflowGuideProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    {
      id: 'search',
      title: 'Search & Query',
      description: 'Natural language search for crypto assets',
      icon: Search,
      completed: ['applications', 'services', 'overview', 'components'].includes(currentStep)
    },
    {
      id: 'applications',
      title: 'Applications Overview',
      description: 'View all applications and their risk levels',
      icon: Building,
      completed: ['services', 'overview', 'components'].includes(currentStep)
    },
    {
      id: 'components',
      title: 'Components Analysis',
      description: 'Drill down into libraries and languages',
      icon: Layers,
      completed: false
    },
    {
      id: 'services',
      title: 'Service Details',
      description: 'Analyze individual services',
      icon: Eye,
      completed: ['overview'].includes(currentStep)
    },
    {
      id: 'overview',
      title: 'Crypto Graph',
      description: 'Visual dependency analysis',
      icon: CheckCircle,
      completed: false
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          CBOM Analysis Workflow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCurrent = step.id === currentStep;
            const isCompleted = step.completed;
            
            return (
              <React.Fragment key={step.id}>
                <div
                  className={`flex flex-col items-center min-w-0 flex-shrink-0 cursor-pointer transition-all duration-200 ${
                    isCurrent ? 'scale-105' : 'hover:scale-102'
                  }`}
                  onClick={() => onStepClick?.(step.id)}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-lg'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-medium ${isCurrent ? 'text-blue-700' : 'text-gray-700'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 max-w-20 leading-tight">
                      {step.description}
                    </div>
                  </div>
                  {isCurrent && (
                    <Badge variant="default" className="mt-1 text-xs">
                      Current
                    </Badge>
                  )}
                  {isCompleted && !isCurrent && (
                    <CheckCircle className="h-3 w-3 text-green-500 mt-1" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0 mx-1" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
