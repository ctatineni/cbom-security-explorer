
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Layers,
  Building,
  Code,
  Key,
  XCircle
} from 'lucide-react';
import { Service, CBOMData } from '@/data/mockCBOMData';

interface MetricsDashboardProps {
  services: Service[];
  cbomData: CBOMData;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ services, cbomData }) => {
  const metrics = useMemo(() => {
    const totalServices = services.length;
    const totalApplications = cbomData.applications?.length || 0;
    
    // Risk distribution
    const lowRisk = services.filter(s => s.riskLevel === 'low').length;
    const mediumRisk = services.filter(s => s.riskLevel === 'medium').length;
    const highRisk = services.filter(s => s.riskLevel === 'high').length;
    
    // PQC readiness
    const pqcReady = services.filter(s => s.pqcCompatible === true).length;
    const pqcNeedsMigration = services.filter(s => s.pqcCompatible === false).length;
    const pqcReadyPercentage = totalServices > 0 ? Math.round((pqcReady / totalServices) * 100) : 0;
    
    // Technology breakdown
    const languageStats = services.reduce((acc, service) => {
      const lang = service.programmingLanguage || 'Unknown';
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topLanguages = Object.entries(languageStats)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5);
    
    // Unique crypto algorithms and libraries
    const uniqueCryptoAlgorithms = new Set();
    const uniqueLibraries = new Set();
    
    services.forEach(service => {
      service.cryptoAlgorithms.forEach(algo => uniqueCryptoAlgorithms.add(algo.id));
      service.libraries.forEach(lib => uniqueLibraries.add(lib.id));
    });
    
    // Critical issues
    const deprecatedAlgorithms = cbomData.cryptoAlgorithms?.filter(algo => algo.deprecated).length || 0;
    const vulnerableLibraries = cbomData.libraries?.filter(lib => lib.hasVulnerabilities).length || 0;
    
    return {
      totalServices,
      totalApplications,
      lowRisk,
      mediumRisk,
      highRisk,
      pqcReady,
      pqcNeedsMigration,
      pqcReadyPercentage,
      topLanguages,
      uniqueCryptoCount: uniqueCryptoAlgorithms.size,
      uniqueLibrariesCount: uniqueLibraries.size,
      deprecatedAlgorithms,
      vulnerableLibraries
    };
  }, [services, cbomData]);

  const getRiskPercentage = (count: number) => {
    return metrics.totalServices > 0 ? Math.round((count / metrics.totalServices) * 100) : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Overview Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Building className="h-4 w-4" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Applications</span>
            <span className="text-lg font-bold text-blue-600">{metrics.totalApplications}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Services</span>
            <span className="text-lg font-bold text-purple-600">{metrics.totalServices}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Algorithms</span>
            <span className="text-lg font-bold text-green-600">{metrics.uniqueCryptoCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Libraries</span>
            <span className="text-lg font-bold text-orange-600">{metrics.uniqueLibrariesCount}</span>
          </div>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-xs">Low Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{metrics.lowRisk}</span>
                <Badge variant="outline" className="text-xs">
                  {getRiskPercentage(metrics.lowRisk)}%
                </Badge>
              </div>
            </div>
            <Progress value={getRiskPercentage(metrics.lowRisk)} className="h-1 bg-gray-200" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-yellow-500" />
                <span className="text-xs">Medium Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{metrics.mediumRisk}</span>
                <Badge variant="secondary" className="text-xs">
                  {getRiskPercentage(metrics.mediumRisk)}%
                </Badge>
              </div>
            </div>
            <Progress value={getRiskPercentage(metrics.mediumRisk)} className="h-1 bg-gray-200" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <XCircle className="h-3 w-3 text-red-500" />
                <span className="text-xs">High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{metrics.highRisk}</span>
                <Badge variant="destructive" className="text-xs">
                  {getRiskPercentage(metrics.highRisk)}%
                </Badge>
              </div>
            </div>
            <Progress value={getRiskPercentage(metrics.highRisk)} className="h-1 bg-gray-200" />
          </div>
        </CardContent>
      </Card>

      {/* PQC Readiness */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Key className="h-4 w-4" />
            PQC Readiness
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {metrics.pqcReadyPercentage}%
            </div>
            <p className="text-xs text-gray-600">Services Ready</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Ready
              </span>
              <span className="font-medium">{metrics.pqcReady}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-yellow-500" />
                Needs Migration
              </span>
              <span className="font-medium">{metrics.pqcNeedsMigration}</span>
            </div>
          </div>
          
          <Progress value={metrics.pqcReadyPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Code className="h-4 w-4" />
            Technology Stack
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {metrics.topLanguages.slice(0, 4).map(([language, count]) => (
            <div key={language} className="flex justify-between items-center">
              <span className="text-xs text-gray-600 truncate">{language}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{count as React.ReactNode}</span>
                <div className="w-8 h-1 bg-gray-200 rounded">
                  <div 
                    className="h-1 bg-blue-500 rounded" 
                    style={{ 
                      width: `${Math.min(100, ((count as number) / metrics.totalServices) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {metrics.topLanguages.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-2">
              No language data available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Critical Issues */}
      {(metrics.deprecatedAlgorithms > 0 || metrics.vulnerableLibraries > 0) && (
        <Card className="md:col-span-2 lg:col-span-4 border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Critical Issues Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.deprecatedAlgorithms > 0 && (
                <div className="flex items-center gap-3 p-3 bg-white border border-red-200 rounded">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      {metrics.deprecatedAlgorithms} Deprecated Algorithm{metrics.deprecatedAlgorithms > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-red-700">Immediate migration required</p>
                  </div>
                </div>
              )}
              
              {metrics.vulnerableLibraries > 0 && (
                <div className="flex items-center gap-3 p-3 bg-white border border-red-200 rounded">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      {metrics.vulnerableLibraries} Vulnerable Librar{metrics.vulnerableLibraries > 1 ? 'ies' : 'y'}
                    </p>
                    <p className="text-xs text-red-700">Security updates needed</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
