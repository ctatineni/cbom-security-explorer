
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Server, Package, Monitor, Box, Cloud, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Host } from '@/data/mockCBOMData';

interface HostsGridProps {
  hosts: Host[];
  onHostSelect: (host: Host) => void;
  selectedHost?: Host | null;
}

export const HostsGrid: React.FC<HostsGridProps> = ({ hosts, onHostSelect, selectedHost }) => {
  const getHostIcon = (type: string) => {
    switch (type) {
      case 'vm': return Monitor;
      case 'container': return Box;
      case 'kubernetes-pod': return Cloud;
      case 'bare-metal': return Server;
      default: return Server;
    }
  };

  const getHostTypeLabel = (type: string) => {
    switch (type) {
      case 'vm': return 'Virtual Machine';
      case 'container': return 'Container';
      case 'kubernetes-pod': return 'Kubernetes Pod';
      case 'bare-metal': return 'Bare Metal';
      default: return type;
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <AlertTriangle className="h-3 w-3" />;
      case 'low': return <CheckCircle className="h-3 w-3" />;
      default: return <CheckCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {hosts.map((host) => {
        const HostIcon = getHostIcon(host.type);
        const isSelected = selectedHost?.id === host.id;
        
        return (
          <Card 
            key={host.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
            }`}
            onClick={() => onHostSelect(host)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HostIcon className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm font-medium truncate">{host.name}</CardTitle>
                </div>
                <Badge variant={getRiskBadgeVariant(host.riskLevel)} className="text-xs">
                  {getRiskIcon(host.riskLevel)}
                  {host.riskLevel.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium">{getHostTypeLabel(host.type)}</span>
                </div>
                
                {host.ipAddress && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">IP Address:</span>
                    <span className="font-mono text-xs">{host.ipAddress}</span>
                  </div>
                )}
                
                {host.operatingSystem && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">OS:</span>
                    <span className="text-xs truncate">{host.operatingSystem}</span>
                  </div>
                )}
                
                {host.containerImage && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Image:</span>
                    <span className="font-mono text-xs truncate">{host.containerImage}</span>
                  </div>
                )}
                
                {host.kubernetesNamespace && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Namespace:</span>
                    <span className="text-xs">{host.kubernetesNamespace}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    Libraries:
                  </span>
                  <span className="font-medium">{host.libraries.length}</span>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Last Scan:
                  </span>
                  <span className="text-xs">{host.lastScanned}</span>
                </div>
              </div>
              
              <Button 
                variant={isSelected ? "default" : "outline"} 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onHostSelect(host);
                }}
              >
                {isSelected ? "Selected" : "View Details"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
