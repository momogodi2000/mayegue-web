import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Progress,
  useToastActions
} from '@/shared/components/ui';
import {
  ServerIcon,
  CpuChipIcon,
  CircleStackIcon,
  CloudIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  max: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface SystemStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded';
  responseTime?: number;
  lastChecked: Date;
  uptime: number;
}

interface SystemMonitoringPanelProps {
  refreshInterval?: number;
}

const SystemMonitoringPanel: React.FC<SystemMonitoringPanelProps> = ({
  refreshInterval = 30000
}) => {
  const { success: showSuccess, error: showError } = useToastActions();
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [services, setServices] = useState<SystemStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Mock system metrics
  const mockMetrics: SystemMetric[] = [
    {
      id: 'cpu',
      name: 'CPU Usage',
      value: 45,
      max: 100,
      unit: '%',
      status: 'healthy',
      trend: 'stable'
    },
    {
      id: 'memory',
      name: 'Memory Usage',
      value: 72,
      max: 100,
      unit: '%',
      status: 'warning',
      trend: 'up'
    },
    {
      id: 'disk',
      name: 'Disk Usage',
      value: 85,
      max: 100,
      unit: '%',
      status: 'warning',
      trend: 'up'
    },
    {
      id: 'network',
      name: 'Network I/O',
      value: 23,
      max: 100,
      unit: '%',
      status: 'healthy',
      trend: 'stable'
    }
  ];

  // Mock system services
  const mockServices: SystemStatus[] = [
    {
      id: 'api',
      name: 'API Server',
      status: 'online',
      responseTime: 145,
      lastChecked: new Date(),
      uptime: 99.9
    },
    {
      id: 'database',
      name: 'Database',
      status: 'online',
      responseTime: 23,
      lastChecked: new Date(),
      uptime: 99.8
    },
    {
      id: 'storage',
      name: 'File Storage',
      status: 'degraded',
      responseTime: 890,
      lastChecked: new Date(),
      uptime: 98.5
    },
    {
      id: 'cache',
      name: 'Redis Cache',
      status: 'online',
      responseTime: 12,
      lastChecked: new Date(),
      uptime: 99.9
    },
    {
      id: 'email',
      name: 'Email Service',
      status: 'online',
      responseTime: 234,
      lastChecked: new Date(),
      uptime: 99.7
    }
  ];

  const fetchSystemData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update metrics with slight variations
      const updatedMetrics = mockMetrics.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10))
      }));

      // Update services with random response times
      const updatedServices = mockServices.map(service => ({
        ...service,
        responseTime: service.responseTime ? 
          Math.max(10, service.responseTime + (Math.random() - 0.5) * 50) : 
          undefined,
        lastChecked: new Date()
      }));

      setMetrics(updatedMetrics);
      setServices(updatedServices);
      setLastUpdate(new Date());
    } catch (error) {
      showError('Erreur lors de la récupération des données système');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
    
    const interval = setInterval(fetchSystemData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'warning':
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'offline':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'warning':
      case 'degraded':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'critical':
      case 'offline':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '➡️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ServerIcon className="w-5 h-5" />
              Surveillance Système
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSystemData}
                disabled={loading}
              >
                <ArrowPathIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CpuChipIcon className="w-5 h-5" />
            Métriques Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{metric.name}</h4>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{getTrendIcon(metric.trend)}</span>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getStatusColor(metric.status)}`}
                    >
                      {getStatusIcon(metric.status)}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {metric.value.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-600">{metric.unit}</span>
                  </div>
                  
                  <Progress
                    value={metric.value}
                    className="h-2"
                  />
                  
                  <div className="text-xs text-gray-500">
                    {metric.value.toFixed(1)} / {metric.max} {metric.unit}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudIcon className="w-5 h-5" />
            Services Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'online' ? 'bg-green-500' :
                    service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-600">
                      Uptime: {service.uptime}% • 
                      Dernière vérification: {service.lastChecked.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {service.responseTime && (
                    <div className="text-right">
                      <p className="text-sm font-medium">{service.responseTime}ms</p>
                      <p className="text-xs text-gray-600">Temps de réponse</p>
                    </div>
                  )}
                  
                  <Badge
                    variant="secondary"
                    className={getStatusColor(service.status)}
                  >
                    {getStatusIcon(service.status)}
                    <span className="ml-1 capitalize">{service.status}</span>
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5" />
            Alertes Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Utilisation mémoire élevée</p>
                <p className="text-sm text-yellow-700">
                  L'utilisation de la mémoire est à 72%. Considérez redémarrer certains services.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Service de stockage dégradé</p>
                <p className="text-sm text-yellow-700">
                  Le service de stockage de fichiers répond lentement (890ms).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoringPanel;
