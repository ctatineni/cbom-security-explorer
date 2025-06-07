
import React from 'react';
import { ChevronRight, Home, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface CBOMBreadcrumbProps {
  items: BreadcrumbItem[];
}

export const CBOMBreadcrumb: React.FC<CBOMBreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-4">
      <Home className="h-4 w-4" />
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.onClick ? (
            <Button
              variant="ghost"
              size="sm"
              className={`h-auto p-1 text-sm ${
                item.active ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={item.onClick}
            >
              {item.label}
            </Button>
          ) : (
            <span className={item.active ? 'text-blue-600 font-medium' : 'text-gray-600'}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
