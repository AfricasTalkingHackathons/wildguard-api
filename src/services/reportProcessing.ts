// src/services/reportProcessing.ts
import { db, reports, users, rewards, conservationAreas } from '../db'
import { eq, and, gte, desc, sql } from 'drizzle-orm'
import AfricasTalkingService from './africasTalking'
import { ThreatAnalysisService } from './threatAnalysis'
import { v4 as uuidv4 } from 'uuid'

export interface NewReportData {
  phoneNumber: string
  type: 'poaching' | 'illegal_logging' | 'wildlife_sighting' | 'suspicious_activity' | 'injury' | 'fence_breach' | 'fire'
  description: string
  latitude?: number
  longitude?: number
  animalSpecies?: string
  estimatedCount?: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  reportMethod: 'sms' | 'ussd' | 'voice' | 'app'
  mediaUrls?: string[]
  isAnonymous?: boolean
}

export interface ReportValidationResult {
  isValid: boolean
  trustScore: number
  riskFactors: string[]
  shouldAlert: boolean
  recommendedActions: string[]
}

type ReportType = 'poaching' | 'illegal_logging' | 'wildlife_sighting' | 'suspicious_activity' | 'injury' | 'fence_breach' | 'fire'
type ReportPriority = 'low' | 'medium' | 'high' | 'urgent'
type ReportMethod = 'sms' | 'ussd' | 'voice' | 'app'

export class ReportProcessingService {
  // Create a new report from community input
  static async createReport(reportData: NewReportData): Promise<string> {
    try {
      // Find or create user
      const user = await this.findOrCreateUser(reportData.phoneNumber)
      
      // Generate report ID
      const reportId = uuidv4()
      
      // Determine conservation area if coordinates provided
      let conservationAreaId = null
      if (reportData.latitude && reportData.longitude) {
        conservationAreaId = await this.findConservationArea(
          reportData.latitude, 
          reportData.longitude
        )
      }

      // Create the report
      await db.insert(reports).values({
        id: reportId,
        reporterId: user.id,
        type: reportData.type,
        priority: reportData.priority,
        latitude: reportData.latitude?.toString(),
        longitude: reportData.longitude?.toString(),
        description: reportData.description,
        animalSpecies: reportData.animalSpecies,
        estimatedCount: reportData.estimatedCount,
        conservationAreaId,
        reportMethod: reportData.reportMethod,
        mediaUrls: reportData.mediaUrls || [],
        isAnonymous: reportData.isAnonymous || false,
        verificationStatus: 'pending',
      })

      // Update user report count
      await db
        .update(users)
        .set({ 
          totalReports: sql`${users.totalReports} + 1`,
          lastActiveAt: new Date(),
        })
        .where(eq(users.id, user.id))

      // Send confirmation SMS
      if (!reportData.isAnonymous) {
        await AfricasTalkingService.sendReportConfirmation(
          reportData.phoneNumber,
          reportId,
          reportData.type
        )
      }

      // Process the report for immediate actions
      await this.processReportUrgency(reportId, reportData)

      console.log(`Report created successfully: ${reportId}`)
      return reportId

    } catch (error) {
      console.error('Error creating report:', error)
      throw error
    }
  }

  // Find existing user or create new one
  private static async findOrCreateUser(phoneNumber: string) {
    let user = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber))
      .limit(1)

    if (user.length === 0) {
      // Create new user
      const newUserId = uuidv4()
      await db.insert(users).values({
        id: newUserId,
        phoneNumber,
        role: 'community',
        trustScore: '50.00', // Starting trust score
      })

      user = await db
        .select()
        .from(users)
        .where(eq(users.id, newUserId))
        .limit(1)
    }

    return user[0]
  }

  // Find conservation area by coordinates
  private static async findConservationArea(lat: number, lng: number): Promise<string | null> {
    // This would typically use PostGIS for proper geospatial queries
    // For now, we'll do a simple query - in production you'd want:
    // SELECT * FROM conservation_areas WHERE ST_Contains(boundaries, ST_Point(lng, lat))
    
    const areas = await db.select().from(conservationAreas).limit(10)
    
    // Simple distance-based matching for demo
    // In production, use proper geospatial indexing
    for (const area of areas) {
      // This is a placeholder - implement proper geospatial checking
      return area.id
    }
    
    return null
  }

  // Process report for immediate urgency and actions
  private static async processReportUrgency(reportId: string, reportData: NewReportData) {
    const urgentTypes = ['poaching', 'suspicious_activity', 'fire']
    const highPrioritySpecies = ['rhino', 'elephant', 'lion', 'leopard']

    let shouldAlertRangers = false
    let alertMessage = ''

    // Check if this requires immediate ranger alert
    if (urgentTypes.includes(reportData.type) || reportData.priority === 'urgent') {
      shouldAlertRangers = true
      alertMessage = `${reportData.type.toUpperCase()} reported: ${reportData.description}`
    }

    // High-value species sightings
    if (reportData.animalSpecies && highPrioritySpecies.includes(reportData.animalSpecies.toLowerCase())) {
      shouldAlertRangers = true
      alertMessage = `${reportData.animalSpecies} sighting: ${reportData.description}`
    }

    // Alert rangers if necessary
    if (shouldAlertRangers && reportData.latitude && reportData.longitude) {
      await this.alertNearbyRangers(reportData.latitude, reportData.longitude, alertMessage)
    }

    // Run threat analysis
    if (reportData.latitude && reportData.longitude) {
      ThreatAnalysisService.analyzeThreat(reportData.latitude, reportData.longitude, reportData.type)
        .catch(error => console.error('Threat analysis failed:', error))
    }
  }

  // Alert rangers in the area
  private static async alertNearbyRangers(lat: number, lng: number, message: string) {
    try {
      // Find rangers in the area (simplified query)
      const rangers = await db
        .select()
        .from(users)
        .where(eq(users.role, 'ranger'))
        .limit(5)

      const rangerPhones = rangers.map(r => r.phoneNumber)

      if (rangerPhones.length > 0) {
        const locationMessage = `${message}\n\nLocation: ${lat.toFixed(6)}, ${lng.toFixed(6)}\nView: https://maps.google.com/maps?q=${lat},${lng}`
        
        await AfricasTalkingService.sendConservationAlert(rangerPhones, locationMessage)
        console.log(`Alerted ${rangerPhones.length} rangers about urgent report`)
      }
    } catch (error) {
      console.error('Failed to alert rangers:', error)
    }
  }

  // Verify a report and process rewards
  static async verifyReport(reportId: string, verifierId: string, isVerified: boolean, notes?: string) {
    try {
      const report = await db
        .select()
        .from(reports)
        .where(eq(reports.id, reportId))
        .limit(1)

      if (!report.length) {
        throw new Error('Report not found')
      }

      const reportData = report[0]

      // Update report status
      await db
        .update(reports)
        .set({
          verificationStatus: isVerified ? 'verified' : 'rejected',
          verifiedBy: verifierId,
          verificationNotes: notes,
          verifiedAt: new Date(),
        })
        .where(eq(reports.id, reportId))

      if (isVerified && reportData.reporterId) {
        // Update user verified reports count and trust score
        await db
          .update(users)
          .set({
            verifiedReports: sql`${users.verifiedReports} + 1`,
            trustScore: sql`LEAST(100, ${users.trustScore} + 2.5)`, // Increase trust score
          })
          .where(eq(users.id, reportData.reporterId))

        // Calculate and award airtime
        const rewardAmount = this.calculateReward(reportData.type, reportData.priority)
        await this.awardAirtime(reportData.reporterId, reportId, rewardAmount, 'verified_report')

        console.log(`Report ${reportId} verified and reward processed`)
      } else if (!isVerified && reportData.reporterId) {
        // Decrease trust score for false reports
        await db
          .update(users)
          .set({
            trustScore: sql`GREATEST(0, ${users.trustScore} - 5)`,
          })
          .where(eq(users.id, reportData.reporterId))
      }

    } catch (error) {
      console.error('Error verifying report:', error)
      throw error
    }
  }

  // Calculate airtime reward based on report type and priority
  private static calculateReward(type: string, priority: string): number {
    // Base rewards (1-3 KES based on report importance)
    const baseRewards = {
      'poaching': 3,          // High value - critical for conservation
      'fire': 3,              // High value - immediate danger
      'illegal_logging': 2,   // Medium value - environmental damage  
      'suspicious_activity': 2, // Medium value - potential threat
      'injury': 2,            // Medium value - animal welfare
      'fence_breach': 1,      // Low value - infrastructure issue
      'wildlife_sighting': 1, // Low value - monitoring data
    }

    // Priority bonuses (0-2 KES additional)
    const priorityBonuses = {
      'low': 0,
      'medium': 1,
      'high': 1, 
      'urgent': 2,
    }

    const baseReward = baseRewards[type as keyof typeof baseRewards] || 1
    const bonus = priorityBonuses[priority as keyof typeof priorityBonuses] || 0

    // Ensure reward stays within 1-5 KES range
    return Math.min(5, Math.max(1, baseReward + bonus))
  }

  // Award airtime to user
  private static async awardAirtime(userId: string, reportId: string, amount: number, reason: string) {
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

      if (!user.length) return

      const userData = user[0]

      // Create reward record
      const rewardId = uuidv4()
      await db.insert(rewards).values({
        id: rewardId,
        userId,
        reportId,
        amount: amount.toString(),
        reason: reason as any,
        status: 'pending',
      })

      // Send airtime via Africa's Talking
      try {
        const result = await AfricasTalkingService.sendAirtime({
          phoneNumber: userData.phoneNumber,
          amount,
          currencyCode: 'KES',
        })

        // Update reward status
        await db
          .update(rewards)
          .set({
            status: 'sent',
            sentAt: new Date(),
            transactionId: result.entries?.[0]?.transactionId || null,
          })
          .where(eq(rewards.id, rewardId))

        // Update user total airtime earned
        await db
          .update(users)
          .set({
            airtimeEarned: sql`${users.airtimeEarned} + ${amount}`,
          })
          .where(eq(users.id, userId))

        // Send notification
        await AfricasTalkingService.sendRewardNotification(
          userData.phoneNumber,
          amount,
          reason.replace('_', ' ')
        )

        console.log(`Airtime reward sent: ${amount} KES to ${userData.phoneNumber}`)

      } catch (airtimeError) {
        console.error('Failed to send airtime:', airtimeError)
        
        // Mark reward as failed
        await db
          .update(rewards)
          .set({ status: 'failed' })
          .where(eq(rewards.id, rewardId))
      }

    } catch (error) {
      console.error('Error awarding airtime:', error)
    }
  }

  // Get reports for analysis and dashboard
  static async getReports(filters: {
    status?: string
    type?: string
    area?: string
    timeRange?: { start: Date; end: Date }
    limit?: number
  } = {}) {
    try {
      let query = db
        .select({
          id: reports.id,
          type: reports.type,
          priority: reports.priority,
          latitude: reports.latitude,
          longitude: reports.longitude,
          description: reports.description,
          verificationStatus: reports.verificationStatus,
          reportedAt: reports.reportedAt,
          reporterPhone: users.phoneNumber,
          reporterTrustScore: users.trustScore,
        })
        .from(reports)
        .leftJoin(users, eq(reports.reporterId, users.id))
        .orderBy(desc(reports.reportedAt))

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      return await query
    } catch (error) {
      console.error('Error fetching reports:', error)
      throw error
    }
  }
}

export default ReportProcessingService