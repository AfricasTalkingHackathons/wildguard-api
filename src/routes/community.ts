// src/routes/community.ts
import { Router, Request, Response } from 'express'
import ReportProcessingService from '../services/reportProcessing'
import { AfricasTalkingService } from '../services/africasTalking'
import { ThreatAnalysisService } from '../services/threatAnalysis'

const router = Router()

// USSD endpoint for Africa's Talking
router.post('/ussd', async (req: Request, res: Response) => {
  try {
    const { sessionId, serviceCode, phoneNumber, text } = req.body

    console.log(`USSD Session: ${sessionId}, Phone: ${phoneNumber}, Text: "${text}"`)

    // Build comprehensive USSD response menu
    const response = AfricasTalkingService.buildUSSDMenu(sessionId, serviceCode, phoneNumber, text)
    
    // Process completed reports (when session ends with submission)
    if (text && (text.includes('*5') || text.split('*').length >= 4)) {
      try {
        // Extract report details from USSD flow
        const parts = text.split('*')
        
        if (parts.length >= 4) {
          let reportType: ReportType = 'suspicious_activity'
          let priority: ReportPriority = 'medium'
          let description = 'USSD Report'
          
          // Map first menu selection to report types
          if (parts[0] === '1') {
            // Emergency reports
            const emergencyTypes = ['poaching', 'injury', 'fire', 'suspicious_activity'] as const
            reportType = emergencyTypes[parseInt(parts[1]) - 1] || 'suspicious_activity'
            priority = 'urgent'
            description = `Emergency: ${reportType} via USSD`
          } else if (parts[0] === '2') {
            // Wildlife sightings
            reportType = 'wildlife_sighting'
            priority = 'medium'
            description = `Wildlife sighting via USSD - Category: ${parts[1]}, Count: ${parts[2]}`
          } else if (parts[0] === '3') {
            // Suspicious activity
            reportType = 'suspicious_activity'
            priority = parts[2] === '1' || parts[2] === '2' ? 'urgent' : 'high'
            description = `Suspicious activity via USSD - Type: ${parts[1]}, Timing: ${parts[2]}`
          }
          
          // Create the report
          const reportId = await ReportProcessingService.createReport({
            phoneNumber,
            type: reportType,
            description,
            priority,
            reportMethod: 'ussd',
            isAnonymous: false
          })
          
          console.log(`USSD Report created: ${reportId} by ${phoneNumber}`)
        }
      } catch (reportError) {
        console.error('Error processing USSD report:', reportError)
      }
    }

    res.set('Content-Type', 'text/plain')
    res.send(response)
    
  } catch (error) {
    console.error('USSD handling error:', error)
    res.set('Content-Type', 'text/plain')
    res.send('END Sorry, there was a technical error. Please try again later.')
  }
})

// SMS endpoint for receiving reports
router.post('/sms', async (req: Request, res: Response) => {
  try {
    const { from, text, to, id, linkId, date } = req.body

    console.log(`SMS received from ${from}: ${text}`)

    // Parse SMS for report information
    const reportData = parseSMSReport(from, text)
    
    if (reportData) {
      const reportId = await ReportProcessingService.createReport(reportData)
      
      // Send confirmation SMS
      await AfricasTalkingService.sendReportConfirmation(from, reportId, reportData.type)
    } else {
      // Send help message for unrecognized format
      await AfricasTalkingService.sendSMS({
        to: [from],
        message: `Welcome to WildGuard! 🌿\n\nTo report wildlife incidents:\n• Text: REPORT [TYPE] [DESCRIPTION]\n• Types: POACHING, SIGHTING, INJURY, FIRE\n• Or dial *123#\n\nExample: REPORT POACHING Saw 3 men with guns near waterhole`,
      })
    }

    res.json({ success: true })
    
  } catch (error) {
    console.error('SMS handling error:', error)
    res.status(500).json({ error: 'Failed to process SMS' })
  }
})

// Voice endpoint for handling voice reports and IVR
router.post('/voice', async (req: Request, res: Response) => {
  try {
    const callbackData = req.body
    console.log('Voice callback received:', callbackData)

    // Use enhanced voice callback handler
    const xmlResponse = await AfricasTalkingService.handleVoiceCallback(callbackData)
    
    // Process voice recordings if available
    if (callbackData.recordingUrl) {
      try {
        // Create voice report from recording
        await ReportProcessingService.createReport({
          phoneNumber: callbackData.callerNumber,
          type: 'suspicious_activity', // Default type for voice reports
          description: `Voice report recorded. Audio URL: ${callbackData.recordingUrl}`,
          priority: callbackData.dtmfDigits === '1' ? 'urgent' : 'medium',
          reportMethod: 'voice',
          mediaUrls: [callbackData.recordingUrl]
        })
        
        console.log(`Voice report created from ${callbackData.callerNumber}`)
      } catch (reportError) {
        console.error('Error creating voice report:', reportError)
      }
    }

    res.set('Content-Type', 'text/xml')
    res.send(xmlResponse)
    
  } catch (error) {
    console.error('Voice handling error:', error)
    
    // Fallback XML response
    const errorResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="woman">Sorry, there was a technical error. Please try calling again later.</Say>
      <Hangup/>
    </Response>`
    
    res.set('Content-Type', 'text/xml')
    res.send(errorResponse)
  }
})// Mobile app endpoint for digital reports
router.post('/report', async (req: Request, res: Response) => {
  try {
    const {
      phoneNumber,
      type,
      description,
      latitude,
      longitude,
      animalSpecies,
      estimatedCount,
      mediaUrls,
      isAnonymous,
    } = req.body

    // Validate required fields
    if (!phoneNumber || !type || !description) {
      return res.status(400).json({
        error: 'Missing required fields: phoneNumber, type, description'
      })
    }

    // Determine priority based on type
    const urgentTypes = ['poaching', 'suspicious_activity', 'fire']
    const priority = urgentTypes.includes(type) ? 'urgent' : 'medium'

    const reportId = await ReportProcessingService.createReport({
      phoneNumber,
      type,
      description,
      latitude,
      longitude,
      animalSpecies,
      estimatedCount,
      priority,
      reportMethod: 'app',
      mediaUrls,
      isAnonymous,
    })

    return res.json({
      success: true,
      reportId,
      message: 'Report submitted successfully. Rangers have been notified.',
    })
    
  } catch (error) {
    console.error('Report submission error:', error)
    return res.status(500).json({ error: 'Failed to submit report' })
  }
})

// Get user's report history and trust score
router.get('/profile/:phoneNumber', async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.params
    
    // Get user profile and reports
    // This would be implemented with proper authentication
    const userReports = await ReportProcessingService.getReports({
      // Add phone number filter when implementing
      limit: 20,
    })

    const profile = {
      phoneNumber,
      trustScore: 85, // Would come from database
      totalReports: userReports.length,
      verifiedReports: userReports.filter((r: any) => r.verificationStatus === 'verified').length,
      airtimeEarned: 350, // Would come from database
      recentReports: userReports.slice(0, 5),
    }

    res.json(profile)
    
  } catch (error) {
    console.error('Profile retrieval error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
})

// Airtime callback endpoint for transaction status updates
router.post('/airtime-callback', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, amount, status, transactionId, discount, requestId } = req.body
    
    console.log('Airtime callback received:', {
      phoneNumber,
      amount, 
      status,
      transactionId,
      discount,
      requestId
    })

    // Update reward record with callback information
    // In production, you'd update the database record matching the transactionId
    if (transactionId) {
      console.log(`Airtime transaction ${transactionId} status: ${status}`)
      
      // Send confirmation SMS if successful
      if (status === 'Success') {
        await AfricasTalkingService.sendSMS({
          to: [phoneNumber],
          message: `✅ Airtime Delivered!\n\nAmount: ${amount}\nTransaction: ${transactionId}\n\nThank you for protecting wildlife!\n- WildGuard`
        })
      } else if (status === 'Failed') {
        console.error(`Airtime delivery failed for ${phoneNumber}: ${amount}`)
      }
    }

    res.json({ success: true, message: 'Callback processed' })
    
  } catch (error) {
    console.error('Airtime callback error:', error)
    res.status(500).json({ error: 'Callback processing failed' })
  }
})

// Helper method to map USSD selections to report types
function mapUSSDToReportType(mainMenu: string, subMenu: string): ReportType {
  const mapping: { [key: string]: { [key: string]: ReportType } } = {
    '1': { // Wildlife sighting
      '1': 'wildlife_sighting',
      '2': 'wildlife_sighting',
      '3': 'wildlife_sighting',
      '4': 'wildlife_sighting',
      '5': 'wildlife_sighting',
      '6': 'wildlife_sighting',
      '7': 'wildlife_sighting',
    },
    '2': { // Illegal activity
      '1': 'poaching',
      '2': 'suspicious_activity',
      '3': 'illegal_logging',
      '4': 'fence_breach',
      '5': 'suspicious_activity',
    },
    '3': { // Injured animal
      '1': 'injury',
      '2': 'injury',
      '3': 'injury',
      '4': 'injury',
      '5': 'injury',
    }
  }

  return mapping[mainMenu]?.[subMenu] || 'suspicious_activity'
}

// Helper method to parse SMS reports
function parseSMSReport(phoneNumber: string, text: string) {
  const upperText = text.toUpperCase()
  
  // Check if it's a report format
  if (!upperText.startsWith('REPORT ')) {
    return null
  }

  const parts = text.substring(7).split(' ', 2) // Remove "REPORT " and split
  if (parts.length < 2) return null

  const typeMap: { [key: string]: ReportType } = {
    'POACHING': 'poaching',
    'POACH': 'poaching',
    'SIGHTING': 'wildlife_sighting',
    'WILDLIFE': 'wildlife_sighting',
    'ANIMAL': 'wildlife_sighting',
    'INJURY': 'injury',
    'INJURED': 'injury',
    'FIRE': 'fire',
    'LOGGING': 'illegal_logging',
    'SUSPICIOUS': 'suspicious_activity',
    'FENCE': 'fence_breach',
  }

  const reportType = typeMap[parts[0].toUpperCase()] || 'suspicious_activity'
  const description = parts.slice(1).join(' ')

  const urgentTypes: ReportType[] = ['poaching', 'suspicious_activity', 'fire']
  
  return {
    phoneNumber,
    type: reportType,
    description: `SMS: ${description}`,
    priority: urgentTypes.includes(reportType) ? 'urgent' as ReportPriority : 'medium' as ReportPriority,
    reportMethod: 'sms' as ReportMethod,
  }
}

type ReportType = 'poaching' | 'illegal_logging' | 'wildlife_sighting' | 'suspicious_activity' | 'injury' | 'fence_breach' | 'fire'
type ReportPriority = 'low' | 'medium' | 'high' | 'urgent'
type ReportMethod = 'sms' | 'ussd' | 'voice' | 'app'

export default router