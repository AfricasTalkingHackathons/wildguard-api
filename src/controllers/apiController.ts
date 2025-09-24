// src/controllers/apiController.ts
import { Request, Response } from 'express'
import ReportProcessingService from '../services/reportProcessing'
import { ThreatAnalysisService } from '../services/threatAnalysis'
import AfricasTalkingService from '../services/africasTalking'

export class ApiController {
  // Health check for the API
  static health(req: Request, res: Response) {
    res.json({
      status: 'OK',
      service: 'WildGuard Conservation API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      features: [
        'Community Reporting (SMS/USSD/Voice)',
        'Threat Analysis & Prediction',
        'Ranger Dashboard',
        'Airtime Rewards',
        'Real-time Alerts',
      ],
    })
  }

  // Get API statistics and usage
  static async stats(req: Request, res: Response) {
    try {
      // Get recent report statistics
      const reports = await ReportProcessingService.getReports({ limit: 1000 })
      
      const stats = {
        totalReports: reports.length,
        reportsByType: reports.reduce((acc: any, report: any) => {
          acc[report.type] = (acc[report.type] || 0) + 1
          return acc
        }, {}),
        verificationStats: {
          verified: reports.filter((r: any) => r.verificationStatus === 'verified').length,
          pending: reports.filter((r: any) => r.verificationStatus === 'pending').length,
          rejected: reports.filter((r: any) => r.verificationStatus === 'rejected').length,
        },
        lastUpdated: new Date().toISOString(),
      }

      res.json(stats)
    } catch (error) {
      console.error('Stats error:', error)
      res.status(500).json({ error: 'Failed to get statistics' })
    }
  }

  // Test Africa's Talking integration
  static async testAT(req: Request, res: Response) {
    try {
      const { phoneNumber, message } = req.body

      if (!phoneNumber || !message) {
        return res.status(400).json({ 
          error: 'phoneNumber and message required' 
        })
      }

      const result = await AfricasTalkingService.sendSMS({
        to: [phoneNumber],
        message: `WildGuard Test: ${message}`,
      })

      return res.json({
        success: true,
        result,
        message: 'Test SMS sent successfully',
      })
    } catch (error) {
      console.error('AT test error:', error)
      return res.status(500).json({ error: 'Failed to send test SMS' })
    }
  }

  // Emergency alert system
  static async emergencyAlert(req: Request, res: Response) {
    try {
      const { 
        alertType, 
        location, 
        description, 
        severity = 'high',
        targetAudience = 'rangers' 
      } = req.body

      if (!alertType || !location || !description) {
        return res.status(400).json({ 
          error: 'alertType, location, and description required' 
        })
      }

      // Create emergency report
      const reportId = await ReportProcessingService.createReport({
        phoneNumber: 'SYSTEM',
        type: alertType,
        description: `EMERGENCY ALERT: ${description}`,
        latitude: location.lat,
        longitude: location.lng,
        priority: 'urgent',
        reportMethod: 'app',
      })

      // Alert rangers immediately
      if (targetAudience === 'rangers' || targetAudience === 'all') {
        // In production, get ranger phone numbers from database
        const rangerPhones = ['+254700000000'] // Demo number
        
        await AfricasTalkingService.sendConservationAlert(
          rangerPhones,
          `${alertType.toUpperCase()}: ${description} at ${location.lat}, ${location.lng}`
        )
      }

      return res.json({
        success: true,
        reportId,
        message: 'Emergency alert sent successfully',
        alertedPersons: targetAudience === 'rangers' ? 'Rangers' : 'All users',
      })
    } catch (error) {
      console.error('Emergency alert error:', error)
      return res.status(500).json({ error: 'Failed to send emergency alert' })
    }
  }

  // Bulk report processing for IoT sensors
  static async processSensorData(req: Request, res: Response) {
    try {
      const { sensorId, dataPoints } = req.body

      if (!sensorId || !Array.isArray(dataPoints)) {
        return res.status(400).json({ 
          error: 'sensorId and dataPoints array required' 
        })
      }

      const processedReports = []

      for (const dataPoint of dataPoints) {
        if (dataPoint.threatLevel && dataPoint.threatLevel !== 'none') {
          // Create report for sensor detection
          const reportId = await ReportProcessingService.createReport({
            phoneNumber: `SENSOR_${sensorId}`,
            type: this.mapSensorToReportType(dataPoint.type, dataPoint.value) as any,
            description: `Sensor ${sensorId} detected: ${dataPoint.description || 'Automated detection'}`,
            latitude: dataPoint.latitude,
            longitude: dataPoint.longitude,
            priority: this.mapThreatToPriority(dataPoint.threatLevel) as any,
            reportMethod: 'app',
          })

          processedReports.push({
            reportId,
            sensorId,
            dataPoint: dataPoint.id,
            threatLevel: dataPoint.threatLevel,
          })
        }
      }

      return res.json({
        success: true,
        processedReports,
        message: `Processed ${processedReports.length} sensor detections`,
      })
    } catch (error) {
      console.error('Sensor data processing error:', error)
      return res.status(500).json({ error: 'Failed to process sensor data' })
    }
  }

  // Helper methods
  private static mapSensorToReportType(sensorType: string, value: any): string {
    const mapping: { [key: string]: string } = {
      'motion_sensor': 'suspicious_activity',
      'camera_trap': 'wildlife_sighting',
      'acoustic_sensor': 'suspicious_activity',
      'fire_sensor': 'fire',
      'fence_sensor': 'fence_breach',
    }

    return mapping[sensorType] || 'suspicious_activity'
  }

  private static mapThreatToPriority(threatLevel: string): string {
    const mapping: { [key: string]: string } = {
      'low': 'low',
      'medium': 'medium',
      'high': 'high',
      'critical': 'urgent',
    }

    return mapping[threatLevel] || 'medium'
  }
}

export default ApiController