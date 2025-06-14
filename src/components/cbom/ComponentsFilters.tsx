
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface ComponentsFiltersProps {
  searchFilter: string;
  setSearchFilter: (value: string) => void;
  componentTypeFilter: 'all' | 'libraries' | 'languages';
  setComponentTypeFilter: (value: 'all' | 'libraries' | 'languages') => void;
  minApplicationsFilter: string;
  setMinApplicationsFilter: (value: string) => void;
  onClear: () => void;
}

export const ComponentsFilters: React.FC<ComponentsFiltersProps> = ({
  searchFilter,
  setSearchFilter,
  componentTypeFilter,
  setComponentTypeFilter,
  minApplicationsFilter,
  setMinApplicationsFilter,
  onClear
}) => {
  return (
    <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <label className="text-sm font-medium mb-2 block">Search Components</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search components or applications..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="w-48">
        <label className="text-sm font-medium mb-2 block">Component Type</label>
        <select
          value={componentTypeFilter}
          onChange={(e) => setComponentTypeFilter(e.target.value as 'all' | 'libraries' | 'languages')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="all">All Components</option>
          <option value="libraries">Libraries Only</option>
          <option value="languages">Languages Only</option>
        </select>
      </div>
      <div className="w-48">
        <label className="text-sm font-medium mb-2 block">Min Applications</label>
        <Input
          type="number"
          placeholder="e.g., 5"
          value={minApplicationsFilter}
          onChange={(e) => setMinApplicationsFilter(e.target.value)}
        />
      </div>
      <div className="flex items-end">
        <Button
          variant="outline"
          onClick={onClear}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
};
