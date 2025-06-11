
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, Key, FileKey, Lightbulb } from 'lucide-react';

interface CryptoMaterialsSearchProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

const EXAMPLE_QUERIES = [
  "Find all certificates issued by DigiCert",
  "Show me keys with length 2048 bits",
  "List certificates expiring in the next 30 days",
  "Find all RSA certificates across applications",
  "Show me self-signed certificates",
  "Find certificates using SHA-256 signature algorithm",
  "List all expired certificates",
  "Show me certificates used in production environments"
];

export const CryptoMaterialsSearch: React.FC<CryptoMaterialsSearchProps> = ({
  onSearch,
  loading
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-green-600" />
          Crypto Materials Search
        </CardTitle>
        <p className="text-sm text-gray-600">
          Search for certificates, keys, and other cryptographic materials across your infrastructure
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search Query</label>
            <Textarea
              placeholder="e.g., Find all certificates issued by DigiCert or Show me keys with length 2048..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
          
          <Button 
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            {loading ? 'Searching...' : 'Search Materials'}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Lightbulb className="h-4 w-4" />
            Example Searches
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {EXAMPLE_QUERIES.map((example, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer p-2 text-xs hover:bg-green-50 hover:border-green-300 text-left justify-start h-auto whitespace-normal"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </Badge>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <FileKey className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 mb-1">What you can search for:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• <strong>Certificates:</strong> By issuer, expiration, algorithm, key size</li>
                <li>• <strong>Keys:</strong> By type, length, usage, location</li>
                <li>• <strong>Relationships:</strong> Cross-application usage patterns</li>
                <li>• <strong>Compliance:</strong> Standards adherence and policy violations</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
