
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
      lastUpdated: "2023-11-01"
    },
    {
      id: "bouncy-castle",
      name: "Bouncy Castle",
      version: "1.70",
      license: "MIT",
      hasVulnerabilities: true,
      algorithms: ["aes-256", "rsa-2048"],
      lastUpdated: "2023-05-15"
    },
    {
      id: "legacy-crypto",
      name: "Legacy Crypto Lib",
      version: "1.2.3",
      license: "GPL",
      hasVulnerabilities: true,
      algorithms: ["md5", "des"],
      lastUpdated: "2019-03-10"
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
