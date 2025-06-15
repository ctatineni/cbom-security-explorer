
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { AlgorithmsProtocolsFilter } from './AlgorithmsProtocolsFilter';

interface GraphControlsProps {
  title: string;
  filterValue: string;
  onFilterChange: (value: string) => void;
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  title,
  filterValue,
  onFilterChange
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <AlgorithmsProtocolsFilter
            value={filterValue}
            onValueChange={onFilterChange}
          />
        </div>
      </CardHeader>
    </Card>
  );
};
