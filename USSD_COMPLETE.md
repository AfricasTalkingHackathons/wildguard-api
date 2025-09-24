# 🌿 WildGuard Enhanced USSD System & Airtime Rewards

## 📱 Complete USSD Menu Structure

### Main Menu - Dial `*789*90000#`
```
Welcome to WildGuard
Wildlife Protection Platform
1. Report Wildlife Emergency
2. Report Wildlife Sighting  
3. Report Suspicious Activity
4. Check My Profile
5. View Reward Balance
6. Get Conservation Tips
```

## 🚨 1. Emergency Reports
**Flow**: `1` → Emergency Type → Location → Details

### Emergency Types:
- `1` - Active Poaching (**30 KES reward**)
- `2` - Injured Large Animal (**18 KES reward**)
- `3` - Animal-Human Conflict (**18 KES reward**)
- `4` - Forest Fire (**23 KES reward**)
- `5` - Poisoning Incident (**18 KES reward**)

### Location Options:
- `1` - GPS Coordinates (enter: `-1.4061, 35.0117`)
- `2` - Landmark Description
- `3` - I'm at the location now
- `4` - I can guide rangers here

**Airtime**: Emergency reports earn **15-30 KES** automatically!

## 🦁 2. Wildlife Sightings
**Flow**: `2` → Animal Type → Count → Condition

### Animal Categories:
- `1` - Big 5 Animals (Elephant, Rhino, Lion, Leopard, Buffalo)
- `2` - Primates (Monkey, Baboon, Chimpanzee)
- `3` - Antelope & Zebra
- `4` - Birds (Eagle, Vulture, Ostrich)
- `5` - Other Wildlife

### Count Options:
- `1` - 1-5 animals
- `2` - 6-15 animals
- `3` - 16-30 animals
- `4` - 31+ animals (Large herd)
- `5` - I'm not sure

### Animal Condition:
- `1` - Healthy & Active
- `2` - With Young/Babies
- `3` - Feeding/Drinking
- `4` - Showing Signs of Distress
- `5` - Dead/Injured

**Airtime**: Wildlife sightings earn **5-8 KES** automatically!

## 🚨 3. Suspicious Activities
**Flow**: `3` → Activity Type → Timing

### Activity Types:
- `1` - Suspicious Persons/Vehicles (**12 KES reward**)
- `2` - Illegal Logging (**12 KES reward**)
- `3` - Fence Damage (**7 KES reward**)
- `4` - Night Activity (**10 KES reward**)
- `5` - Gunshots/Sounds (**12 KES reward**)

### Timing:
- `1` - Happening right now (**50% bonus!**)
- `2` - Within last hour (**20% bonus**)
- `3` - Within last 24 hours
- `4` - 2-7 days ago
- `5` - More than a week ago (20% reduction)

**Airtime**: Suspicious activity reports earn **6-18 KES**!

## 👤 4. Enhanced Profile Menu
**Flow**: `4` → Profile Option

### Profile Options:
- `1` - View Report History (last 5 reports with status)
- `2` - Update Contact Info (instructions provided)
- `3` - Trust Score Details (breakdown of 87/100 score)
- `4` - Conservation Impact (your wildlife protection stats)

## 💰 5. Complete Rewards System
**Flow**: `5` → Rewards Option

### Current Status:
- **Available Balance**: 45 KES
- **This Month**: 25 KES
- **Total Lifetime**: 180 KES
- **Pending**: 10 KES (2 unverified reports)

### Rewards Menu:
- `1` - **Request Airtime Now** (instant airtime!)
- `2` - View Earning History
- `3` - How to Earn More
- `0` - Back to Main Menu

### 🎉 Instant Airtime Request (`5` → `1`)
Choose amount:
- `1` - 5 KES
- `2` - 10 KES  
- `3` - 20 KES
- `4` - All Balance (45 KES)
- `5` - Custom Amount (1-45 KES)

**Result**: Airtime delivered within 5 minutes + SMS confirmation!

## 💡 6. Conservation Tips System
**Flow**: `6` → Tip Category

### Tip Categories:
- `1` - **Wildlife Safety** (animal approach guidelines)
- `2` - **Reporting Best Practices** (GPS, photos, timing)
- `3` - **Emergency Procedures** (what to do first)
- `4` - **Animal Behavior** (warning signs, safe distances)
- `5` - **Random Daily Tip** (surprise learning!)

## 🏆 Airtime Reward System

### Base Rewards by Report Type:
| Report Type | Base Reward | Urgent Bonus |
|-------------|-------------|--------------|
| Poaching | 20 KES | **+10 KES** |
| Forest Fire | 15 KES | **+7 KES** |
| Injured Animal | 12 KES | **+6 KES** |
| Suspicious Activity | 8 KES | **+4 KES** |
| Illegal Logging | 10 KES | **+5 KES** |
| Fence Breach | 6 KES | **+3 KES** |
| Wildlife Sighting | 5 KES | **+2 KES** |

### Priority Multipliers:
- **Urgent**: +50% bonus (happening now!)
- **High**: +20% bonus (within hour)
- **Medium**: No change
- **Low**: -20% (older reports)

### Bonus Opportunities:
- **GPS Coordinates**: +1 KES
- **Photo Attached**: +2 KES  
- **Quick Response**: +3 KES
- **Follow-up Report**: +2 KES

## 🔄 Navigation Features

### Back Navigation:
- Press `0` from any submenu to return to main menu
- Sessions expire after 3 minutes of inactivity
- Clear error messages for invalid inputs

### Session Persistence:
- USSD sessions remember your place in complex flows
- Can resume interrupted sessions
- Automatic session cleanup prevents memory leaks

## 📞 Testing Your Enhanced USSD

### Test the Complete Flow:
1. **Dial**: `*789*90000#`
2. **Try Emergency**: `1` → `1` → `2` → `"poaching near gate"`
3. **Check Rewards**: `5` → `1` → `2` (request 10 KES)
4. **Get Tips**: `6` → `1` (wildlife safety)
5. **View Profile**: `4` → `3` (trust score details)

### Expected Results:
- ✅ Complete report submission
- ✅ Automatic airtime reward (15-30 KES for emergencies)
- ✅ SMS confirmation with report ID
- ✅ Instant airtime delivery for reward requests
- ✅ Comprehensive information in all menus

## 💡 Frontend Integration Examples

### Test All USSD Features:
```javascript
// Simulate USSD testing from your frontend
const testUSSDFeatures = async () => {
  // Test emergency report
  console.log('Testing emergency flow: 1*1*2*"poaching incident"')
  
  // Test airtime request  
  console.log('Testing airtime: 5*1*2 (request 10 KES)')
  
  // Test profile check
  console.log('Testing profile: 4*3 (trust score)')
}
```

### Report Submission with Airtime:
```javascript
// Mobile app report with automatic airtime
fetch('/api/community/report', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+254795410486',
    type: 'poaching',
    description: 'Saw armed men with elephant tusks',
    latitude: -1.2921,
    longitude: 36.8219,
    isAnonymous: false
  })
})
.then(res => res.json())
.then(data => {
  console.log('Report ID:', data.reportId)
  console.log('Airtime Reward:', data.airtimeReward, 'KES')
})
```

Your USSD system is now **complete** with instant airtime rewards! 🎉🌿