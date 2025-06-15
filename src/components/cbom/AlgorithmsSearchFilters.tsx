
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface AlgorithmsSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  securityFilter: string;
  onSecurityFilterChange: (value: string) => void;
  hideStatusFilter?: boolean;
}

export const AlgorithmsSearchFilters: React.FC<AlgorithmsSearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  securityFilter,
  onSecurityFilterChange,
  hideStatusFilter = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Label htmlFor="search" className="text-sm font-medium">
          Search
        </Label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Search algorithms, protocols..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {!hideStatusFilter && (
        <div className="w-32">
          <Label htmlFor="status-filter" className="text-sm font-medium">
            Status
          </Label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger id="status-filter" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="enabled">Enabled</SelectItem>
              <SelectItem value="supported">Supported</SelectItem>
              <SelectItem value="deprecated">Deprecated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="w-32">
        <Label htmlFor="security-filter" className="text-sm font-medium">
          Security
        </Label>
        <Select value={securityFilter} onValueChange={onSecurityFilterChange}>
          <SelectTrigger id="security-filter" className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="secure">Secure</SelectItem>
            <SelectItem value="weak">Weak</SelectItem>
            <SelectItem value="vulnerable">Vulnerable</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
