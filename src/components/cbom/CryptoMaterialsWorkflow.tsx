
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, FileKey, BarChart3, Target } from 'lucide-react';

interface CryptoMaterialsWorkflowProps {
  currentStep: 'search' | 'results';
  onStepClick?: (step: string) => void;
}

export const CryptoMaterialsWorkflow: React.FC<CryptoMaterialsWorkflowProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    {
      id: 'search',
      title: 'Search & Query',
      description: 'Find crypto materials across infrastructure',
      icon: Search
    },
    {
      id: 'results',
      title: 'Materials Analysis',
      description: 'Certificates, keys, and risk assessment',
      icon: FileKey
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-green-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          Crypto Materials Workflow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Icons row */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCurrent = step.id === currentStep;
                
                return (
                  <div key={step.id} className="flex justify-center relative">
                    <button
                      onClick={() => onStepClick?.(step.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCurrent
                          ? 'bg-green-600 text-white shadow-lg scale-110'
                          : 'bg-gray-200 text-gray-500 hover:bg-gray-300 hover:scale-105'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </button>
                    
                    {isCurrent && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Connection line */}
            <div className="absolute top-6 left-1/4 right-1/4 h-0.5 bg-gray-300 -z-10">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
                style={{ 
                  width: `${(steps.findIndex(s => s.id === currentStep) / (steps.length - 1)) * 100}%` 
                }}
              ></div>
            </div>
          </div>
          
          {/* Step details boxes */}
          <div className="grid grid-cols-2 gap-4">
            {steps.map((step) => {
              const isCurrent = step.id === currentStep;
              
              return (
                <div 
                  key={step.id}
                  className={`text-center p-3 rounded-lg transition-all cursor-pointer ${
                    isCurrent 
                      ? 'bg-green-100 border-2 border-green-300' 
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => onStepClick?.(step.id)}
                >
                  <div className={`font-medium text-sm ${
                    isCurrent ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </div>
                  <div className={`text-xs mt-1 ${
                    isCurrent ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </div>
                  
                  {isCurrent && (
                    <Badge variant="default" className="mt-2 text-xs bg-green-600">
                      Active
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
