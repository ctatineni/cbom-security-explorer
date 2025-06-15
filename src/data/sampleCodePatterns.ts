
import { CodePattern, Recommendation } from './types';

export const sampleCodePatterns: CodePattern[] = [
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

export const sampleRecommendations: Recommendation[] = [
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
