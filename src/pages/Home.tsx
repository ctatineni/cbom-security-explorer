
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  Key,
  Lock,
  Layers,
  Building,
  ArrowRight,
  TrendingUp,
  Globe,
  Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const platformMetrics = {
    totalApplications: 156,
    totalServices: 834,
    cryptoAlgorithms: 47,
    libraries: 123,
    criticalIssues: 12,
    pqcReadiness: 73
  };

  const features = [
    {
      icon: Search,
      title: "Natural Language Search",
      description: "Query your cryptographic assets using plain English. Find services, algorithms, and vulnerabilities instantly."
    },
    {
      icon: Shield,
      title: "Security Analysis",
      description: "Comprehensive security assessment of cryptographic implementations across your infrastructure."
    },
    {
      icon: Key,
      title: "Crypto Materials Tracking",
      description: "Monitor certificates, keys, and cryptographic materials with expiration tracking and compliance checks."
    },
    {
      icon: BarChart3,
      title: "Risk Assessment",
      description: "Automated risk scoring and prioritized recommendations for cryptographic vulnerabilities."
    },
    {
      icon: Lock,
      title: "PQC Readiness",
      description: "Assess your organization's readiness for post-quantum cryptography migration."
    },
    {
      icon: Layers,
      title: "Component Analysis",
      description: "Deep dive into libraries, algorithms, and their usage patterns across applications."
    }
  ];

  const quickStats = [
    { label: "Applications Scanned", value: platformMetrics.totalApplications, icon: Building, color: "text-blue-600" },
    { label: "Services Analyzed", value: platformMetrics.totalServices, icon: Database, color: "text-purple-600" },
    { label: "Crypto Algorithms", value: platformMetrics.cryptoAlgorithms, icon: Lock, color: "text-green-600" },
    { label: "Libraries Tracked", value: platformMetrics.libraries, icon: Layers, color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cryptographic Asset Intelligence</h1>
              <p className="text-sm text-gray-600">Comprehensive analysis of cryptographic components and materials</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Secure Your Cryptographic Infrastructure
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Discover, analyze, and manage cryptographic assets across your entire technology stack. 
              Get insights into security risks, compliance status, and post-quantum readiness.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => navigate('/cbom-viewer')}
              >
                Start Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => navigate('/cbom-viewer')}
              >
                View Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardContent className="p-6 text-center">
                  <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                What is Cryptographic Asset Intelligence?
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our platform provides comprehensive visibility into your organization's cryptographic posture. 
                From identifying deprecated algorithms to preparing for post-quantum cryptography, 
                we help you maintain security and compliance across your entire infrastructure.
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-green-800 mb-2">
                    {platformMetrics.pqcReadiness}%
                  </div>
                  <div className="text-sm text-green-700">PQC Ready Services</div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-yellow-800 mb-2">
                    92%
                  </div>
                  <div className="text-sm text-yellow-700">Security Score</div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-red-800 mb-2">
                    {platformMetrics.criticalIssues}
                  </div>
                  <div className="text-sm text-red-700">Critical Issues</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Platform Capabilities
              </h3>
              <p className="text-lg text-gray-600">
                Comprehensive tools for cryptographic asset management and security analysis
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className="h-8 w-8 text-blue-600 mb-3" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Secure Your Cryptographic Assets?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start analyzing your infrastructure today and get insights into your cryptographic security posture.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => navigate('/cbom-viewer')}
          >
            Launch Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">Cryptographic Asset Intelligence</span>
          </div>
          <p className="text-sm">
            Comprehensive cryptographic security analysis and management platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
