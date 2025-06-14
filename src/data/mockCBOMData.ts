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
  languageVersion?: string;
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

// Sample crypto algorithms
const sampleCryptoAlgorithms: CryptoAlgorithm[] = [
  {
    id: "aes-256",
    name: "AES-256",
    type: "Symmetric Encryption",
    keySize: "256-bit",
    riskLevel: "low",
    deprecated: false,
    purpose: "Primary encryption for sensitive data storage and transmission",
    usageLocations: [
      {
        file: "src/auth/encryption.js",
        line: 45,
        function: "encryptUserData",
        usage: "AES.encrypt(userData, secretKey)"
      }
    ],
    recommendations: [
      "Consider using AES-GCM mode for authenticated encryption",
      "Ensure proper key rotation policies are in place"
    ]
  },
  {
    id: "rsa-2048",
    name: "RSA-2048",
    type: "Asymmetric Encryption",
    keySize: "2048-bit",
    riskLevel: "medium",
    deprecated: false,
    purpose: "Key exchange and digital signatures",
    usageLocations: [
      {
        file: "src/auth/keyExchange.js",
        line: 12,
        function: "generateKeyPair",
        usage: "crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })"
      }
    ],
    recommendations: [
      "Migrate to RSA-4096 or ECC for future-proofing",
      "Implement proper certificate validation"
    ]
  },
  {
    id: "md5",
    name: "MD5",
    type: "Hash Function",
    keySize: "128-bit",
    riskLevel: "high",
    deprecated: true,
    purpose: "Legacy hash function (deprecated)",
    usageLocations: [
      {
        file: "src/legacy/oldHashing.js",
        line: 89,
        function: "legacyHash",
        usage: "crypto.createHash('md5').update(data).digest('hex')"
      }
    ],
    recommendations: [
      "Replace with SHA-256 or SHA-3 immediately",
      "Audit all usages and create migration plan"
    ]
  }
];

// Sample libraries
const sampleLibraries: Library[] = [
  {
    id: "openssl",
    name: "OpenSSL",
    version: "3.0.7",
    license: "Apache 2.0",
    hasVulnerabilities: false,
    algorithms: ["aes-256", "rsa-2048"],
    lastUpdated: "2023-11-01",
    usageLocations: [
      {
        file: "package.json",
        line: 23,
        context: "Production dependency"
      }
    ],
    functions: [
      {
        name: "crypto.createHash",
        usedIn: ["src/auth/password.js", "src/data/integrity.js"],
        purpose: "Hash generation"
      }
    ]
  },
  {
    id: "legacy-crypto",
    name: "Legacy Crypto Lib",
    version: "1.2.3",
    license: "GPL",
    hasVulnerabilities: true,
    algorithms: ["md5"],
    lastUpdated: "2019-03-10",
    usageLocations: [
      {
        file: "src/legacy/oldCrypto.js",
        line: 1,
        context: "const legacyCrypto = require('legacy-crypto-lib')"
      }
    ],
    functions: [
      {
        name: "legacyCrypto.md5",
        usedIn: ["src/legacy/oldHashing.js"],
        purpose: "Legacy hash functions"
      }
    ]
  }
];

// Sample code patterns
const sampleCodePatterns: CodePattern[] = [
  {
    id: "hardcoded-key-1",
    type: "anti-pattern",
    title: "Hardcoded Encryption Key",
    description: "Encryption key is hardcoded in source code, making it visible to anyone with access to the codebase",
    severity: "critical",
    category: "security",
    location: {
      file: "src/auth/encryption.js",
      line: 12,
      column: 15,
      function: "encryptData"
    },
    codeSnippet: "const secretKey = 'my-super-secret-key-123';",
    recommendation: "Use environment variables or a secure key management service",
    fixExample: "const secretKey = process.env.ENCRYPTION_KEY;"
  },
  {
    id: "weak-random-1",
    type: "security-issue",
    title: "Weak Random Number Generation",
    description: "Using Math.random() for cryptographic purposes is insecure",
    severity: "high",
    category: "cryptography",
    location: {
      file: "src/auth/tokens.js",
      line: 34,
      column: 8,
      function: "generateToken"
    },
    codeSnippet: "const token = Math.random().toString(36);",
    recommendation: "Use crypto.randomBytes() for cryptographically secure random generation",
    fixExample: "const token = crypto.randomBytes(32).toString('hex');"
  }
];

// Sample recommendations
const sampleRecommendations: Recommendation[] = [
  {
    id: "rec-1",
    title: "Migrate from MD5 to SHA-256",
    description: "Replace all MD5 hash functions with SHA-256 for better security",
    priority: "critical",
    category: "security",
    effort: "medium",
    impact: "high",
    actionItems: [
      "Identify all MD5 usage locations",
      "Create migration plan",
      "Update code to use SHA-256",
      "Test thoroughly"
    ],
    relatedPatterns: ["hardcoded-key-1"]
  },
  {
    id: "rec-2",
    title: "Implement Key Management System",
    description: "Set up proper key management to avoid hardcoded secrets",
    priority: "high",
    category: "security",
    effort: "high",
    impact: "high",
    actionItems: [
      "Evaluate key management solutions",
      "Implement environment variable system",
      "Update deployment processes",
      "Train development team"
    ],
    relatedPatterns: ["hardcoded-key-1"]
  }
];

// Generate mock hosts for applications
const generateMockHosts = (applicationId: string, appIndex: number): Host[] => {
  const hosts: Host[] = [];
  const hostCount = Math.floor(Math.random() * 5) + 2; // 2-6 hosts per app
  const hostTypes = ['vm', 'container', 'bare-metal', 'kubernetes-pod'] as const;
  const osTypes = ['Ubuntu 20.04', 'CentOS 8', 'Alpine Linux', 'Windows Server 2019', 'RHEL 8'];
  
  for (let i = 0; i < hostCount; i++) {
    const hostType = hostTypes[Math.floor(Math.random() * hostTypes.length)];
    const riskLevels = ['low', 'medium', 'high'] as const;
    
    // Randomly assign some libraries to each host
    const hostLibraries = sampleLibraries
      .filter(() => Math.random() > 0.5)
      .slice(0, Math.floor(Math.random() * 3) + 1);
    
    const host: Host = {
      id: `host-${applicationId}-${i}`,
      name: `${hostType}-${i + 1}`,
      type: hostType,
      description: `${hostType.charAt(0).toUpperCase() + hostType.slice(1)} hosting application components`,
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      applicationId,
      libraries: hostLibraries,
      lastScanned: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ipAddress: `192.168.${appIndex + 1}.${i + 10}`,
      operatingSystem: osTypes[Math.floor(Math.random() * osTypes.length)]
    };
    
    if (hostType === 'container') {
      host.containerImage = `app-${appIndex}:${Math.floor(Math.random() * 10) + 1}.0`;
    }
    
    if (hostType === 'kubernetes-pod') {
      host.kubernetesNamespace = `app-${appIndex}-ns`;
    }
    
    hosts.push(host);
  }
  
  return hosts;
};

// Generate mock applications with the new structure
const generateMockApplications = (): Application[] => {
  const applications: Application[] = [];
  const appNames = ['E-Commerce Platform', 'Banking System', 'Healthcare Portal', 'IoT Management'];
  const riskLevels = ['low', 'medium', 'high'] as const;
  
  appNames.forEach((appName, appIndex) => {
    const serviceCount = Math.floor(Math.random() * 8) + 3; // 3-10 services per app
    const services: Service[] = [];
    
    for (let i = 0; i < serviceCount; i++) {
      const serviceTypes = ['Auth', 'Payment', 'Data', 'API', 'Cache', 'Storage', 'Analytics', 'Notification'];
      const languages = ['Java', 'Python', 'JavaScript', 'C#', 'Go', 'Rust', 'C++'];
      const type = serviceTypes[i % serviceTypes.length];
      const language = languages[Math.floor(Math.random() * languages.length)];
      const pqcCompatible = Math.random() > 0.4;
      
      // Randomly assign some algorithms, libraries, patterns, and recommendations to each service
      const serviceCryptoAlgorithms = sampleCryptoAlgorithms
        .filter(() => Math.random() > 0.3)
        .slice(0, Math.floor(Math.random() * 3) + 1);
      
      const serviceLibraries = sampleLibraries
        .filter(() => Math.random() > 0.4)
        .slice(0, Math.floor(Math.random() * 2) + 1);
      
      const serviceCodePatterns = sampleCodePatterns
        .filter(() => Math.random() > 0.5)
        .slice(0, Math.floor(Math.random() * 2) + 1);
      
      const serviceRecommendations = sampleRecommendations
        .filter(() => Math.random() > 0.4)
        .slice(0, Math.floor(Math.random() * 2) + 1);
      
      services.push({
        id: `app-${appIndex}-service-${i}`,
        name: `${type} Service ${Math.floor(i / serviceTypes.length) + 1}`,
        version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        description: `${appName} ${type.toLowerCase()} service handling critical operations`,
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        programmingLanguage: language,
        languageVersion: language === 'Java' ? '11' : language === 'Python' ? '3.9' : '14.0',
        pqcCompatible,
        applicationId: `app-${appIndex}`,
        cryptoAlgorithms: serviceCryptoAlgorithms,
        libraries: serviceLibraries,
        codePatterns: serviceCodePatterns,
        recommendations: serviceRecommendations
      });
    }
    
    const hosts = generateMockHosts(`app-${appIndex}`, appIndex);
    
    applications.push({
      id: `app-${appIndex}`,
      name: appName,
      version: `${Math.floor(Math.random() * 3) + 1}.0.0`,
      description: `Enterprise ${appName.toLowerCase()} with comprehensive security features`,
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      lastAnalyzed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      services,
      hosts
    });
  });
  
  return applications;
};

export const mockCBOMData: CBOMData = {
  applications: generateMockApplications(),
  metrics: {
    secure: 8,
    warnings: 3,
    critical: 2,
  }
};
