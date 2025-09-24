// src/controllers/apiController.ts
import { Request, Response } from 'express'
import ReportProcessingService from '../services/reportProcessing'
import { ThreatAnalysisService } from '../services/threatAnalysis'
import AfricasTalkingService from '../services/africasTalking'

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthCheck:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "OK"
 *         service:
 *           type: string
 *           example: "WildGuard Conservation API"
 *         version:
 *           type: string
 *           example: "1.0.0"
 *         timestamp:
 *           type: string
 *           format: date-time
 *         features:
 *           type: array
 *           items:
 *             type: string
 */

export class ApiController {
  
  /**
   * @swagger
   * /health:
   *   get:
   *     summary: API Health Check
   *     description: Check if the WildGuard API is operational and get service information
   *     tags: [System]
   *     responses:
   *       200:
   *         description: API is healthy and operational
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HealthCheck'
   *             example:
   *               status: "OK"
   *               service: "WildGuard Conservation API"
   *               version: "1.0.0"
   *               timestamp: "2025-09-24T10:00:00.000Z"
   *               features:
   *                 - "Community Reporting (SMS/USSD/Voice)"
   *                 - "Threat Analysis & Prediction"
   *                 - "Ranger Dashboard"
   *                 - "Airtime Rewards"
   *                 - "Real-time Alerts"
   */
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

  /**
   * @swagger
   * /api/stats:
   *   get:
   *     summary: Get API Usage Statistics
   *     description: Retrieve comprehensive statistics about reports, verifications, and system usage
   *     tags: [System]
   *     responses:
   *       200:
   *         description: Statistics retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalReports:
   *                   type: integer
   *                   example: 1247
   *                 reportsByType:
   *                   type: object
   *                   properties:
   *                     poaching:
   *                       type: integer
   *                       example: 156
   *                     wildlife_sighting:
   *                       type: integer
   *                       example: 892
   *                     injury:
   *                       type: integer
   *                       example: 78
   *                 verificationStats:
   *                   type: object
   *                   properties:
   *                     verified:
   *                       type: integer
   *                       example: 1089
   *                     pending:
   *                       type: integer
   *                       example: 134
   *                     rejected:
   *                       type: integer
   *                       example: 24
   *                 lastUpdated:
   *                   type: string
   *                   format: date-time
   *       500:
   *         description: Failed to retrieve statistics
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
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

  /**
   * @swagger
   * /api/test-sms:
   *   post:
   *     summary: Test SMS Integration
   *     description: Send a test SMS using Africa's Talking integration (Development only)
   *     tags: [System]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - phoneNumber
   *               - message
   *             properties:
   *               phoneNumber:
   *                 type: string
   *                 pattern: '^\\+254[0-9]{9}$'
   *                 example: "+254712345678"
   *                 description: Kenyan phone number
   *               message:
   *                 type: string
   *                 maxLength: 160
   *                 example: "Test message from WildGuard API"
   *     responses:
   *       200:
   *         description: Test SMS sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 result:
   *                   type: object
   *                   description: Africa's Talking API response
   *                 message:
   *                   type: string
   *                   example: "Test SMS sent successfully"
   *       400:
   *         description: Missing required fields
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Failed to send SMS
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
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

  /**
   * @swagger
   * /api/emergency-alert:
   *   post:
   *     summary: Broadcast Emergency Alert
   *     description: Send emergency alerts to rangers and create urgent reports for critical conservation incidents
   *     tags: [System]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - alertType
   *               - location
   *               - description
   *             properties:
   *               alertType:
   *                 type: string
   *                 enum: [poaching, fire, injury, suspicious_activity]
   *                 example: "fire"
   *               location:
   *                 type: object
   *                 properties:
   *                   lat:
   *                     type: number
   *                     example: -1.2921
   *                   lng:
   *                     type: number
   *                     example: 36.8219
   *               description:
   *                 type: string
   *                 example: "Large wildfire detected in Maasai Mara North"
   *               severity:
   *                 type: string
   *                 enum: [low, medium, high, critical]
   *                 default: high
   *               targetAudience:
   *                 type: string
   *                 enum: [rangers, all]
   *                 default: rangers
   *     responses:
   *       200:
   *         description: Emergency alert sent successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 reportId:
   *                   type: string
   *                   format: uuid
   *                 message:
   *                   type: string
   *                   example: "Emergency alert sent successfully"
   *                 alertedPersons:
   *                   type: string
   *                   example: "Rangers"
   *       400:
   *         description: Missing required fields
   *       500:
   *         description: Failed to send emergency alert
   */
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

  /**
   * @swagger
   * /api/sensor-data:
   *   post:
   *     summary: Process IoT Sensor Data
   *     description: Bulk process sensor data points and create reports for threat detections
   *     tags: [Sensors]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - sensorId
   *               - dataPoints
   *             properties:
   *               sensorId:
   *                 type: string
   *                 example: "SENSOR_001_MAASAI_MARA"
   *               dataPoints:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "dp_001"
   *                     type:
   *                       type: string
   *                       enum: [motion_sensor, camera_trap, acoustic_sensor, fire_sensor, fence_sensor]
   *                       example: "motion_sensor"
   *                     value:
   *                       type: string
   *                       example: "movement_detected"
   *                     threatLevel:
   *                       type: string
   *                       enum: [none, low, medium, high, critical]
   *                       example: "high"
   *                     latitude:
   *                       type: number
   *                       example: -1.2921
   *                     longitude:
   *                       type: number
   *                       example: 36.8219
   *                     description:
   *                       type: string
   *                       example: "Motion detected at north perimeter fence"
   *                     timestamp:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-01-15T14:30:00Z"
   *     responses:
   *       200:
   *         description: Sensor data processed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 processedReports:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       reportId:
   *                         type: string
   *                         format: uuid
   *                       sensorId:
   *                         type: string
   *                         example: "SENSOR_001_MAASAI_MARA"
   *                       dataPoint:
   *                         type: string
   *                         example: "dp_001"
   *                       threatLevel:
   *                         type: string
   *                         example: "high"
   *                 message:
   *                   type: string
   *                   example: "Processed 3 sensor detections"
   *       400:
   *         description: Missing required fields or invalid data format
   *       500:
   *         description: Failed to process sensor data
   */
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