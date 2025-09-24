# 🌿 WildGuard Conservation API Documentation# 🌿 WildGuard API Documentation



**Live API Base URL:** `https://wildguard-api-gubr.onrender.com`  **Version:** 1.0.0  

**Version:** 1.0.0  **Base URL:** `http://localhost:3000` (Development) | `https://api.wildguard.conservation` (Production)  

**Interactive Documentation:** `https://wildguard-api-gubr.onrender.com/api/docs`**Last Updated:** September 23, 2025



---## 📋 Table of Contents



## 🚀 Quick Start1. [Authentication](#authentication)

2. [Community API](#community-api)

### Health Check3. [Rangers Dashboard API](#rangers-dashboard-api)

```bash4. [Sensor Network API](#sensor-network-api)

GET /health5. [System API](#system-api)

```6. [Error Handling](#error-handling)

**Response:**7. [Rate Limits](#rate-limits)

```json8. [WebSocket Events](#websocket-events)

{9. [Code Examples](#code-examples)

  "status": "ok",

  "timestamp": "2025-09-24T09:03:01.128Z",---

  "database": "connected"

}## 🔐 Authentication

```

Currently, the API uses phone number-based identification for community members and role-based access for rangers. JWT tokens will be implemented in future versions.

---

**Headers Required:**

## 🔐 Authentication```

Content-Type: application/json

Most community endpoints are open for SMS/USSD integration. Ranger endpoints require authentication.Accept: application/json

```

### Register User

```http---

POST /api/auth/register

Content-Type: application/json## 📱 Community API



{### Submit Wildlife Report

  "phoneNumber": "+254712345678",

  "name": "John Doe", **Endpoint:** `POST /api/community/report`

  "role": "community",

  "location": "Nairobi"Submit a wildlife sighting, poaching incident, or other conservation report.

}

```**Request:**

```json

### Login{

```http  "phoneNumber": "+254712345678",

POST /api/auth/login  "type": "poaching",

Content-Type: application/json  "description": "Saw 3 men with guns near waterhole",

  "latitude": -2.153456,

{  "longitude": 34.678901,

  "phoneNumber": "+254712345678"  "animalSpecies": "elephant",

}  "estimatedCount": 5,

```  "urgency": "high",

  "mediaUrls": ["https://example.com/photo1.jpg"],

---  "isAnonymous": false

}

## 📱 Community Endpoints```



### 1. USSD Callback (Africa's Talking Integration)**Response:**

```http```json

POST /api/community/ussd{

Content-Type: application/x-www-form-urlencoded  "success": true,

  "message": "Report submitted successfully",

sessionId=session123&serviceCode=*123#&phoneNumber=%2B254712345678&text=1*2*3  "reportId": "uuid-here",

```  "report": {

    "id": "uuid-here",

**USSD Menu Flow:**    "type": "poaching",

1. **Main Menu:** Wildlife Sighting | Illegal Activity | Injured Animal | Profile | Help    "priority": "high",

2. **Sub-menus** for detailed report categorization    "status": "pending",

3. **Automatic Report Creation** when flow completed    "reportedAt": "2025-09-23T14:30:00Z",

4. **SMS Confirmations** sent to reporter    "trustScore": 0.85,

    "estimatedReward": 50

**Response:** Plain text USSD response  }

}

### 2. SMS Webhook (Africa's Talking Integration)  ```

```http

POST /api/community/sms**Report Types:**

Content-Type: application/x-www-form-urlencoded- `poaching` - Illegal hunting/wildlife crime

- `wildlife_sighting` - Animal observation

from=%2B254712345678&text=REPORT%20POACHING%20Saw%203%20men%20with%20guns&to=AFTKNG&id=msg123&linkId=link123&date=2025-09-24- `suspicious_activity` - Unusual behavior in conservation area

```- `injury` - Injured wildlife

- `illegal_logging` - Forest destruction

**SMS Report Format:**- `fire` - Wildfire incident

- `REPORT POACHING [description]` - Urgent poaching report- `fence_breach` - Perimeter security breach

- `REPORT SIGHTING [description]` - Wildlife sighting

- `REPORT INJURY [description]` - Injured animal### Get User Profile

- `REPORT FIRE [description]` - Fire emergency

**Endpoint:** `GET /api/community/profile/{phoneNumber}`

**Auto-responses:** Confirmation SMS sent with report ID

Get community member's profile, trust score, and statistics.

### 3. Voice Callback (Africa's Talking Integration)

```http  **Response:**

POST /api/community/voice```json

Content-Type: application/x-www-form-urlencoded{

  "success": true,

callerNumber=%2B254712345678&dtmfDigits=1&recordingUrl=https://example.com/recording.wav  "profile": {

```    "phoneNumber": "+254712345678",

    "name": "John Doe",

**Voice Flow:**    "location": "Maasai Mara",

1. **IVR Menu:** Press 1 for Emergency, 2 for Sighting, 3 for Help    "trustScore": 85.5,

2. **Voice Recording:** Leave detailed message after beep    "totalReports": 23,

3. **Auto-transcription** and report creation    "verifiedReports": 19,

4. **SMS Confirmation** with report ID    "airtimeEarned": 1250.00,

    "rank": "Conservation Hero",

### 4. Mobile App Report Submission    "badgeLevel": "Gold",

```http    "joinedDate": "2025-01-15T10:00:00Z",

POST /api/community/report    "lastActiveAt": "2025-09-23T12:00:00Z"

Content-Type: application/json  },

Authorization: Bearer <token>  "recentReports": [

    {

{      "id": "uuid",

  "phoneNumber": "+254712345678",      "type": "wildlife_sighting",

  "type": "wildlife_sighting",      "verificationStatus": "verified",

  "description": "Herd of elephants crossing the road",      "reportedAt": "2025-09-22T16:45:00Z",

  "latitude": -1.2921,      "reward": 30.00

  "longitude": 36.8219,    }

  "animalSpecies": "African Elephant",   ]

  "estimatedCount": 12,}

  "mediaUrls": ["https://cloudinary.com/photo1.jpg"],```

  "isAnonymous": false

}### USSD Webhook

```

**Endpoint:** `POST /api/community/ussd`

**Report Types:**

- `poaching` - Urgent poaching activityHandles USSD menu interactions (internal use - Africa's Talking webhook).

- `illegal_logging` - Illegal tree cutting  

- `wildlife_sighting` - Animal sightings### SMS Webhook

- `suspicious_activity` - Unusual behavior

- `injury` - Injured animals**Endpoint:** `POST /api/community/sms`

- `fence_breach` - Broken barriers

- `fire` - Fire emergenciesProcesses SMS reports (internal use - Africa's Talking webhook).



**Response:**### Voice Webhook

```json

{**Endpoint:** `POST /api/community/voice`

  "success": true,

  "reportId": "50d59a9a-29c5-4f78-b0a6-88a175730b4b",Handles voice call reports (internal use - Africa's Talking webhook).

  "message": "Report submitted successfully. Rangers have been notified."

}---

```

## 🎯 Rangers Dashboard API

### 5. User Profile & Statistics

```http### Dashboard Overview

GET /api/community/profile/{phoneNumber}

```**Endpoint:** `GET /api/rangers/dashboard`



**Response:**Get comprehensive dashboard data for rangers.

```json

{**Response:**

  "phoneNumber": "+254712345678",```json

  "trustScore": 0.85,{

  "totalReports": 23,  "success": true,

  "verifiedReports": 19,   "dashboard": {

  "airtimeEarned": "350.00",    "summary": {

  "recentReports": [...]      "totalReports": 156,

}      "pendingReports": 12,

```      "verifiedToday": 8,

      "activeThreats": 3,

### 6. Airtime Reward Callback      "onlineRangers": 5,

```http      "sensorAlerts": 2

POST /api/community/airtime-callback    },

Content-Type: application/json    "recentReports": [

      {

{        "id": "uuid",

  "phoneNumber": "+254712345678",        "type": "poaching",

  "amount": "KES 5.00",        "priority": "urgent",

  "status": "Success",        "location": {

  "transactionId": "AT_TXN_123456",          "latitude": -2.153456,

  "requestId": "req_789"          "longitude": 34.678901

}        },

```        "description": "Gunshots heard near River Camp",

        "reportedAt": "2025-09-23T13:45:00Z",

---        "reporter": {

          "phoneNumber": "+254712345678",

## 🎖️ Rangers Dashboard Endpoints          "trustScore": 92

        },

### 1. Dashboard Overview        "distance": "2.3km"

```http      }

GET /api/rangers/dashboard    ],

Authorization: Bearer <ranger-token>    "threatPredictions": [

```      {

        "id": "uuid",

**Response:**        "type": "poaching_risk",

```json        "riskScore": 0.87,

{        "location": {

  "stats": {          "latitude": -2.150000,

    "totalReports": 156,          "longitude": 34.680000

    "urgentReports": 12,        },

    "pendingVerifications": 8,        "timeWindow": "next_6h",

    "verifiedToday": 15        "factors": ["historical_incidents", "night_activity"],

  },        "recommendedActions": [

  "recentReports": [...],          {

  "threatSummary": {            "action": "immediate_patrol",

    "currentRiskLevel": "medium",            "priority": "urgent"

    "activeThreats": 3,          }

    "predictions": [...]        ]

  },      }

  "pendingReports": [...]    ],

}    "sensorStatus": {

```      "total": 25,

      "online": 23,

### 2. Reports Management      "alerting": 2,

```http      "lowBattery": 1

GET /api/rangers/reports?status=pending&type=poaching&limit=20&page=1    }

Authorization: Bearer <ranger-token>  }

```}

```

**Query Parameters:**

- `status`: pending | verified | rejected | investigating### List Reports

- `type`: poaching | wildlife_sighting | injury | fire | etc.

- `area`: conservation area filter**Endpoint:** `GET /api/rangers/reports`

- `startDate` / `endDate`: Date range filtering

- `limit` / `page`: PaginationGet filtered list of conservation reports.



### 3. Report Verification**Query Parameters:**

```http- `status` - Filter by verification status (`pending`, `verified`, `rejected`, `investigating`)

POST /api/rangers/reports/{reportId}/verify- `type` - Filter by report type

Content-Type: application/json- `priority` - Filter by priority level

Authorization: Bearer <ranger-token>- `limit` - Number of results (default: 50)

- `offset` - Pagination offset

{- `dateFrom` - Start date (ISO 8601)

  "isVerified": true,- `dateTo` - End date (ISO 8601)

  "notes": "Confirmed via drone patrol",- `location` - Filter by area/GPS bounds

  "rangerId": "ranger-uuid-123"

}**Example:** `GET /api/rangers/reports?status=pending&priority=high&limit=20`

```

**Response:**

### 4. Threat Analysis```json

```http{

POST /api/rangers/threats/analyze  "success": true,

Content-Type: application/json  "reports": [

Authorization: Bearer <ranger-token>    {

      "id": "uuid",

{      "type": "poaching",

  "lat": -1.2921,      "priority": "high",

  "lng": 36.8219,      "description": "Multiple gunshots at dawn",

  "reportType": "poaching"      "location": {

}        "latitude": -2.153456,

```        "longitude": 34.678901

      },

**Response:**      "reporter": {

```json        "phoneNumber": "+254712345678",

{        "trustScore": 88,

  "analysis": {        "name": "Anonymous"

    "riskScore": 0.78,      },

    "threatLevel": "high",      "verificationStatus": "pending",

    "factors": ["High poaching history", "Remote location"],      "reportedAt": "2025-09-23T06:15:00Z",

    "recommendations": ["Increase patrols", "Install camera trap"]      "mediaUrls": ["https://example.com/audio1.mp3"],

  }      "threatAnalysis": {

}        "riskScore": 0.91,

```        "confidence": 0.85,

        "patterns": ["night_activity", "escalating_threat"]

### 5. Real-time Alert Stream      }

```http      }

GET /api/rangers/alerts/stream  ],

Authorization: Bearer <ranger-token>  "pagination": {

Accept: text/event-stream    "total": 156,

```    "limit": 20,

    "offset": 0,

**Server-Sent Events:**    "hasMore": true

```  }

data: {"type":"urgent_reports","data":[...],"timestamp":"..."}}

```

data: {"type":"threat_alert","data":{"level":"high",...},"timestamp":"..."}

```### Verify Report



### 6. Conservation Analytics**Endpoint:** `POST /api/rangers/reports/{reportId}/verify`

```http

GET /api/rangers/analytics?timeframe=30dVerify or reject a community report.

Authorization: Bearer <ranger-token>

```**Request:**

```json

**Response:**{

```json  "action": "verify",

{  "notes": "Confirmed by patrol team. Evidence collected.",

  "timeframe": "30d",  "rewardAmount": 75.00,

  "summary": {  "followUpRequired": false

    "totalReports": 45,}

    "verifiedReports": 38,```

    "poachingIncidents": 8,

    "wildlifeSightings": 25**Actions:**

  },- `verify` - Confirm report is accurate

  "trends": {- `reject` - Report is false/spam

    "reportsByType": {"poaching": 8, "sighting": 25},- `investigate` - Needs further investigation

    "reportsByDay": {"2025-09-20": 3, "2025-09-21": 5},

    "hotspots": [{"lat": -1.29, "lng": 36.82, "count": 12}]**Response:**

  },```json

  "insights": [{

    {  "success": true,

      "type": "alert",   "message": "Report verified successfully",

      "message": "High poaching activity detected: 8 incidents",  "report": {

      "recommendation": "Increase ranger patrols in affected areas"    "id": "uuid",

    }    "verificationStatus": "verified",

  ]    "verifiedAt": "2025-09-23T14:30:00Z",

}    "verifiedBy": "ranger-uuid",

```    "reward": {

      "amount": 75.00,

### 7. Patrol Management      "status": "pending",

```http      "transactionId": "at-transaction-id"

GET /api/rangers/patrols    }

Authorization: Bearer <ranger-token>  }

```}

```

**Response:**

```json### Get Threat Predictions

[

  {**Endpoint:** `GET /api/rangers/threats`

    "id": "1",

    "name": "Morning Perimeter Check",Get current AI-generated threat predictions.

    "status": "active",

    "leadRanger": "John Kamau",**Query Parameters:**

    "area": "North Sector",- `riskLevel` - Filter by risk level (`low`, `medium`, `high`)

    "startTime": "2025-09-24T06:00:00Z",- `type` - Threat type (`poaching_risk`, `fire_risk`, `human_activity`)

    "waypoints": [- `radius` - Search radius in km

      {"lat": -1.2921, "lng": 36.8219},- `lat`, `lng` - Center coordinates for radius search

      {"lat": -1.2925, "lng": 36.8225}

    ]**Response:**

  }```json

]{

```  "success": true,

  "threats": [

---    {

      "id": "uuid",

## 📡 IoT Sensors & Night Guard      "type": "poaching_risk",

      "riskScore": 0.89,

### 1. Submit Sensor Data      "confidence": 0.92,

```http      "location": {

POST /api/sensors/data        "latitude": -2.155000,

Content-Type: application/json        "longitude": 34.675000

      },

{      "timeWindow": "next_12h",

  "sensorId": "sensor-uuid-123",      "validFrom": "2025-09-23T20:00:00Z",

  "dataType": "image",      "validTo": "2025-09-24T08:00:00Z",

  "value": {      "factors": {

    "imageUrl": "https://s3.amazonaws.com/camera-trap-123.jpg",        "historicalIncidents": 5,

    "detections": ["elephant", "human"]        "timePatterns": ["night_activity", "weekend_activity"],

  },        "recentActivity": 2,

  "metadata": {        "sensorAlerts": 1

    "temperature": 28.5,      },

    "batteryLevel": 85      "recommendedActions": [

  },        {

  "timestamp": "2025-09-24T09:00:00Z"          "action": "night_surveillance",

}          "priority": "high",

```          "description": "Increase night-time monitoring in this area"

        },

**Data Types:** image | audio | movement | temperature | humidity | gps        {

          "action": "community_alert", 

### 2. Register New Sensor          "priority": "medium",

```http          "description": "Alert local community leaders"

POST /api/sensors/register        }

Content-Type: application/json      ]

    }

{  ]

  "deviceId": "CAMERA_TRAP_001",}

  "name": "North Waterhole Camera",```

  "type": "camera_trap",

  "latitude": -1.2921,### Analyze Location Threats

  "longitude": 36.8219,

  "conservationAreaId": "area-uuid-123",**Endpoint:** `POST /api/rangers/threats/analyze`

  "configuration": {

    "sensitivity": "high",Analyze threat level at specific location.

    "recordingDuration": 30

  }**Request:**

}```json

```{

  "latitude": -2.153456,

**Sensor Types:** camera_trap | motion_sensor | acoustic_sensor | gps_collar | weather_station  "longitude": 34.678901,

  "reportType": "poaching"

### 3. Sensor Status & Health}

```http```

GET /api/sensors/status/{sensorId}

```**Response:**

```json

**Response:**{

```json  "success": true,

{  "analysis": {

  "sensor": {    "location": {

    "id": "sensor-uuid-123",      "latitude": -2.153456,

    "name": "North Waterhole Camera",      "longitude": 34.678901

    "type": "camera_trap",    },

    "location": {"latitude": -1.2921, "longitude": 36.8219},    "riskScore": 0.76,

    "status": "active",    "riskLevel": "high",

    "batteryLevel": 85,    "confidence": 0.88,

    "lastDataReceived": "2025-09-24T08:45:00Z"    "factors": {

  },      "historicalIncidents": 3,

  "statistics": {      "recentActivity": 1,

    "totalReadingsToday": 45,      "timeOfDay": "high",

    "threatDetections": 3,      "season": "medium",

    "averageConfidence": 0.78      "proximity": "road"

  },    },

  "recentData": [...]    "patterns": ["night_activity", "escalating_threat"],

}    "recommendations": [

```      "Immediate patrol dispatch recommended",

      "Consider deploying additional sensors",

### 4. Night Guard Alerts      "Alert community in 2km radius"

```http    ]

GET /api/sensors/alerts?hours=24  }

```}

```

**Response:**

```json### Real-time Alerts Stream

{

  "summary": {**Endpoint:** `GET /api/rangers/alerts/stream`

    "totalAlerts": 15,

    "highPriorityAlerts": 3,Server-Sent Events stream for real-time alerts.

    "timeRange": "24 hours",

    "mostActiveHours": ["22:00-02:00", "04:00-06:00"]**Response Stream:**

  },```

  "alerts": [data: {"type":"new_report","priority":"urgent","reportId":"uuid","location":{"lat":-2.153,"lng":34.678}}

    {

      "id": "alert-123",data: {"type":"threat_detected","threatLevel":"high","sensorId":"sensor-uuid","confidence":0.91}

      "sensorId": "sensor-uuid-123", 

      "threatLevel": "high",data: {"type":"verification_needed","reportId":"uuid","trustScore":0.95}

      "description": "Human activity detected in restricted area",```

      "timestamp": "2025-09-24T02:30:00Z",

      "location": {"lat": -1.29, "lng": 36.82},### Analytics

      "confidence": 0.89

    }**Endpoint:** `GET /api/rangers/analytics`

  ]

}Get conservation analytics and statistics.

```

**Query Parameters:**

### 5. Sensor Network Overview- `period` - Time period (`7d`, `30d`, `90d`, `1y`)

```http- `type` - Analytics type (`incidents`, `community`, `sensors`, `threats`)

GET /api/sensors/network

```**Response:**

```json

**Response:**{

```json  "success": true,

{  "analytics": {

  "overview": {    "period": "30d",

    "totalSensors": 25,    "summary": {

    "activeSensors": 23,      "totalIncidents": 45,

    "onlineSensors": 20,      "resolved": 38,

    "sensorsWithThreats": 5,      "prevented": 12,

    "totalThreatsLast24h": 15,      "communityEngagement": 89.5,

    "averageBatteryLevel": 78.5,      "responseTime": "18min",

    "sensorTypes": {      "successRate": 84.4

      "camera_trap": 15,    },

      "motion_sensor": 8,    "trends": {

      "acoustic_sensor": 2      "incidentsByType": {

    }        "poaching": 15,

  },        "wildlife_sighting": 20,

  "sensors": [...]        "suspicious_activity": 8,

}        "injury": 2

```      },

      "timePatterns": {

### 6. Sensor Maintenance        "peak_hours": ["22:00", "23:00", "02:00", "05:00"],

```http        "peak_days": ["Friday", "Saturday", "Sunday"]

POST /api/sensors/{sensorId}/maintenance      },

Content-Type: application/json      "hotspots": [

        {

{          "area": "Water Hole 3",

  "status": "maintenance",          "incidents": 8,

  "batteryLevel": 45,          "riskIncrease": 45.2

  "notes": "Cleaning lens and replacing batteries"        }

}      ]

```    },

    "communityStats": {

---      "activeReporters": 156,

      "newMembers": 23,

## ⚡ System Endpoints      "avgTrustScore": 78.5,

      "airtimePaid": 12450.00

### 1. API Statistics    }

```http  }

GET /api/stats}

``````



**Response:**---

```json

{## 📡 Sensor Network API

  "api": {

    "version": "1.0.0",### Submit Sensor Data

    "uptime": "15 days",

    "requestsToday": 1247**Endpoint:** `POST /api/sensors/data`

  },

  "conservation": {Submit sensor readings for threat analysis (IoT devices).

    "totalReports": 2847,

    "activeSensors": 23,**Request:**

    "registeredUsers": 156```json

  },{

  "africasTalking": {  "sensorId": "sensor-uuid",

    "smssSentToday": 45,  "dataType": "image",

    "airtimeDistributed": "KES 450.00"  "value": {

  }    "objects": ["person", "vehicle"],

}    "confidence": 0.89,

```    "night_vision": true

  },

### 2. Test SMS (Development)  "metadata": {

```http    "camera_model": "TrailCam Pro",

POST /api/test-sms    "battery_level": 78,

Content-Type: application/json    "temperature": 24.5

  },

{  "timestamp": "2025-09-23T02:15:00Z"

  "to": "+254712345678",}

  "message": "Test message"```

}

```**Data Types:**

- `image` - Camera trap photos

### 3. Emergency Alert Broadcast- `audio` - Acoustic sensor recordings  

```http- `movement` - Motion sensor data

POST /api/emergency-alert- `gps` - GPS collar tracking

Content-Type: application/json- `temperature` - Weather station data

- `humidity` - Environmental monitoring

{

  "type": "fire",**Response:**

  "location": "Maasai Mara North",```json

  "severity": "high",{

  "message": "Large wildfire detected. Evacuate wildlife area immediately."  "success": true,

}  "message": "Sensor data processed successfully",

```  "sensorId": "sensor-uuid",

  "processed": true,

### 4. Process External Sensor Data  "threatAnalysis": {

```http    "threatLevel": "medium",

POST /api/sensor-data    "confidence": 0.89,

Content-Type: application/json    "alertGenerated": true,

    "recommendedAction": "Monitor group activity - Consider patrol"

{  }

  "deviceId": "WEATHER_STATION_001",}

  "data": {```

    "temperature": 28.5,

    "humidity": 65,### Register Sensor

    "windSpeed": 12

  }**Endpoint:** `POST /api/sensors/register`

}

```Register a new IoT sensor device.



---**Request:**

```json

## 📊 Response Formats{

  "deviceId": "WILDCAM001",

### Success Response  "name": "Water Hole Camera 3",

```json  "type": "camera_trap",

{  "latitude": -2.153456,

  "success": true,  "longitude": 34.678901,

  "data": {...},  "conservationAreaId": "area-uuid",

  "message": "Operation completed successfully"  "configuration": {

}    "capture_interval": 300,

```    "night_vision": true,

    "motion_sensitivity": "high"

### Error Response  }

```json}

{```

  "success": false,

  "error": "Validation failed",**Sensor Types:**

  "details": {- `camera_trap` - Motion-activated cameras

    "field": "phoneNumber",- `motion_sensor` - Movement detection

    "message": "Invalid phone number format"- `acoustic_sensor` - Sound monitoring

  },- `gps_collar` - Animal tracking

  "code": "VALIDATION_ERROR"- `weather_station` - Environmental data

}

```**Response:**

```json

### Common HTTP Status Codes{

- `200` - Success  "success": true,

- `201` - Created    "message": "Sensor registered successfully", 

- `400` - Bad Request (validation error)  "sensorId": "sensor-uuid",

- `401` - Unauthorized  "sensor": {

- `403` - Forbidden    "id": "sensor-uuid",

- `404` - Not Found    "deviceId": "WILDCAM001",

- `409` - Conflict (duplicate resource)    "name": "Water Hole Camera 3",

- `429` - Rate Limited    "type": "camera_trap",

- `500` - Internal Server Error    "location": {

      "latitude": -2.153456,

---      "longitude": 34.678901

    },

## 🔄 Real-time Features    "status": "active"

  }

### WebSocket Placeholder}

```http```

GET /api/ws

```### Get Sensor Status



**Response:****Endpoint:** `GET /api/sensors/status/{sensorId}`

```json

{Get sensor health and recent activity.

  "message": "WebSocket endpoint - implement with Socket.IO for real-time updates",

  "endpoints": {**Response:**

    "alerts": "/api/rangers/alerts/stream",```json

    "reports": "ws://localhost:3000/reports",{

    "threats": "ws://localhost:3000/threats"  "success": true,

  }  "sensor": {

}    "id": "sensor-uuid",

```    "deviceId": "WILDCAM001", 

    "name": "Water Hole Camera 3",

### Server-Sent Events (Alerts Stream)    "type": "camera_trap",

```javascript    "location": {

const eventSource = new EventSource('/api/rangers/alerts/stream');      "latitude": -2.153456,

      "longitude": 34.678901

eventSource.addEventListener('urgent_reports', (event) => {    },

  const reports = JSON.parse(event.data);    "status": "active",

  // Handle urgent reports    "batteryLevel": 78,

});    "lastDataReceived": "2025-09-23T14:22:00Z",

    "installationDate": "2025-08-15T09:00:00Z"

eventSource.addEventListener('threat_alert', (event) => {  },

  const alert = JSON.parse(event.data);  "statistics": {

  // Handle threat alerts    "totalReadingsToday": 45,

});    "threatDetections": 3,

```    "lastReading": "2025-09-23T14:22:00Z",

    "averageConfidence": 0.82

---  },

  "recentData": [

## 🎯 Integration Examples    {

      "id": "data-uuid",

### Frontend JavaScript      "dataType": "image",

```javascript      "threatLevel": "medium",

// Submit wildlife report      "confidence": "0.89",

const submitReport = async (reportData) => {      "recordedAt": "2025-09-23T14:22:00Z",

  const response = await fetch('/api/community/report', {      "description": "Human presence detected - Vehicle movement at 14:22"

    method: 'POST',    }

    headers: {  ]

      'Content-Type': 'application/json',}

      'Authorization': `Bearer ${userToken}````

    },

    body: JSON.stringify(reportData)### Get Night Guard Alerts

  });

  **Endpoint:** `GET /api/sensors/alerts`

  return response.json();

};Get recent automated threat alerts from sensor network.



// Get ranger dashboard**Query Parameters:**

const getDashboard = async (rangerToken) => {- `hours` - Time window in hours (default: 24)

  const response = await fetch('/api/rangers/dashboard', {

    headers: { 'Authorization': `Bearer ${rangerToken}` }**Response:**

  });```json

  {

  return response.json();  "success": true,

};  "summary": {

    "totalAlerts": 12,

// Real-time alerts    "highThreatAlerts": 2,

const connectAlerts = (rangerToken) => {    "mediumThreatAlerts": 7,

  const eventSource = new EventSource('/api/rangers/alerts/stream', {    "timeRange": "24 hours",

    headers: { 'Authorization': `Bearer ${rangerToken}` }    "topThreats": [

  });      {

          "timestamp": "2025-09-23T02:15:00Z",

  eventSource.onmessage = (event) => {        "location": "Camera Trap 001",

    const data = JSON.parse(event.data);        "threatLevel": "high",

    if (data.type === 'urgent_reports') {        "confidence": "0.91",

      showUrgentAlert(data.data);        "description": "Human presence with weapon detected - Vehicle movement at 2:15 AM"

    }      }

  };    ]

    }

  return eventSource;}

};```

```

### Get Sensor Network Overview

### Africa's Talking Webhooks

Configure your AT account to send callbacks to:**Endpoint:** `GET /api/sensors/network`

- **USSD:** `https://wildguard-api-gubr.onrender.com/api/community/ussd`

- **SMS:** `https://wildguard-api-gubr.onrender.com/api/community/sms`  Get complete sensor network status.

- **Voice:** `https://wildguard-api-gubr.onrender.com/api/community/voice`

- **Airtime:** `https://wildguard-api-gubr.onrender.com/api/community/airtime-callback`**Response:**

```json

### IoT Device Integration{

```javascript  "success": true,

// Send sensor data from camera trap  "overview": {

const sendSensorData = async (sensorId, imageData) => {    "totalSensors": 25,

  await fetch('/api/sensors/data', {    "activeSensors": 23,

    method: 'POST',    "onlineSensors": 21,

    headers: { 'Content-Type': 'application/json' },    "sensorsWithThreats": 3,

    body: JSON.stringify({    "totalThreatsLast24h": 8,

      sensorId,    "averageBatteryLevel": 76.4,

      dataType: 'image',    "sensorTypes": {

      value: {      "camera_trap": 15,

        imageUrl: imageData.url,      "acoustic_sensor": 5,

        detections: imageData.aiDetections      "motion_sensor": 3,

      },      "gps_collar": 2

      metadata: {    }

        batteryLevel: getBatteryLevel(),  },

        temperature: getTemperature()  "sensors": [

      }    {

    })      "id": "sensor-uuid",

  });      "deviceId": "WILDCAM001",

};      "name": "Water Hole Camera 3",

      "type": "camera_trap",

// Register new sensor device      "location": {

const registerSensor = async (sensorConfig) => {        "latitude": -2.153456,

  const response = await fetch('/api/sensors/register', {        "longitude": 34.678901

    method: 'POST',      },

    headers: { 'Content-Type': 'application/json' },      "status": "active",

    body: JSON.stringify(sensorConfig)      "batteryLevel": 78,

  });      "lastDataReceived": "2025-09-23T14:22:00Z",

        "stats": {

  const result = await response.json();        "readingsLast24h": 45,

  if (result.success) {        "threatsDetected": 2,

    console.log(`Sensor registered: ${result.sensorId}`);        "isOnline": true

  }      }

};    }

```  ]

}

---```



## 🚨 Key Features### Update Sensor Maintenance



### 🔄 Automatic Processing**Endpoint:** `POST /api/sensors/{sensorId}/maintenance`

- **Threat Analysis**: AI-powered risk assessment for all reports

- **Ranger Alerts**: SMS notifications for urgent reports  Update sensor maintenance status.

- **Airtime Rewards**: Automatic 1-5 KES rewards for verified reports

- **Trust Scoring**: 0.0-1.0 reliability scores for community reporters**Request:**

```json

### 📱 Multi-Channel Reporting{

- **SMS**: Text "REPORT POACHING [details]" to shortcode  "status": "maintenance",

- **USSD**: Dial *123# for guided menu system  "batteryLevel": 95,

- **Voice**: Call hotline for voice recordings  "notes": "Battery replaced, lens cleaned"

- **Mobile App**: Rich reports with GPS and photos}

```

### 🌙 Night Guard System

- **Automated Monitoring**: 24/7 sensor data processing**Response:**

- **Threat Detection**: AI analysis of camera trap images```json

- **Real-time Alerts**: Instant notifications for suspicious activity{

- **Pattern Analysis**: Historical threat trend analysis  "success": true,

  "message": "Sensor maintenance status updated",

### 📊 Conservation Intelligence    "sensorId": "sensor-uuid",

- **Hotspot Identification**: Geographic clustering of incidents  "updates": {

- **Predictive Analytics**: Risk forecasting for areas    "status": "maintenance",

- **Performance Metrics**: Verification rates and response times    "batteryLevel": 95

- **Species Tracking**: Wildlife population and movement insights  }

}

---```



## 🛡️ Security & Limits---



- **Rate Limiting**: 1000 requests/hour for authenticated users## ⚙️ System API

- **CORS**: Enabled for all origins (development mode)

- **File Uploads**: Max 10MB per file, 10 files/hour### Health Check

- **SMS Costs**: Tracked and monitored via Africa's Talking callbacks

- **Data Privacy**: Anonymous reporting supported for sensitive cases**Endpoint:** `GET /health`

- **Validation**: Zod schema validation for all inputs

- **Error Handling**: Comprehensive error responses with detailsCheck system health and status.



---**Response:**

```json

## 📈 Production Status{

  "status": "healthy",

### ✅ Live Deployment  "timestamp": "2025-09-23T14:30:00Z",

- **URL**: https://wildguard-api-gubr.onrender.com  "version": "1.0.0",

- **Status**: Production Ready  "services": {

- **Health**: `/health` endpoint available    "database": "connected",

- **Uptime**: Auto-scaling on Render cloud    "africasTalking": "operational",

- **Database**: PostgreSQL with connection pooling    "redis": "connected",

    "sensors": "monitoring"

### 🔧 Current Capabilities  },

- **SMS Integration**: Fully operational with sender ID "AFTKNG"  "uptime": "15d 8h 23m"

- **USSD Menus**: Complete flow implementation}

- **Voice IVR**: Recording and transcription ready```

- **Threat Analysis**: AI-powered risk assessment active

- **Sensor Network**: IoT data processing operational### API Statistics

- **Night Guard**: Automated monitoring system running

- **Airtime Rewards**: 1-5 KES distribution working**Endpoint:** `GET /api/stats`

- **Database Seeding**: Comprehensive test data available

Get API usage statistics.

### 📊 Performance Metrics

From deployment logs showing successful operations:**Response:**

- **Reports Created**: Multiple successful report submissions```json

- **SMS Notifications**: Rangers alerted automatically{

- **Threat Analysis**: Risk scores calculated (0.39-0.78 range)  "success": true,

- **Airtime Distribution**: Callback system operational  "stats": {

- **Database**: All operations completing successfully    "totalRequests": 15420,

    "requestsToday": 523,

---    "averageResponseTime": "145ms",

    "endpoints": {

## 🆘 Support      "/api/community/report": 8934,

      "/api/rangers/reports": 3241,

- **Live API**: https://wildguard-api-gubr.onrender.com      "/api/sensors/data": 2156

- **Health Check**: https://wildguard-api-gubr.onrender.com/health      },

- **Interactive Docs**: https://wildguard-api-gubr.onrender.com/api/docs    "errorRate": 0.02,

- **SMS Sender ID**: AFTKNG    "uptime": 99.8

- **GitHub**: AfricasTalkingHackathons/wildguard-api  }

}

### Example API Calls```

```bash

# Test API health### Test SMS Integration

curl https://wildguard-api-gubr.onrender.com/health

**Endpoint:** `POST /api/test-sms`

# Get API documentation

curl https://wildguard-api-gubr.onrender.com/api/docsTest Africa's Talking SMS integration.



# Submit test report (replace with valid data)**Request:**

curl -X POST https://wildguard-api-gubr.onrender.com/api/community/report \```json

  -H "Content-Type: application/json" \{

  -d '{  "phoneNumber": "+254712345678",

    "phoneNumber": "+254712345678",  "message": "Test message from WildGuard API"

    "type": "wildlife_sighting",}

    "description": "Elephants near waterhole",```

    "latitude": -1.2921,

    "longitude": 36.8219**Response:**

  }'```json

```{

  "success": true,

For technical support or API access, contact the WildGuard development team.  "message": "SMS sent successfully",
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