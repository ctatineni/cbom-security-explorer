
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Code, 
  Calendar, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  ArrowRight
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  version: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  cryptoAlgorithms: string[];
  libraries: string[];
  programmingLanguage?: string;
  languageVersion?: string;
  pqcCompatible?: boolean;
}

interface MigrationStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

interface MigrationPlan {
  id: string;
  serviceId: string;
  totalSteps: number;
  estimatedDuration: string;
  complexity: 'low' | 'medium' | 'high';
  steps: MigrationStep[];
  recommendations: string[];
}

interface ServiceDetailsModalProps {
  service: Service | null;
  open: boolean;
  onClose: () => void;
  migrationPlan?: MigrationPlan;
}

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  service,
  open,
  onClose,
  migrationPlan
}) => {
  if (!service) return null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            {service.name}
          </DialogTitle>
          <DialogDescription>
            Detailed service information and migration planning
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security Analysis</TabsTrigger>
            <TabsTrigger value="migration">Migration Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Version:</span>
                    <span className="text-sm font-medium">{service.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Language:</span>
                    <span className="text-sm font-medium">
                      {service.programmingLanguage || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lang Version:</span>
                    <span className="text-sm font-medium">
                      {service.languageVersion || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">PQC Ready:</span>
                    <div className="flex items-center gap-2">
                      {service.pqcCompatible ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-sm font-medium">
                        {service.pqcCompatible ? 'Yes' : 'Needs Migration'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-3 rounded-lg border ${getRiskColor(service.riskLevel)}`}>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium capitalize">{service.riskLevel} Risk</span>
                    </div>
                    <p className="text-sm mt-2">
                      {service.riskLevel === 'high' && 'Immediate attention required for security vulnerabilities.'}
                      {service.riskLevel === 'medium' && 'Some security considerations need to be addressed.'}
                      {service.riskLevel === 'low' && 'Service follows security best practices.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{service.description}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Cryptographic Algorithms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {service.cryptoAlgorithms.map((algo) => (
                      <Badge key={algo} variant="outline" className="text-xs">
                        {algo}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Libraries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {service.libraries.map((lib) => (
                      <Badge key={lib} variant="secondary" className="text-xs">
                        {lib}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Security Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Cryptographic Vulnerabilities</h4>
                  <div className="space-y-2">
                    {service.cryptoAlgorithms.map((algo) => (
                      <div key={algo} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{algo}</span>
                        <Badge variant={algo.includes('MD5') || algo.includes('SHA1') ? 'destructive' : 'outline'}>
                          {algo.includes('MD5') || algo.includes('SHA1') ? 'Deprecated' : 'Secure'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="migration" className="space-y-4">
            {migrationPlan ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Migration Plan Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{migrationPlan.totalSteps}</div>
                        <div className="text-xs text-gray-600">Total Steps</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{migrationPlan.estimatedDuration}</div>
                        <div className="text-xs text-gray-600">Est. Duration</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600 capitalize">{migrationPlan.complexity}</div>
                        <div className="text-xs text-gray-600">Complexity</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Migration Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {migrationPlan.steps.map((step, index) => (
                      <div key={step.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{step.title}</h4>
                            <Badge variant={getPriorityColor(step.priority)} className="text-xs">
                              {step.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{step.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {step.estimatedTime}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {migrationPlan.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Detailed Plan
                  </Button>
                  <Button variant="outline">
                    Download Report
                  </Button>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-600 mb-2">Migration Plan Not Available</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {service.pqcCompatible 
                      ? 'This service is already PQC compatible.' 
                      : 'Migration plan will be generated by the backend.'}
                  </p>
                  {!service.pqcCompatible && (
                    <Button size="sm">Request Migration Plan</Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
