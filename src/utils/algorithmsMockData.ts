
// Mock data for algorithms and protocols - in real app this would come from the component data
export const generateMockAlgorithmsProtocols = (componentName: string, isLanguage: boolean = false) => {
  const baseAlgorithms = [
    { name: 'AES-256-GCM', type: 'Symmetric Encryption', status: 'enabled', security: 'secure', description: 'Advanced Encryption Standard with Galois/Counter Mode' },
    { name: 'RSA-2048', type: 'Asymmetric Encryption', status: 'enabled', security: 'secure', description: 'RSA encryption with 2048-bit key' },
    { name: 'SHA-256', type: 'Hash Function', status: 'enabled', security: 'secure', description: 'Secure Hash Algorithm 256-bit' },
    { name: 'ECDSA-P256', type: 'Digital Signature', status: 'enabled', security: 'secure', description: 'Elliptic Curve Digital Signature Algorithm' },
    { name: 'ChaCha20-Poly1305', type: 'Authenticated Encryption', status: 'supported', security: 'secure', description: 'ChaCha20 stream cipher with Poly1305 authenticator' },
    { name: 'MD5', type: 'Hash Function', status: 'deprecated', security: 'vulnerable', description: 'Message Digest Algorithm 5 (deprecated)' },
    { name: 'DES', type: 'Symmetric Encryption', status: 'deprecated', security: 'vulnerable', description: 'Data Encryption Standard (deprecated)' },
    { name: 'RSA-1024', type: 'Asymmetric Encryption', status: 'deprecated', security: 'weak', description: 'RSA encryption with 1024-bit key (weak)' },
    { name: 'AES-128-CBC', type: 'Symmetric Encryption', status: 'enabled', security: 'secure', description: 'AES 128-bit Cipher Block Chaining' },
    { name: 'AES-256-CBC', type: 'Symmetric Encryption', status: 'enabled', security: 'secure', description: 'AES 256-bit Cipher Block Chaining' },
    { name: 'PBKDF2', type: 'Key Derivation', status: 'enabled', security: 'secure', description: 'Password-Based Key Derivation Function 2' },
    { name: 'HMAC-SHA256', type: 'Message Authentication', status: 'enabled', security: 'secure', description: 'Hash-based Message Authentication Code with SHA-256' },
  ];

  const baseProtocols = [
    { name: 'TLS 1.3', type: 'Transport Security', status: 'enabled', security: 'secure', description: 'Transport Layer Security version 1.3' },
    { name: 'TLS 1.2', type: 'Transport Security', status: 'enabled', security: 'secure', description: 'Transport Layer Security version 1.2' },
    { name: 'HTTPS', type: 'Application Protocol', status: 'enabled', security: 'secure', description: 'HTTP over TLS/SSL' },
    { name: 'SSH-2', type: 'Remote Access', status: 'enabled', security: 'secure', description: 'Secure Shell Protocol version 2' },
    { name: 'OAuth 2.0', type: 'Authorization', status: 'enabled', security: 'secure', description: 'Open Authorization framework' },
    { name: 'JWT', type: 'Token Format', status: 'enabled', security: 'secure', description: 'JSON Web Token' },
    { name: 'SAML 2.0', type: 'Authentication', status: 'supported', security: 'secure', description: 'Security Assertion Markup Language' },
    { name: 'SSL 3.0', type: 'Transport Security', status: 'deprecated', security: 'vulnerable', description: 'Secure Sockets Layer 3.0 (deprecated)' },
    { name: 'TLS 1.0', type: 'Transport Security', status: 'deprecated', security: 'weak', description: 'Transport Layer Security 1.0 (deprecated)' },
    { name: 'TLS 1.1', type: 'Transport Security', status: 'deprecated', security: 'weak', description: 'Transport Layer Security 1.1 (deprecated)' },
    { name: 'WebSocket Secure', type: 'Transport Security', status: 'enabled', security: 'secure', description: 'WebSocket over TLS' },
    { name: 'gRPC', type: 'RPC Protocol', status: 'enabled', security: 'secure', description: 'Google Remote Procedure Call' },
  ];

  // Language-specific additions
  if (isLanguage) {
    const languageSpecific = {
      'Java': [
        { name: 'JCE', type: 'Crypto Framework', status: 'enabled', security: 'secure', description: 'Java Cryptography Extension' },
        { name: 'Bouncy Castle', type: 'Crypto Provider', status: 'supported', security: 'secure', description: 'Third-party cryptography provider' },
        { name: 'JSSE', type: 'Security Framework', status: 'enabled', security: 'secure', description: 'Java Secure Socket Extension' },
      ],
      'JavaScript': [
        { name: 'Web Crypto API', type: 'Browser API', status: 'enabled', security: 'secure', description: 'Native browser cryptography API' },
        { name: 'Node.js Crypto', type: 'Runtime Module', status: 'enabled', security: 'secure', description: 'Node.js built-in crypto module' },
        { name: 'SubtleCrypto', type: 'Browser API', status: 'enabled', security: 'secure', description: 'Low-level cryptographic operations' },
      ],
      'Python': [
        { name: 'cryptography', type: 'Library', status: 'enabled', security: 'secure', description: 'Modern cryptographic library for Python' },
        { name: 'hashlib', type: 'Standard Library', status: 'enabled', security: 'secure', description: 'Secure hash and message digest algorithms' },
        { name: 'secrets', type: 'Standard Library', status: 'enabled', security: 'secure', description: 'Cryptographically strong random numbers' },
      ],
      'C#': [
        { name: '.NET Cryptography', type: 'Framework', status: 'enabled', security: 'secure', description: '.NET Framework cryptographic services' },
        { name: 'CNG', type: 'Windows API', status: 'supported', security: 'secure', description: 'Cryptography API: Next Generation' },
        { name: 'DPAPI', type: 'Windows API', status: 'supported', security: 'secure', description: 'Data Protection API' },
      ]
    };

    const langSpecific = languageSpecific[componentName] || [];
    return { 
      algorithms: [...baseAlgorithms, ...langSpecific], 
      protocols: baseProtocols 
    };
  }

  return { algorithms: baseAlgorithms, protocols: baseProtocols };
};
