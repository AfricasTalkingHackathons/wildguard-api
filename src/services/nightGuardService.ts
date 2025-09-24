// src/services/nightGuardService.ts
import { db, sensorData, sensors, reports, users, patrols } from '../db'
import { and, gte, desc, sql, eq } from 'drizzle-orm'
import { AfricasTalkingService } from './africasTalking'
import { ThreatAnalysisService } from './threatAnalysis'

export interface NightAlert {
  id: string
  timestamp: Date
  location: { lat: number; lng: number }
  alertType: 'motion_detected' | 'unusual_sound' | 'camera_triggered' | 'gps_anomaly'
  confidence: number
  sensorId: string
  description: string
  threatLevel: 'low' | 'medium' | 'high'
  recommendedAction: string
}

export interface PoachingIndicators {
  vehicleMovement: boolean
  humanPresence: boolean
  animalDistress: boolean
  gunshotDetected: boolean
  chainsaw: boolean
  nightVision: boolean
  multiplePersons: boolean
}

/**
 * NightGuard Service - Specialized nighttime and remote area monitoring
 * Handles automated detection and response for poaching activities
 * when human witnesses are not available
 */
export class NightGuardService {
  
  /**
   * Process incoming sensor data for potential threats
   * This is called whenever new sensor data arrives
   */
  static async processSensorAlert(sensorReading: any): Promise<void> {
    try {
      console.log(`🌙 NightGuard processing sensor data from ${sensorReading.sensorId}`)
      
      // Get sensor details
      const sensor = await this.getSensorDetails(sensorReading.sensorId)
      if (!sensor) {
        console.warn(`Sensor ${sensorReading.sensorId} not found`)
        return
      }
      
      // Analyze the sensor data for threats
      const threatAnalysis = await this.analyzeSensorData(sensorReading, sensor)
      
      // If threat detected, create alert
      if (threatAnalysis.threatLevel !== 'low') {
        const alert = await this.createNightAlert(threatAnalysis, sensor)
        await this.respondToThreat(alert, sensor)
      }
      
      // Store processed sensor data
      await this.storeSensorData(sensorReading, threatAnalysis)
      
    } catch (error) {
      console.error('NightGuard sensor processing failed:', error)
    }
  }

  /**
   * Analyze sensor data for poaching indicators
   */
  private static async analyzeSensorData(reading: any, sensor: any): Promise<any> {
    const indicators: PoachingIndicators = {
      vehicleMovement: false,
      humanPresence: false,
      animalDistress: false,
      gunshotDetected: false,
      chainsaw: false,
      nightVision: false,
      multiplePersons: false,
    }
    
    let confidence = 0
    let threatLevel: 'low' | 'medium' | 'high' = 'low'
    let description = ''
    
    // Analyze based on sensor type
    switch (sensor.type) {
      case 'camera_trap':
        const cameraAnalysis = this.analyzeCameraData(reading)
        Object.assign(indicators, cameraAnalysis.indicators)
        confidence = cameraAnalysis.confidence
        description = cameraAnalysis.description
        break
        
      case 'acoustic_sensor':
        const audioAnalysis = this.analyzeAudioData(reading)
        Object.assign(indicators, audioAnalysis.indicators)
        confidence = audioAnalysis.confidence
        description = audioAnalysis.description
        break
        
      case 'motion_sensor':
        const motionAnalysis = this.analyzeMotionData(reading)
        Object.assign(indicators, motionAnalysis.indicators)
        confidence = motionAnalysis.confidence
        description = motionAnalysis.description
        break
        
      case 'gps_collar':
        const gpsAnalysis = this.analyzeGPSData(reading)
        Object.assign(indicators, gpsAnalysis.indicators)
        confidence = gpsAnalysis.confidence
        description = gpsAnalysis.description
        break
    }
    
    // Calculate threat level based on indicators
    threatLevel = this.calculateThreatLevel(indicators, confidence)
    
    // Check time context (nighttime = higher risk)
    const currentHour = new Date().getHours()
    const isNighttime = currentHour >= 22 || currentHour <= 5
    if (isNighttime && threatLevel !== 'low') {
      confidence *= 1.3 // Increase confidence for nighttime alerts
      if (threatLevel === 'medium') threatLevel = 'high'
    }
    
    return {
      indicators,
      confidence: Math.min(confidence, 1.0),
      threatLevel,
      description,
      isNighttime,
    }
  }

  /**
   * Analyze camera trap data for human activity
   */
  private static analyzeCameraData(reading: any): any {
    const indicators: Partial<PoachingIndicators> = {}
    let confidence = 0
    let description = 'Camera activation detected'
    
    // Simulate AI analysis of camera images
    // In real implementation, this would use computer vision models
    if (reading.value?.objects) {
      const objects = reading.value.objects
      
      if (objects.includes('person') || objects.includes('human')) {
        indicators.humanPresence = true
        confidence += 0.4
        description += ' - Human presence detected'
        
        if (objects.includes('multiple_persons')) {
          indicators.multiplePersons = true
          confidence += 0.3
          description += ' (multiple individuals)'
        }
      }
      
      if (objects.includes('vehicle') || objects.includes('motorcycle')) {
        indicators.vehicleMovement = true
        confidence += 0.5
        description += ' - Vehicle detected'
      }
      
      if (objects.includes('weapon') || objects.includes('gun')) {
        confidence += 0.8
        description += ' - WEAPON DETECTED'
      }
      
      if (objects.includes('night_vision') || objects.includes('flashlight')) {
        indicators.nightVision = true
        confidence += 0.3
        description += ' - Night equipment detected'
      }
    }
    
    // Check for rapid successive images (suspicious activity)
    if (reading.metadata?.rapid_succession) {
      confidence += 0.2
      description += ' - Rapid movement pattern'
    }
    
    return { indicators, confidence, description }
  }

  /**
   * Analyze acoustic sensor data for suspicious sounds
   */
  private static analyzeAudioData(reading: any): any {
    const indicators: Partial<PoachingIndicators> = {}
    let confidence = 0
    let description = 'Audio event detected'
    
    if (reading.value?.audio_classification) {
      const sounds = reading.value.audio_classification
      
      if (sounds.includes('gunshot') || sounds.includes('rifle')) {
        indicators.gunshotDetected = true
        confidence += 0.9
        description += ' - GUNSHOT DETECTED'
      }
      
      if (sounds.includes('chainsaw') || sounds.includes('cutting')) {
        indicators.chainsaw = true
        confidence += 0.7
        description += ' - Chainsaw/cutting detected'
      }
      
      if (sounds.includes('human_voices') || sounds.includes('shouting')) {
        indicators.humanPresence = true
        confidence += 0.4
        description += ' - Human voices detected'
      }
      
      if (sounds.includes('vehicle_engine') || sounds.includes('motorcycle')) {
        indicators.vehicleMovement = true
        confidence += 0.5
        description += ' - Vehicle engine detected'
      }
      
      if (sounds.includes('animal_distress') || sounds.includes('animal_panic')) {
        indicators.animalDistress = true
        confidence += 0.6
        description += ' - Animal distress calls detected'
      }
    }
    
    // Check sound intensity and frequency patterns
    if (reading.value?.intensity > 80) { // High decibel level
      confidence += 0.2
      description += ' - High intensity sound'
    }
    
    return { indicators, confidence, description }
  }

  /**
   * Analyze motion sensor data
   */
  private static analyzeMotionData(reading: any): any {
    const indicators: Partial<PoachingIndicators> = {}
    let confidence = 0
    let description = 'Motion detected'
    
    if (reading.value?.motion_pattern) {
      const pattern = reading.value.motion_pattern
      
      if (pattern === 'human_walking' || pattern === 'bipedal') {
        indicators.humanPresence = true
        confidence += 0.5
        description += ' - Human movement pattern'
      }
      
      if (pattern === 'vehicle_movement') {
        indicators.vehicleMovement = true
        confidence += 0.6
        description += ' - Vehicle movement detected'
      }
      
      if (pattern === 'multiple_signatures') {
        indicators.multiplePersons = true
        confidence += 0.3
        description += ' - Multiple movement signatures'
      }
    }
    
    // Check for unusual timing
    const currentHour = new Date().getHours()
    if (currentHour >= 23 || currentHour <= 4) {
      confidence += 0.3
      description += ' - Late night activity'
    }
    
    return { indicators, confidence, description }
  }

  /**
   * Analyze GPS collar data for animal behavior anomalies
   */
  private static analyzeGPSData(reading: any): any {
    const indicators: Partial<PoachingIndicators> = {}
    let confidence = 0
    let description = 'GPS tracking update'
    
    if (reading.value?.behavior_analysis) {
      const behavior = reading.value.behavior_analysis
      
      if (behavior.includes('panic_movement') || behavior.includes('flight_response')) {
        indicators.animalDistress = true
        confidence += 0.7
        description += ' - Animal panic/flight behavior detected'
      }
      
      if (behavior.includes('herd_scattering') || behavior.includes('sudden_direction_change')) {
        indicators.animalDistress = true
        confidence += 0.6
        description += ' - Herd disturbance detected'
      }
      
      if (behavior.includes('unusual_night_movement')) {
        confidence += 0.4
        description += ' - Unusual nighttime animal movement'
      }
    }
    
    // Check for sudden speed changes
    if (reading.value?.speed_change > 500) { // Rapid acceleration (meters/minute)
      confidence += 0.5
      description += ' - Rapid animal movement detected'
    }
    
    return { indicators, confidence, description }
  }

  /**
   * Calculate overall threat level from indicators
   */
  private static calculateThreatLevel(indicators: PoachingIndicators, confidence: number): 'low' | 'medium' | 'high' {
    // High threat indicators
    if (indicators.gunshotDetected || 
        (indicators.humanPresence && indicators.vehicleMovement && indicators.animalDistress)) {
      return 'high'
    }
    
    // Medium threat indicators
    if (confidence > 0.6 || 
        indicators.chainsaw ||
        (indicators.humanPresence && indicators.nightVision) ||
        (indicators.multiplePersons && indicators.animalDistress)) {
      return 'medium'
    }
    
    // Low threat (normal activity)
    return 'low'
  }

  /**
   * Create night alert record
   */
  private static async createNightAlert(analysis: any, sensor: any): Promise<NightAlert> {
    const alertId = crypto.randomUUID()
    
    // Determine alert type
    let alertType: NightAlert['alertType'] = 'motion_detected'
    if (analysis.indicators.gunshotDetected) alertType = 'unusual_sound'
    else if (analysis.indicators.humanPresence) alertType = 'camera_triggered'
    else if (analysis.indicators.animalDistress) alertType = 'gps_anomaly'
    
    // Generate recommended action
    const recommendedAction = this.generateRecommendedAction(analysis)
    
    const alert: NightAlert = {
      id: alertId,
      timestamp: new Date(),
      location: {
        lat: parseFloat(sensor.latitude),
        lng: parseFloat(sensor.longitude),
      },
      alertType,
      confidence: analysis.confidence,
      sensorId: sensor.id,
      description: analysis.description,
      threatLevel: analysis.threatLevel,
      recommendedAction,
    }
    
    console.log(`🚨 NightGuard Alert Created: ${alertId} - ${analysis.threatLevel.toUpperCase()} threat`)
    
    return alert
  }

  /**
   * Respond to detected threat
   */
  private static async respondToThreat(alert: NightAlert, sensor: any): Promise<void> {
    try {
      // 1. Create automated report
      await this.createAutomatedReport(alert, sensor)
      
      // 2. Alert rangers based on threat level
      if (alert.threatLevel === 'high') {
        await this.alertRangers(alert, 'immediate')
      } else if (alert.threatLevel === 'medium') {
        await this.alertRangers(alert, 'urgent')
      }
      
      // 3. Trigger additional sensors in area
      await this.activateNearbySensors(alert.location)
      
      // 4. Log to threat analysis system
      await ThreatAnalysisService.analyzeThreat(
        alert.location.lat,
        alert.location.lng,
        alert.threatLevel === 'high' ? 'poaching' : 'suspicious_activity'
      )
      
    } catch (error) {
      console.error('Failed to respond to threat:', error)
    }
  }

  /**
   * Create automated report from sensor detection
   */
  private static async createAutomatedReport(alert: NightAlert, sensor: any): Promise<string> {
    const reportId = crypto.randomUUID()
    
    const reportType = alert.threatLevel === 'high' ? 'poaching' : 'suspicious_activity'
    const priority = alert.threatLevel === 'high' ? 'urgent' : 
                     alert.threatLevel === 'medium' ? 'high' : 'medium'
    
    await db.insert(reports).values({
      id: reportId,
      reporterId: null, // Automated report
      type: reportType as any,
      priority: priority as any,
      latitude: alert.location.lat.toString(),
      longitude: alert.location.lng.toString(),
      description: `AUTOMATED SENSOR ALERT: ${alert.description}\n\nSensor: ${sensor.name} (${sensor.type})\nConfidence: ${(alert.confidence * 100).toFixed(1)}%\nRecommended Action: ${alert.recommendedAction}`,
      source: 'sensor',
      reportMethod: 'app' as any,
      verificationStatus: 'pending' as any,
      reportedAt: alert.timestamp,
    })
    
    console.log(`📊 Automated report created: ${reportId}`)
    return reportId
  }

  /**
   * Alert rangers about detected threat
   */
  private static async alertRangers(alert: NightAlert, urgency: 'immediate' | 'urgent' | 'normal'): Promise<void> {
    try {
      // Get rangers in the area or on duty
      const rangers = await db
        .select()
        .from(users)
        .where(eq(users.role, 'ranger'))
        .limit(5)
      
      if (rangers.length === 0) {
        console.warn('No rangers available to alert')
        return
      }
      
      // Create alert message
      const urgencyEmoji = urgency === 'immediate' ? '🚨🚨🚨' : urgency === 'urgent' ? '🚨🚨' : '🚨'
      const alertMessage = `${urgencyEmoji} NIGHT GUARD ALERT ${urgencyEmoji}
      
Location: ${alert.location.lat.toFixed(6)}, ${alert.location.lng.toFixed(6)}
Type: ${alert.alertType.replace('_', ' ').toUpperCase()}
Threat Level: ${alert.threatLevel.toUpperCase()}
Confidence: ${(alert.confidence * 100).toFixed(1)}%

Details: ${alert.description}

Action Required: ${alert.recommendedAction}

Time: ${alert.timestamp.toLocaleString()}
Sensor: ${alert.sensorId}

Respond immediately if threat level is HIGH.`

      // Send SMS to rangers
      for (const ranger of rangers) {
        if (ranger.phoneNumber) {
          await AfricasTalkingService.sendSMS({
            to: [ranger.phoneNumber],
            message: alertMessage,
          })
          console.log(`📱 Ranger alerted: ${ranger.phoneNumber}`)
        }
      }
      
      // If immediate threat, also try voice calls (placeholder - not implemented yet)
      if (urgency === 'immediate') {
        for (const ranger of rangers.slice(0, 2)) { // Call first 2 rangers
          if (ranger.phoneNumber) {
            try {
              // Voice calling not implemented yet - would need different Africa's Talking setup
              console.log(`📞 Emergency call needed for: ${ranger.phoneNumber}`)
            } catch (error) {
              console.error('Emergency call failed:', error)
            }
          }
        }
      }
      
    } catch (error) {
      console.error('Failed to alert rangers:', error)
    }
  }

  /**
   * Activate nearby sensors for enhanced monitoring
   */
  private static async activateNearbySensors(location: { lat: number; lng: number }): Promise<void> {
    try {
      const radius = 0.02 // ~2km radius
      
      // Find sensors within radius
      const nearbySensors = await db
        .select()
        .from(sensors)
        .where(
          and(
            sql`${sensors.latitude}::float BETWEEN ${location.lat - radius} AND ${location.lat + radius}`,
            sql`${sensors.longitude}::float BETWEEN ${location.lng - radius} AND ${location.lng + radius}`,
            eq(sensors.status, 'active')
          )
        )
      
      console.log(`🔍 Activating ${nearbySensors.length} nearby sensors for enhanced monitoring`)
      
      // This would trigger enhanced monitoring modes on compatible sensors
      // For example: increase camera capture frequency, enhance audio sensitivity, etc.
      
    } catch (error) {
      console.error('Failed to activate nearby sensors:', error)
    }
  }

  /**
   * Generate recommended action based on threat analysis
   */
  private static generateRecommendedAction(analysis: any): string {
    if (analysis.indicators.gunshotDetected) {
      return 'IMMEDIATE RANGER RESPONSE - Possible active poaching with weapons'
    }
    
    if (analysis.indicators.humanPresence && analysis.indicators.vehicleMovement) {
      return 'Urgent patrol dispatch - Human activity with vehicle access'
    }
    
    if (analysis.indicators.chainsaw) {
      return 'Investigate illegal logging activity - Deploy anti-logging team'
    }
    
    if (analysis.indicators.animalDistress && analysis.indicators.humanPresence) {
      return 'Investigate animal disturbance - Possible human-wildlife conflict'
    }
    
    if (analysis.indicators.multiplePersons && analysis.isNighttime) {
      return 'Monitor group activity - Consider patrol or community alert'
    }
    
    return 'Continue monitoring - Assess for pattern development'
  }

  /**
   * Store processed sensor data
   */
  private static async storeSensorData(reading: any, analysis: any): Promise<void> {
    try {
      await db.insert(sensorData).values({
        id: crypto.randomUUID(),
        sensorId: reading.sensorId,
        dataType: reading.dataType,
        value: reading.value,
        metadata: {
          ...reading.metadata,
          threatAnalysis: analysis,
          processedAt: new Date().toISOString(),
        },
        detectionConfidence: analysis.confidence.toString(),
        threatLevel: analysis.threatLevel,
        processingStatus: 'analyzed',
        recordedAt: reading.timestamp || new Date(),
        processedAt: new Date(),
      })
      
    } catch (error) {
      console.error('Failed to store sensor data:', error)
    }
  }

  /**
   * Get sensor details
   */
  private static async getSensorDetails(sensorId: string): Promise<any> {
    try {
      const sensorDetails = await db
        .select()
        .from(sensors)
        .where(eq(sensors.id, sensorId))
        .limit(1)
      
      return sensorDetails[0] || null
    } catch (error) {
      console.error('Failed to get sensor details:', error)
      return null
    }
  }

  /**
   * Get night alerts summary for rangers
   */
  static async getNightAlertsSummary(hours: number = 24): Promise<any> {
    try {
      const startTime = new Date(Date.now() - hours * 60 * 60 * 1000)
      
      const recentAlerts = await db
        .select()
        .from(sensorData)
        .where(
          and(
            gte(sensorData.recordedAt, startTime),
            sql`threat_level IN ('medium', 'high')`
          )
        )
        .orderBy(desc(sensorData.recordedAt))
        .limit(50)
      
      const summary = {
        totalAlerts: recentAlerts.length,
        highThreatAlerts: recentAlerts.filter((a: any) => a.threatLevel === 'high').length,
        mediumThreatAlerts: recentAlerts.filter((a: any) => a.threatLevel === 'medium').length,
        topThreats: recentAlerts.slice(0, 10).map((alert: any) => ({
          timestamp: alert.recordedAt,
          location: 'Sensor location', // Would get from sensor details
          threatLevel: alert.threatLevel,
          confidence: alert.detectionConfidence,
          description: alert.metadata?.threatAnalysis?.description,
        })),
        timeRange: `${hours} hours`,
      }
      
      return summary
      
    } catch (error) {
      console.error('Failed to generate night alerts summary:', error)
      throw error
    }
  }
}