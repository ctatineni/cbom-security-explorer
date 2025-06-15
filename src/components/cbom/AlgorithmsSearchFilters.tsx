
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface AlgorithmsSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  securityFilter: string;
  onSecurityFilterChange: (value: string) => void;
}

export const AlgorithmsSearchFilters: React.FC<AlgorithmsSearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  securityFilter,
  onSecurityFilterChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search algorithms, protocols, or descriptions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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
              onClick={() => onStatusFilterChange('all')}
              className="text-xs"
            >
              All
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'enabled' ? 'default' : 'outline'}
              onClick={() => onStatusFilterChange('enabled')}
              className="text-xs"
            >
              Enabled
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'supported' ? 'default' : 'outline'}
              onClick={() => onStatusFilterChange('supported')}
              className="text-xs"
            >
              Supported
            </Button>
            <Button
              size="sm"
              variant={statusFilter === 'deprecated' ? 'default' : 'outline'}
              onClick={() => onStatusFilterChange('deprecated')}
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
              onClick={() => onSecurityFilterChange('all')}
              className="text-xs"
            >
              All
            </Button>
            <Button
              size="sm"
              variant={securityFilter === 'secure' ? 'default' : 'outline'}
              onClick={() => onSecurityFilterChange('secure')}
              className="text-xs"
            >
              Secure
            </Button>
            <Button
              size="sm"
              variant={securityFilter === 'weak' ? 'default' : 'outline'}
              onClick={() => onSecurityFilterChange('weak')}
              className="text-xs"
            >
              Weak
            </Button>
            <Button
              size="sm"
              variant={securityFilter === 'vulnerable' ? 'default' : 'outline'}
              onClick={() => onSecurityFilterChange('vulnerable')}
              className="text-xs"
            >
              Vulnerable
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
