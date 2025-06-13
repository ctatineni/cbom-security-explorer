
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Clock, FileKey, Key, Shield, BarChart3 } from 'lucide-react';
import { CryptoMaterialsData } from '@/data/mockCryptoMaterialsData';
import { CertificatesTab } from './CertificatesTab';
import { KeysTab } from './KeysTab';
import { CryptoMaterialsMetrics } from './CryptoMaterialsMetrics';

interface CryptoMaterialsAnalysisProps {
  data: CryptoMaterialsData;
  streamingData?: boolean;
  onDataUpdate?: (newData: CryptoMaterialsData) => void;
}

export const CryptoMaterialsAnalysis: React.FC<CryptoMaterialsAnalysisProps> = ({ 
  data, 
  streamingData = false, 
  onDataUpdate 
}) => {
  const [activeTab, setActiveTab] = useState('metrics'); // Default to metrics
  const [activeFilters, setActiveFilters] = useState<{
    certificates?: any;
    keys?: any;
  }>({});

  // Handle streaming data updates
  useEffect(() => {
    if (streamingData && onDataUpdate) {
      const interval = setInterval(() => {
        console.log('Streaming data update available');
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [streamingData, onDataUpdate]);

  const hasCertificates = data.certificates.length > 0;
  const hasKeys = data.keys.length > 0;

  const handleCertificateFiltersChange = (filters: any) => {
    setActiveFilters(prev => ({
      ...prev,
      certificates: filters
    }));
  };

  const handleKeyFiltersChange = (filters: any) => {
    setActiveFilters(prev => ({
      ...prev,
      keys: filters
    }));
  };

  return (
    <div className="space-y-6">
      {/* Streaming Status */}
      {streamingData && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live data streaming enabled</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileKey className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{data.certificates.length}</div>
                <div className="text-sm text-gray-500">Certificates</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{data.keys.length}</div>
                <div className="text-sm text-gray-500">Keys</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {data.certificates.filter(cert => cert.isExpired || cert.daysUntilExpiry < 30).length}
                </div>
                <div className="text-sm text-gray-500">High Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {data.certificates.filter(cert => !cert.isExpired && cert.daysUntilExpiry < 90 && cert.daysUntilExpiry >= 30).length}
                </div>
                <div className="text-sm text-gray-500">Expiring Soon</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Cryptographic Assets Registry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metrics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Metrics & Impact
              </TabsTrigger>
              {hasCertificates && (
                <TabsTrigger value="certificates">
                  <FileKey className="h-4 w-4 mr-2" />
                  Certificates
                  <Badge variant="secondary" className="ml-2 text-xs">{data.certificates.length}</Badge>
                </TabsTrigger>
              )}
              {hasKeys && (
                <TabsTrigger value="keys">
                  <Key className="h-4 w-4 mr-2" />
                  Keys
                  <Badge variant="secondary" className="ml-2 text-xs">{data.keys.length}</Badge>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="metrics" className="space-y-4">
              <CryptoMaterialsMetrics data={data} activeFilters={activeFilters} />
            </TabsContent>

            {hasCertificates && (
              <TabsContent value="certificates" className="space-y-4">
                <CertificatesTab 
                  certificates={data.certificates} 
                  onFiltersChange={handleCertificateFiltersChange}
                />
              </TabsContent>
            )}

            {hasKeys && (
              <TabsContent value="keys" className="space-y-4">
                <KeysTab 
                  keys={data.keys}
                  onFiltersChange={handleKeyFiltersChange}
                />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
