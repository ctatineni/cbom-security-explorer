
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Layers } from 'lucide-react';

interface ServiceTreeItemProps {
  service: {
    serviceName: string;
    applicationName: string;
    appId: string;
    usage: Array<{
      name: string;
      usedIn?: string[];
      purpose?: string;
      framework?: string;
    }>;
  };
  serviceIndex: number;
}

export const ServiceTreeItem: React.FC<ServiceTreeItemProps> = ({ service, serviceIndex }) => {
  const [isServiceExpanded, setIsServiceExpanded] = useState(false);

  const toggleService = () => {
    setIsServiceExpanded(!isServiceExpanded);
  };

  return (
    <div className="border rounded bg-white">
      <div className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Layers className="h-3 w-3 text-green-600 flex-shrink-0" />
            <span className="text-sm truncate">{service.serviceName}</span>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              {service.usage.length} library functions
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleService}
            className="h-6 px-2 flex-shrink-0"
          >
            {isServiceExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        </div>
        
        <Collapsible open={isServiceExpanded}>
          <CollapsibleContent>
            <div className="border-t mt-2 pt-2">
              <div className="space-y-1">
                {service.usage.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between items-center text-xs p-1 bg-gray-50 rounded">
                    <span className="font-mono truncate">{item.name}</span>
                    <span className="text-gray-500 flex-shrink-0 ml-2">
                      {item.purpose || 'Library'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};
