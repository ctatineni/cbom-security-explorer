export interface Application {
  id: string;
  name: string;
  version: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  lastAnalyzed: string;
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  version: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  cryptoAlgorithms: string[];
  libraries: string[];
  programmingLanguage?: string;
  languageVersion?: string;
  pqcCompatible?: boolean;
  applicationId: string;
}

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

export interface CBOMData {
  applications: Application[];
  cryptoAlgorithms: CryptoAlgorithm[];
  libraries: Library[];
  metrics: {
    secure: number;
    warnings: number;
    critical: number;
  };
}

// Generate mock applications with services
const generateMockApplications = (): Application[] => {
  const applications: Application[] = [];
  const appNames = ['E-Commerce Platform', 'Banking System', 'Healthcare Portal', 'IoT Management'];
  const riskLevels = ['low', 'medium', 'high'] as const;
  
  appNames.forEach((appName, appIndex) => {
    const serviceCount = Math.floor(Math.random() * 15) + 5; // 5-20 services per app
    const services: Service[] = [];
    
    for (let i = 0; i < serviceCount; i++) {
      const serviceTypes = ['Auth', 'Payment', 'Data', 'API', 'Cache', 'Storage', 'Analytics', 'Notification'];
      const languages = ['Java', 'Python', 'JavaScript', 'C#', 'Go', 'Rust', 'C++'];
      const type = serviceTypes[i % serviceTypes.length];
      const language = languages[Math.floor(Math.random() * languages.length)];
      const pqcCompatible = Math.random() > 0.4;
      
      services.push({
        id: `app-${appIndex}-service-${i}`,
        name: `${type} Service ${Math.floor(i / serviceTypes.length) + 1}`,
        version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        description: `${appName} ${type.toLowerCase()} service handling critical operations`,
        riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        cryptoAlgorithms: ['aes-256', 'rsa-2048', 'sha-256'].slice(0, Math.floor(Math.random() * 3) + 1),
        libraries: ['openssl', 'bouncy-castle'].slice(0, Math.floor(Math.random() * 2) + 1),
        programmingLanguage: language,
        languageVersion: language === 'Java' ? '11' : language === 'Python' ? '3.9' : '14.0',
        pqcCompatible,
        applicationId: `app-${appIndex}`
      });
    }
    
    applications.push({
      id: `app-${appIndex}`,
      name: appName,
      version: `${Math.floor(Math.random() * 3) + 1}.0.0`,
      description: `Enterprise ${appName.toLowerCase()} with comprehensive security features`,
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      lastAnalyzed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      services
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
  },
  cryptoAlgorithms: [
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
        },
        {
          file: "src/payment/secure.js", 
          line: 23,
          function: "encryptPaymentInfo",
          usage: "crypto.createCipher('aes-256-cbc', key)"
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
        },
        {
          file: "src/payment/signatures.js",
          line: 67,
          function: "signTransaction",
          usage: "crypto.sign('sha256', data, privateKey)"
        }
      ],
      recommendations: [
        "Migrate to RSA-4096 or ECC for future-proofing",
        "Implement proper certificate validation"
      ]
    },
    {
      id: "sha-256",
      name: "SHA-256",
      type: "Hash Function",
      keySize: "256-bit",
      riskLevel: "low",
      deprecated: false,
      purpose: "Data integrity verification and password hashing",
      usageLocations: [
        {
          file: "src/auth/password.js",
          line: 34,
          function: "hashPassword",
          usage: "crypto.createHash('sha256').update(password).digest('hex')"
        },
        {
          file: "src/data/integrity.js",
          line: 18,
          function: "verifyChecksum",
          usage: "crypto.createHash('sha256').update(fileData)"
        }
      ],
      recommendations: [
        "Use with proper salting for password storage",
        "Consider SHA-3 for new implementations"
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
    },
    {
      id: "des",
      name: "DES",
      type: "Symmetric Encryption",
      keySize: "56-bit",
      riskLevel: "high",
      deprecated: true,
      purpose: "Legacy encryption (deprecated)",
      usageLocations: [
        {
          file: "src/payment/legacy.js",
          line: 156,
          function: "oldEncrypt",
          usage: "crypto.createCipher('des', key)"
        }
      ],
      recommendations: [
        "Replace with AES-256 immediately",
        "Critical security vulnerability"
      ]
    }
  ],
  libraries: [
    {
      id: "openssl",
      name: "OpenSSL",
      version: "3.0.7",
      license: "Apache 2.0",
      hasVulnerabilities: false,
      algorithms: ["aes-256", "rsa-2048", "sha-256"],
      lastUpdated: "2023-11-01",
      usageLocations: [
        {
          file: "package.json",
          line: 23,
          context: "Production dependency"
        },
        {
          file: "src/crypto/provider.js",
          line: 5,
          context: "const crypto = require('crypto')"
        }
      ],
      functions: [
        {
          name: "crypto.createHash",
          usedIn: ["src/auth/password.js", "src/data/integrity.js"],
          purpose: "Hash generation"
        },
        {
          name: "crypto.createCipher",
          usedIn: ["src/payment/secure.js"],
          purpose: "Symmetric encryption"
        }
      ]
    },
    {
      id: "bouncy-castle",
      name: "Bouncy Castle",
      version: "1.70",
      license: "MIT",
      hasVulnerabilities: true,
      algorithms: ["aes-256", "rsa-2048"],
      lastUpdated: "2023-05-15",
      usageLocations: [
        {
          file: "src/auth/advanced.js",
          line: 8,
          context: "const BC = require('node-bouncy-castle')"
        }
      ],
      functions: [
        {
          name: "BC.encrypt",
          usedIn: ["src/auth/advanced.js"],
          purpose: "Advanced encryption operations"
        }
      ]
    },
    {
      id: "legacy-crypto",
      name: "Legacy Crypto Lib",
      version: "1.2.3",
      license: "GPL",
      hasVulnerabilities: true,
      algorithms: ["md5", "des"],
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
        },
        {
          name: "legacyCrypto.des",
          usedIn: ["src/payment/legacy.js"],
          purpose: "Legacy encryption"
        }
      ]
    }
  ]
};
