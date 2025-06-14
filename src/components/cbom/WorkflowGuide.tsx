
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Search, Building, Layers, Eye, CheckCircle, Target } from 'lucide-react';

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
      title: 'Applications',
      description: 'View all applications and risk levels',
      icon: Building,
      completed: ['services', 'overview', 'components'].includes(currentStep)
    },
    {
      id: 'components',
      title: 'Components',
      description: 'Libraries and languages analysis',
      icon: Layers,
      completed: false
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Individual service analysis',
      icon: Eye,
      completed: ['overview'].includes(currentStep)
    },
    {
      id: 'overview',
      title: 'Graph View',
      description: 'Visual dependency analysis',
      icon: Target,
      completed: false
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          Analysis Workflow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Icons row */}
          <div className="relative">
            <div className="grid grid-cols-5 gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCurrent = step.id === currentStep;
                const isCompleted = step.completed;
                
                return (
                  <div key={step.id} className="flex justify-center relative">
                    <button
                      onClick={() => onStepClick?.(step.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-lg scale-110'
                          : isCompleted
                          ? 'bg-green-500 text-white shadow-md hover:scale-105'
                          : 'bg-gray-200 text-gray-500 hover:bg-gray-300 hover:scale-105'
                      }`}
                    >
                      {isCompleted && !isCurrent ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </button>
                    
                    {isCurrent && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Connection line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-300 -z-10">
              <div className="mx-12 h-full relative">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                  style={{ 
                    width: `${(steps.findIndex(s => s.id === currentStep) / (steps.length - 1)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Step details boxes */}
          <div className="grid grid-cols-5 gap-4">
            {steps.map((step) => {
              const isCurrent = step.id === currentStep;
              const isCompleted = step.completed;
              
              return (
                <div 
                  key={step.id}
                  className={`text-center p-3 rounded-lg transition-all cursor-pointer ${
                    isCurrent 
                      ? 'bg-blue-100 border-2 border-blue-300' 
                      : isCompleted
                      ? 'bg-green-50 border border-green-200 hover:bg-green-100'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => onStepClick?.(step.id)}
                >
                  <div className={`font-medium text-sm ${
                    isCurrent ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </div>
                  <div className={`text-xs mt-1 ${
                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </div>
                  
                  {isCurrent && (
                    <Badge variant="default" className="mt-2 text-xs bg-blue-600">
                      Active
                    </Badge>
                  )}
                  {isCompleted && !isCurrent && (
                    <Badge variant="outline" className="mt-2 text-xs border-green-500 text-green-700">
                      Complete
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
