
export interface AlgorithmProtocolStrings {
  enabledAlgorithms: string;
  supportedAlgorithms: string;
  enabledProtocols: string;
  supportedProtocols: string;
}

export interface ComponentAlgorithmsProtocols {
  componentName: string;
  componentType: 'library' | 'language';
  version?: string;
  algorithmProtocolStrings: AlgorithmProtocolStrings;
  // Detailed arrays for UI display
  algorithms: Array<{
    name: string;
    type: string;
    status: 'enabled' | 'supported' | 'deprecated';
    security: 'secure' | 'weak' | 'vulnerable';
    description: string;
    source: string;
    usageContext: string;
    version?: string;
    keySize?: number;
  }>;
  protocols: Array<{
    name: string;
    type: string;
    status: 'enabled' | 'supported' | 'deprecated';
    security: 'secure' | 'weak' | 'vulnerable';
    description: string;
    source: string;
    usageContext: string;
    version?: string;
    port?: number;
  }>;
}

export interface CBOMAlgorithmsProtocolsResponse {
  serviceName: string;
  serviceType: string;
  programmingLanguage: string;
  framework?: string;
  lastAnalyzed: string;
  // All components with their algorithm/protocol data
  components: ComponentAlgorithmsProtocols[];
  // Service-level summary strings
  serviceAlgorithmProtocolStrings: AlgorithmProtocolStrings;
  riskSummary: {
    totalAlgorithms: number;
    totalProtocols: number;
    secureCount: number;
    weakCount: number;
    vulnerableCount: number;
    overallRiskLevel: 'low' | 'medium' | 'high';
  };
}

export const filterAlgorithmsAndProtocols = (data: ComponentAlgorithmsProtocols, filter: string) => {
  if (!data || filter === 'all') return data;

  const filterItems = (items: any[]) => {
    if (filter === 'enabled') {
      return items.filter(item => item.status === 'enabled');
    }
    if (filter === 'supported') {
      return items.filter(item => item.status === 'enabled' || item.status === 'supported');
    }
    return items;
  };

  return {
    ...data,
    algorithms: filterItems(data.algorithms || []),
    protocols: filterItems(data.protocols || [])
  };
};

// Helper function to parse algorithm/protocol strings back to arrays if needed
export const parseAlgorithmProtocolStrings = (strings: AlgorithmProtocolStrings) => {
  return {
    enabledAlgorithms: strings.enabledAlgorithms.split(',').map(s => s.trim()).filter(s => s),
    supportedAlgorithms: strings.supportedAlgorithms.split(',').map(s => s.trim()).filter(s => s),
    enabledProtocols: strings.enabledProtocols.split(',').map(s => s.trim()).filter(s => s),
    supportedProtocols: strings.supportedProtocols.split(',').map(s => s.trim()).filter(s => s)
  };
};
