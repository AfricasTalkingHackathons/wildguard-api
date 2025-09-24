<div align="center"># 🌿 WildGuard Conservation API Documentation# 🌿 WildGuard API Documentation



# 🌿 WildGuard Conservation API

### *Protecting Africa's Wildlife Through Technology*

**Live API Base URL:** `https://wildguard-api-gubr.onrender.com`  **Version:** 1.0.0  

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

![Status](https://img.shields.io/badge/status-production-brightgreen.svg)**Version:** 1.0.0  **Base URL:** `http://localhost:3000` (Development) | `https://api.wildguard.conservation` (Production)  

![Platform](https://img.shields.io/badge/platform-Africa's%20Talking-blue.svg)

**Interactive Documentation:** `https://wildguard-api-gubr.onrender.com/api/docs`**Last Updated:** September 23, 2025

**🌐 Live API:** `https://wildguard-api-gubr.onrender.com`  

**📚 Interactive Docs:** [`/api/docs`](https://wildguard-api-gubr.onrender.com/api/docs)  

**💚 Health Check:** [`/health`](https://wildguard-api-gubr.onrender.com/health)

---## 📋 Table of Contents

</div>



---

## 🚀 Quick Start1. [Authentication](#authentication)

## 📋 Table of Contents

2. [Community API](#community-api)

| Section | Description |

|---------|-------------|### Health Check3. [Rangers Dashboard API](#rangers-dashboard-api)

| [🚀 Quick Start](#-quick-start) | Get up and running in minutes |

| [🔐 Authentication](#-authentication) | User registration and login |```bash4. [Sensor Network API](#sensor-network-api)

| [📱 Community API](#-community-api) | SMS, USSD, Voice, Mobile reporting |

| [🎖️ Rangers Dashboard](#️-rangers-dashboard) | Management and analytics |GET /health5. [System API](#system-api)

| [📡 IoT & Sensors](#-iot--sensors) | Night Guard and sensor network |

| [⚡ System API](#-system-api) | Health, stats, and utilities |```6. [Error Handling](#error-handling)

| [🎯 Integration Examples](#-integration-examples) | Frontend and webhook examples |

| [🚨 Features Overview](#-features-overview) | Key capabilities |**Response:**7. [Rate Limits](#rate-limits)

| [🛡️ Security & Production](#️-security--production) | Deployment and security info |

```json8. [WebSocket Events](#websocket-events)

---

{9. [Code Examples](#code-examples)

## 🚀 Quick Start

  "status": "ok",

> **Ready to test?** All endpoints are live and operational!

  "timestamp": "2025-09-24T09:03:01.128Z",---

### ✅ Health Check

```http  "database": "connected"

GET https://wildguard-api-gubr.onrender.com/health

```}## 🔐 Authentication



<details>```

<summary><strong>📋 Response Example</strong></summary>

Currently, the API uses phone number-based identification for community members and role-based access for rangers. JWT tokens will be implemented in future versions.

```json

{---

  "status": "ok",

  "timestamp": "2025-09-24T09:03:01.128Z",**Headers Required:**

  "database": "connected",

  "environment": "production"## 🔐 Authentication```

}

```Content-Type: application/json

</details>

Most community endpoints are open for SMS/USSD integration. Ranger endpoints require authentication.Accept: application/json

### 🔗 Quick Links

- **📊 API Stats:** [`GET /api/stats`](https://wildguard-api-gubr.onrender.com/api/stats)```

- **📖 Full Documentation:** [`GET /api/docs`](https://wildguard-api-gubr.onrender.com/api/docs)

- **🔍 Interactive Explorer:** Available at base URL### Register User



---```http---



## 🔐 AuthenticationPOST /api/auth/register



> Most community endpoints are open for SMS/USSD integration. Rangers require authentication tokens.Content-Type: application/json## 📱 Community API



### 👤 Register User



<div style="background: #f6f8fa; padding: 16px; border-radius: 8px; margin: 16px 0;">{### Submit Wildlife Report



```http  "phoneNumber": "+254712345678",

POST /api/auth/register

Content-Type: application/json  "name": "John Doe", **Endpoint:** `POST /api/community/report`

```

  "role": "community",

```json

{  "location": "Nairobi"Submit a wildlife sighting, poaching incident, or other conservation report.

  "phoneNumber": "+254712345678",

  "name": "John Doe", }

  "role": "community",

  "location": "Nairobi"```**Request:**

}

``````json



</div>### Login{



### 🔑 Login User```http  "phoneNumber": "+254712345678",



<div style="background: #f6f8fa; padding: 16px; border-radius: 8px; margin: 16px 0;">POST /api/auth/login  "type": "poaching",



```httpContent-Type: application/json  "description": "Saw 3 men with guns near waterhole",

POST /api/auth/login

Content-Type: application/json  "latitude": -2.153456,

```

{  "longitude": 34.678901,

```json

{  "phoneNumber": "+254712345678"  "animalSpecies": "elephant",

  "phoneNumber": "+254712345678"

}}  "estimatedCount": 5,

```

```  "urgency": "high",

</div>

  "mediaUrls": ["https://example.com/photo1.jpg"],

---

---  "isAnonymous": false

## 📱 Community API

}

> **Multi-channel wildlife reporting system** - SMS, USSD, Voice, and Mobile App integration

## 📱 Community Endpoints```

### 📟 1. USSD Callback (Africa's Talking)



<div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px; margin: 16px 0;">

<strong>🎯 Endpoint:</strong> <code>POST /api/community/ussd</code><br>### 1. USSD Callback (Africa's Talking Integration)**Response:**

<strong>📡 Format:</strong> <code>application/x-www-form-urlencoded</code>

</div>```http```json



```httpPOST /api/community/ussd{

POST /api/community/ussd

Content-Type: application/x-www-form-urlencodedContent-Type: application/x-www-form-urlencoded  "success": true,



sessionId=session123&serviceCode=*123#&phoneNumber=%2B254712345678&text=1*2*3  "message": "Report submitted successfully",

```

sessionId=session123&serviceCode=*123#&phoneNumber=%2B254712345678&text=1*2*3  "reportId": "uuid-here",

#### 🗂️ USSD Menu Flow

```  "report": {

| Step | Menu Options |

|------|-------------|    "id": "uuid-here",

| **1️⃣ Main** | Wildlife Sighting \| Illegal Activity \| Injured Animal \| Profile \| Help |

| **2️⃣ Sub-menus** | Detailed report categorization |**USSD Menu Flow:**    "type": "poaching",

| **3️⃣ Auto-creation** | Report generated automatically |

| **4️⃣ SMS Confirmation** | Confirmation sent to reporter |1. **Main Menu:** Wildlife Sighting | Illegal Activity | Injured Animal | Profile | Help    "priority": "high",



<details>2. **Sub-menus** for detailed report categorization    "status": "pending",

<summary><strong>🔄 Response Format</strong></summary>

3. **Automatic Report Creation** when flow completed    "reportedAt": "2025-09-23T14:30:00Z",

Returns plain text USSD response for AT integration.

4. **SMS Confirmations** sent to reporter    "trustScore": 0.85,

</details>

    "estimatedReward": 50

### 💬 2. SMS Webhook (Africa's Talking)

**Response:** Plain text USSD response  }

<div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px; margin: 16px 0;">

<strong>🎯 Endpoint:</strong> <code>POST /api/community/sms</code><br>}

<strong>📡 Sender ID:</strong> <code>AFTKNG</code>

</div>### 2. SMS Webhook (Africa's Talking Integration)  ```



```http```http

POST /api/community/sms

Content-Type: application/x-www-form-urlencodedPOST /api/community/sms**Report Types:**



from=%2B254712345678&text=REPORT%20POACHING%20Saw%203%20men%20with%20guns&to=AFTKNGContent-Type: application/x-www-form-urlencoded- `poaching` - Illegal hunting/wildlife crime

```

- `wildlife_sighting` - Animal observation

#### 📝 SMS Report Formats

from=%2B254712345678&text=REPORT%20POACHING%20Saw%203%20men%20with%20guns&to=AFTKNG&id=msg123&linkId=link123&date=2025-09-24- `suspicious_activity` - Unusual behavior in conservation area

| Format | Type | Priority |

|--------|------|----------|```- `injury` - Injured wildlife

| `REPORT POACHING [description]` | 🚨 Urgent poaching | HIGH |

| `REPORT SIGHTING [description]` | 🐘 Wildlife sighting | MEDIUM |- `illegal_logging` - Forest destruction

| `REPORT INJURY [description]` | 🏥 Injured animal | HIGH |

| `REPORT FIRE [description]` | 🔥 Fire emergency | URGENT |**SMS Report Format:**- `fire` - Wildfire incident



**Auto-responses:** ✅ Confirmation SMS sent with unique report ID- `REPORT POACHING [description]` - Urgent poaching report- `fence_breach` - Perimeter security breach



### 📞 3. Voice Callback (Africa's Talking)- `REPORT SIGHTING [description]` - Wildlife sighting



<div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px; margin: 16px 0;">- `REPORT INJURY [description]` - Injured animal### Get User Profile

<strong>🎯 Endpoint:</strong> <code>POST /api/community/voice</code><br>

<strong>🎙️ Features:</strong> IVR Menu + Voice Recording- `REPORT FIRE [description]` - Fire emergency

</div>

**Endpoint:** `GET /api/community/profile/{phoneNumber}`

```http

POST /api/community/voice**Auto-responses:** Confirmation SMS sent with report ID

Content-Type: application/x-www-form-urlencoded

Get community member's profile, trust score, and statistics.

callerNumber=%2B254712345678&dtmfDigits=1&recordingUrl=https://example.com/recording.wav

```### 3. Voice Callback (Africa's Talking Integration)



#### 🎤 Voice Flow```http  **Response:**



```mermaidPOST /api/community/voice```json

graph TD

    A[📞 Incoming Call] --> B[🎵 IVR Menu]Content-Type: application/x-www-form-urlencoded{

    B --> C[1️⃣ Emergency]

    B --> D[2️⃣ Sighting]  "success": true,

    B --> E[3️⃣ Help]

    C --> F[🎙️ Record Message]callerNumber=%2B254712345678&dtmfDigits=1&recordingUrl=https://example.com/recording.wav  "profile": {

    D --> F

    F --> G[🤖 Auto-transcription]```    "phoneNumber": "+254712345678",

    G --> H[📄 Report Created]

    H --> I[💬 SMS Confirmation]    "name": "John Doe",

```

**Voice Flow:**    "location": "Maasai Mara",

### 📱 4. Mobile App Report Submission

1. **IVR Menu:** Press 1 for Emergency, 2 for Sighting, 3 for Help    "trustScore": 85.5,

<div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px; margin: 16px 0;">

<strong>🎯 Endpoint:</strong> <code>POST /api/community/report</code><br>2. **Voice Recording:** Leave detailed message after beep    "totalReports": 23,

<strong>🔒 Auth:</strong> Bearer Token Required

</div>3. **Auto-transcription** and report creation    "verifiedReports": 19,



```http4. **SMS Confirmation** with report ID    "airtimeEarned": 1250.00,

POST /api/community/report

Content-Type: application/json    "rank": "Conservation Hero",

Authorization: Bearer <token>

```### 4. Mobile App Report Submission    "badgeLevel": "Gold",



<details>```http    "joinedDate": "2025-01-15T10:00:00Z",

<summary><strong>📋 Request Body Example</strong></summary>

POST /api/community/report    "lastActiveAt": "2025-09-23T12:00:00Z"

```json

{Content-Type: application/json  },

  "phoneNumber": "+254712345678",

  "type": "wildlife_sighting",Authorization: Bearer <token>  "recentReports": [

  "description": "Herd of elephants crossing the road",

  "latitude": -1.2921,    {

  "longitude": 36.8219,

  "animalSpecies": "African Elephant", {      "id": "uuid",

  "estimatedCount": 12,

  "mediaUrls": ["https://cloudinary.com/photo1.jpg"],  "phoneNumber": "+254712345678",      "type": "wildlife_sighting",

  "isAnonymous": false

}  "type": "wildlife_sighting",      "verificationStatus": "verified",

```

  "description": "Herd of elephants crossing the road",      "reportedAt": "2025-09-22T16:45:00Z",

</details>

  "latitude": -1.2921,      "reward": 30.00

#### 📊 Report Types

  "longitude": 36.8219,    }

<div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0;">

<span style="background: #dc3545; color: white; padding: 4px 8px; border-radius: 4px;">🚨 poaching</span>  "animalSpecies": "African Elephant",   ]

<span style="background: #fd7e14; color: white; padding: 4px 8px; border-radius: 4px;">🌳 illegal_logging</span>

<span style="background: #28a745; color: white; padding: 4px 8px; border-radius: 4px;">🐘 wildlife_sighting</span>  "estimatedCount": 12,}

<span style="background: #ffc107; color: black; padding: 4px 8px; border-radius: 4px;">👀 suspicious_activity</span>

<span style="background: #dc3545; color: white; padding: 4px 8px; border-radius: 4px;">🏥 injury</span>  "mediaUrls": ["https://cloudinary.com/photo1.jpg"],```

<span style="background: #6f42c1; color: white; padding: 4px 8px; border-radius: 4px;">🚧 fence_breach</span>

<span style="background: #e83e8c; color: white; padding: 4px 8px; border-radius: 4px;">🔥 fire</span>  "isAnonymous": false

</div>

}### USSD Webhook

<details>

<summary><strong>✅ Success Response</strong></summary>```



```json**Endpoint:** `POST /api/community/ussd`

{

  "success": true,**Report Types:**

  "reportId": "50d59a9a-29c5-4f78-b0a6-88a175730b4b",

  "message": "Report submitted successfully. Rangers have been notified."- `poaching` - Urgent poaching activityHandles USSD menu interactions (internal use - Africa's Talking webhook).

}

```- `illegal_logging` - Illegal tree cutting  



</details>- `wildlife_sighting` - Animal sightings### SMS Webhook



### 👤 5. User Profile & Statistics- `suspicious_activity` - Unusual behavior



```http- `injury` - Injured animals**Endpoint:** `POST /api/community/sms`

GET /api/community/profile/{phoneNumber}

```- `fence_breach` - Broken barriers



<details>- `fire` - Fire emergenciesProcesses SMS reports (internal use - Africa's Talking webhook).

<summary><strong>📊 Profile Response</strong></summary>



```json

{**Response:**### Voice Webhook

  "phoneNumber": "+254712345678",

  "trustScore": 0.85,```json

  "totalReports": 23,

  "verifiedReports": 19, {**Endpoint:** `POST /api/community/voice`

  "airtimeEarned": "350.00",

  "recentReports": [...]  "success": true,

}

```  "reportId": "50d59a9a-29c5-4f78-b0a6-88a175730b4b",Handles voice call reports (internal use - Africa's Talking webhook).



> **🎯 Trust Score:** Scale of 0.0 to 1.0 (85% = 0.85)  "message": "Report submitted successfully. Rangers have been notified."



</details>}---



### 💰 6. Airtime Reward Callback```



<div style="background: #28a745; color: white; padding: 16px; border-radius: 8px; margin: 16px 0;">## 🎯 Rangers Dashboard API

<strong>💰 Reward Range:</strong> 1-5 KES for verified reports<br>

<strong>🎯 Endpoint:</strong> <code>POST /api/community/airtime-callback</code>### 5. User Profile & Statistics

</div>

```http### Dashboard Overview

```json

{GET /api/community/profile/{phoneNumber}

  "phoneNumber": "+254712345678",

  "amount": "KES 5.00",```**Endpoint:** `GET /api/rangers/dashboard`

  "status": "Success",

  "transactionId": "AT_TXN_123456",

  "requestId": "req_789"

}**Response:**Get comprehensive dashboard data for rangers.

```

```json

---

{**Response:**

## 🎖️ Rangers Dashboard

  "phoneNumber": "+254712345678",```json

> **Command center for conservation teams** - Real-time monitoring, analytics, and management tools

  "trustScore": 0.85,{

### 📊 1. Dashboard Overview

  "totalReports": 23,  "success": true,

<div style="background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%); color: white; padding: 16px; border-radius: 8px; margin: 16px 0;">

<strong>🎯 Endpoint:</strong> <code>GET /api/rangers/dashboard</code><br>  "verifiedReports": 19,   "dashboard": {

<strong>🔒 Auth:</strong> Bearer Token Required

</div>  "airtimeEarned": "350.00",    "summary": {



<details>  "recentReports": [...]      "totalReports": 156,

<summary><strong>📈 Dashboard Response</strong></summary>

}      "pendingReports": 12,

```json

{```      "verifiedToday": 8,

  "stats": {

    "totalReports": 156,      "activeThreats": 3,

    "urgentReports": 12,

    "pendingVerifications": 8,### 6. Airtime Reward Callback      "onlineRangers": 5,

    "verifiedToday": 15

  },```http      "sensorAlerts": 2

  "recentReports": [...],

  "threatSummary": {POST /api/community/airtime-callback    },

    "currentRiskLevel": "medium",

    "activeThreats": 3,Content-Type: application/json    "recentReports": [

    "predictions": [...]

  },      {

  "pendingReports": [...]

}{        "id": "uuid",

```

  "phoneNumber": "+254712345678",        "type": "poaching",

</details>

  "amount": "KES 5.00",        "priority": "urgent",

### 📋 2. Reports Management

  "status": "Success",        "location": {

```http

GET /api/rangers/reports?status=pending&type=poaching&limit=20&page=1  "transactionId": "AT_TXN_123456",          "latitude": -2.153456,

Authorization: Bearer <ranger-token>

```  "requestId": "req_789"          "longitude": 34.678901



#### 🔍 Query Parameters}        },



| Parameter | Options | Description |```        "description": "Gunshots heard near River Camp",

|-----------|---------|-------------|

| `status` | pending \| verified \| rejected \| investigating | Filter by status |        "reportedAt": "2025-09-23T13:45:00Z",

| `type` | poaching \| wildlife_sighting \| injury \| fire | Filter by type |

| `area` | conservation area ID | Location filter |---        "reporter": {

| `startDate` / `endDate` | ISO dates | Date range |

| `limit` / `page` | numbers | Pagination |          "phoneNumber": "+254712345678",



### ✅ 3. Report Verification## 🎖️ Rangers Dashboard Endpoints          "trustScore": 92



<div style="background: #17a2b8; color: white; padding: 16px; border-radius: 8px; margin: 16px 0;">        },

<strong>🎯 Endpoint:</strong> <code>POST /api/rangers/reports/{reportId}/verify</code><br>

<strong>⚡ Action:</strong> Triggers airtime rewards for verified reports### 1. Dashboard Overview        "distance": "2.3km"

</div>

```http      }

```json

{GET /api/rangers/dashboard    ],

  "isVerified": true,

  "notes": "Confirmed via drone patrol",Authorization: Bearer <ranger-token>    "threatPredictions": [

  "rangerId": "ranger-uuid-123"

}```      {

```

        "id": "uuid",

### 🎯 4. Threat Analysis

**Response:**        "type": "poaching_risk",

```http

POST /api/rangers/threats/analyze```json        "riskScore": 0.87,

Content-Type: application/json

Authorization: Bearer <ranger-token>{        "location": {

```

  "stats": {          "latitude": -2.150000,

<details>

<summary><strong>🤖 AI Analysis Request</strong></summary>    "totalReports": 156,          "longitude": 34.680000



```json    "urgentReports": 12,        },

{

  "lat": -1.2921,    "pendingVerifications": 8,        "timeWindow": "next_6h",

  "lng": 36.8219,

  "reportType": "poaching"    "verifiedToday": 15        "factors": ["historical_incidents", "night_activity"],

}

```  },        "recommendedActions": [



**Response:**  "recentReports": [...],          {

```json

{  "threatSummary": {            "action": "immediate_patrol",

  "analysis": {

    "riskScore": 0.78,    "currentRiskLevel": "medium",            "priority": "urgent"

    "threatLevel": "high",

    "factors": ["High poaching history", "Remote location"],    "activeThreats": 3,          }

    "recommendations": ["Increase patrols", "Install camera trap"]

  }    "predictions": [...]        ]

}

```  },      }



</details>  "pendingReports": [...]    ],



### 🚨 5. Real-time Alert Stream}    "sensorStatus": {



<div style="background: #dc3545; color: white; padding: 16px; border-radius: 8px; margin: 16px 0;">```      "total": 25,

<strong>⚡ Live Updates:</strong> Server-Sent Events<br>

<strong>🎯 Endpoint:</strong> <code>GET /api/rangers/alerts/stream</code>      "online": 23,

</div>

### 2. Reports Management      "alerting": 2,

```http

GET /api/rangers/alerts/stream```http      "lowBattery": 1

Authorization: Bearer <ranger-token>

Accept: text/event-streamGET /api/rangers/reports?status=pending&type=poaching&limit=20&page=1    }

```

Authorization: Bearer <ranger-token>  }

**Stream Events:**

``````}

data: {"type":"urgent_reports","data":[...],"timestamp":"..."}

data: {"type":"threat_alert","data":{"level":"high",...},"timestamp":"..."}```

```

**Query Parameters:**

### 📊 6. Conservation Analytics

- `status`: pending | verified | rejected | investigating### List Reports

```http

GET /api/rangers/analytics?timeframe=30d- `type`: poaching | wildlife_sighting | injury | fire | etc.

Authorization: Bearer <ranger-token>

```- `area`: conservation area filter**Endpoint:** `GET /api/rangers/reports`



<details>- `startDate` / `endDate`: Date range filtering

<summary><strong>📈 Analytics Response</strong></summary>

- `limit` / `page`: PaginationGet filtered list of conservation reports.

```json

{

  "timeframe": "30d",

  "summary": {### 3. Report Verification**Query Parameters:**

    "totalReports": 45,

    "verifiedReports": 38,```http- `status` - Filter by verification status (`pending`, `verified`, `rejected`, `investigating`)

    "poachingIncidents": 8,

    "wildlifeSightings": 25POST /api/rangers/reports/{reportId}/verify- `type` - Filter by report type

  },

  "trends": {Content-Type: application/json- `priority` - Filter by priority level

    "reportsByType": {"poaching": 8, "sighting": 25},

    "reportsByDay": {"2025-09-20": 3, "2025-09-21": 5},Authorization: Bearer <ranger-token>- `limit` - Number of results (default: 50)

    "hotspots": [{"lat": -1.29, "lng": 36.82, "count": 12}]

  },- `offset` - Pagination offset

  "insights": [

    {{- `dateFrom` - Start date (ISO 8601)

      "type": "alert", 

      "message": "High poaching activity detected: 8 incidents",  "isVerified": true,- `dateTo` - End date (ISO 8601)

      "recommendation": "Increase ranger patrols in affected areas"

    }  "notes": "Confirmed via drone patrol",- `location` - Filter by area/GPS bounds

  ]

}  "rangerId": "ranger-uuid-123"

```

}**Example:** `GET /api/rangers/reports?status=pending&priority=high&limit=20`

</details>

```

---

**Response:**

## 📡 IoT & Sensors

### 4. Threat Analysis```json

> **Night Guard automated monitoring system** - 24/7 sensor network with AI threat detection

```http{

### 📸 1. Submit Sensor Data

POST /api/rangers/threats/analyze  "success": true,

<div style="background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 16px; border-radius: 8px; margin: 16px 0;">

<strong>🎯 Endpoint:</strong> <code>POST /api/sensors/data</code><br>Content-Type: application/json  "reports": [

<strong>🤖 Features:</strong> AI Analysis + Auto-threat Detection

</div>Authorization: Bearer <ranger-token>    {



```json      "id": "uuid",

{

  "sensorId": "sensor-uuid-123",{      "type": "poaching",

  "dataType": "image",

  "value": {  "lat": -1.2921,      "priority": "high",

    "imageUrl": "https://s3.amazonaws.com/camera-trap-123.jpg",

    "detections": ["elephant", "human"]  "lng": 36.8219,      "description": "Multiple gunshots at dawn",

  },

  "metadata": {  "reportType": "poaching"      "location": {

    "temperature": 28.5,

    "batteryLevel": 85}        "latitude": -2.153456,

  },

  "timestamp": "2025-09-24T09:00:00Z"```        "longitude": 34.678901

}

```      },



#### 🔧 Data Types**Response:**      "reporter": {



<div style="display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0;">```json        "phoneNumber": "+254712345678",

<span style="background: #007bff; color: white; padding: 4px 8px; border-radius: 4px;">📸 image</span>

<span style="background: #28a745; color: white; padding: 4px 8px; border-radius: 4px;">🎵 audio</span>{        "trustScore": 88,

<span style="background: #ffc107; color: black; padding: 4px 8px; border-radius: 4px;">🏃 movement</span>

<span style="background: #dc3545; color: white; padding: 4px 8px; border-radius: 4px;">🌡️ temperature</span>  "analysis": {        "name": "Anonymous"

<span style="background: #17a2b8; color: white; padding: 4px 8px; border-radius: 4px;">💧 humidity</span>

<span style="background: #6f42c1; color: white; padding: 4px 8px; border-radius: 4px;">🗺️ gps</span>    "riskScore": 0.78,      },

</div>

    "threatLevel": "high",      "verificationStatus": "pending",

### 🔌 2. Register New Sensor

    "factors": ["High poaching history", "Remote location"],      "reportedAt": "2025-09-23T06:15:00Z",

```http

POST /api/sensors/register    "recommendations": ["Increase patrols", "Install camera trap"]      "mediaUrls": ["https://example.com/audio1.mp3"],

Content-Type: application/json

```  }      "threatAnalysis": {



<details>}        "riskScore": 0.91,

<summary><strong>📋 Registration Example</strong></summary>

```        "confidence": 0.85,

```json

{        "patterns": ["night_activity", "escalating_threat"]

  "deviceId": "CAMERA_TRAP_001",

  "name": "North Waterhole Camera",### 5. Real-time Alert Stream      }

  "type": "camera_trap",

  "latitude": -1.2921,```http      }

  "longitude": 36.8219,

  "conservationAreaId": "area-uuid-123",GET /api/rangers/alerts/stream  ],

  "configuration": {

    "sensitivity": "high",Authorization: Bearer <ranger-token>  "pagination": {

    "recordingDuration": 30

  }Accept: text/event-stream    "total": 156,

}

``````    "limit": 20,



**Sensor Types:** camera_trap | motion_sensor | acoustic_sensor | gps_collar | weather_station    "offset": 0,



</details>**Server-Sent Events:**    "hasMore": true



### ❤️ 3. Sensor Health Monitoring```  }



```httpdata: {"type":"urgent_reports","data":[...],"timestamp":"..."}}

GET /api/sensors/status/{sensorId}

``````



<details>data: {"type":"threat_alert","data":{"level":"high",...},"timestamp":"..."}

<summary><strong>📊 Health Response</strong></summary>

```### Verify Report

```json

{

  "sensor": {

    "id": "sensor-uuid-123",### 6. Conservation Analytics**Endpoint:** `POST /api/rangers/reports/{reportId}/verify`

    "name": "North Waterhole Camera",

    "type": "camera_trap",```http

    "location": {"latitude": -1.2921, "longitude": 36.8219},

    "status": "active",GET /api/rangers/analytics?timeframe=30dVerify or reject a community report.

    "batteryLevel": 85,

    "lastDataReceived": "2025-09-24T08:45:00Z"Authorization: Bearer <ranger-token>

  },

  "statistics": {```**Request:**

    "totalReadingsToday": 45,

    "threatDetections": 3,```json

    "averageConfidence": 0.78

  },**Response:**{

  "recentData": [...]

}```json  "action": "verify",

```

{  "notes": "Confirmed by patrol team. Evidence collected.",

</details>

  "timeframe": "30d",  "rewardAmount": 75.00,

### 🌙 4. Night Guard Alerts

  "summary": {  "followUpRequired": false

<div style="background: #343a40; color: white; padding: 16px; border-radius: 8px; margin: 16px 0;">

<strong>🌙 Night Guard System:</strong> Automated 24/7 monitoring<br>    "totalReports": 45,}

<strong>🎯 Endpoint:</strong> <code>GET /api/sensors/alerts?hours=24</code>

</div>    "verifiedReports": 38,```



<details>    "poachingIncidents": 8,

<summary><strong>🚨 Alerts Response</strong></summary>

    "wildlifeSightings": 25**Actions:**

```json

{  },- `verify` - Confirm report is accurate

  "summary": {

    "totalAlerts": 15,  "trends": {- `reject` - Report is false/spam

    "highPriorityAlerts": 3,

    "timeRange": "24 hours",    "reportsByType": {"poaching": 8, "sighting": 25},- `investigate` - Needs further investigation

    "mostActiveHours": ["22:00-02:00", "04:00-06:00"]

  },    "reportsByDay": {"2025-09-20": 3, "2025-09-21": 5},

  "alerts": [

    {    "hotspots": [{"lat": -1.29, "lng": 36.82, "count": 12}]**Response:**

      "id": "alert-123",

      "sensorId": "sensor-uuid-123",   },```json

      "threatLevel": "high",

      "description": "Human activity detected in restricted area",  "insights": [{

      "timestamp": "2025-09-24T02:30:00Z",

      "location": {"lat": -1.29, "lng": 36.82},    {  "success": true,

      "confidence": 0.89

    }      "type": "alert",   "message": "Report verified successfully",

  ]

}      "message": "High poaching activity detected: 8 incidents",  "report": {

```

      "recommendation": "Increase ranger patrols in affected areas"    "id": "uuid",

</details>

    }    "verificationStatus": "verified",

### 🌐 5. Sensor Network Overview

  ]    "verifiedAt": "2025-09-23T14:30:00Z",

```http

GET /api/sensors/network}    "verifiedBy": "ranger-uuid",

```

```    "reward": {

<details>

<summary><strong>📈 Network Overview</strong></summary>      "amount": 75.00,



```json### 7. Patrol Management      "status": "pending",

{

  "overview": {```http      "transactionId": "at-transaction-id"

    "totalSensors": 25,

    "activeSensors": 23,GET /api/rangers/patrols    }

    "onlineSensors": 20,

    "sensorsWithThreats": 5,Authorization: Bearer <ranger-token>  }

    "totalThreatsLast24h": 15,

    "averageBatteryLevel": 78.5,```}

    "sensorTypes": {

      "camera_trap": 15,```

      "motion_sensor": 8,

      "acoustic_sensor": 2**Response:**

    }

  },```json### Get Threat Predictions

  "sensors": [...]

}[

```

  {**Endpoint:** `GET /api/rangers/threats`

</details>

    "id": "1",

---

    "name": "Morning Perimeter Check",Get current AI-generated threat predictions.

## ⚡ System API

    "status": "active",

### 📊 1. API Statistics

    "leadRanger": "John Kamau",**Query Parameters:**

```http

GET /api/stats    "area": "North Sector",- `riskLevel` - Filter by risk level (`low`, `medium`, `high`)

```

    "startTime": "2025-09-24T06:00:00Z",- `type` - Threat type (`poaching_risk`, `fire_risk`, `human_activity`)

<details>

<summary><strong>📈 Stats Response</strong></summary>    "waypoints": [- `radius` - Search radius in km



```json      {"lat": -1.2921, "lng": 36.8219},- `lat`, `lng` - Center coordinates for radius search

{

  "api": {      {"lat": -1.2925, "lng": 36.8225}

    "version": "1.0.0",

    "uptime": "15 days",    ]**Response:**

    "requestsToday": 1247

  },  }```json

  "conservation": {

    "totalReports": 2847,]{

    "activeSensors": 23,

    "registeredUsers": 156```  "success": true,

  },

  "africasTalking": {  "threats": [

    "smssSentToday": 45,

    "airtimeDistributed": "KES 450.00"---    {

  }

}      "id": "uuid",

```

## 📡 IoT Sensors & Night Guard      "type": "poaching_risk",

</details>

      "riskScore": 0.89,

### 📱 2. Test SMS (Development)

### 1. Submit Sensor Data      "confidence": 0.92,

```http

POST /api/test-sms```http      "location": {

Content-Type: application/json

```POST /api/sensors/data        "latitude": -2.155000,



```jsonContent-Type: application/json        "longitude": 34.675000

{

  "to": "+254712345678",      },

  "message": "Test message from WildGuard"

}{      "timeWindow": "next_12h",

```

  "sensorId": "sensor-uuid-123",      "validFrom": "2025-09-23T20:00:00Z",

### 🚨 3. Emergency Alert Broadcast

  "dataType": "image",      "validTo": "2025-09-24T08:00:00Z",

<div style="background: #dc3545; color: white; padding: 16px; border-radius: 8px; margin: 16px 0;">

<strong>⚡ Mass Notification:</strong> Broadcast to all rangers<br>  "value": {      "factors": {

<strong>🎯 Endpoint:</strong> <code>POST /api/emergency-alert</code>

</div>    "imageUrl": "https://s3.amazonaws.com/camera-trap-123.jpg",        "historicalIncidents": 5,



```json    "detections": ["elephant", "human"]        "timePatterns": ["night_activity", "weekend_activity"],

{

  "type": "fire",  },        "recentActivity": 2,

  "location": "Maasai Mara North",

  "severity": "high",  "metadata": {        "sensorAlerts": 1

  "message": "Large wildfire detected. Evacuate wildlife area immediately."

}    "temperature": 28.5,      },

```

    "batteryLevel": 85      "recommendedActions": [

---

  },        {

## 🎯 Integration Examples

  "timestamp": "2025-09-24T09:00:00Z"          "action": "night_surveillance",

### 💻 Frontend JavaScript

}          "priority": "high",

<div style="background: #f8f9fa; padding: 16px; border-radius: 8px; border-left: 4px solid #007bff;">

```          "description": "Increase night-time monitoring in this area"

**Submit Wildlife Report**

```javascript        },

const submitReport = async (reportData) => {

  const response = await fetch('/api/community/report', {**Data Types:** image | audio | movement | temperature | humidity | gps        {

    method: 'POST',

    headers: {          "action": "community_alert", 

      'Content-Type': 'application/json',

      'Authorization': `Bearer ${userToken}`### 2. Register New Sensor          "priority": "medium",

    },

    body: JSON.stringify(reportData)```http          "description": "Alert local community leaders"

  });

  POST /api/sensors/register        }

  return response.json();

};Content-Type: application/json      ]

```

    }

**Real-time Alert Connection**

```javascript{  ]

const connectAlerts = (rangerToken) => {

  const eventSource = new EventSource('/api/rangers/alerts/stream', {  "deviceId": "CAMERA_TRAP_001",}

    headers: { 'Authorization': `Bearer ${rangerToken}` }

  });  "name": "North Waterhole Camera",```

  

  eventSource.onmessage = (event) => {  "type": "camera_trap",

    const data = JSON.parse(event.data);

    if (data.type === 'urgent_reports') {  "latitude": -1.2921,### Analyze Location Threats

      showUrgentAlert(data.data);

    }  "longitude": 36.8219,

  };

    "conservationAreaId": "area-uuid-123",**Endpoint:** `POST /api/rangers/threats/analyze`

  return eventSource;

};  "configuration": {

```

    "sensitivity": "high",Analyze threat level at specific location.

</div>

    "recordingDuration": 30

### 📡 Africa's Talking Webhooks

  }**Request:**

<div style="background: #e7f3ff; padding: 16px; border-radius: 8px; border-left: 4px solid #007bff;">

}```json

Configure your AT account callbacks:

```{

| Service | Webhook URL |

|---------|-------------|  "latitude": -2.153456,

| **USSD** | `https://wildguard-api-gubr.onrender.com/api/community/ussd` |

| **SMS** | `https://wildguard-api-gubr.onrender.com/api/community/sms` |**Sensor Types:** camera_trap | motion_sensor | acoustic_sensor | gps_collar | weather_station  "longitude": 34.678901,

| **Voice** | `https://wildguard-api-gubr.onrender.com/api/community/voice` |

| **Airtime** | `https://wildguard-api-gubr.onrender.com/api/community/airtime-callback` |  "reportType": "poaching"



</div>### 3. Sensor Status & Health}



### 🔧 IoT Device Integration```http```



<div style="background: #f8f9fa; padding: 16px; border-radius: 8px; border-left: 4px solid #28a745;">GET /api/sensors/status/{sensorId}



**Camera Trap Data Submission**```**Response:**

```javascript

const sendSensorData = async (sensorId, imageData) => {```json

  await fetch('/api/sensors/data', {

    method: 'POST',**Response:**{

    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify({```json  "success": true,

      sensorId,

      dataType: 'image',{  "analysis": {

      value: {

        imageUrl: imageData.url,  "sensor": {    "location": {

        detections: imageData.aiDetections

      },    "id": "sensor-uuid-123",      "latitude": -2.153456,

      metadata: {

        batteryLevel: getBatteryLevel(),    "name": "North Waterhole Camera",      "longitude": 34.678901

        temperature: getTemperature()

      }    "type": "camera_trap",    },

    })

  });    "location": {"latitude": -1.2921, "longitude": 36.8219},    "riskScore": 0.76,

};

```    "status": "active",    "riskLevel": "high",



</div>    "batteryLevel": 85,    "confidence": 0.88,



---    "lastDataReceived": "2025-09-24T08:45:00Z"    "factors": {



## 🚨 Features Overview  },      "historicalIncidents": 3,



<table>  "statistics": {      "recentActivity": 1,

<tr>

<td width="50%">    "totalReadingsToday": 45,      "timeOfDay": "high",



### 🔄 **Automatic Processing**    "threatDetections": 3,      "season": "medium",

- ✅ **AI Threat Analysis** - Risk assessment

- ✅ **Ranger SMS Alerts** - Instant notifications      "averageConfidence": 0.78      "proximity": "road"

- ✅ **Airtime Rewards** - 1-5 KES for verified reports

- ✅ **Trust Scoring** - 0.0-1.0 reliability system  },    },



</td>  "recentData": [...]    "patterns": ["night_activity", "escalating_threat"],

<td width="50%">

}    "recommendations": [

### 📱 **Multi-Channel Reporting**

- ✅ **SMS** - Text "REPORT POACHING [details]"```      "Immediate patrol dispatch recommended",

- ✅ **USSD** - Dial *123# for guided menu

- ✅ **Voice** - Call hotline with recordings      "Consider deploying additional sensors",

- ✅ **Mobile App** - Rich reports with GPS/photos

### 4. Night Guard Alerts      "Alert community in 2km radius"

</td>

</tr>```http    ]

<tr>

<td>GET /api/sensors/alerts?hours=24  }



### 🌙 **Night Guard System**```}

- ✅ **24/7 Monitoring** - Automated sensor processing

- ✅ **AI Detection** - Camera trap image analysis```

- ✅ **Real-time Alerts** - Instant threat notifications

- ✅ **Pattern Analysis** - Historical trend analysis**Response:**



</td>```json### Real-time Alerts Stream

<td>

{

### 📊 **Conservation Intelligence**

- ✅ **Hotspot Mapping** - Geographic incident clustering  "summary": {**Endpoint:** `GET /api/rangers/alerts/stream`

- ✅ **Predictive Analytics** - Risk forecasting

- ✅ **Performance Metrics** - Verification rates    "totalAlerts": 15,

- ✅ **Species Tracking** - Population insights

    "highPriorityAlerts": 3,Server-Sent Events stream for real-time alerts.

</td>

</tr>    "timeRange": "24 hours",

</table>

    "mostActiveHours": ["22:00-02:00", "04:00-06:00"]**Response Stream:**

---

  },```

## 🛡️ Security & Production

  "alerts": [data: {"type":"new_report","priority":"urgent","reportId":"uuid","location":{"lat":-2.153,"lng":34.678}}

### 🔒 **Security Features**

    {

| Feature | Details |

|---------|---------|      "id": "alert-123",data: {"type":"threat_detected","threatLevel":"high","sensorId":"sensor-uuid","confidence":0.91}

| **Rate Limiting** | 1000 requests/hour for authenticated users |

| **CORS** | Enabled for all origins (development mode) |      "sensorId": "sensor-uuid-123", 

| **File Uploads** | Max 10MB per file, 10 files/hour |

| **Data Privacy** | Anonymous reporting supported |      "threatLevel": "high",data: {"type":"verification_needed","reportId":"uuid","trustScore":0.95}

| **Validation** | Zod schema validation for all inputs |

      "description": "Human activity detected in restricted area",```

### 🚀 **Production Status**

      "timestamp": "2025-09-24T02:30:00Z",

<div style="background: linear-gradient(90deg, #56ab2f 0%, #a8e6cf 100%); color: white; padding: 16px; border-radius: 8px; margin: 16px 0;">

      "location": {"lat": -1.29, "lng": 36.82},### Analytics

**🌐 Live Deployment:** https://wildguard-api-gubr.onrender.com  

**✅ Status:** Production Ready        "confidence": 0.89

**⚡ Platform:** Render Cloud with auto-scaling  

**🗄️ Database:** PostgreSQL with connection pooling      }**Endpoint:** `GET /api/rangers/analytics`

**📊 Monitoring:** Health checks and performance metrics  

  ]

</div>

}Get conservation analytics and statistics.

### 📈 **Live Performance Metrics**

```

Based on recent deployment logs:

**Query Parameters:**

- ✅ **Report Processing** - Multiple successful submissions

- ✅ **SMS Integration** - Notifications sent successfully  ### 5. Sensor Network Overview- `period` - Time period (`7d`, `30d`, `90d`, `1y`)

- ✅ **Threat Analysis** - AI risk scores (0.39-0.78 range)

- ✅ **Ranger Alerts** - 3 rangers notified automatically```http- `type` - Analytics type (`incidents`, `community`, `sensors`, `threats`)

- ✅ **Database** - All operations completing successfully

GET /api/sensors/network

---

```**Response:**

<div align="center">

```json

## 🆘 Support & Resources

**Response:**{

**🌐 Live API:** [`https://wildguard-api-gubr.onrender.com`](https://wildguard-api-gubr.onrender.com)  

**💚 Health Check:** [`/health`](https://wildguard-api-gubr.onrender.com/health)  ```json  "success": true,

**📚 Interactive Docs:** [`/api/docs`](https://wildguard-api-gubr.onrender.com/api/docs)  

**📱 SMS Sender ID:** `AFTKNG`  {  "analytics": {

**💻 GitHub:** [`AfricasTalkingHackathons/wildguard-api`](https://github.com/AfricasTalkingHackathons/wildguard-api)

  "overview": {    "period": "30d",

### 🧪 Quick Test Commands

    "totalSensors": 25,    "summary": {

```bash

# Test API health    "activeSensors": 23,      "totalIncidents": 45,

curl https://wildguard-api-gubr.onrender.com/health

    "onlineSensors": 20,      "resolved": 38,

# Get API documentation  

curl https://wildguard-api-gubr.onrender.com/api/docs    "sensorsWithThreats": 5,      "prevented": 12,



# Submit test report    "totalThreatsLast24h": 15,      "communityEngagement": 89.5,

curl -X POST https://wildguard-api-gubr.onrender.com/api/community/report \

  -H "Content-Type: application/json" \    "averageBatteryLevel": 78.5,      "responseTime": "18min",

  -d '{

    "phoneNumber": "+254712345678",    "sensorTypes": {      "successRate": 84.4

    "type": "wildlife_sighting", 

    "description": "Elephants near waterhole",      "camera_trap": 15,    },

    "latitude": -1.2921,

    "longitude": 36.8219      "motion_sensor": 8,    "trends": {

  }'

```      "acoustic_sensor": 2      "incidentsByType": {



---    }        "poaching": 15,



*🌿 **WildGuard** - Protecting Africa's wildlife through innovative technology*    },        "wildlife_sighting": 20,

*Made with ❤️ for conservation teams across Africa*

  "sensors": [...]        "suspicious_activity": 8,

</div>
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