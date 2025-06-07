
import React, { useMemo, useState } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
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
}

interface VirtualizedServicesGridProps {
  services: Service[];
  selectedService: Service | null;
  onServiceSelect: (service: Service) => void;
}

const ITEM_WIDTH = 320;
const ITEM_HEIGHT = 180;
const GAP = 16;

export const VirtualizedServicesGrid: React.FC<VirtualizedServicesGridProps> = ({
  services,
  selectedService,
  onServiceSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'all' || service.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [services, searchTerm, riskFilter]);

  const containerWidth = Math.min(window.innerWidth - 100, 1200);
  const itemsPerRow = Math.floor(containerWidth / (ITEM_WIDTH + GAP));
  const rowCount = Math.ceil(filteredServices.length / itemsPerRow);

  const ServiceCard = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * itemsPerRow + columnIndex;
    const service = filteredServices[index];

    if (!service) return null;

    return (
      <div style={{
        ...style,
        left: style.left + GAP / 2,
        top: style.top + GAP / 2,
        width: style.width - GAP,
        height: style.height - GAP,
      }}>
        <Card 
          className={`cursor-pointer transition-all h-full ${
            selectedService?.id === service.id 
              ? 'border-blue-500 bg-blue-50 shadow-md' 
              : 'hover:bg-gray-50 hover:shadow-sm'
          }`}
          onClick={() => onServiceSelect(service)}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm truncate">{service.name}</CardTitle>
            <div className="text-xs text-gray-500">v{service.version}</div>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <p className="text-xs text-gray-600 line-clamp-2">{service.description}</p>
            <div className="flex items-center justify-between">
              <div className={`w-2 h-2 rounded-full ${
                service.riskLevel === 'high' ? 'bg-red-500' :
                service.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-xs capitalize">{service.riskLevel}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">
                {service.cryptoAlgorithms.length} algos
              </Badge>
              <Badge variant="outline" className="text-xs">
                {service.libraries.length} libs
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search services..."
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
              {risk === 'all' ? 'All' : `${risk.charAt(0).toUpperCase()}${risk.slice(1)} Risk`}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        Showing {filteredServices.length} of {services.length} services
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
          No services found matching your criteria
        </div>
      )}
    </div>
  );
};
