
export interface CryptoAlgorithm {
  id: string;
  name: string;
  type: string;
  keySize: string;
  riskLevel: 'low' | 'medium' | 'high';
  deprecated: boolean;
  purpose: string;
  usageLocations: Array<{
    file: string;
    line: number;
    function: string;
    usage: string;
  }>;
  recommendations: string[];
}

export interface Library {
  id: string;
  name: string;
  version: string;
  license: string;
  hasVulnerabilities: boolean;
  algorithms: string[];
  lastUpdated: string;
  usageLocations: Array<{
    file: string;
    line: number;
    context: string;
  }>;
  functions: Array<{
    name: string;
    usedIn: string[];
    purpose: string;
  }>;
  enabledAlgorithms: string;
  enabledProtocols: string;
  supportedAlgorithms: string;
  supportedProtocols: string;
}

export interface ProgrammingLanguage {
  id: string;
  name: string;
  version: string;
  runtimeEnvironment?: string;
  enabledAlgorithms: string;
  enabledProtocols: string;
  supportedAlgorithms: string;
  supportedProtocols: string;
}

export interface CodePattern {
  id: string;
  type: 'anti-pattern' | 'best-practice' | 'deprecated' | 'security-issue';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'cryptography' | 'security' | 'performance' | 'maintainability';
  location: {
    file: string;
    line: number;
    column: number;
    function: string;
  };
  codeSnippet: string;
  recommendation: string;
  fixExample?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'security' | 'performance' | 'maintainability' | 'compliance';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  actionItems: string[];
  relatedPatterns: string[];
}

export interface Service {
  id: string;
  name: string;
  version: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  programmingLanguage?: string;
  languageVersion?: string; // Added missing property
  pqcCompatible?: boolean;
  applicationId: string;
  cryptoAlgorithms: CryptoAlgorithm[];
  libraries: Library[];
  recommendations: Recommendation[];
  codePatterns: CodePattern[];
}

export interface Host {
  id: string;
  name: string;
  type: 'vm' | 'container' | 'bare-metal' | 'kubernetes-pod';
  version?: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  applicationId: string;
  libraries: Library[];
  lastScanned: string;
  ipAddress?: string;
  operatingSystem?: string;
  containerImage?: string;
  kubernetesNamespace?: string;
  programmingLanguage?: string;
}

export interface Application {
  id: string;
  name: string;
  version: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  lastAnalyzed: string;
  services: Service[];
  hosts: Host[];
}

export interface CBOMData {
  applications: Application[];
  metrics: {
    secure: number;
    warnings: number;
    critical: number;
  };
}
