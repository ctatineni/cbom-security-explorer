
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, GitBranch, Clock, Lightbulb, Package, Code } from 'lucide-react';

interface NaturalLanguageSearchProps {
  onSearch: (query: string) => void;
  onGitHubScan: (url: string) => void;
  loading: boolean;
  analysisType?: 'libraries' | 'languages';
}

const EXAMPLE_QUERIES = {
  libraries: [
    "Show me all services using deprecated encryption libraries",
    "Find high-risk libraries in the payment processing module",
    "List libraries using RSA-2048 with medium or high risk levels",
    "Show libraries that use both AES-256 and SHA-256",
    "Find all services with OpenSSL vulnerabilities",
    "Display libraries used across the most applications",
  ],
  languages: [
    "Show me all programming languages using crypto functions",
    "Find Python services with encryption capabilities",
    "List Java applications with cryptographic libraries",
    "Show Node.js services using deprecated crypto",
    "Find all C++ services with custom encryption",
    "Display language distribution across applications",
  ]
};

const EXAMPLE_GITHUB_URLS = [
  "https://github.com/username/repo-name",
  "https://github.com/company/microservices-app",
  "https://github.com/org/crypto-service",
];

export const NaturalLanguageSearch: React.FC<NaturalLanguageSearchProps> = ({
  onSearch,
  onGitHubScan,
  loading,
  analysisType = 'libraries'
}) => {
  const [query, setQuery] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [showGitHubInput, setShowGitHubInput] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleGitHubScan = () => {
    if (githubUrl.trim()) {
      onGitHubScan(githubUrl.trim());
      setShowGitHubInput(false);
      setGithubUrl('');
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  const currentExamples = EXAMPLE_QUERIES[analysisType];
  const analysisTypeLabel = analysisType === 'libraries' ? 'Libraries' : 'Programming Languages';
  const analysisIcon = analysisType === 'libraries' ? Package : Code;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          AI-Powered CBOM Analysis
          <Badge variant="outline" className="ml-2 flex items-center gap-1">
            {React.createElement(analysisIcon, { className: "h-3 w-3" })}
            {analysisTypeLabel}
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Ask natural language questions about your cryptographic {analysisType} or scan a GitHub repository
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Natural Language Search */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Natural Language Query</label>
            <Textarea
              placeholder={`e.g., Show me all ${analysisType} using deprecated algorithms with high risk...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowGitHubInput(!showGitHubInput)}
              className="flex items-center gap-2"
            >
              <GitBranch className="h-4 w-4" />
              Scan GitHub Repo
            </Button>
          </div>
        </div>

        {/* GitHub URL Input */}
        {showGitHubInput && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium">GitHub Repository URL</label>
              <Textarea
                placeholder="https://github.com/username/repository-name"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded">
              <Clock className="h-4 w-4" />
              <span>Repository analysis takes approximately 30 minutes to complete</span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleGitHubScan}
                disabled={!githubUrl.trim()}
                size="sm"
              >
                Start Scan
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowGitHubInput(false)}
                size="sm"
              >
                Cancel
              </Button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600">Example URLs:</div>
              <div className="flex flex-wrap gap-1">
                {EXAMPLE_GITHUB_URLS.map((url, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer text-xs"
                    onClick={() => setGithubUrl(url)}
                  >
                    {url}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Example Queries */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Lightbulb className="h-4 w-4" />
            Example Queries for {analysisTypeLabel}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentExamples.map((example, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer p-2 text-xs hover:bg-blue-50 hover:border-blue-300 text-left justify-start h-auto whitespace-normal"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
