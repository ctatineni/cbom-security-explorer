
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface CBOMRecommendationsProps {
  recommendations: string[];
}

export const CBOMRecommendations: React.FC<CBOMRecommendationsProps> = ({ 
  recommendations 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-sm space-y-1">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
