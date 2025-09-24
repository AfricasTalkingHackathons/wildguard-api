// src/services/threatAnalysis.ts
import { db, reports, sensorData, threatPredictions } from '../db'
import { and, gte, lte, desc, sql } from 'drizzle-orm'

export interface ThreatPattern {
  type: string
  location: { lat: number; lng: number }
  frequency: number
  riskScore: number
  timePatterns: string[]
  relatedIncidents: string[]
}

export interface RiskFactors {
  historicalIncidents: number
  recentActivity: number
  sensorAlerts: number
  timeOfDay: 'high' | 'medium' | 'low'
  season: 'high' | 'medium' | 'low'
  proximity: 'village' | 'road' | 'border' | 'remote'
}

export class ThreatAnalysisService {
  // Analyze threat patterns at a specific location
  static async analyzeThreat(lat: number, lng: number, reportType: string): Promise<ThreatPattern> {
    try {
      const radius = 0.01 // ~1km radius for analysis
      
      // Get historical incidents in the area
      const historicalIncidents = await this.getHistoricalIncidents(lat, lng, radius, 30) // Last 30 days
      
      // Get sensor data if available
      const sensorAlerts = await this.getSensorAlerts(lat, lng, radius, 7) // Last 7 days
      
      // Calculate risk factors
      const riskFactors = this.calculateRiskFactors(historicalIncidents, sensorAlerts, lat, lng)
      
      // Generate risk score (0-1)
      const riskScore = this.calculateRiskScore(riskFactors, reportType)
      
      // Identify time patterns
      const timePatterns = this.identifyTimePatterns(historicalIncidents)
      
      // Create threat pattern
      const threatPattern: ThreatPattern = {
        type: reportType,
        location: { lat, lng },
        frequency: historicalIncidents.length,
        riskScore,
        timePatterns,
        relatedIncidents: historicalIncidents.map((i: any) => i.id),
      }
      
      // Store prediction if risk is significant
      if (riskScore > 0.3) {
        await this.storeThreatPrediction(threatPattern)
      }
      
      console.log(`Threat analysis completed for ${lat}, ${lng}: Risk Score ${riskScore}`)
      return threatPattern
      
    } catch (error) {
      console.error('Threat analysis failed:', error)
      throw error
    }
  }

  // Get historical incidents in radius
  private static async getHistoricalIncidents(lat: number, lng: number, radius: number, days: number) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    // Simple radius query - in production use PostGIS ST_DWithin
    const incidents = await db
      .select()
      .from(reports)
      .where(
        and(
          gte(reports.reportedAt, startDate),
          sql`${reports.latitude}::float BETWEEN ${lat - radius} AND ${lat + radius}`,
          sql`${reports.longitude}::float BETWEEN ${lng - radius} AND ${lng + radius}`
        )
      )
      .orderBy(desc(reports.reportedAt))
    
    return incidents
  }

  // Get sensor alerts in area
  private static async getSensorAlerts(lat: number, lng: number, radius: number, days: number) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const alerts = await db
      .select()
      .from(sensorData)
      .where(
        and(
          gte(sensorData.recordedAt, startDate),
          sql`threat_level IN ('medium', 'high')`
        )
      )
      .limit(50)
    
    return alerts
  }

  // Calculate comprehensive risk factors
  private static calculateRiskFactors(incidents: any[], sensorAlerts: any[], lat: number, lng: number): RiskFactors {
    const now = new Date()
    const currentHour = now.getHours()
    
    // Time of day risk (based on typical poaching patterns)
    let timeOfDay: 'high' | 'medium' | 'low' = 'low'
    if (currentHour >= 22 || currentHour <= 5) timeOfDay = 'high' // Night
    else if (currentHour <= 8 || currentHour >= 18) timeOfDay = 'medium' // Dawn/dusk
    
    // Season risk (dry season typically higher for poaching)
    const month = now.getMonth() + 1
    let season: 'high' | 'medium' | 'low' = 'medium'
    if (month >= 6 && month <= 9) season = 'high' // Dry season
    else if (month >= 12 || month <= 2) season = 'high' // Secondary dry season
    
    // Proximity risk (simplified - would use real geographic data)
    let proximity: 'village' | 'road' | 'border' | 'remote' = 'remote'
    // This would be calculated using real geographic databases
    
    return {
      historicalIncidents: incidents.length,
      recentActivity: incidents.filter(i => {
        const incidentDate = new Date(i.reportedAt)
        const diffDays = (now.getTime() - incidentDate.getTime()) / (1000 * 3600 * 24)
        return diffDays <= 7
      }).length,
      sensorAlerts: sensorAlerts.length,
      timeOfDay,
      season,
      proximity,
    }
  }

  // Calculate overall risk score
  private static calculateRiskScore(factors: RiskFactors, reportType: string): number {
    let score = 0
    
    // Base score from report type
    const typeScores = {
      'poaching': 0.8,
      'suspicious_activity': 0.7,
      'illegal_logging': 0.6,
      'fire': 0.9,
      'wildlife_sighting': 0.2,
      'injury': 0.4,
      'fence_breach': 0.5,
    }
    
    score += typeScores[reportType as keyof typeof typeScores] || 0.3
    
    // Historical incident factor
    score += Math.min(factors.historicalIncidents * 0.05, 0.3)
    
    // Recent activity multiplier
    if (factors.recentActivity > 0) {
      score *= 1.5
    }
    
    // Sensor alerts factor
    score += Math.min(factors.sensorAlerts * 0.1, 0.2)
    
    // Time factors
    const timeMultipliers = {
      'high': 1.3,
      'medium': 1.1,
      'low': 1.0,
    }
    score *= timeMultipliers[factors.timeOfDay]
    score *= timeMultipliers[factors.season]
    
    // Proximity factors
    const proximityMultipliers = {
      'village': 1.2,
      'road': 1.4,
      'border': 1.6,
      'remote': 0.8,
    }
    score *= proximityMultipliers[factors.proximity]
    
    // Normalize to 0-1 range
    return Math.min(score, 1.0)
  }

  // Identify time patterns in incidents
  private static identifyTimePatterns(incidents: any[]): string[] {
    const patterns: string[] = []
    
    if (incidents.length < 2) return patterns
    
    // Analyze hour patterns
    const hourCounts = new Array(24).fill(0)
    incidents.forEach(incident => {
      const hour = new Date(incident.reportedAt).getHours()
      hourCounts[hour]++
    })
    
    // Find peak hours
    const maxCount = Math.max(...hourCounts)
    if (maxCount >= 2) {
      hourCounts.forEach((count, hour) => {
        if (count === maxCount) {
          if (hour >= 22 || hour <= 5) patterns.push('night_activity')
          else if (hour <= 8 || hour >= 18) patterns.push('dawn_dusk_activity')
          else patterns.push('day_activity')
        }
      })
    }
    
    // Analyze day patterns
    const dayOfWeekCounts = new Array(7).fill(0)
    incidents.forEach(incident => {
      const dayOfWeek = new Date(incident.reportedAt).getDay()
      dayOfWeekCounts[dayOfWeek]++
    })
    
    const maxDayCount = Math.max(...dayOfWeekCounts)
    if (maxDayCount >= 2) {
      if (dayOfWeekCounts[0] === maxDayCount || dayOfWeekCounts[6] === maxDayCount) {
        patterns.push('weekend_activity')
      }
    }
    
    // Check for escalating pattern
    const recentIncidents = incidents.filter(i => {
      const days = (Date.now() - new Date(i.reportedAt).getTime()) / (1000 * 3600 * 24)
      return days <= 7
    })
    
    if (recentIncidents.length > incidents.length / 2) {
      patterns.push('escalating_threat')
    }
    
    return patterns
  }

  // Store threat prediction for future use
  private static async storeThreatPrediction(pattern: ThreatPattern) {
    try {
      const predictionId = crypto.randomUUID()
      const validFrom = new Date()
      const validTo = new Date(validFrom.getTime() + 24 * 60 * 60 * 1000) // 24 hours
      
      // Determine prediction type
      let predictionType: string = 'human_activity'
      if (pattern.type === 'poaching') predictionType = 'poaching_risk'
      else if (pattern.type === 'fire') predictionType = 'fire_risk'
      
      // Generate recommended actions
      const recommendedActions = this.generateRecommendedActions(pattern)
      
      await db.insert(threatPredictions).values({
        id: predictionId,
        predictionType: predictionType as any,
        latitude: pattern.location.lat.toString(),
        longitude: pattern.location.lng.toString(),
        riskScore: pattern.riskScore.toString(),
        confidence: '0.85', // Based on model confidence
        timeWindow: 'next_24h',
        factors: {
          historicalIncidents: pattern.frequency,
          timePatterns: pattern.timePatterns,
          relatedIncidents: pattern.relatedIncidents,
        },
        recommendedActions,
        validFrom,
        validTo,
      })
      
      console.log(`Threat prediction stored: ${predictionId}`)
      
    } catch (error) {
      console.error('Failed to store threat prediction:', error)
    }
  }

  // Generate recommended actions based on threat pattern
  private static generateRecommendedActions(pattern: ThreatPattern): any {
    const actions = []
    
    if (pattern.riskScore > 0.7) {
      actions.push({
        action: 'immediate_patrol',
        priority: 'urgent',
        description: 'Deploy rangers immediately to investigate high-risk area',
      })
    } else if (pattern.riskScore > 0.5) {
      actions.push({
        action: 'scheduled_patrol',
        priority: 'high',
        description: 'Schedule patrol within next 4 hours',
      })
    }
    
    if (pattern.timePatterns.includes('night_activity')) {
      actions.push({
        action: 'night_surveillance',
        priority: 'medium',
        description: 'Increase night-time monitoring in this area',
      })
    }
    
    if (pattern.timePatterns.includes('escalating_threat')) {
      actions.push({
        action: 'community_alert',
        priority: 'high',
        description: 'Alert local community leaders about increased threat',
      })
    }
    
    if (pattern.frequency > 5) {
      actions.push({
        action: 'sensor_deployment',
        priority: 'medium',
        description: 'Consider deploying additional sensors in this hotspot',
      })
    }
    
    return actions
  }

  // Get current threat predictions for an area
  static async getCurrentThreats(lat: number, lng: number, radius: number = 0.05) {
    const now = new Date()
    
    const threats = await db
      .select()
      .from(threatPredictions)
      .where(
        and(
          lte(threatPredictions.validFrom, now),
          gte(threatPredictions.validTo, now),
          sql`${threatPredictions.latitude}::float BETWEEN ${lat - radius} AND ${lat + radius}`,
          sql`${threatPredictions.longitude}::float BETWEEN ${lng - radius} AND ${lng + radius}`
        )
      )
      .orderBy(desc(threatPredictions.riskScore))
    
    return threats
  }

  // Generate daily threat summary for rangers
  static async generateDailyThreatSummary() {
    try {
      const today = new Date()
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      
      const activePredictions = await db
        .select()
        .from(threatPredictions)
        .where(
          and(
            gte(threatPredictions.validTo, today),
            lte(threatPredictions.validFrom, tomorrow)
          )
        )
        .orderBy(desc(threatPredictions.riskScore))
        .limit(10)
      
      const summary = {
        date: today.toISOString().split('T')[0],
        totalThreats: activePredictions.length,
        highRiskAreas: activePredictions.filter((p: any) => parseFloat(p.riskScore) > 0.7).length,
        mediumRiskAreas: activePredictions.filter((p: any) => parseFloat(p.riskScore) > 0.4 && parseFloat(p.riskScore) <= 0.7).length,
        recommendations: activePredictions.slice(0, 5).map((p: any) => ({
          location: `${p.latitude}, ${p.longitude}`,
          riskScore: p.riskScore,
          type: p.predictionType,
          actions: p.recommendedActions,
        })),
      }
      
      return summary
      
    } catch (error) {
      console.error('Failed to generate threat summary:', error)
      throw error
    }
  }
}