
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlgorithmProtocolItem } from './AlgorithmProtocolItem';

interface AlgorithmsProtocolsListProps {
  items: Array<{
    name: string;
    type: string;
    status: string;
    security: string;
    description: string;
  }>;
  title: string;
}

export const AlgorithmsProtocolsList: React.FC<AlgorithmsProtocolsListProps> = ({ items, title }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title} ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {items.map((item, index) => (
              <AlgorithmProtocolItem key={index} item={item} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
