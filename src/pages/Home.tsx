
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
  Database,
  Brain,
  Zap
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
      title: "AI-Powered Natural Language Search",
      description: "Query your cryptographic assets using plain English. Our AI understands context and finds services, algorithms, and vulnerabilities instantly."
    },
    {
      icon: Shield,
      title: "Intelligent Security Analysis",
      description: "AI-driven comprehensive security assessment of cryptographic implementations with automated threat detection across your infrastructure."
    },
    {
      icon: Key,
      title: "Smart Crypto Materials Tracking",
      description: "AI monitors certificates, keys, and cryptographic materials with predictive expiration tracking and intelligent compliance checks."
    },
    {
      icon: BarChart3,
      title: "AI Risk Assessment",
      description: "Machine learning algorithms provide automated risk scoring and AI-generated prioritized recommendations for cryptographic vulnerabilities."
    },
    {
      icon: Lock,
      title: "AI-Guided PQC Readiness",
      description: "Artificial intelligence assesses your organization's readiness for post-quantum cryptography migration with smart recommendations."
    },
    {
      icon: Layers,
      title: "Intelligent Component Analysis",
      description: "AI-powered deep dive into libraries, algorithms, and their usage patterns with automated insights across applications."
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
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">Cryptographic Asset Intelligence</h1>
                <Badge className="bg-blue-100 text-blue-800 text-xs flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  AI-Powered
                </Badge>
              </div>
              <p className="text-sm text-gray-600">AI-driven comprehensive analysis of cryptographic components and materials</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="h-8 w-8 text-blue-200" />
              <span className="text-lg font-semibold text-blue-200">Powered by Artificial Intelligence</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              AI-Driven Cryptographic Security Intelligence
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Harness the power of artificial intelligence to discover, analyze, and manage cryptographic assets across your entire technology stack. 
              Get AI-generated insights into security risks, compliance status, and post-quantum readiness.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => navigate('/cbom-viewer')}
              >
                <Zap className="h-5 w-5" />
                Start AI Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
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
              <div className="flex items-center justify-center gap-2 mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">AI-Powered Platform</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                What is AI-Driven Cryptographic Asset Intelligence?
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our AI-powered platform provides comprehensive visibility into your organization's cryptographic posture. 
                Using machine learning and natural language processing, we help you identify deprecated algorithms, 
                prepare for post-quantum cryptography, and maintain security and compliance across your entire infrastructure.
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
                  <div className="text-sm text-green-700">AI-Assessed PQC Ready Services</div>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-yellow-800 mb-2">
                    92%
                  </div>
                  <div className="text-sm text-yellow-700">AI-Generated Security Score</div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <div className="text-2xl font-bold text-red-800 mb-2">
                    {platformMetrics.criticalIssues}
                  </div>
                  <div className="text-sm text-red-700">AI-Detected Critical Issues</div>
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
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">AI Capabilities</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Intelligent Platform Capabilities
              </h3>
              <p className="text-lg text-gray-600">
                Comprehensive AI-powered tools for cryptographic asset management and security analysis
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
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-8 w-8 text-blue-200" />
            <span className="text-lg font-semibold text-blue-200">AI-Powered Security</span>
          </div>
          <h3 className="text-3xl font-bold mb-4">
            Ready to Harness AI for Cryptographic Security?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your AI-driven analysis today and get intelligent insights into your cryptographic security posture.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 flex items-center gap-2"
            onClick={() => navigate('/cbom-viewer')}
          >
            <Zap className="h-5 w-5" />
            Start AI Analysis
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
            <Badge className="bg-blue-900 text-blue-200 text-xs flex items-center gap-1">
              <Brain className="h-3 w-3" />
              AI-Powered
            </Badge>
          </div>
          <p className="text-sm">
            AI-driven comprehensive cryptographic security analysis and management platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
