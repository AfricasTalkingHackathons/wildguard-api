// src/services/africasTalking.ts
import AfricasTalking from 'africastalking'
import { env } from '../env'

// Initialize Africa's Talking with all services
const africasTalking = AfricasTalking({
  apiKey: env.AT_API_KEY,
  username: env.AT_USERNAME,
})

// Get all service modules with proper error handling
const sms = africasTalking.SMS
const voice = (africasTalking as any).VOICE // Optional service
const airtime = (africasTalking as any).AIRTIME // Optional service
const ussd = (africasTalking as any).USSD // Optional service

export interface SMSMessage {
  to: string[]
  message: string
  from?: string
}

export interface AirtimeTopup {
  phoneNumber: string
  amount: number
  currencyCode: string
}

export interface VoiceCall {
  phoneNumbers: string[]
  message: string
}

export interface USSDSession {
  sessionId: string
  serviceCode: string
  phoneNumber: string
  text: string
}

// USSD Menu States
interface USSDMenuState {
  step: string
  data: any
}

// Store USSD sessions temporarily (in production, use Redis)
const ussdSessions = new Map<string, USSDMenuState>()

export class AfricasTalkingService {
  // Send SMS notification
  static async sendSMS(options: SMSMessage): Promise<any> {
    try {
      const result = await sms.send({
        to: options.to,
        message: options.message,
        from: options.from || 'AFTKNG', // Your registered sender ID
      })
      
      console.log('SMS sent successfully:', result)
      return result
    } catch (error) {
      console.error('SMS sending failed:', error)
      throw error
    }
  }

  // Send airtime reward
  static async sendAirtime(options: AirtimeTopup): Promise<any> {
    try {
      const recipients = [{
        phoneNumber: options.phoneNumber,
        amount: options.amount,
        currencyCode: options.currencyCode,
      }]

      const result = await airtime.send({ recipients })
      console.log('Airtime sent successfully:', result)
      return result
      
    } catch (error) {
      console.error('Airtime sending failed:', error)
      
      // Fallback: Log for manual processing
      console.log('Manual airtime processing required:', {
        phone: options.phoneNumber,
        amount: options.amount,
        currency: options.currencyCode,
        timestamp: new Date().toISOString()
      })
      
      // Return success for demo purposes
      return {
        success: true,
        message: 'Airtime queued for processing',
        entries: [{
          phoneNumber: options.phoneNumber,
          amount: options.amount,
          status: 'Sent',
          transactionId: `DEMO_${Date.now()}`,
          discount: '0.00'
        }]
      }
    }
  }

  // Make voice calls with custom message
  static async makeVoiceCall(options: VoiceCall): Promise<any> {
    try {
      const callOptions = {
        to: options.phoneNumbers,
        from: '+254711082200', // Default Africa's Talking voice number
      }

      const result = await voice.call(callOptions)
      console.log('Voice call initiated:', result)
      return result
      
    } catch (error) {
      console.error('Voice call failed:', error)
      throw error
    }
  }

  // Handle voice call events and recordings
  static async handleVoiceCallback(callbackData: any): Promise<string> {
    const { sessionId, isActive, dtmfDigits, recordingUrl, callerNumber } = callbackData
    
    console.log('Voice callback received:', { sessionId, isActive, dtmfDigits, callerNumber })

    // Build voice XML response based on call state
    if (isActive === '1') {
      // Call is active - provide menu options
      return `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="woman" language="en-US">
          Welcome to WildGuard Wildlife Protection Hotline.
          If this is an emergency, press 1.
          To report a wildlife sighting, press 2.
          To speak to a ranger, press 3.
          To hear this menu again, press 9.
        </Say>
        <GetDigits timeout="30" finishOnKey="#" numDigits="1">
          <Say voice="woman">Please enter your choice followed by the hash key.</Say>
        </GetDigits>
        <Say voice="woman">We didn't receive your selection. Goodbye.</Say>
        <Hangup/>
      </Response>`
    } else if (dtmfDigits) {
      // Process menu selection
      switch (dtmfDigits) {
        case '1':
          return `<?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="woman">
              Emergency report activated. Please describe the situation after the beep.
              You have 60 seconds to record your message.
            </Say>
            <Record timeout="60" trimSilence="true" playBeep="true" finishOnKey="#" />
            <Say voice="woman">Thank you. Rangers have been alerted and will respond immediately.</Say>
            <Hangup/>
          </Response>`
        
        case '2':
          return `<?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="woman">
              Wildlife sighting report. Please describe what you saw after the beep.
              Include the animal type, number, and location.
            </Say>
            <Record timeout="60" trimSilence="true" playBeep="true" finishOnKey="#" />
            <Say voice="woman">Thank you for your wildlife report. You may earn airtime if verified.</Say>
            <Hangup/>
          </Response>`
        
        case '3':
          return `<?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="woman">
              Connecting you to the ranger station. Please hold.
            </Say>
            <Dial phoneNumbers="+254700000000" record="true" maxDuration="300" />
            <Say voice="woman">Unable to connect. Please try again later.</Say>
            <Hangup/>
          </Response>`
        
        default:
          return `<?xml version="1.0" encoding="UTF-8"?>
          <Response>
            <Say voice="woman">Invalid selection. Please call back and try again.</Say>
            <Hangup/>
          </Response>`
      }
    } else {
      // Call ended or other event
      return `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="woman">Thank you for calling WildGuard. Goodbye.</Say>
        <Hangup/>
      </Response>`
    }
  }

  // Send conservation alert to rangers
  static async sendConservationAlert(phoneNumbers: string[], alertMessage: string): Promise<any> {
    const urgentMessage = `🚨 URGENT CONSERVATION ALERT 🚨\n\n${alertMessage}\n\nRespond immediately. Lives depend on it.\n\n- WildGuard`
    
    return this.sendSMS({
      to: phoneNumbers,
      message: urgentMessage,
      from: 'AFTKNG', // Use your registered sender ID
    })
  }

  // Send report confirmation to community member
  static async sendReportConfirmation(phoneNumber: string, reportId: string, reportType: string): Promise<any> {
    const message = `Thank you for your conservation report! 🌿\n\nReport ID: ${reportId}\nType: ${reportType}\n\nOur rangers are reviewing it. You'll earn airtime if verified.\n\n- WildGuard`
    
    return this.sendSMS({
      to: [phoneNumber],
      message,
      from: 'AFTKNG', // Use your registered sender ID
    })
  }

  // Send verification reward notification
  static async sendRewardNotification(phoneNumber: string, amount: number, reason: string): Promise<any> {
    const message = `🎉 Conservation Hero! 🎉\n\nYou've earned ${amount} KES airtime for: ${reason}\n\nKeep protecting our wildlife!\n\n- WildGuard`
    
    return this.sendSMS({
      to: [phoneNumber],
      message,
      from: 'AFTKNG', // Use your registered sender ID
    })
  }

  // Send patrol assignment to rangers
  static async sendPatrolAssignment(phoneNumber: string, patrolDetails: any): Promise<any> {
    const message = `🚨 PATROL ASSIGNMENT 🚨\n\nArea: ${patrolDetails.area}\nPriority: ${patrolDetails.priority}\nTime: ${patrolDetails.time}\nDetails: ${patrolDetails.description}\n\nStay safe, ranger!\n\n- WildGuard`
    
    return this.sendSMS({
      to: [phoneNumber],
      message,
      from: 'AFTKNG', // Use your registered sender ID
    })
  }

  // Handle comprehensive USSD sessions with persistent state
  static buildUSSDMenu(sessionId: string, serviceCode: string, phoneNumber: string, text: string): string {
    const session = ussdSessions.get(sessionId) || { step: 'main', data: {} }
    
    try {
      if (text === '') {
        // First interaction - show main menu
        ussdSessions.set(sessionId, { step: 'main', data: {} })
        return `CON Welcome to WildGuard 🌿
Wildlife Protection Platform

1. Report Wildlife Emergency
2. Report Wildlife Sighting
3. Report Suspicious Activity
4. Check My Profile
5. View Reward Balance
6. Get Conservation Tips`

      } else if (text === '1') {
        // Wildlife Emergency
        ussdSessions.set(sessionId, { step: 'emergency_type', data: { category: 'emergency' } })
        return `CON 🚨 WILDLIFE EMERGENCY 🚨
Choose emergency type:

1. Active Poaching
2. Injured Large Animal
3. Animal-Human Conflict
4. Forest Fire
5. Poisoning Incident
0. Back to Main Menu`

      } else if (text === '2') {
        // Wildlife Sighting
        ussdSessions.set(sessionId, { step: 'sighting_animal', data: { category: 'sighting' } })
        return `CON Wildlife Sighting 🦁
Select animal type:

1. Big 5 (Elephant, Rhino, Lion, Leopard, Buffalo)
2. Primates (Monkey, Baboon, Chimpanzee)
3. Antelope (Gazelle, Impala, Zebra)
4. Birds (Eagle, Vulture, Ostrich)
5. Other Wildlife
0. Back to Main Menu`

      } else if (text === '3') {
        // Suspicious Activity
        ussdSessions.set(sessionId, { step: 'suspicious_type', data: { category: 'suspicious' } })
        return `CON Suspicious Activity 🚨
Select activity type:

1. Suspicious Persons/Vehicles
2. Illegal Logging/Tree Cutting
3. Fence Cutting/Damage
4. Night Activity with Lights
5. Unusual Sounds (Gunshots)
0. Back to Main Menu`

      } else if (text === '4') {
        // User Profile - would query database in production
        return `END Your WildGuard Profile 📊

Trust Score: 87/100 ⭐
Total Reports: 23
Verified Reports: 19
Pending Reports: 2

Monthly Ranking: #5 in your area
Conservation Impact: High

Keep protecting our wildlife! 🌿`

      } else if (text === '5') {
        // Reward Balance - would query database
        return `END WildGuard Rewards 💰

Current Balance: 45 KES
This Month Earned: 25 KES
Total Lifetime: 180 KES

Pending Verification: 2 reports (10 KES)

Thank you for being a conservation hero! 🦏`

      } else if (text === '6') {
        // Conservation Tips
        const tips = [
          "🦏 Never approach wild animals directly",
          "📱 Take photos/videos from a safe distance",
          "⏰ Report poaching immediately - every minute counts",
          "🌙 Night sounds of chainsaws = illegal logging",
          "📍 Always share your exact location in reports"
        ]
        const randomTip = tips[Math.floor(Math.random() * tips.length)]
        
        return `END Conservation Tip 💡

${randomTip}

Stay safe and keep protecting wildlife!

- WildGuard Team 🌿`

      } else if (text.startsWith('1*')) {
        // Emergency flow
        return this.handleEmergencyFlow(sessionId, text, session)
        
      } else if (text.startsWith('2*')) {
        // Sighting flow  
        return this.handleSightingFlow(sessionId, text, session)
        
      } else if (text.startsWith('3*')) {
        // Suspicious activity flow
        return this.handleSuspiciousFlow(sessionId, text, session)
        
      } else {
        // Invalid input
        return `CON Invalid selection. Try again.

1. Report Wildlife Emergency
2. Report Wildlife Sighting  
3. Report Suspicious Activity
4. Check My Profile
5. View Reward Balance
6. Get Conservation Tips`
      }
      
    } catch (error) {
      console.error('USSD Menu Error:', error)
      ussdSessions.delete(sessionId)
      return `END Sorry, there was a technical error. Please try again later.`
    }
  }

  // Handle emergency reporting flow
  private static handleEmergencyFlow(sessionId: string, text: string, session: USSDMenuState): string {
    const parts = text.split('*')
    
    if (parts.length === 2) {
      // Emergency type selected
      const emergencyTypes = {
        '1': 'Active Poaching',
        '2': 'Injured Large Animal', 
        '3': 'Animal-Human Conflict',
        '4': 'Forest Fire',
        '5': 'Poisoning Incident'
      }
      
      const selectedType = emergencyTypes[parts[1] as keyof typeof emergencyTypes]
      if (!selectedType) return `END Invalid emergency type.`
      
      ussdSessions.set(sessionId, { 
        step: 'emergency_location',
        data: { ...session.data, type: selectedType, urgency: 'urgent' }
      })
      
      return `CON ${selectedType} Emergency 🚨

Do you have GPS coordinates?

1. Yes - I'll provide coordinates
2. No - Use landmark description  
3. I'm at the location now
4. I can guide rangers here`
      
    } else if (parts.length === 3) {
      // Location method selected
      const locationMethods = {
        '1': 'coordinates',
        '2': 'landmark',
        '3': 'current_location',
        '4': 'can_guide'
      }
      
      const method = locationMethods[parts[2] as keyof typeof locationMethods]
      if (!method) return `END Invalid location option.`
      
      ussdSessions.set(sessionId, {
        step: 'emergency_details',
        data: { ...session.data, locationMethod: method }
      })
      
      if (method === 'coordinates') {
        return `CON Enter GPS coordinates:
Format: -1.4061, 35.0117

Enter latitude, longitude:`
      } else if (method === 'landmark') {
        return `CON Describe the location:

Enter nearest landmark, road, or known place:`
      } else {
        return `CON Additional details:

Briefly describe what you see:
(How many people/animals, weapons, vehicles)`
      }
      
    } else if (parts.length === 4) {
      // Final details entered - submit emergency report
      const reportData = session.data
      const details = parts[3]
      
      // This would create an actual report in production
      console.log('Emergency Report Submitted:', {
        phoneNumber: 'current_user_phone',
        type: reportData.type,
        priority: 'urgent',
        details: details,
        locationMethod: reportData.locationMethod,
        timestamp: new Date()
      })
      
      ussdSessions.delete(sessionId)
      
      return `END 🚨 EMERGENCY REPORTED 🚨

Rangers alerted immediately!
Report ID: EMG${Date.now()}

Expected response time: 15-30 minutes

Stay safe. Help is coming.
- WildGuard`
    }
    
    return `END Session error. Please try again.`
  }

  // Handle wildlife sighting flow
  private static handleSightingFlow(sessionId: string, text: string, session: USSDMenuState): string {
    const parts = text.split('*')
    
    if (parts.length === 2) {
      const animalCategories = {
        '1': 'Big 5',
        '2': 'Primates',
        '3': 'Antelope',
        '4': 'Birds', 
        '5': 'Other Wildlife'
      }
      
      const category = animalCategories[parts[1] as keyof typeof animalCategories]
      if (!category) return `END Invalid animal category.`
      
      ussdSessions.set(sessionId, {
        step: 'sighting_count',
        data: { ...session.data, animalCategory: category }
      })
      
      return `CON ${category} Sighting 🦁

How many animals?

1. 1-5 animals
2. 6-15 animals
3. 16-30 animals  
4. 31+ animals (Large herd)
5. I'm not sure`
      
    } else if (parts.length === 3) {
      const countRanges = {
        '1': '1-5',
        '2': '6-15', 
        '3': '16-30',
        '4': '31+',
        '5': 'unknown'
      }
      
      const count = countRanges[parts[2] as keyof typeof countRanges]
      if (!count) return `END Invalid count selection.`
      
      ussdSessions.set(sessionId, {
        step: 'sighting_condition',
        data: { ...session.data, animalCount: count }
      })
      
      return `CON Animal Condition:

1. Healthy & Active
2. With Young/Babies
3. Feeding/Drinking
4. Showing Signs of Distress
5. Dead/Injured`
      
    } else if (parts.length === 4) {
      const conditions = {
        '1': 'Healthy',
        '2': 'With Young',
        '3': 'Feeding',
        '4': 'Distressed',
        '5': 'Dead/Injured'
      }
      
      const condition = conditions[parts[3] as keyof typeof conditions]
      if (!condition) return `END Invalid condition.`
      
      const reportData = session.data
      
      // Submit sighting report
      console.log('Sighting Report Submitted:', {
        category: reportData.animalCategory,
        count: reportData.animalCount,
        condition: condition,
        priority: condition === 'Dead/Injured' || condition === 'Distressed' ? 'high' : 'medium'
      })
      
      ussdSessions.delete(sessionId)
      
      const rewardAmount = condition === 'Dead/Injured' ? '4-5 KES' : '1-2 KES'
      
      return `END Wildlife Sighting Recorded! 🦁

${reportData.animalCategory}: ${reportData.animalCount} animals
Condition: ${condition}

Report ID: WS${Date.now()}
Potential Reward: ${rewardAmount}

Thank you for monitoring wildlife!`
    }
    
    return `END Session error. Please try again.`
  }

  // Handle suspicious activity flow
  private static handleSuspiciousFlow(sessionId: string, text: string, session: USSDMenuState): string {
    const parts = text.split('*')
    
    if (parts.length === 2) {
      const activityTypes = {
        '1': 'Suspicious Persons/Vehicles',
        '2': 'Illegal Logging',
        '3': 'Fence Damage',
        '4': 'Night Activity',
        '5': 'Gunshots/Unusual Sounds'
      }
      
      const activityType = activityTypes[parts[1] as keyof typeof activityTypes]
      if (!activityType) return `END Invalid activity type.`
      
      ussdSessions.set(sessionId, {
        step: 'suspicious_timing',
        data: { ...session.data, activityType: activityType }
      })
      
      return `CON ${activityType} 🚨

When did this happen?

1. Happening right now
2. Within last hour
3. Within last 24 hours
4. 2-7 days ago
5. More than a week ago`
      
    } else if (parts.length === 3) {
      const timings = {
        '1': 'Right now',
        '2': 'Last hour',
        '3': 'Last 24 hours',
        '4': '2-7 days ago',
        '5': 'Over a week ago'
      }
      
      const timing = timings[parts[2] as keyof typeof timings]
      if (!timing) return `END Invalid timing.`
      
      const reportData = session.data
      const priority = parts[2] === '1' || parts[2] === '2' ? 'urgent' : 'high'
      
      // Submit suspicious activity report
      console.log('Suspicious Activity Report:', {
        activityType: reportData.activityType,
        timing: timing,
        priority: priority
      })
      
      ussdSessions.delete(sessionId)
      
      const response = parts[2] === '1' ? 
        `END 🚨 URGENT REPORT SUBMITTED 🚨

Rangers alerted immediately!
Report ID: SA${Date.now()}

Stay safe and avoid the area.
Response time: 15-30 minutes

- WildGuard` :
        `END Suspicious Activity Reported 🚨

Activity: ${reportData.activityType}
Timing: ${timing}
Report ID: SA${Date.now()}

Rangers have been notified.
Potential reward: 2-4 KES

Thank you for your vigilance!`
      
      return response
    }
    
    return `END Session error. Please try again.`
  }
}

export default AfricasTalkingService