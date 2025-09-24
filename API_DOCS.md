# 🌿 WildGuard API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:3000` (Development) | `https://api.wildguard.conservation` (Production)  
**Last Updated:** September 23, 2025

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Community API](#community-api)
3. [Rangers Dashboard API](#rangers-dashboard-api)
4. [Sensor Network API](#sensor-network-api)
5. [System API](#system-api)
6. [Error Handling](#error-handling)
7. [Rate Limits](#rate-limits)
8. [WebSocket Events](#websocket-events)
9. [Code Examples](#code-examples)

---

## 🔐 Authentication

Currently, the API uses phone number-based identification for community members and role-based access for rangers. JWT tokens will be implemented in future versions.

**Headers Required:**
```
Content-Type: application/json
Accept: application/json
```

---

## 📱 Community API

### Submit Wildlife Report

**Endpoint:** `POST /api/community/report`

Submit a wildlife sighting, poaching incident, or other conservation report.

**Request:**
```json
{
  "phoneNumber": "+254712345678",
  "type": "poaching",
  "description": "Saw 3 men with guns near waterhole",
  "latitude": -2.153456,
  "longitude": 34.678901,
  "animalSpecies": "elephant",
  "estimatedCount": 5,
  "urgency": "high",
  "mediaUrls": ["https://example.com/photo1.jpg"],
  "isAnonymous": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report submitted successfully",
  "reportId": "uuid-here",
  "report": {
    "id": "uuid-here",
    "type": "poaching",
    "priority": "high",
    "status": "pending",
    "reportedAt": "2025-09-23T14:30:00Z",
    "trustScore": 0.85,
    "estimatedReward": 50
  }
}
```

**Report Types:**
- `poaching` - Illegal hunting/wildlife crime
- `wildlife_sighting` - Animal observation
- `suspicious_activity` - Unusual behavior in conservation area
- `injury` - Injured wildlife
- `illegal_logging` - Forest destruction
- `fire` - Wildfire incident
- `fence_breach` - Perimeter security breach

### Get User Profile

**Endpoint:** `GET /api/community/profile/{phoneNumber}`

Get community member's profile, trust score, and statistics.

**Response:**
```json
{
  "success": true,
  "profile": {
    "phoneNumber": "+254712345678",
    "name": "John Doe",
    "location": "Maasai Mara",
    "trustScore": 85.5,
    "totalReports": 23,
    "verifiedReports": 19,
    "airtimeEarned": 1250.00,
    "rank": "Conservation Hero",
    "badgeLevel": "Gold",
    "joinedDate": "2025-01-15T10:00:00Z",
    "lastActiveAt": "2025-09-23T12:00:00Z"
  },
  "recentReports": [
    {
      "id": "uuid",
      "type": "wildlife_sighting",
      "verificationStatus": "verified",
      "reportedAt": "2025-09-22T16:45:00Z",
      "reward": 30.00
    }
  ]
}
```

### USSD Webhook

**Endpoint:** `POST /api/community/ussd`

Handles USSD menu interactions (internal use - Africa's Talking webhook).

### SMS Webhook

**Endpoint:** `POST /api/community/sms`

Processes SMS reports (internal use - Africa's Talking webhook).

### Voice Webhook

**Endpoint:** `POST /api/community/voice`

Handles voice call reports (internal use - Africa's Talking webhook).

---

## 🎯 Rangers Dashboard API

### Dashboard Overview

**Endpoint:** `GET /api/rangers/dashboard`

Get comprehensive dashboard data for rangers.

**Response:**
```json
{
  "success": true,
  "dashboard": {
    "summary": {
      "totalReports": 156,
      "pendingReports": 12,
      "verifiedToday": 8,
      "activeThreats": 3,
      "onlineRangers": 5,
      "sensorAlerts": 2
    },
    "recentReports": [
      {
        "id": "uuid",
        "type": "poaching",
        "priority": "urgent",
        "location": {
          "latitude": -2.153456,
          "longitude": 34.678901
        },
        "description": "Gunshots heard near River Camp",
        "reportedAt": "2025-09-23T13:45:00Z",
        "reporter": {
          "phoneNumber": "+254712345678",
          "trustScore": 92
        },
        "distance": "2.3km"
      }
    ],
    "threatPredictions": [
      {
        "id": "uuid",
        "type": "poaching_risk",
        "riskScore": 0.87,
        "location": {
          "latitude": -2.150000,
          "longitude": 34.680000
        },
        "timeWindow": "next_6h",
        "factors": ["historical_incidents", "night_activity"],
        "recommendedActions": [
          {
            "action": "immediate_patrol",
            "priority": "urgent"
          }
        ]
      }
    ],
    "sensorStatus": {
      "total": 25,
      "online": 23,
      "alerting": 2,
      "lowBattery": 1
    }
  }
}
```

### List Reports

**Endpoint:** `GET /api/rangers/reports`

Get filtered list of conservation reports.

**Query Parameters:**
- `status` - Filter by verification status (`pending`, `verified`, `rejected`, `investigating`)
- `type` - Filter by report type
- `priority` - Filter by priority level
- `limit` - Number of results (default: 50)
- `offset` - Pagination offset
- `dateFrom` - Start date (ISO 8601)
- `dateTo` - End date (ISO 8601)
- `location` - Filter by area/GPS bounds

**Example:** `GET /api/rangers/reports?status=pending&priority=high&limit=20`

**Response:**
```json
{
  "success": true,
  "reports": [
    {
      "id": "uuid",
      "type": "poaching",
      "priority": "high",
      "description": "Multiple gunshots at dawn",
      "location": {
        "latitude": -2.153456,
        "longitude": 34.678901
      },
      "reporter": {
        "phoneNumber": "+254712345678",
        "trustScore": 88,
        "name": "Anonymous"
      },
      "verificationStatus": "pending",
      "reportedAt": "2025-09-23T06:15:00Z",
      "mediaUrls": ["https://example.com/audio1.mp3"],
      "threatAnalysis": {
        "riskScore": 0.91,
        "confidence": 0.85,
        "patterns": ["night_activity", "escalating_threat"]
      }
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### Verify Report

**Endpoint:** `POST /api/rangers/reports/{reportId}/verify`

Verify or reject a community report.

**Request:**
```json
{
  "action": "verify",
  "notes": "Confirmed by patrol team. Evidence collected.",
  "rewardAmount": 75.00,
  "followUpRequired": false
}
```

**Actions:**
- `verify` - Confirm report is accurate
- `reject` - Report is false/spam
- `investigate` - Needs further investigation

**Response:**
```json
{
  "success": true,
  "message": "Report verified successfully",
  "report": {
    "id": "uuid",
    "verificationStatus": "verified",
    "verifiedAt": "2025-09-23T14:30:00Z",
    "verifiedBy": "ranger-uuid",
    "reward": {
      "amount": 75.00,
      "status": "pending",
      "transactionId": "at-transaction-id"
    }
  }
}
```

### Get Threat Predictions

**Endpoint:** `GET /api/rangers/threats`

Get current AI-generated threat predictions.

**Query Parameters:**
- `riskLevel` - Filter by risk level (`low`, `medium`, `high`)
- `type` - Threat type (`poaching_risk`, `fire_risk`, `human_activity`)
- `radius` - Search radius in km
- `lat`, `lng` - Center coordinates for radius search

**Response:**
```json
{
  "success": true,
  "threats": [
    {
      "id": "uuid",
      "type": "poaching_risk",
      "riskScore": 0.89,
      "confidence": 0.92,
      "location": {
        "latitude": -2.155000,
        "longitude": 34.675000
      },
      "timeWindow": "next_12h",
      "validFrom": "2025-09-23T20:00:00Z",
      "validTo": "2025-09-24T08:00:00Z",
      "factors": {
        "historicalIncidents": 5,
        "timePatterns": ["night_activity", "weekend_activity"],
        "recentActivity": 2,
        "sensorAlerts": 1
      },
      "recommendedActions": [
        {
          "action": "night_surveillance",
          "priority": "high",
          "description": "Increase night-time monitoring in this area"
        },
        {
          "action": "community_alert", 
          "priority": "medium",
          "description": "Alert local community leaders"
        }
      ]
    }
  ]
}
```

### Analyze Location Threats

**Endpoint:** `POST /api/rangers/threats/analyze`

Analyze threat level at specific location.

**Request:**
```json
{
  "latitude": -2.153456,
  "longitude": 34.678901,
  "reportType": "poaching"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "location": {
      "latitude": -2.153456,
      "longitude": 34.678901
    },
    "riskScore": 0.76,
    "riskLevel": "high",
    "confidence": 0.88,
    "factors": {
      "historicalIncidents": 3,
      "recentActivity": 1,
      "timeOfDay": "high",
      "season": "medium",
      "proximity": "road"
    },
    "patterns": ["night_activity", "escalating_threat"],
    "recommendations": [
      "Immediate patrol dispatch recommended",
      "Consider deploying additional sensors",
      "Alert community in 2km radius"
    ]
  }
}
```

### Real-time Alerts Stream

**Endpoint:** `GET /api/rangers/alerts/stream`

Server-Sent Events stream for real-time alerts.

**Response Stream:**
```
data: {"type":"new_report","priority":"urgent","reportId":"uuid","location":{"lat":-2.153,"lng":34.678}}

data: {"type":"threat_detected","threatLevel":"high","sensorId":"sensor-uuid","confidence":0.91}

data: {"type":"verification_needed","reportId":"uuid","trustScore":0.95}
```

### Analytics

**Endpoint:** `GET /api/rangers/analytics`

Get conservation analytics and statistics.

**Query Parameters:**
- `period` - Time period (`7d`, `30d`, `90d`, `1y`)
- `type` - Analytics type (`incidents`, `community`, `sensors`, `threats`)

**Response:**
```json
{
  "success": true,
  "analytics": {
    "period": "30d",
    "summary": {
      "totalIncidents": 45,
      "resolved": 38,
      "prevented": 12,
      "communityEngagement": 89.5,
      "responseTime": "18min",
      "successRate": 84.4
    },
    "trends": {
      "incidentsByType": {
        "poaching": 15,
        "wildlife_sighting": 20,
        "suspicious_activity": 8,
        "injury": 2
      },
      "timePatterns": {
        "peak_hours": ["22:00", "23:00", "02:00", "05:00"],
        "peak_days": ["Friday", "Saturday", "Sunday"]
      },
      "hotspots": [
        {
          "area": "Water Hole 3",
          "incidents": 8,
          "riskIncrease": 45.2
        }
      ]
    },
    "communityStats": {
      "activeReporters": 156,
      "newMembers": 23,
      "avgTrustScore": 78.5,
      "airtimePaid": 12450.00
    }
  }
}
```

---

## 📡 Sensor Network API

### Submit Sensor Data

**Endpoint:** `POST /api/sensors/data`

Submit sensor readings for threat analysis (IoT devices).

**Request:**
```json
{
  "sensorId": "sensor-uuid",
  "dataType": "image",
  "value": {
    "objects": ["person", "vehicle"],
    "confidence": 0.89,
    "night_vision": true
  },
  "metadata": {
    "camera_model": "TrailCam Pro",
    "battery_level": 78,
    "temperature": 24.5
  },
  "timestamp": "2025-09-23T02:15:00Z"
}
```

**Data Types:**
- `image` - Camera trap photos
- `audio` - Acoustic sensor recordings  
- `movement` - Motion sensor data
- `gps` - GPS collar tracking
- `temperature` - Weather station data
- `humidity` - Environmental monitoring

**Response:**
```json
{
  "success": true,
  "message": "Sensor data processed successfully",
  "sensorId": "sensor-uuid",
  "processed": true,
  "threatAnalysis": {
    "threatLevel": "medium",
    "confidence": 0.89,
    "alertGenerated": true,
    "recommendedAction": "Monitor group activity - Consider patrol"
  }
}
```

### Register Sensor

**Endpoint:** `POST /api/sensors/register`

Register a new IoT sensor device.

**Request:**
```json
{
  "deviceId": "WILDCAM001",
  "name": "Water Hole Camera 3",
  "type": "camera_trap",
  "latitude": -2.153456,
  "longitude": 34.678901,
  "conservationAreaId": "area-uuid",
  "configuration": {
    "capture_interval": 300,
    "night_vision": true,
    "motion_sensitivity": "high"
  }
}
```

**Sensor Types:**
- `camera_trap` - Motion-activated cameras
- `motion_sensor` - Movement detection
- `acoustic_sensor` - Sound monitoring
- `gps_collar` - Animal tracking
- `weather_station` - Environmental data

**Response:**
```json
{
  "success": true,
  "message": "Sensor registered successfully", 
  "sensorId": "sensor-uuid",
  "sensor": {
    "id": "sensor-uuid",
    "deviceId": "WILDCAM001",
    "name": "Water Hole Camera 3",
    "type": "camera_trap",
    "location": {
      "latitude": -2.153456,
      "longitude": 34.678901
    },
    "status": "active"
  }
}
```

### Get Sensor Status

**Endpoint:** `GET /api/sensors/status/{sensorId}`

Get sensor health and recent activity.

**Response:**
```json
{
  "success": true,
  "sensor": {
    "id": "sensor-uuid",
    "deviceId": "WILDCAM001", 
    "name": "Water Hole Camera 3",
    "type": "camera_trap",
    "location": {
      "latitude": -2.153456,
      "longitude": 34.678901
    },
    "status": "active",
    "batteryLevel": 78,
    "lastDataReceived": "2025-09-23T14:22:00Z",
    "installationDate": "2025-08-15T09:00:00Z"
  },
  "statistics": {
    "totalReadingsToday": 45,
    "threatDetections": 3,
    "lastReading": "2025-09-23T14:22:00Z",
    "averageConfidence": 0.82
  },
  "recentData": [
    {
      "id": "data-uuid",
      "dataType": "image",
      "threatLevel": "medium",
      "confidence": "0.89",
      "recordedAt": "2025-09-23T14:22:00Z",
      "description": "Human presence detected - Vehicle movement at 14:22"
    }
  ]
}
```

### Get Night Guard Alerts

**Endpoint:** `GET /api/sensors/alerts`

Get recent automated threat alerts from sensor network.

**Query Parameters:**
- `hours` - Time window in hours (default: 24)

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalAlerts": 12,
    "highThreatAlerts": 2,
    "mediumThreatAlerts": 7,
    "timeRange": "24 hours",
    "topThreats": [
      {
        "timestamp": "2025-09-23T02:15:00Z",
        "location": "Camera Trap 001",
        "threatLevel": "high",
        "confidence": "0.91",
        "description": "Human presence with weapon detected - Vehicle movement at 2:15 AM"
      }
    ]
  }
}
```

### Get Sensor Network Overview

**Endpoint:** `GET /api/sensors/network`

Get complete sensor network status.

**Response:**
```json
{
  "success": true,
  "overview": {
    "totalSensors": 25,
    "activeSensors": 23,
    "onlineSensors": 21,
    "sensorsWithThreats": 3,
    "totalThreatsLast24h": 8,
    "averageBatteryLevel": 76.4,
    "sensorTypes": {
      "camera_trap": 15,
      "acoustic_sensor": 5,
      "motion_sensor": 3,
      "gps_collar": 2
    }
  },
  "sensors": [
    {
      "id": "sensor-uuid",
      "deviceId": "WILDCAM001",
      "name": "Water Hole Camera 3",
      "type": "camera_trap",
      "location": {
        "latitude": -2.153456,
        "longitude": 34.678901
      },
      "status": "active",
      "batteryLevel": 78,
      "lastDataReceived": "2025-09-23T14:22:00Z",
      "stats": {
        "readingsLast24h": 45,
        "threatsDetected": 2,
        "isOnline": true
      }
    }
  ]
}
```

### Update Sensor Maintenance

**Endpoint:** `POST /api/sensors/{sensorId}/maintenance`

Update sensor maintenance status.

**Request:**
```json
{
  "status": "maintenance",
  "batteryLevel": 95,
  "notes": "Battery replaced, lens cleaned"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sensor maintenance status updated",
  "sensorId": "sensor-uuid",
  "updates": {
    "status": "maintenance",
    "batteryLevel": 95
  }
}
```

---

## ⚙️ System API

### Health Check

**Endpoint:** `GET /health`

Check system health and status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-23T14:30:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "africasTalking": "operational",
    "redis": "connected",
    "sensors": "monitoring"
  },
  "uptime": "15d 8h 23m"
}
```

### API Statistics

**Endpoint:** `GET /api/stats`

Get API usage statistics.

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalRequests": 15420,
    "requestsToday": 523,
    "averageResponseTime": "145ms",
    "endpoints": {
      "/api/community/report": 8934,
      "/api/rangers/reports": 3241,
      "/api/sensors/data": 2156
    },
    "errorRate": 0.02,
    "uptime": 99.8
  }
}
```

### Test SMS Integration

**Endpoint:** `POST /api/test-sms`

Test Africa's Talking SMS integration.

**Request:**
```json
{
  "phoneNumber": "+254712345678",
  "message": "Test message from WildGuard API"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS sent successfully",
  "africasTalking": {
    "messageId": "at-message-id",
    "status": "sent",
    "cost": "KES 2.00"
  }
}
```

### Emergency Alert

**Endpoint:** `POST /api/emergency-alert`

Send emergency alert to all rangers.

**Request:**
```json
{
  "alertType": "poaching_confirmed",
  "message": "Active poaching at coordinates -2.153, 34.678. Immediate response required.",
  "location": {
    "latitude": -2.153456,
    "longitude": 34.678901
  },
  "priority": "critical"
}
```

---

## ❌ Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {},
  "timestamp": "2025-09-23T14:30:00Z"
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Invalid request data
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error
- `SERVICE_UNAVAILABLE` - External service down

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `429` - Rate Limited
- `500` - Server Error

---

## 🚦 Rate Limits

**Global Limits:**
- 100 requests per 15 minutes per IP
- 1000 requests per hour for authenticated users

**Endpoint-Specific Limits:**
- SMS endpoints: 10 requests per minute
- Report submission: 20 requests per hour per user
- Sensor data: 1000 requests per hour per sensor

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1695478800
```

---

## 🔄 WebSocket Events

**Connection:** `ws://localhost:3000/api/ws`

**Event Types:**

### New Report
```json
{
  "type": "new_report",
  "data": {
    "reportId": "uuid",
    "type": "poaching",
    "priority": "urgent",
    "location": {
      "latitude": -2.153456,
      "longitude": 34.678901
    },
    "timestamp": "2025-09-23T14:30:00Z"
  }
}
```

### Threat Alert
```json
{
  "type": "threat_alert",
  "data": {
    "threatId": "uuid",
    "riskScore": 0.89,
    "location": {
      "latitude": -2.153456,
      "longitude": 34.678901
    },
    "actions": ["immediate_patrol"]
  }
}
```

### Sensor Alert
```json
{
  "type": "sensor_alert", 
  "data": {
    "sensorId": "uuid",
    "alertType": "camera_triggered",
    "threatLevel": "high",
    "confidence": 0.91,
    "timestamp": "2025-09-23T02:15:00Z"
  }
}
```

---

## 💻 Code Examples

### JavaScript/React Example

```javascript
// Submit a wildlife report
const submitReport = async (reportData) => {
  try {
    const response = await fetch('/api/community/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Report submitted:', result.reportId);
      // Show success message
    } else {
      console.error('Error:', result.error);
      // Show error message
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Listen to real-time alerts
const connectToAlerts = () => {
  const eventSource = new EventSource('/api/rangers/alerts/stream');
  
  eventSource.onmessage = (event) => {
    const alert = JSON.parse(event.data);
    
    switch (alert.type) {
      case 'new_report':
        updateReportsList(alert.data);
        break;
      case 'threat_alert':
        showThreatNotification(alert.data);
        break;
      case 'sensor_alert':
        updateSensorStatus(alert.data);
        break;
    }
  };
  
  eventSource.onerror = (error) => {
    console.error('Connection lost:', error);
    // Implement reconnection logic
  };
};
```

### React Hook Example

```javascript
// Custom hook for WildGuard API
import { useState, useEffect } from 'react';

export const useWildGuardAPI = () => {
  const [reports, setReports] = useState([]);
  const [threats, setThreats] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/rangers/reports?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyReport = async (reportId, action, notes) => {
    try {
      const response = await fetch(`/api/rangers/reports/${reportId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setReports(prev => prev.map(report => 
          report.id === reportId 
            ? { ...report, verificationStatus: action }
            : report
        ));
      }
      
      return result;
    } catch (error) {
      console.error('Failed to verify report:', error);
      throw error;
    }
  };

  return {
    reports,
    threats,
    sensors,
    loading,
    fetchReports,
    verifyReport
  };
};
```

### Python Example (for IoT sensors)

```python
import requests
import json
from datetime import datetime

class WildGuardSensor:
    def __init__(self, sensor_id, api_base_url):
        self.sensor_id = sensor_id
        self.api_url = f"{api_base_url}/api/sensors"
        
    def send_data(self, data_type, value, metadata=None):
        """Send sensor data to WildGuard API"""
        payload = {
            "sensorId": self.sensor_id,
            "dataType": data_type,
            "value": value,
            "metadata": metadata or {},
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/data",
                headers={"Content-Type": "application/json"},
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    print(f"Data sent successfully: {result}")
                    return result
                else:
                    print(f"API Error: {result.get('error')}")
            else:
                print(f"HTTP Error: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"Network Error: {e}")
            
        return None

# Usage example
sensor = WildGuardSensor("sensor-uuid", "http://localhost:3000")

# Send camera trap data
camera_data = {
    "objects": ["person", "vehicle"],
    "confidence": 0.89,
    "night_vision": True
}

result = sensor.send_data("image", camera_data, {
    "battery_level": 78,
    "temperature": 24.5
})
```

---

## 🔧 Environment Setup

**Development Environment:**
```bash
# Clone repository
git clone <repo-url>
cd wildguard-api

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit environment variables
# - DATABASE_URL
# - AT_API_KEY (Africa's Talking)
# - AT_USERNAME

# Start development server
npm run dev
```

**Environment Variables:**
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://localhost:5432/wildguard
AT_API_KEY=your_africas_talking_api_key
AT_USERNAME=your_africas_talking_username
JWT_SECRET=your_jwt_secret_min_32_chars
```

---

## 📞 Support

**Issues & Bugs:** [GitHub Issues](https://github.com/wildguard/api/issues)  
**Documentation:** [Full Docs](https://docs.wildguard.conservation)  
**Email:** dev@wildguard.conservation  
**Discord:** [Developer Community](https://discord.gg/wildguard-dev)

---

*Last updated: September 23, 2025 | Version 1.0.0*