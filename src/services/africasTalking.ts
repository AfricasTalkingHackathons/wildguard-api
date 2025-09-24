// src/services/africasTalking.ts
import AfricasTalking from 'africastalking'
import { env } from '../env'

// Initialize Africa's Talking
const africasTalking = AfricasTalking({
  apiKey: env.AT_API_KEY,
  username: env.AT_USERNAME,
})

// Get service modules with proper typing
const sms = africasTalking.SMS
// Note: VOICE and AIRTIME may not be available in all versions
// We'll implement them as needed or use alternative approaches

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

export class AfricasTalkingService {
  // Send SMS notification
  static async sendSMS(options: SMSMessage): Promise<any> {
    try {
      const result = await sms.send({
        to: options.to,
        message: options.message,
        from: options.from || 'WildGuard',
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
      // Check if airtime service is available via optional chaining
      const airtimeService = (africasTalking as any).AIRTIME
      
      if (airtimeService) {
        const recipients = [{
          phoneNumber: options.phoneNumber,
          amount: options.amount,
          currencyCode: options.currencyCode,
        }]

        const result = await airtimeService.send({ recipients })
        console.log('Airtime sent successfully:', result)
        return result
      } else {
        // Fallback: Log the airtime request for manual processing
        console.log('Airtime service not available. Logging request:', options)
        return {
          success: false,
          message: 'Airtime service not configured',
          request: options
        }
      }
    } catch (error) {
      console.error('Airtime sending failed:', error)
      throw error
    }
  }

  // Send conservation alert to rangers
  static async sendConservationAlert(phoneNumbers: string[], alertMessage: string): Promise<any> {
    const urgentMessage = `🚨 URGENT CONSERVATION ALERT 🚨\n\n${alertMessage}\n\nRespond immediately. Lives depend on it.\n\n- WildGuard`
    
    return this.sendSMS({
      to: phoneNumbers,
      message: urgentMessage,
    })
  }

  // Send report confirmation to community member
  static async sendReportConfirmation(phoneNumber: string, reportId: string, reportType: string): Promise<any> {
    const message = `Thank you for your conservation report! 🌿\n\nReport ID: ${reportId}\nType: ${reportType}\n\nOur rangers are reviewing it. You'll earn airtime if verified.\n\n- WildGuard`
    
    return this.sendSMS({
      to: [phoneNumber],
      message,
    })
  }

  // Send verification reward notification
  static async sendRewardNotification(phoneNumber: string, amount: number, reason: string): Promise<any> {
    const message = `🎉 Conservation Hero! 🎉\n\nYou've earned ${amount} KES airtime for: ${reason}\n\nKeep protecting our wildlife!\n\n- WildGuard`
    
    return this.sendSMS({
      to: [phoneNumber],
      message,
    })
  }

  // Send patrol assignment to rangers
  static async sendPatrolAssignment(phoneNumber: string, patrolDetails: any): Promise<any> {
    const message = `🚨 PATROL ASSIGNMENT 🚨\n\nArea: ${patrolDetails.area}\nPriority: ${patrolDetails.priority}\nTime: ${patrolDetails.time}\nDetails: ${patrolDetails.description}\n\nStay safe, ranger!\n\n- WildGuard`
    
    return this.sendSMS({
      to: [phoneNumber],
      message,
    })
  }

  // Handle incoming USSD sessions for report submission
  static buildUSSDMenu(sessionId: string, serviceCode: string, phoneNumber: string, text: string) {
    let response = ''

    if (text === '') {
      // Main menu
      response = `CON Welcome to WildGuard 🌿
Wildlife Protection Platform

1. Report Wildlife Sighting
2. Report Poaching/Illegal Activity  
3. Report Injured Animal
4. Check My Trust Score
5. View Rewards Earned`
    } else if (text === '1') {
      // Wildlife sighting submenu
      response = `CON Wildlife Sighting 🦁

1. Elephant
2. Rhino
3. Lion
4. Leopard
5. Buffalo
6. Giraffe
7. Other`
    } else if (text === '2') {
      // Illegal activity submenu
      response = `CON Report Illegal Activity 🚨

1. Active Poaching
2. Suspicious People/Vehicles
3. Illegal Logging
4. Fence Cutting
5. Other Illegal Activity`
    } else if (text === '3') {
      // Injured animal submenu
      response = `CON Injured Animal 🏥

1. Elephant
2. Rhino  
3. Lion
4. Other Large Animal
5. Small Animal/Bird`
    } else if (text === '4') {
      // Trust score (would need to query database)
      response = `END Your WildGuard Trust Score: 85/100 ⭐

Total Reports: 23
Verified Reports: 19
Airtime Earned: 450 KES

Keep up the great work protecting wildlife!`
    } else if (text === '5') {
      // Rewards summary
      response = `END WildGuard Rewards Summary 💰

This Month: 120 KES
Total Earned: 450 KES
Pending Verification: 2 reports

Thank you for protecting our wildlife!`
    } else if (text.startsWith('1*')) {
      // Wildlife sighting flow
      const parts = text.split('*')
      if (parts.length === 2) {
        response = `CON How many animals did you see?

Enter number (1-50):`
      } else if (parts.length === 3) {
        response = `CON Any additional details?

1. Healthy animals
2. With young ones  
3. Unusual behavior
4. Near water source
5. Submit report now`
      }
    } else if (text.startsWith('2*')) {
      // Illegal activity flow - this needs immediate attention
      response = `CON 🚨 URGENT REPORT 🚨

This will alert rangers immediately!

1. I can see them now
2. I saw them recently  
3. I found evidence
4. Someone told me

Select urgency level:`
    }

    return response
  }
}

export default AfricasTalkingService