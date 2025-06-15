
import { CryptoAlgorithm } from './types';

export const sampleCryptoAlgorithms: CryptoAlgorithm[] = [
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
