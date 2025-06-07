
import React, { useMemo, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter, Code, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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

interface VirtualizedServicesGridProps {
  services: Service[];
  selectedService: Service | null;
  onServiceSelect: (service: Service) => void;
  onServiceDetails: (service: Service) => void;
}

const ITEM_WIDTH = 340;
const ITEM_HEIGHT = 220;
const GAP = 16;

export const VirtualizedServicesGrid: React.FC<VirtualizedServicesGridProps> = ({
  services,
  selectedService,
  onServiceSelect,
  onServiceDetails
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [pqcFilter, setPqcFilter] = useState<string>('all');

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (service.programmingLanguage?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRisk = riskFilter === 'all' || service.riskLevel === riskFilter;
      const matchesPqc = pqcFilter === 'all' || 
                        (pqcFilter === 'compatible' && service.pqcCompatible) ||
                        (pqcFilter === 'needs-migration' && !service.pqcCompatible);
      return matchesSearch && matchesRisk && matchesPqc;
    });
  }, [services, searchTerm, riskFilter, pqcFilter]);

  const containerWidth = Math.min(window.innerWidth - 100, 1200);
  const itemsPerRow = Math.floor(containerWidth / (ITEM_WIDTH + GAP));
  const rowCount = Math.ceil(filteredServices.length / itemsPerRow);

  const ServiceCard = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * itemsPerRow + columnIndex;
    const service = filteredServices[index];

    if (!service) return null;

    const getRiskColor = (risk: string) => {
      switch (risk) {
        case 'high': return 'border-red-200 bg-red-50';
        case 'medium': return 'border-yellow-200 bg-yellow-50';
        default: return 'border-green-200 bg-green-50';
      }
    };

    return (
      <div style={{
        ...style,
        left: style.left + GAP / 2,
        top: style.top + GAP / 2,
        width: style.width - GAP,
        height: style.height - GAP,
      }}>
        <Card 
          className={`cursor-pointer transition-all h-full hover:shadow-md ${
            selectedService?.id === service.id 
              ? 'border-blue-500 bg-blue-50 shadow-md' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onServiceSelect(service)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-sm truncate mb-1">{service.name}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>v{service.version}</span>
                  {service.programmingLanguage && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Code className="h-3 w-3" />
                        <span>{service.programmingLanguage}</span>
                        {service.languageVersion && <span>({service.languageVersion})</span>}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  service.riskLevel === 'high' ? 'bg-red-500' :
                  service.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                {service.pqcCompatible !== undefined && (
                  <div className="flex items-center">
                    {service.pqcCompatible ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 text-yellow-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <p className="text-xs text-gray-600 line-clamp-2">{service.description}</p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Risk Level:</span>
                <span className={`capitalize font-medium ${
                  service.riskLevel === 'high' ? 'text-red-600' :
                  service.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {service.riskLevel}
                </span>
              </div>
              
              {service.pqcCompatible !== undefined && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">PQC Status:</span>
                  <span className={`font-medium ${
                    service.pqcCompatible ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {service.pqcCompatible ? 'Ready' : 'Needs Migration'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">
                {service.cryptoAlgorithms.length} algos
              </Badge>
              <Badge variant="outline" className="text-xs">
                {service.libraries.length} libs
              </Badge>
            </div>

            <div className="flex gap-1 pt-1">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 text-xs h-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onServiceDetails(service);
                }}
              >
                Details
              </Button>
              {!service.pqcCompatible && (
                <Button 
                  size="sm" 
                  className="flex-1 text-xs h-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onServiceDetails(service);
                  }}
                >
                  Migration Plan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search services, languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'low', 'medium', 'high'].map((risk) => (
            <Button
              key={risk}
              variant={riskFilter === risk ? "default" : "outline"}
              size="sm"
              onClick={() => setRiskFilter(risk)}
            >
              {risk === 'all' ? 'All Risk' : `${risk.charAt(0).toUpperCase()}${risk.slice(1)}`}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All PQC' },
            { key: 'compatible', label: 'PQC Ready' },
            { key: 'needs-migration', label: 'Needs Migration' }
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={pqcFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setPqcFilter(filter.key)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 flex items-center justify-between">
        <span>Showing {filteredServices.length} of {services.length} services</span>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span>PQC Ready</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-yellow-500" />
            <span>Needs Migration</span>
          </div>
        </div>
      </div>

      {filteredServices.length > 0 ? (
        <Grid
          columnCount={itemsPerRow}
          columnWidth={ITEM_WIDTH + GAP}
          height={Math.min(600, rowCount * (ITEM_HEIGHT + GAP))}
          rowCount={rowCount}
          rowHeight={ITEM_HEIGHT + GAP}
          width={containerWidth}
        >
          {ServiceCard}
        </Grid>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium mb-2">No services found</h3>
          <p className="text-sm">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};
