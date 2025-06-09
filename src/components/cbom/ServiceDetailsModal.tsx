
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
  ArrowRight,
  Bug,
  Lightbulb,
  XCircle
} from 'lucide-react';
import { Service } from '@/data/mockCBOMData';

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

interface AntiPattern {
  id: string;
  type: 'hardcoded-algorithm' | 'weak-encryption' | 'improper-key-management' | 'deprecated-function' | 'insecure-random';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: {
    file: string;
    line: number;
    function?: string;
  };
  codeSnippet: string;
  recommendation: string;
  fixExample?: string;
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

  // Mock anti-patterns based on service data for demonstration
  const getAntiPatterns = (): AntiPattern[] => {
    const patterns: AntiPattern[] = [];
    
    // Check for weak algorithms
    const weakAlgorithms = service.cryptoAlgorithms.filter(algo => 
      algo.name === 'MD5' || algo.name === 'SHA1' || algo.deprecated
    );
    
    if (weakAlgorithms.length > 0) {
      patterns.push({
        id: '1',
        type: 'weak-encryption',
        severity: 'critical',
        title: 'Weak Cryptographic Algorithm',
        description: 'Use of deprecated or weak cryptographic algorithms detected',
        location: {
          file: `${service.name.toLowerCase()}.js`,
          line: 45,
          function: 'hashPassword'
        },
        codeSnippet: `const hash = crypto.createHash('${weakAlgorithms[0].name.toLowerCase()}').update(password).digest('hex');`,
        recommendation: 'Replace MD5/SHA1 with SHA-256 or better. Use bcrypt for password hashing.',
        fixExample: 'const hash = await bcrypt.hash(password, 12);'
      });
    }

    // Check for hardcoded values
    if (service.riskLevel === 'high') {
      patterns.push({
        id: '2',
        type: 'hardcoded-algorithm',
        severity: 'high',
        title: 'Hardcoded Cryptographic Parameters',
        description: 'Cryptographic algorithm or key parameters are hardcoded in the source code',
        location: {
          file: `${service.name.toLowerCase()}/config.js`,
          line: 23,
          function: 'initCrypto'
        },
        codeSnippet: 'const algorithm = "aes-128-cbc"; // Hardcoded algorithm',
        recommendation: 'Move cryptographic parameters to configuration files or environment variables.',
        fixExample: 'const algorithm = process.env.CRYPTO_ALGORITHM || "aes-256-gcm";'
      });
    }

    // Check for improper key management
    if (!service.pqcCompatible) {
      patterns.push({
        id: '3',
        type: 'improper-key-management',
        severity: 'medium',
        title: 'Improper Key Management',
        description: 'Keys are stored or managed in an insecure manner',
        location: {
          file: `${service.name.toLowerCase()}/auth.js`,
          line: 67
        },
        codeSnippet: 'const secretKey = "my-secret-key-123"; // Insecure key storage',
        recommendation: 'Use secure key management systems like AWS KMS, Azure Key Vault, or HashiCorp Vault.',
        fixExample: 'const secretKey = await keyVault.getSecret("app-secret-key");'
      });
    }

    return patterns;
  };

  const antiPatterns = getAntiPatterns();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Bug className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            {service.name}
          </DialogTitle>
          <DialogDescription>
            Detailed service information, security analysis, and code recommendations
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security Analysis</TabsTrigger>
            <TabsTrigger value="recommendations" className="relative">
              Recommendations
              {antiPatterns.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {antiPatterns.length}
                </Badge>
              )}
            </TabsTrigger>
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
                      <Badge 
                        key={algo.id} 
                        variant={algo.deprecated ? "destructive" : "outline"} 
                        className="text-xs"
                      >
                        {algo.name}
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
                      <Badge 
                        key={lib.id} 
                        variant={lib.hasVulnerabilities ? "destructive" : "secondary"} 
                        className="text-xs"
                      >
                        {lib.name}
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
                      <div key={algo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{algo.name}</span>
                        <Badge variant={algo.deprecated ? 'destructive' : 'outline'}>
                          {algo.deprecated ? 'Deprecated' : 'Secure'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Code Analysis & Recommendations
                </CardTitle>
                <p className="text-xs text-gray-600">
                  Anti-patterns and security issues found in the codebase with actionable recommendations
                </p>
              </CardHeader>
              <CardContent>
                {antiPatterns.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-600 mb-2">No Issues Found</h3>
                    <p className="text-sm text-gray-500">
                      Your code follows security best practices. No anti-patterns detected.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {antiPatterns.map((pattern) => (
                      <Card key={pattern.id} className="border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            {/* Issue Header */}
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="flex items-center gap-2">
                                  {getSeverityIcon(pattern.severity)}
                                  <Badge variant={getSeverityColor(pattern.severity)}>
                                    {pattern.severity.toUpperCase()}
                                  </Badge>
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm">{pattern.title}</h4>
                                  <p className="text-xs text-gray-600 mt-1">{pattern.description}</p>
                                </div>
                              </div>
                            </div>

                            {/* Location */}
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                <FileText className="h-3 w-3" />
                                <span>{pattern.location.file}:{pattern.location.line}</span>
                                {pattern.location.function && (
                                  <span>in <code className="bg-gray-200 px-1 rounded">{pattern.location.function}()</code></span>
                                )}
                              </div>
                              
                              {/* Code Snippet */}
                              <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                                <div className="text-xs text-red-600 mb-1">❌ Problematic Code:</div>
                                <code className="text-xs bg-white p-2 block rounded border">
                                  {pattern.codeSnippet}
                                </code>
                              </div>

                              {/* Fix Example */}
                              {pattern.fixExample && (
                                <div className="bg-green-50 border border-green-200 rounded p-2">
                                  <div className="text-xs text-green-600 mb-1">✅ Recommended Fix:</div>
                                  <code className="text-xs bg-white p-2 block rounded border">
                                    {pattern.fixExample}
                                  </code>
                                </div>
                              )}
                            </div>

                            {/* Recommendation */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-sm font-medium text-blue-900 mb-1">Recommendation</div>
                                  <p className="text-sm text-blue-700">{pattern.recommendation}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Summary Actions */}
                    <div className="bg-gray-50 border rounded-lg p-4 mt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">Quick Actions</h4>
                          <p className="text-xs text-gray-600">Generate reports and track fixes</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Generate Fix Report
                          </Button>
                          <Button size="sm">
                            Create Tracking Issue
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
