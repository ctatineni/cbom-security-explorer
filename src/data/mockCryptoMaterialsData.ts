
export interface Certificate {
  id: string;
  commonName: string;
  issuer: string;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  keySize: number;
  algorithm: string;
  signatureAlgorithm: string;
  fingerprint: string;
  isExpired: boolean;
  daysUntilExpiry: number;
  isSelfSigned: boolean;
  applications: string[];
  services: string[];
  environment: 'production' | 'staging' | 'development';
  certificateType: 'SSL/TLS' | 'Code Signing' | 'Client Authentication' | 'Email';
}

export interface CryptoKey {
  id: string;
  name: string;
  type: 'RSA' | 'ECDSA' | 'Ed25519' | 'AES' | 'DES';
  keySize: number;
  usage: string[];
  location: string;
  applications: string[];
  services: string[];
  createdDate: string;
  lastUsed: string;
  isActive: boolean;
  environment: 'production' | 'staging' | 'development';
  associatedCertificates: string[];
}

export interface CryptoRelationship {
  id: string;
  type: 'certificate-key' | 'key-application' | 'certificate-application' | 'cross-application';
  sourceId: string;
  targetId: string;
  relationship: string;
  strength: number; // 1-10 scale
}

export interface CryptoMaterialsData {
  certificates: Certificate[];
  keys: CryptoKey[];
  relationships: CryptoRelationship[];
}

const generateMockCertificates = (): Certificate[] => {
  const issuers = ['DigiCert', 'Let\'s Encrypt', 'Comodo', 'GeoTrust', 'VeriSign', 'Internal CA'];
  const domains = ['api.company.com', 'app.company.com', 'secure.company.com', 'internal.company.com'];
  const applications = ['E-Commerce Platform', 'Banking System', 'Healthcare Portal', 'IoT Management'];
  const environments: ('production' | 'staging' | 'development')[] = ['production', 'staging', 'development'];
  const certTypes: ('SSL/TLS' | 'Code Signing' | 'Client Authentication' | 'Email')[] = ['SSL/TLS', 'Code Signing', 'Client Authentication', 'Email'];
  
  return Array.from({ length: 15 }, (_, i) => {
    const issuer = issuers[i % issuers.length];
    const domain = domains[i % domains.length];
    const validFrom = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const validTo = new Date(validFrom.getTime() + (365 + Math.random() * 365) * 24 * 60 * 60 * 1000);
    const daysUntilExpiry = Math.floor((validTo.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    
    return {
      id: `cert-${i}`,
      commonName: domain,
      issuer,
      serialNumber: `${Math.random().toString(16).substr(2, 16).toUpperCase()}`,
      validFrom: validFrom.toISOString().split('T')[0],
      validTo: validTo.toISOString().split('T')[0],
      keySize: [2048, 4096][Math.floor(Math.random() * 2)],
      algorithm: 'RSA',
      signatureAlgorithm: ['SHA-256', 'SHA-384'][Math.floor(Math.random() * 2)],
      fingerprint: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(':'),
      isExpired: daysUntilExpiry < 0,
      daysUntilExpiry,
      isSelfSigned: issuer === 'Internal CA',
      applications: applications.slice(0, Math.floor(Math.random() * 3) + 1),
      services: [`Auth Service`, `API Gateway`, `Web Server`].slice(0, Math.floor(Math.random() * 3) + 1),
      environment: environments[Math.floor(Math.random() * environments.length)],
      certificateType: certTypes[Math.floor(Math.random() * certTypes.length)]
    };
  });
};

const generateMockKeys = (): CryptoKey[] => {
  const keyTypes: ('RSA' | 'ECDSA' | 'Ed25519' | 'AES' | 'DES')[] = ['RSA', 'ECDSA', 'Ed25519', 'AES', 'DES'];
  const usages = ['encryption', 'signing', 'authentication', 'key-exchange'];
  const locations = ['HSM', 'Key Vault', 'File System', 'Database', 'Cloud KMS'];
  const applications = ['E-Commerce Platform', 'Banking System', 'Healthcare Portal', 'IoT Management'];
  const environments: ('production' | 'staging' | 'development')[] = ['production', 'staging', 'development'];
  
  return Array.from({ length: 20 }, (_, i) => {
    const keyType = keyTypes[i % keyTypes.length];
    const keySize = keyType === 'RSA' ? [2048, 4096][Math.floor(Math.random() * 2)] :
                   keyType === 'ECDSA' ? [256, 384][Math.floor(Math.random() * 2)] :
                   keyType === 'AES' ? [128, 256][Math.floor(Math.random() * 2)] : 256;
    
    return {
      id: `key-${i}`,
      name: `${keyType}-Key-${i + 1}`,
      type: keyType,
      keySize,
      usage: usages.slice(0, Math.floor(Math.random() * 3) + 1),
      location: locations[Math.floor(Math.random() * locations.length)],
      applications: applications.slice(0, Math.floor(Math.random() * 2) + 1),
      services: [`Service-${Math.floor(Math.random() * 10) + 1}`],
      createdDate: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastUsed: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: Math.random() > 0.2,
      environment: environments[Math.floor(Math.random() * environments.length)],
      associatedCertificates: Math.random() > 0.5 ? [`cert-${Math.floor(Math.random() * 15)}`] : []
    };
  });
};

const generateMockRelationships = (certificates: Certificate[], keys: CryptoKey[]): CryptoRelationship[] => {
  const relationships: CryptoRelationship[] = [];
  
  // Certificate-Key relationships
  certificates.forEach((cert, i) => {
    if (i < keys.length && Math.random() > 0.3) {
      relationships.push({
        id: `rel-cert-key-${i}`,
        type: 'certificate-key',
        sourceId: cert.id,
        targetId: keys[i].id,
        relationship: 'uses key',
        strength: Math.floor(Math.random() * 5) + 6
      });
    }
  });
  
  // Cross-application relationships
  const applications = ['E-Commerce Platform', 'Banking System', 'Healthcare Portal', 'IoT Management'];
  applications.forEach((app, i) => {
    const relatedCerts = certificates.filter(cert => cert.applications.includes(app));
    relatedCerts.forEach((cert, j) => {
      if (j > 0) {
        relationships.push({
          id: `rel-app-${i}-${j}`,
          type: 'cross-application',
          sourceId: relatedCerts[0].id,
          targetId: cert.id,
          relationship: `shared in ${app}`,
          strength: relatedCerts.length
        });
      }
    });
  });
  
  return relationships;
};

const certificates = generateMockCertificates();
const keys = generateMockKeys();
const relationships = generateMockRelationships(certificates, keys);

export const mockCryptoMaterialsData: CryptoMaterialsData = {
  certificates,
  keys,
  relationships
};
