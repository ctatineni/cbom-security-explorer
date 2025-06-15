
import { Library } from './types';

export const sampleLibraries: Library[] = [
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
    ],
    enabledAlgorithms: "AES-256-GCM, RSA-2048, HMAC-SHA256",
    enabledProtocols: "TLS 1.3, TLS 1.2",
    supportedAlgorithms: "AES-256-GCM, AES-256-CBC, RSA-2048, RSA-4096, ECDSA-P256, HMAC-SHA256, HMAC-SHA512",
    supportedProtocols: "TLS 1.3, TLS 1.2, TLS 1.1, SSL 3.0, DTLS 1.2"
  },
  {
    id: "spring-security",
    name: "Spring Security",
    version: "5.7.2",
    license: "Apache 2.0",
    hasVulnerabilities: false,
    algorithms: ["aes-256"],
    lastUpdated: "2023-10-15",
    usageLocations: [
      {
        file: "pom.xml",
        line: 45,
        context: "Security framework dependency"
      }
    ],
    functions: [
      {
        name: "BCryptPasswordEncoder",
        usedIn: ["src/auth/UserService.java"],
        purpose: "Password hashing"
      }
    ],
    enabledAlgorithms: "BCrypt, PBKDF2, AES-256-GCM",
    enabledProtocols: "OAuth 2.0, SAML 2.0",
    supportedAlgorithms: "BCrypt, PBKDF2, Argon2, AES-256-GCM, AES-256-CBC, RSA-2048",
    supportedProtocols: "OAuth 2.0, OAuth 1.0, SAML 2.0, OpenID Connect, JWT"
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
    ],
    enabledAlgorithms: "MD5, DES",
    enabledProtocols: "SSL 2.0",
    supportedAlgorithms: "MD5, SHA-1, DES, 3DES",
    supportedProtocols: "SSL 2.0, SSL 3.0"
  }
];
