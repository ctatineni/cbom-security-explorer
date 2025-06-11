
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileKey, Key, AlertTriangle, CheckCircle, Calendar, Building } from 'lucide-react';
import { CryptoMaterialsData } from '@/data/mockCryptoMaterialsData';

interface CryptoMaterialsKnowledgeGraphProps {
  data: CryptoMaterialsData;
}

export const CryptoMaterialsKnowledgeGraph: React.FC<CryptoMaterialsKnowledgeGraphProps> = ({ data }) => {
  const analytics = useMemo(() => {
    const expiringSoon = data.certificates.filter(cert => cert.daysUntilExpiry > 0 && cert.daysUntilExpiry <= 30);
    const expired = data.certificates.filter(cert => cert.isExpired);
    const selfSigned = data.certificates.filter(cert => cert.isSelfSigned);
    const weakKeys = data.keys.filter(key => 
      (key.type === 'RSA' && key.keySize < 2048) || 
      (key.type === 'AES' && key.keySize < 128)
    );
    
    // Application usage analysis
    const appUsage = new Map();
    data.certificates.forEach(cert => {
      cert.applications.forEach(app => {
        if (!appUsage.has(app)) {
          appUsage.set(app, { certificates: 0, keys: 0 });
        }
        appUsage.get(app).certificates++;
      });
    });
    
    data.keys.forEach(key => {
      key.applications.forEach(app => {
        if (!appUsage.has(app)) {
          appUsage.set(app, { certificates: 0, keys: 0 });
        }
        appUsage.get(app).keys++;
      });
    });
    
    return {
      expiringSoon,
      expired,
      selfSigned,
      weakKeys,
      appUsage: Array.from(appUsage.entries()).map(([app, usage]) => ({ app, ...usage }))
    };
  }, [data]);

  const getStatusBadge = (isExpired: boolean, daysUntilExpiry: number) => {
    if (isExpired) {
      return <Badge variant="destructive" className="text-xs">Expired</Badge>;
    }
    if (daysUntilExpiry <= 30) {
      return <Badge variant="destructive" className="text-xs">Expiring Soon</Badge>;
    }
    if (daysUntilExpiry <= 90) {
      return <Badge className="text-xs bg-yellow-500">Warning</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Valid</Badge>;
  };

  const getKeyStrengthBadge = (key: any) => {
    const isWeak = (key.type === 'RSA' && key.keySize < 2048) || 
                   (key.type === 'AES' && key.keySize < 128);
    
    return isWeak ? (
      <Badge variant="destructive" className="text-xs">Weak</Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">Strong</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{analytics.expired.length}</div>
            <div className="text-sm text-red-700">Expired Certificates</div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{analytics.expiringSoon.length}</div>
            <div className="text-sm text-yellow-700">Expiring Soon</div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{analytics.selfSigned.length}</div>
            <div className="text-sm text-orange-700">Self-Signed</div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{analytics.weakKeys.length}</div>
            <div className="text-sm text-purple-700">Weak Keys</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="certificates" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="certificates">
            <FileKey className="h-4 w-4 mr-2" />
            Certificates
          </TabsTrigger>
          <TabsTrigger value="keys">
            <Key className="h-4 w-4 mr-2" />
            Keys
          </TabsTrigger>
          <TabsTrigger value="relationships">
            <Building className="h-4 w-4 mr-2" />
            Usage Patterns
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Common Name</TableHead>
                    <TableHead>Issuer</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Key Size</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.certificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-mono text-sm">{cert.commonName}</TableCell>
                      <TableCell className="text-sm">{cert.issuer}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {cert.validTo}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{cert.keySize} bits</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {cert.applications.slice(0, 2).map((app, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {app}
                            </Badge>
                          ))}
                          {cert.applications.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{cert.applications.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(cert.isExpired, cert.daysUntilExpiry)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cryptographic Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.keys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-mono text-sm">{key.name}</TableCell>
                      <TableCell className="text-sm">{key.type}</TableCell>
                      <TableCell className="text-sm">{key.keySize} bits</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {key.usage.map((usage, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {usage}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{key.location}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {getKeyStrengthBadge(key)}
                          {key.isActive ? (
                            <Badge variant="secondary" className="text-xs">Active</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Inactive</Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Usage Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.appUsage.map((usage, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {usage.app}
                      </h4>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>{usage.certificates} certificates</span>
                        <span>{usage.keys} keys</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Associated Certificates</h5>
                        <div className="space-y-1">
                          {data.certificates
                            .filter(cert => cert.applications.includes(usage.app))
                            .slice(0, 3)
                            .map((cert, certIndex) => (
                              <div key={certIndex} className="text-xs text-gray-600 flex items-center gap-2">
                                <FileKey className="h-3 w-3" />
                                {cert.commonName}
                                {getStatusBadge(cert.isExpired, cert.daysUntilExpiry)}
                              </div>
                            ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-2">Associated Keys</h5>
                        <div className="space-y-1">
                          {data.keys
                            .filter(key => key.applications.includes(usage.app))
                            .slice(0, 3)
                            .map((key, keyIndex) => (
                              <div key={keyIndex} className="text-xs text-gray-600 flex items-center gap-2">
                                <Key className="h-3 w-3" />
                                {key.name}
                                {getKeyStrengthBadge(key)}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Security Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <strong>Expired Certificates ({analytics.expired.length})</strong>
                  {analytics.expired.slice(0, 3).map((cert, index) => (
                    <div key={index} className="text-xs text-gray-600 ml-4">
                      • {cert.commonName} (expired {Math.abs(cert.daysUntilExpiry)} days ago)
                    </div>
                  ))}
                </div>
                
                <div className="text-sm">
                  <strong>Weak Keys ({analytics.weakKeys.length})</strong>
                  {analytics.weakKeys.slice(0, 3).map((key, index) => (
                    <div key={index} className="text-xs text-gray-600 ml-4">
                      • {key.name} ({key.type}-{key.keySize})
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <strong>Strong Certificates</strong>
                  <div className="text-xs text-gray-600 ml-4">
                    {data.certificates.filter(cert => !cert.isExpired && cert.keySize >= 2048).length} certificates with 2048+ bit keys
                  </div>
                </div>
                
                <div className="text-sm">
                  <strong>Active Key Management</strong>
                  <div className="text-xs text-gray-600 ml-4">
                    {data.keys.filter(key => key.isActive).length} active keys properly managed
                  </div>
                </div>
                
                <div className="text-sm">
                  <strong>Environment Separation</strong>
                  <div className="text-xs text-gray-600 ml-4">
                    Production, staging, and development properly isolated
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
