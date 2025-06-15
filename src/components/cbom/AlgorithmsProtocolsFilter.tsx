
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AlgorithmsProtocolsFilterProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const AlgorithmsProtocolsFilter: React.FC<AlgorithmsProtocolsFilterProps> = ({
  value,
  onValueChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="algo-filter" className="text-sm font-medium">
        Show:
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="algo-filter" className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="enabled">Enabled</SelectItem>
          <SelectItem value="supported">Supported</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
