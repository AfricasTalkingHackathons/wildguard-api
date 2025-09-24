# 🧪 WildGuard API - Africa's Talking Testing Guide

## 🚀 Live API: https://wildguard-api-gubr.onrender.com

Your WildGuard API is now live and ready for comprehensive testing of all Africa's Talking integrations!

## 📱 1. SMS Testing

### Test SMS Sending (Internal)
```bash
# Test the SMS sending functionality
curl -X POST "https://wildguard-api-gubr.onrender.com/api/test-sms" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254700000000",
    "message": "🦁 WildGuard Test: SMS integration working!"
  }'
```

### SMS Webhook (Incoming SMS)
Your API listens for incoming SMS at:
```
POST https://wildguard-api-gubr.onrender.com/api/community/sms
```

**Configure in Africa's Talking:**
1. Go to SMS → Callback URLs
2. Set Callback URL: `https://wildguard-api-gubr.onrender.com/api/community/sms`
3. Test by sending SMS to your shortcode

**Test Incoming SMS Format:**
```bash
curl -X POST "https://wildguard-api-gubr.onrender.com/api/community/sms" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "from=+254712345678&text=POACHING Gunshots near waterhole -1.2921,36.8219&linkId=123&date=2025-09-24"
```

## 📞 2. USSD Testing

### USSD Callback Endpoint
```
POST https://wildguard-api-gubr.onrender.com/api/community/ussd
```

**Configure in Africa's Talking:**
1. Go to USSD → Create Channel
2. Set Callback URL: `https://wildguard-api-gubr.onrender.com/api/community/ussd`
3. Get your USSD code (e.g., `*123#`)

**Test USSD Flow:**
```bash
# Test USSD main menu
curl -X POST "https://wildguard-api-gubr.onrender.com/api/community/ussd" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=ATUid_123&serviceCode=*123*1*2#&phoneNumber=+254712345678&text="

# Test wildlife sighting report
curl -X POST "https://wildguard-api-gubr.onrender.com/api/community/ussd" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=ATUid_123&serviceCode=*123*1*2#&phoneNumber=+254712345678&text=1*2*Large herd of elephants*-1.2921*36.8219*15"
```

**Expected USSD Flow:**
```
*123# → Welcome to WildGuard
1. Report Wildlife
2. Report Threat
3. My Profile

1 → Wildlife Sighting
1. Elephants
2. Lions  
3. Rhinos
4. Other

1*2*description*lat*lng*count → Report submitted!
```

## 🎤 3. Voice Testing

### Voice Callback Endpoint
```
POST https://wildguard-api-gubr.onrender.com/api/community/voice
```

**Configure in Africa's Talking:**
1. Go to Voice → Applications
2. Set Callback URL: `https://wildguard-api-gubr.onrender.com/api/community/voice`
3. Configure your voice number

**Test Voice Response:**
```bash
curl -X POST "https://wildguard-api-gubr.onrender.com/api/community/voice" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=ATSid_123&callerNumber=+254712345678&direction=Inbound&dtmfDigits=1"
```

**Expected Voice Flow:**
- Call comes in → Welcome message
- Press 1 for emergency → Records location and escalates
- Press 2 for wildlife sighting → Guided voice recording

## 💰 4. Airtime Testing

### Send Airtime Rewards
```bash
# Test airtime sending (requires valid recipient)
curl -X POST "https://wildguard-api-gubr.onrender.com/api/rangers/reports/[REPORT_ID]/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "verify",
    "notes": "Confirmed elephant sighting",
    "rewardAmount": 50
  }'
```

**Test with Real Phone Number:**
```bash
# Replace with actual report ID and test phone number
curl -X POST "https://wildguard-api-gubr.onrender.com/api/rangers/reports/test-report-id/verify" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "verify",
    "notes": "Testing airtime reward",
    "rewardAmount": 10
  }'
```

## 🧪 5. End-to-End Testing Scenarios

### Scenario 1: Community Report via SMS
1. **Send SMS** to your shortcode:
   ```
   POACHING Gunshots heard near waterhole -1.2921,36.8219
   ```

2. **Expected Response:**
   ```
   🦁 WildGuard: Thank you! Report #ABC123 received. 
   Location: -1.2921,36.8219. Rangers notified. 
   Reward: 50 KES pending verification.
   ```

### Scenario 2: USSD Wildlife Sighting
1. **Dial** your USSD code: `*123#`
2. **Follow prompts**: 1 → 1 → "Large herd crossing river" → location → count
3. **Expected**: Confirmation + reward notification

### Scenario 3: Voice Emergency Report
1. **Call** your voice number
2. **Press 1** for emergency
3. **Expected**: Location recorded, rangers alerted, SMS confirmation

### Scenario 4: Ranger Verification & Airtime
1. **Ranger verifies** report via dashboard
2. **Expected**: Airtime sent to reporter's phone
3. **Check**: Reporter receives airtime + SMS confirmation

## 📊 6. Live API Endpoints for Testing

### Check Dashboard Data
```bash
curl "https://wildguard-api-gubr.onrender.com/api/rangers/dashboard"
```

### Get Recent Reports
```bash
curl "https://wildguard-api-gubr.onrender.com/api/rangers/reports?limit=10"
```

### Test User Profile
```bash
curl "https://wildguard-api-gubr.onrender.com/api/community/profile/%2B254712345678"
```

### Check Sensor Network
```bash
curl "https://wildguard-api-gubr.onrender.com/api/sensors/network"
```

## 🔧 7. Africa's Talking Dashboard Setup

### SMS Configuration
1. Go to [AT Dashboard](https://account.africastalking.com/) → SMS
2. **Callback URL**: `https://wildguard-api-gubr.onrender.com/api/community/sms`
3. **Method**: POST
4. Test by sending SMS to shortcode

### USSD Configuration  
1. Go to USSD → Create New Channel
2. **Callback URL**: `https://wildguard-api-gubr.onrender.com/api/community/ussd`
3. **USSD Code**: *123# (or your assigned code)
4. Test by dialing the code

### Voice Configuration
1. Go to Voice → Applications → Create
2. **Callback URL**: `https://wildguard-api-gubr.onrender.com/api/community/voice`
3. **Voice Number**: Your assigned number
4. Test by calling the number

### Airtime Configuration
1. **API Key**: Already configured in environment
2. **Username**: Already configured in environment
3. Airtime is sent automatically when rangers verify reports

## 🔍 8. Debugging & Monitoring

### Check Logs
- **Render Dashboard** → Your Service → Logs
- Monitor incoming webhooks and API responses

### Test API Health
```bash
curl "https://wildguard-api-gubr.onrender.com/health"
```

### Webhook Testing Tools
- Use [ngrok](https://ngrok.com) for local testing
- Use [Postman](https://postman.com) for API testing
- Use [RequestBin](https://requestbin.com) for webhook inspection

## 📱 9. Real Device Testing

### SMS Testing
1. **Send real SMS** to your Africa's Talking shortcode
2. **Format**: `POACHING [description] [lat,lng]`
3. **Example**: `POACHING Gunshots near river -1.2921,36.8219`

### USSD Testing
1. **Dial** your USSD code from a real phone
2. **Follow** the menu prompts
3. **Complete** a wildlife sighting report

### Voice Testing
1. **Call** your Africa's Talking voice number
2. **Test** the IVR menu options
3. **Record** an emergency report

## 🎯 10. Expected Results

### Successful SMS
- ✅ **Immediate response** to sender
- ✅ **Report created** in database  
- ✅ **Rangers notified** via dashboard
- ✅ **Airtime reward** queued for verification

### Successful USSD
- ✅ **Interactive menu** navigation
- ✅ **Report submission** with confirmation
- ✅ **User profile** updated with trust score

### Successful Voice
- ✅ **Voice prompts** played correctly
- ✅ **DTMF input** processed
- ✅ **Emergency alerts** triggered for urgent reports

### Successful Airtime
- ✅ **Verification** triggers airtime send
- ✅ **Transaction ID** logged
- ✅ **Recipient** receives airtime + SMS confirmation

## 🚨 11. Emergency Testing

### High Priority Alert
```bash
curl -X POST "https://wildguard-api-gubr.onrender.com/api/community/report" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254712345678",
    "type": "poaching",
    "priority": "urgent",
    "latitude": -1.2921,
    "longitude": 36.8219,
    "description": "Armed poachers spotted with vehicles - URGENT!"
  }'
```

**Expected:**
- ✅ Immediate ranger alerts
- ✅ Real-time dashboard update
- ✅ Emergency escalation protocol

---

## 🎉 Your WildGuard Platform is Ready!

**Live URL**: https://wildguard-api-gubr.onrender.com
**Documentation**: https://wildguard-api-gubr.onrender.com/api/docs

Start testing with real devices and protect Africa's wildlife! 🦁🌍