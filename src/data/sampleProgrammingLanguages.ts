
import { ProgrammingLanguage } from './types';

export const sampleProgrammingLanguages: ProgrammingLanguage[] = [
  {
    id: "java-11",
    name: "Java",
    version: "11.0.19",
    runtimeEnvironment: "OpenJDK",
    enabledAlgorithms: "AES-256-GCM, RSA-2048, HMAC-SHA256, SHA-256",
    enabledProtocols: "TLS 1.3, TLS 1.2, HTTPS",
    supportedAlgorithms: "AES-256-GCM, AES-256-CBC, AES-192, AES-128, RSA-2048, RSA-4096, ECDSA-P256, ECDSA-P384, HMAC-SHA256, HMAC-SHA512, SHA-256, SHA-512",
    supportedProtocols: "TLS 1.3, TLS 1.2, TLS 1.1, SSL 3.0, HTTPS, HTTP/2, WebSocket"
  },
  {
    id: "python-39",
    name: "Python",
    version: "3.9.16",
    runtimeEnvironment: "CPython",
    enabledAlgorithms: "AES-256-GCM, RSA-2048, HMAC-SHA256, Fernet",
    enabledProtocols: "TLS 1.3, HTTPS",
    supportedAlgorithms: "AES-256-GCM, AES-256-CBC, ChaCha20, RSA-2048, RSA-4096, ECDSA-P256, Ed25519, HMAC-SHA256, HMAC-SHA512, Blake2b, Fernet",
    supportedProtocols: "TLS 1.3, TLS 1.2, HTTPS, HTTP/2, WebSocket, SMTP, IMAP"
  },
  {
    id: "javascript-node",
    name: "JavaScript",
    version: "14.21.3",
    runtimeEnvironment: "Node.js",
    enabledAlgorithms: "AES-256-GCM, RSA-2048, HMAC-SHA256",
    enabledProtocols: "TLS 1.3, HTTPS",
    supportedAlgorithms: "AES-256-GCM, AES-256-CBC, ChaCha20-Poly1305, RSA-2048, RSA-4096, ECDSA-P256, Ed25519, HMAC-SHA256, HMAC-SHA512",
    supportedProtocols: "TLS 1.3, TLS 1.2, HTTPS, HTTP/2, WebSocket"
  }
];
