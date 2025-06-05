
export const mockCBOMData = {
  application: {
    name: "SecureApp v2.1",
    version: "2.1.0",
    riskLevel: "medium",
    lastAnalyzed: "2024-01-15",
  },
  
  services: [
    {
      id: "auth-service",
      name: "Authentication Service",
      version: "1.3.0",
      description: "Handles user authentication and authorization",
      riskLevel: "low",
      cryptoAlgorithms: ["aes-256", "rsa-2048", "sha-256"],
      libraries: ["openssl", "bouncy-castle"]
    },
    {
      id: "payment-service", 
      name: "Payment Service",
      version: "2.0.1",
      description: "Processes payment transactions",
      riskLevel: "high",
      cryptoAlgorithms: ["aes-256", "rsa-2048", "des"],
      libraries: ["openssl", "legacy-crypto"]
    },
    {
      id: "data-service",
      name: "Data Processing Service", 
      version: "1.5.2",
      description: "Handles data storage and retrieval",
      riskLevel: "medium",
      cryptoAlgorithms: ["aes-256", "sha-256", "md5"],
      libraries: ["openssl", "bouncy-castle"]
    }
  ],
  
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
  ],

  certificates: [
    {
      id: "ssl-cert-1",
      name: "api.secureapp.com",
      issuer: "DigiCert",
      expiryDate: "2024-12-31",
      keySize: "2048-bit",
      algorithm: "RSA-SHA256"
    }
  ]
};
