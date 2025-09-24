// WildGuard API TypeScript Definitions
// Copy this file to your frontend project for type safety

export interface WildGuardConfig {
  baseUrl: string;
  timeout?: number;
}

// Request/Response Types
export interface WildlifeReport {
  phoneNumber: string;
  type: ReportType;
  description: string;
  latitude: number;
  longitude: number;
  animalSpecies?: string;
  estimatedCount?: number;
  urgency: Priority;
  mediaUrls?: string[];
  isAnonymous?: boolean;
}

export interface ReportResponse {
  success: boolean;
  message: string;
  reportId: string;
  report: {
    id: string;
    type: ReportType;
    priority: Priority;
    status: VerificationStatus;
    reportedAt: string;
    trustScore: number;
    estimatedReward: number;
  };
}

export interface UserProfile {
  phoneNumber: string;
  name?: string;
  location?: string;
  trustScore: number;
  totalReports: number;
  verifiedReports: number;
  airtimeEarned: number;
  rank: string;
  badgeLevel: string;
  joinedDate: string;
  lastActiveAt: string;
}

export interface DashboardData {
  summary: {
    totalReports: number;
    pendingReports: number;
    verifiedToday: number;
    activeThreats: number;
    onlineRangers: number;
    sensorAlerts: number;
  };
  recentReports: Report[];
  threatPredictions: ThreatPrediction[];
  sensorStatus: {
    total: number;
    online: number;
    alerting: number;
    lowBattery: number;
  };
}

export interface Report {
  id: string;
  type: ReportType;
  priority: Priority;
  description: string;
  location: Location;
  reporter: {
    phoneNumber: string;
    trustScore: number;
    name?: string;
  };
  verificationStatus: VerificationStatus;
  reportedAt: string;
  mediaUrls?: string[];
  threatAnalysis?: {
    riskScore: number;
    confidence: number;
    patterns: string[];
  };
}

export interface ThreatPrediction {
  id: string;
  type: ThreatType;
  riskScore: number;
  confidence: number;
  location: Location;
  timeWindow: string;
  validFrom: string;
  validTo: string;
  factors: {
    historicalIncidents: number;
    timePatterns: string[];
    recentActivity: number;
    sensorAlerts: number;
  };
  recommendedActions: RecommendedAction[];
}

export interface SensorData {
  sensorId: string;
  dataType: SensorDataType;
  value: any;
  metadata?: any;
  timestamp?: string;
}

export interface Sensor {
  id: string;
  deviceId: string;
  name: string;
  type: SensorType;
  location: Location;
  status: SensorStatus;
  batteryLevel?: number;
  lastDataReceived?: string;
  installationDate: string;
}

export interface AlertEvent {
  type: AlertType;
  data: any;
  timestamp: string;
}

// Enums
export type ReportType = 
  | 'poaching'
  | 'wildlife_sighting' 
  | 'suspicious_activity'
  | 'injury'
  | 'illegal_logging'
  | 'fire'
  | 'fence_breach';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'investigating';

export type ThreatType = 'poaching_risk' | 'fire_risk' | 'animal_movement' | 'human_activity';

export type SensorType = 
  | 'camera_trap'
  | 'motion_sensor'
  | 'acoustic_sensor'
  | 'gps_collar'
  | 'weather_station';

export type SensorDataType = 'image' | 'audio' | 'movement' | 'temperature' | 'humidity' | 'gps';

export type SensorStatus = 'active' | 'inactive' | 'maintenance' | 'battery_low';

export type AlertType = 'new_report' | 'threat_alert' | 'sensor_alert' | 'verification_needed';

export type VerificationAction = 'verify' | 'reject' | 'investigate';

// Utility Types
export interface Location {
  latitude: number;
  longitude: number;
}

export interface RecommendedAction {
  action: string;
  priority: Priority;
  description: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  code?: string;
  data?: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Filter Types
export interface ReportFilters {
  status?: VerificationStatus;
  type?: ReportType;
  priority?: Priority;
  limit?: number;
  offset?: number;
  dateFrom?: string;
  dateTo?: string;
  location?: string;
}

export interface ThreatFilters {
  riskLevel?: 'low' | 'medium' | 'high';
  type?: ThreatType;
  radius?: number;
  lat?: number;
  lng?: number;
}

// WildGuard API Client Class
export class WildGuardAPI {
  private config: WildGuardConfig;

  constructor(config: WildGuardConfig) {
    this.config = config;
  }

  // Community API
  async submitReport(report: WildlifeReport): Promise<ApiResponse<ReportResponse>> {
    return this.post('/api/community/report', report);
  }

  async getUserProfile(phoneNumber: string): Promise<ApiResponse<UserProfile>> {
    return this.get(`/api/community/profile/${encodeURIComponent(phoneNumber)}`);
  }

  // Rangers API
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    return this.get('/api/rangers/dashboard');
  }

  async getReports(filters?: ReportFilters): Promise<PaginatedResponse<Report>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    return this.get(`/api/rangers/reports?${params}`);
  }

  async verifyReport(
    reportId: string, 
    action: VerificationAction, 
    notes?: string, 
    rewardAmount?: number
  ): Promise<ApiResponse> {
    return this.post(`/api/rangers/reports/${reportId}/verify`, {
      action,
      notes,
      rewardAmount
    });
  }

  async getThreats(filters?: ThreatFilters): Promise<ApiResponse<ThreatPrediction[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    return this.get(`/api/rangers/threats?${params}`);
  }

  async analyzeLocationThreat(
    latitude: number, 
    longitude: number, 
    reportType: ReportType
  ): Promise<ApiResponse> {
    return this.post('/api/rangers/threats/analyze', {
      latitude,
      longitude,
      reportType
    });
  }

  async getAnalytics(period?: string, type?: string): Promise<ApiResponse> {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (type) params.append('type', type);
    return this.get(`/api/rangers/analytics?${params}`);
  }

  // Sensors API
  async registerSensor(sensor: Omit<Sensor, 'id' | 'status' | 'installationDate'>): Promise<ApiResponse<Sensor>> {
    return this.post('/api/sensors/register', sensor);
  }

  async submitSensorData(data: SensorData): Promise<ApiResponse> {
    return this.post('/api/sensors/data', data);
  }

  async getSensorStatus(sensorId: string): Promise<ApiResponse<Sensor>> {
    return this.get(`/api/sensors/status/${sensorId}`);
  }

  async getSensorNetwork(): Promise<ApiResponse> {
    return this.get('/api/sensors/network');
  }

  async getNightGuardAlerts(hours?: number): Promise<ApiResponse> {
    const params = hours ? `?hours=${hours}` : '';
    return this.get(`/api/sensors/alerts${params}`);
  }

  // System API
  async getHealth(): Promise<ApiResponse> {
    return this.get('/health');
  }

  async getStats(): Promise<ApiResponse> {
    return this.get('/api/stats');
  }

  async testSMS(phoneNumber: string, message: string): Promise<ApiResponse> {
    return this.post('/api/test-sms', { phoneNumber, message });
  }

  // Real-time alerts
  connectToAlerts(onMessage: (event: AlertEvent) => void): EventSource {
    const eventSource = new EventSource(`${this.config.baseUrl}/api/rangers/alerts/stream`);
    
    eventSource.onmessage = (event) => {
      try {
        const alertData = JSON.parse(event.data);
        onMessage(alertData);
      } catch (error) {
        console.error('Failed to parse alert event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('Alert stream connection error:', error);
    };

    return eventSource;
  }

  // HTTP helper methods
  private async get(path: string): Promise<any> {
    return this.request('GET', path);
  }

  private async post(path: string, data?: any): Promise<any> {
    return this.request('POST', path, data);
  }

  private async request(method: string, path: string, data?: any): Promise<any> {
    const url = `${this.config.baseUrl}${path}`;
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error(`WildGuard API ${method} ${path} failed:`, error);
      throw error;
    }
  }
}

// React Hook Example
export function useWildGuardAPI(config: WildGuardConfig) {
  const api = new WildGuardAPI(config);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API call failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { api, loading, error, execute };
}

// Usage Example:
/*
import { WildGuardAPI, useWildGuardAPI } from './wildguard-types';

// Initialize API client
const api = new WildGuardAPI({
  baseUrl: 'http://localhost:3000'
});

// Submit a report
const submitReport = async () => {
  const report = {
    phoneNumber: '+254712345678',
    type: 'poaching' as const,
    description: 'Gunshots heard near waterhole',
    latitude: -2.153456,
    longitude: 34.678901,
    urgency: 'high' as const
  };

  try {
    const response = await api.submitReport(report);
    console.log('Report submitted:', response);
  } catch (error) {
    console.error('Failed to submit report:', error);
  }
};

// React component example
const ReportsComponent = () => {
  const { api, loading, error, execute } = useWildGuardAPI({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000'
  });

  const [reports, setReports] = useState<Report[]>([]);

  const loadReports = async () => {
    const result = await execute(() => api.getReports({ status: 'pending' }));
    if (result?.success) {
      setReports(result.data || []);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {reports.map(report => (
        <div key={report.id}>
          <h3>{report.type}</h3>
          <p>{report.description}</p>
          <span>Priority: {report.priority}</span>
        </div>
      ))}
    </div>
  );
};
*/