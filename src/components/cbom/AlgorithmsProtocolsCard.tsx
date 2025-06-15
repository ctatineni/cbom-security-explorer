
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Shield, Key, Lock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface AlgorithmsProtocolsCardProps {
  component: {
    id: string;
    name: string;
    version?: string;
    isLibrary?: boolean;
  };
}

// Mock data for algorithms and protocols - in real app this would come from the component data
const generateMockAlgorithmsProtocols = (componentName: string) => {
  const cryptoAlgorithms = [
    { name: 'AES-256-GCM', type: 'Symmetric Encryption', status: 'enabled', security: 'secure', description: 'Advanced Encryption Standard with Galois/Counter Mode' },
    { name: 'RSA-2048', type: 'Asymmetric Encryption', status: 'enabled', security: 'secure', description: 'RSA encryption with 2048-bit key' },
    { name: 'SHA-256', type: 'Hash Function', status: 'enabled', security: 'secure', description: 'Secure Hash Algorithm 256-bit' },
    { name: 'ECDSA-P256', type: 'Digital Signature', status: 'enabled', security: 'secure', description: 'Elliptic Curve Digital Signature Algorithm' },
    { name: 'ChaCha20-Poly1305', type: 'Authenticated Encryption', status: 'supported', security: 'secure', description: 'ChaCha20 stream cipher with Poly1305 authenticator' },
    { name: 'MD5', type: 'Hash Function', status: 'deprecated', security: 'vulnerable', description: 'Message Digest Algorithm 5 (deprecated)' },
    { name: 'DES', type: 'Symmetric Encryption', status: 'deprecated', security: 'vulnerable', description: 'Data Encryption Standard (deprecated)' },
    { name: 'RSA-1024', type: 'Asymmetric Encryption', status: 'deprecated', security: 'weak', description: 'RSA encryption with 1024-bit key (weak)' },
    // Add more algorithms to reach ~50
    { name: 'AES-128-CBC', type: 'Symmetric Encryption', status: 'enabled', security: 'secure', description: 'AES 128-bit Cipher Block Chaining' },
    { name: 'AES-256-CBC', type: 'Symmetric Encryption', status: 'enabled', security: 'secure', description: 'AES 256-bit Cipher Block Chaining' },
    { name: 'PBKDF2', type: 'Key Derivation', status: 'enabled', security: 'secure', description: 'Password-Based Key Derivation Function 2' },
    { name: 'HMAC-SHA256', type: 'Message Authentication', status: 'enabled', security: 'secure', description: 'Hash-based Message Authentication Code with SHA-256' },
  ];

  const protocols = [
    { name: 'TLS 1.3', type: 'Transport Security', status: 'enabled', security: 'secure', description: 'Transport Layer Security version 1.3' },
    { name: 'TLS 1.2', type: 'Transport Security', status: 'enabled', security: 'secure', description: 'Transport Layer Security version 1.2' },
    { name: 'HTTPS', type: 'Application Protocol', status: 'enabled', security: 'secure', description: 'HTTP over TLS/SSL' },
    { name: 'SSH-2', type: 'Remote Access', status: 'enabled', security: 'secure', description: 'Secure Shell Protocol version 2' },
    { name: 'OAuth 2.0', type: 'Authorization', status: 'enabled', security: 'secure', description: 'Open Authorization framework' },
    { name: 'JWT', type: 'Token Format', status: 'enabled', security: 'secure', description: 'JSON Web Token' },
    { name: 'SAML 2.0', type: 'Authentication', status: 'supported', security: 'secure', description: 'Security Assertion Markup Language' },
    { name: 'SSL 3.0', type: 'Transport Security', status: 'deprecated', security: 'vulnerable', description: 'Secure Sockets Layer 3.0 (deprecated)' },
    { name: 'TLS 1.0', type: 'Transport Security', status: 'deprecated', security: 'weak', description: 'Transport Layer Security 1.0 (deprecated)' },
    { name: 'TLS 1.1', type: 'Transport Security', status: 'deprecated', security: 'weak', description: 'Transport Layer Security 1.1 (deprecated)' },
    // Add more protocols
    { name: 'WebSocket Secure', type: 'Transport Security', status: 'enabled', security: 'secure', description: 'WebSocket over TLS' },
    { name: 'gRPC', type: 'RPC Protocol', status: 'enabled', security: 'secure', description: 'Google Remote Procedure Call' },
  ];

  return { algorithms: cryptoAlgorithms, protocols };
};

export const AlgorithmsProtocolsCard: React.FC<AlgorithmsProtocolsCardProps> = ({ component }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [securityFilter, setSecurityFilter] = useState('all');

  const { algorithms, protocols } = useMemo(() => 
    generateMockAlgorithmsProtocols(component.name), 
    [component.name]
  );

  const filterItems = (items: any[]) => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesSecurity = securityFilter === 'all' || item.security === securityFilter;
      
      return matchesSearch && matchesStatus && matchesSecurity;
    });
  };

  const filteredAlgorithms = filterItems(algorithms);
  const filteredProtocols = filterItems(protocols);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enabled':
        return <Badge className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="h-3 w-3 mr-1" />Enabled</Badge>;
      case 'supported':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300"><Shield className="h-3 w-3 mr-1" />Supported</Badge>;
      case 'deprecated':
        return <Badge className="bg-red-100 text-red-800 border-red-300"><XCircle className="h-3 w-3 mr-1" />Deprecated</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSecurityBadge = (security: string) => {
    switch (security) {
      case 'secure':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Secure</Badge>;
      case 'weak':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300"><AlertTriangle className="h-3 w-3 mr-1" />Weak</Badge>;
      case 'vulnerable':
        return <Badge className="bg-red-100 text-red-800 border-red-300"><AlertTriangle className="h-3 w-3 mr-1" />Vulnerable</Badge>;
      default:
        return <Badge variant="outline">{security}</Badge>;
    }
  };

  const renderItemsList = (items: any[], title: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title} ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    {getSecurityBadge(item.security)}
                  </div>
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  <Badge variant="outline" className="text-xs">{item.type}</Badge>
                </div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Supported Algorithms & Protocols
        </CardTitle>
        <div className="text-sm text-gray-600">
          Cryptographic algorithms and security protocols supported by {component.name}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search algorithms, protocols, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Status</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  className="text-xs"
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === 'enabled' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('enabled')}
                  className="text-xs"
                >
                  Enabled
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === 'supported' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('supported')}
                  className="text-xs"
                >
                  Supported
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === 'deprecated' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('deprecated')}
                  className="text-xs"
                >
                  Deprecated
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Security</label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={securityFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setSecurityFilter('all')}
                  className="text-xs"
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={securityFilter === 'secure' ? 'default' : 'outline'}
                  onClick={() => setSecurityFilter('secure')}
                  className="text-xs"
                >
                  Secure
                </Button>
                <Button
                  size="sm"
                  variant={securityFilter === 'weak' ? 'default' : 'outline'}
                  onClick={() => setSecurityFilter('weak')}
                  className="text-xs"
                >
                  Weak
                </Button>
                <Button
                  size="sm"
                  variant={securityFilter === 'vulnerable' ? 'default' : 'outline'}
                  onClick={() => setSecurityFilter('vulnerable')}
                  className="text-xs"
                >
                  Vulnerable
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Algorithms and Protocols Tabs */}
        <Tabs defaultValue="algorithms" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="algorithms">
              Algorithms ({filteredAlgorithms.length})
            </TabsTrigger>
            <TabsTrigger value="protocols">
              Protocols ({filteredProtocols.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="algorithms" className="mt-4">
            {renderItemsList(filteredAlgorithms, 'Cryptographic Algorithms')}
          </TabsContent>

          <TabsContent value="protocols" className="mt-4">
            {renderItemsList(filteredProtocols, 'Security Protocols')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
