
// Service-specific algorithms and protocols data structure
// This simulates what would come from a backend API

export interface ServiceAlgorithmData {
  serviceName: string;
  serviceType: string;
  programmingLanguage: string;
  framework?: string;
  enabledAlgorithms: Algorithm[];
  supportedAlgorithms: Algorithm[];
  enabledProtocols: Protocol[];
  supportedProtocols: Protocol[];
}

export interface Algorithm {
  name: string;
  type: string;
  status: 'enabled' | 'supported' | 'deprecated';
  security: 'secure' | 'weak' | 'vulnerable';
  description: string;
  version?: string;
  source: string; // e.g., "Spring Security", "Node.js crypto", "Java JCE"
  usageContext: string; // e.g., "JWT signing", "Database encryption"
}

export interface Protocol {
  name: string;
  type: string;
  status: 'enabled' | 'supported' | 'deprecated';
  security: 'secure' | 'weak' | 'vulnerable';
  description: string;
  version?: string;
  port?: number;
  source: string;
  usageContext: string;
}

// Service-specific algorithm configurations
const serviceAlgorithmConfigs: Record<string, ServiceAlgorithmData> = {
  'auth-service': {
    serviceName: 'auth-service',
    serviceType: 'Authentication Service',
    programmingLanguage: 'Java',
    framework: 'Spring Boot',
    enabledAlgorithms: [
      {
        name: 'HMAC-SHA256',
        type: 'Message Authentication',
        status: 'enabled',
        security: 'secure',
        description: 'Used for JWT token signing',
        version: '1.0',
        source: 'Spring Security',
        usageContext: 'JWT token generation and validation'
      },
      {
        name: 'AES-256-GCM',
        type: 'Symmetric Encryption',
        status: 'enabled',
        security: 'secure',
        description: 'Used for encrypting user credentials',
        version: '256-bit',
        source: 'Java JCE',
        usageContext: 'Password encryption in database'
      },
      {
        name: 'RSA-2048',
        type: 'Asymmetric Encryption',
        status: 'enabled',
        security: 'secure',
        description: 'Used for API key encryption',
        version: '2048-bit',
        source: 'Java JCE',
        usageContext: 'API key exchange'
      }
    ],
    supportedAlgorithms: [
      {
        name: 'ECDSA-P256',
        type: 'Digital Signature',
        status: 'supported',
        security: 'secure',
        description: 'Available for certificate signing',
        version: 'P-256',
        source: 'Bouncy Castle',
        usageContext: 'Certificate generation'
      }
    ],
    enabledProtocols: [
      {
        name: 'TLS 1.3',
        type: 'Transport Security',
        status: 'enabled',
        security: 'secure',
        description: 'HTTPS endpoint encryption',
        version: '1.3',
        port: 443,
        source: 'Spring Boot Embedded Tomcat',
        usageContext: 'API endpoint security'
      },
      {
        name: 'OAuth 2.0',
        type: 'Authorization',
        status: 'enabled',
        security: 'secure',
        description: 'Third-party authentication',
        version: '2.0',
        source: 'Spring OAuth2',
        usageContext: 'Google/GitHub login integration'
      }
    ],
    supportedProtocols: [
      {
        name: 'SAML 2.0',
        type: 'Single Sign-On',
        status: 'supported',
        security: 'secure',
        description: 'Enterprise SSO capability',
        version: '2.0',
        source: 'Spring SAML',
        usageContext: 'Enterprise authentication'
      }
    ]
  },

  'payment-processor': {
    serviceName: 'payment-processor',
    serviceType: 'Payment Service',
    programmingLanguage: 'Node.js',
    framework: 'Express',
    enabledAlgorithms: [
      {
        name: 'AES-256-CBC',
        type: 'Symmetric Encryption',
        status: 'enabled',
        security: 'secure',
        description: 'Credit card data encryption',
        version: '256-bit',
        source: 'Node.js crypto',
        usageContext: 'PCI DSS compliant data encryption'
      },
      {
        name: 'SHA-256',
        type: 'Hash Function',
        status: 'enabled',
        security: 'secure',
        description: 'Transaction integrity verification',
        version: 'SHA-2',
        source: 'Node.js crypto',
        usageContext: 'Payment verification hashing'
      }
    ],
    supportedAlgorithms: [
      {
        name: 'ChaCha20-Poly1305',
        type: 'Authenticated Encryption',
        status: 'supported',
        security: 'secure',
        description: 'Alternative encryption for mobile clients',
        source: 'Node.js crypto',
        usageContext: 'Mobile payment encryption'
      }
    ],
    enabledProtocols: [
      {
        name: 'TLS 1.2',
        type: 'Transport Security',
        status: 'enabled',
        security: 'secure',
        description: 'Payment gateway communication',
        version: '1.2',
        port: 443,
        source: 'Node.js HTTPS',
        usageContext: 'Stripe/PayPal API communication'
      },
      {
        name: 'WebSocket Secure',
        type: 'Real-time Communication',
        status: 'enabled',
        security: 'secure',
        description: 'Real-time payment notifications',
        source: 'Socket.io',
        usageContext: 'Payment status updates'
      }
    ],
    supportedProtocols: []
  },

  'user-management': {
    serviceName: 'user-management',
    serviceType: 'User Service',
    programmingLanguage: 'Python',
    framework: 'Django',
    enabledAlgorithms: [
      {
        name: 'PBKDF2',
        type: 'Key Derivation',
        status: 'enabled',
        security: 'secure',
        description: 'Password hashing with salt',
        version: 'SHA-256',
        source: 'Django.contrib.auth',
        usageContext: 'User password storage'
      },
      {
        name: 'Argon2',
        type: 'Password Hashing',
        status: 'enabled',
        security: 'secure',
        description: 'Modern password hashing',
        source: 'argon2-cffi',
        usageContext: 'Admin password hashing'
      }
    ],
    supportedAlgorithms: [
      {
        name: 'bcrypt',
        type: 'Password Hashing',
        status: 'supported',
        security: 'secure',
        description: 'Legacy password compatibility',
        source: 'bcrypt',
        usageContext: 'Migration from legacy systems'
      }
    ],
    enabledProtocols: [
      {
        name: 'HTTPS',
        type: 'Transport Security',
        status: 'enabled',
        security: 'secure',
        description: 'API endpoint security',
        port: 8000,
        source: 'Django HTTPS',
        usageContext: 'User API endpoints'
      }
    ],
    supportedProtocols: [
      {
        name: 'LDAP',
        type: 'Directory Service',
        status: 'supported',
        security: 'secure',
        description: 'Active Directory integration',
        port: 636,
        source: 'python-ldap',
        usageContext: 'Enterprise user sync'
      }
    ]
  }
};

// Function to get algorithms and protocols for a specific service
export const getServiceAlgorithmsProtocols = (serviceName: string): ServiceAlgorithmData | null => {
  return serviceAlgorithmConfigs[serviceName] || null;
};

// Function to get algorithms and protocols based on programming language
export const getLanguageAlgorithmsProtocols = (language: string): ServiceAlgorithmData => {
  const languageDefaults: Record<string, Partial<ServiceAlgorithmData>> = {
    'Java': {
      enabledAlgorithms: [
        {
          name: 'AES-256-GCM',
          type: 'Symmetric Encryption',
          status: 'enabled',
          security: 'secure',
          description: 'Standard Java encryption',
          source: 'Java JCE',
          usageContext: 'General purpose encryption'
        }
      ],
      enabledProtocols: [
        {
          name: 'TLS 1.3',
          type: 'Transport Security',
          status: 'enabled',
          security: 'secure',
          description: 'Java HTTPS support',
          source: 'Java JSSE',
          usageContext: 'HTTPS communication'
        }
      ]
    },
    'JavaScript': {
      enabledAlgorithms: [
        {
          name: 'AES-GCM',
          type: 'Symmetric Encryption',
          status: 'enabled',
          security: 'secure',
          description: 'Web Crypto API encryption',
          source: 'Web Crypto API',
          usageContext: 'Browser-based encryption'
        }
      ],
      enabledProtocols: [
        {
          name: 'WebSocket Secure',
          type: 'Real-time Communication',
          status: 'enabled',
          security: 'secure',
          description: 'Secure WebSocket connections',
          source: 'Browser WebSocket API',
          usageContext: 'Real-time data transmission'
        }
      ]
    },
    'Python': {
      enabledAlgorithms: [
        {
          name: 'ChaCha20-Poly1305',
          type: 'Authenticated Encryption',
          status: 'enabled',
          security: 'secure',
          description: 'Modern Python encryption',
          source: 'cryptography library',
          usageContext: 'High-performance encryption'
        }
      ],
      enabledProtocols: [
        {
          name: 'TLS 1.3',
          type: 'Transport Security',
          status: 'enabled',
          security: 'secure',
          description: 'Python SSL/TLS support',
          source: 'ssl module',
          usageContext: 'HTTPS and secure connections'
        }
      ]
    }
  };

  const defaults = languageDefaults[language] || {};
  return {
    serviceName: `${language.toLowerCase()}-service`,
    serviceType: 'Language Service',
    programmingLanguage: language,
    enabledAlgorithms: defaults.enabledAlgorithms || [],
    supportedAlgorithms: [],
    enabledProtocols: defaults.enabledProtocols || [],
    supportedProtocols: [],
    ...defaults
  };
};

// Main function to get algorithms and protocols for a node
export const getNodeAlgorithmsProtocols = (
  selectedNode: any,
  serviceName?: string,
  programmingLanguage?: string
): ServiceAlgorithmData => {
  // First try to get service-specific data
  if (serviceName) {
    const serviceData = getServiceAlgorithmsProtocols(serviceName);
    if (serviceData) {
      return serviceData;
    }
  }

  // Fall back to language-based data
  if (programmingLanguage || selectedNode.programmingLanguage) {
    return getLanguageAlgorithmsProtocols(programmingLanguage || selectedNode.programmingLanguage);
  }

  // Default fallback
  return {
    serviceName: selectedNode.name || 'unknown-service',
    serviceType: 'Unknown Service',
    programmingLanguage: 'Unknown',
    enabledAlgorithms: [],
    supportedAlgorithms: [],
    enabledProtocols: [],
    supportedProtocols: []
  };
};
