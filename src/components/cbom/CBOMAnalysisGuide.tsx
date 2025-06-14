
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Package, Code, Layers, Eye, Target, ArrowRight, Lightbulb } from 'lucide-react';

export const CBOMAnalysisGuide: React.FC = () => {
  const analysisSteps = [
    {
      icon: Building,
      title: 'Applications Overview',
      description: 'View all applications and their risk levels across your infrastructure',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      features: [
        'Risk assessment for each application',
        'Service count and distribution',
        'Overall security posture',
        'Application-level metrics'
      ]
    },
    {
      icon: Layers,
      title: 'Components Analysis',
      description: 'Deep dive into libraries, frameworks, and programming languages',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      features: [
        'Library usage patterns',
        'Programming language distribution',
        'Cross-application dependencies',
        'Risk assessment for components'
      ]
    },
    {
      icon: Eye,
      title: 'Services Deep Dive',
      description: 'Individual service analysis with detailed cryptographic insights',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      features: [
        'Service-specific vulnerabilities',
        'Cryptographic implementation details',
        'Dependency relationships',
        'Performance and security metrics'
      ]
    },
    {
      icon: Target,
      title: 'Visual Graph Analysis',
      description: 'Interactive dependency graphs showing cryptographic relationships',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      features: [
        'Interactive dependency visualization',
        'Cryptographic flow analysis',
        'Risk propagation mapping',
        'Component relationship insights'
      ]
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 border-indigo-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-indigo-900">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-md">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          CBOM Analysis Views
          <Badge variant="outline" className="text-indigo-700 border-indigo-300 bg-indigo-100">
            What to Expect
          </Badge>
        </CardTitle>
        <p className="text-indigo-700 text-sm">
          After your search, you'll be guided through these comprehensive analysis views to understand your cryptographic landscape
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-8 h-8 ${step.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${step.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold text-sm ${step.color.replace('text-', 'text-')} mb-1`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-600 leading-relaxed">
                      {step.description}
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-1.5">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className={`w-1.5 h-1.5 ${step.color.replace('text-', 'bg-')} rounded-full flex-shrink-0`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 bg-white rounded-xl p-4 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-800 font-medium text-sm mb-2">
            <ArrowRight className="h-4 w-4" />
            Analysis Flow
          </div>
          <p className="text-xs text-amber-700 leading-relaxed">
            Start with <strong>Applications Overview</strong> to understand your overall landscape, then explore <strong>Components Analysis</strong> for detailed library insights. 
            Use <strong>Services Deep Dive</strong> for specific service analysis, and <strong>Visual Graph Analysis</strong> for interactive dependency exploration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
