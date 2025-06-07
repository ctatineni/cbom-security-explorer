
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Server,
  Key,
  Library,
  Zap
} from 'lucide-react';

interface MetricsDashboardProps {
  services: any[];
  cbomData: any;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ 
  services, 
  cbomData 
}) => {
  const getMetrics = () => {
    const totalServices = services.length;
    const highRiskServices = services.filter(s => s.riskLevel === 'high').length;
    const mediumRiskServices = services.filter(s => s.riskLevel === 'medium').length;
    const lowRiskServices = services.filter(s => s.riskLevel === 'low').length;
    const pqcReadyServices = services.filter(s => s.pqcCompatible).length;
    const pqcMigrationServices = totalServices - pqcReadyServices;
    
    const uniqueAlgorithms = new Set();
    const uniqueLibraries = new Set();
    const languageDistribution: Record<string, number> = {};
    
    services.forEach(service => {
      service.cryptoAlgorithms?.forEach((algo: string) => uniqueAlgorithms.add(algo));
      service.libraries?.forEach((lib: string) => uniqueLibraries.add(lib));
      
      const lang = service.programmingLanguage;
      if (lang) {
        languageDistribution[lang] = (languageDistribution[lang] || 0) + 1;
      }
    });

    const riskScore = totalServices > 0 ? Math.round(
      ((lowRiskServices * 100) + (mediumRiskServices * 50) + (highRiskServices * 0)) / totalServices
    ) : 0;

    return {
      totalServices,
      highRiskServices,
      mediumRiskServices,
      lowRiskServices,
      pqcReadyServices,
      pqcMigrationServices,
      uniqueAlgorithms: uniqueAlgorithms.size,
      uniqueLibraries: uniqueLibraries.size,
      riskScore,
      languageDistribution,
      pqcReadinessPercent: totalServices > 0 ? Math.round((pqcReadyServices / totalServices) * 100) : 0
    };
  };

  const metrics = getMetrics();
  const topLanguages = Object.entries(metrics.languageDistribution)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Server className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics.totalServices}</div>
                <div className="text-sm text-gray-500">Total Services</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Key className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics.uniqueAlgorithms}</div>
                <div className="text-sm text-gray-500">Crypto Algorithms</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Library className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics.uniqueLibraries}</div>
                <div className="text-sm text-gray-500">Libraries</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                metrics.riskScore >= 80 ? 'bg-green-100' :
                metrics.riskScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <TrendingUp className={`h-5 w-5 ${
                  metrics.riskScore >= 80 ? 'text-green-600' :
                  metrics.riskScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics.riskScore}</div>
                <div className="text-sm text-gray-500">Security Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">High Risk</span>
                </div>
                <Badge variant="destructive">{metrics.highRiskServices}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Medium Risk</span>
                </div>
                <Badge variant="secondary">{metrics.mediumRiskServices}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Low Risk</span>
                </div>
                <Badge variant="outline">{metrics.lowRiskServices}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PQC Readiness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              PQC Readiness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {metrics.pqcReadinessPercent}%
              </div>
              <div className="text-sm text-gray-500">Services Ready</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">PQC Ready</span>
                <Badge variant="outline" className="text-green-600 border-green-300">
                  {metrics.pqcReadyServices}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-600">Migration Needed</span>
                <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                  {metrics.pqcMigrationServices}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5" />
              Top Languages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {topLanguages.map(([language, count], index) => (
                <div key={language} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-purple-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-sm">{language}</span>
                  </div>
                  <Badge variant="outline">{count as number}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.highRiskServices > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Action Required</span>
                </div>
                <p className="text-sm text-red-600">
                  {metrics.highRiskServices} service{metrics.highRiskServices > 1 ? 's' : ''} need{metrics.highRiskServices === 1 ? 's' : ''} immediate attention due to high-risk cryptographic implementations.
                </p>
              </div>
            )}
            
            {metrics.pqcReadinessPercent < 50 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-700 mb-2">
                  <Zap className="h-4 w-4" />
                  <span className="font-medium">PQC Migration</span>
                </div>
                <p className="text-sm text-yellow-600">
                  {metrics.pqcMigrationServices} service{metrics.pqcMigrationServices > 1 ? 's' : ''} require{metrics.pqcMigrationServices === 1 ? 's' : ''} post-quantum cryptography migration planning.
                </p>
              </div>
            )}

            {metrics.riskScore >= 80 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Good Security</span>
                </div>
                <p className="text-sm text-green-600">
                  Your application has a strong security score with most services following best practices.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
