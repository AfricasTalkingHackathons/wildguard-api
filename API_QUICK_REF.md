# 🚀 WildGuard API Quick Reference

**Base URL:** `http://localhost:3000`

## 📱 Community Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/community/report` | Submit wildlife/poaching report |
| `GET` | `/api/community/profile/{phone}` | Get user profile & stats |

### Submit Report
```bash
curl -X POST http://localhost:3000/api/community/report \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254712345678",
    "type": "poaching",
    "description": "Saw 3 men with guns",
    "latitude": -2.153456,
    "longitude": 34.678901,
    "urgency": "high"
  }'
```

## 🎯 Rangers Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/rangers/dashboard` | Dashboard overview |
| `GET` | `/api/rangers/reports` | List reports (with filters) |
| `POST` | `/api/rangers/reports/{id}/verify` | Verify/reject report |
| `GET` | `/api/rangers/threats` | AI threat predictions |
| `POST` | `/api/rangers/threats/analyze` | Analyze location threat |
| `GET` | `/api/rangers/alerts/stream` | Real-time alerts (SSE) |
| `GET` | `/api/rangers/analytics` | Conservation analytics |

### Get Reports with Filters
```bash
curl "http://localhost:3000/api/rangers/reports?status=pending&priority=high&limit=10"
```

### Verify Report
```bash
curl -X POST http://localhost:3000/api/rangers/reports/report-uuid/verify \
  -H "Content-Type: application/json" \
  -d '{
    "action": "verify",
    "notes": "Confirmed by patrol",
    "rewardAmount": 75.00
  }'
```

### Real-time Alerts
```javascript
const eventSource = new EventSource('/api/rangers/alerts/stream');
eventSource.onmessage = (event) => {
  const alert = JSON.parse(event.data);
  console.log('New alert:', alert);
};
```

## 📡 Sensor Network

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/sensors/data` | Submit sensor readings |
| `POST` | `/api/sensors/register` | Register new sensor |
| `GET` | `/api/sensors/status/{id}` | Get sensor status |
| `GET` | `/api/sensors/alerts` | Night Guard alerts |
| `GET` | `/api/sensors/network` | Network overview |
| `POST` | `/api/sensors/{id}/maintenance` | Update maintenance |

### Submit Sensor Data
```bash
curl -X POST http://localhost:3000/api/sensors/data \
  -H "Content-Type: application/json" \
  -d '{
    "sensorId": "sensor-uuid",
    "dataType": "image",
    "value": {
      "objects": ["person", "vehicle"],
      "confidence": 0.89
    },
    "timestamp": "2025-09-23T02:15:00Z"
  }'
```

### Register Sensor
```bash
curl -X POST http://localhost:3000/api/sensors/register \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "WILDCAM001",
    "name": "Water Hole Camera 3",
    "type": "camera_trap",
    "latitude": -2.153456,
    "longitude": 34.678901
  }'
```

## ⚙️ System Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | System health check |
| `GET` | `/api/stats` | API usage statistics |
| `POST` | `/api/test-sms` | Test SMS integration |
| `POST` | `/api/emergency-alert` | Emergency alert to rangers |

## 📊 Data Formats

### Report Types
- `poaching` - Illegal hunting/wildlife crime
- `wildlife_sighting` - Animal observation  
- `suspicious_activity` - Unusual behavior
- `injury` - Injured wildlife
- `illegal_logging` - Forest destruction
- `fire` - Wildfire incident
- `fence_breach` - Perimeter breach

### Priority Levels
- `low` - Non-urgent observation
- `medium` - Needs attention
- `high` - Important incident
- `urgent` - Immediate response required

### Sensor Types
- `camera_trap` - Motion cameras
- `acoustic_sensor` - Sound monitoring
- `motion_sensor` - Movement detection  
- `gps_collar` - Animal tracking
- `weather_station` - Environmental data

### Verification Actions
- `verify` - Confirm report accuracy
- `reject` - Report is false/spam
- `investigate` - Needs investigation

## 🔄 Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE"
}
```

## 🚦 Rate Limits

- **Global:** 100 requests per 15 minutes
- **SMS:** 10 requests per minute  
- **Reports:** 20 per hour per user
- **Sensors:** 1000 per hour per device

## 🌐 CORS & Headers

```javascript
// Required headers
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}

// CORS enabled for:
// - localhost:3000, localhost:3001 (development)
// - https://wildguard.conservation (production)
```

## 📱 React Integration Example

```javascript
// Hook for WildGuard API
const useWildGuard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitReport = async (report) => {
    setLoading(true);
    try {
      const response = await fetch('/api/community/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      const result = await response.json();
      return result;
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`/api/rangers/reports?${params}`);
    const result = await response.json();
    setData(result.reports);
    return result;
  };

  return { data, loading, submitReport, fetchReports };
};
```

## 🔧 Environment Setup

```bash
# 1. Clone & install
git clone <repo-url> && cd wildguard-api && npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your credentials

# 3. Start development
npm run dev

# 4. Test API
curl http://localhost:3000/health
```

## 📞 Quick Support

- **Docs:** [Full API Documentation](./API_DOCS.md)
- **Issues:** [GitHub Issues](https://github.com/wildguard/api/issues)
- **Email:** dev@wildguard.conservation

---

*🌿 Protecting Africa's wildlife through technology - One API call at a time*