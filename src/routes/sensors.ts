// src/routes/sensors.ts
import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { db, sensors, sensorData } from '../db'
import { eq, and, gte, desc, sql } from 'drizzle-orm'
import { NightGuardService } from '../services/nightGuardService'

const router = Router()

// Validation schemas
const sensorDataSchema = z.object({
  sensorId: z.string().uuid(),
  dataType: z.enum(['image', 'audio', 'movement', 'temperature', 'humidity', 'gps']),
  value: z.any(), // Flexible data structure
  metadata: z.any().optional(),
  timestamp: z.string().datetime().optional(),
})

const sensorRegistrationSchema = z.object({
  deviceId: z.string(),
  name: z.string(),
  type: z.enum(['camera_trap', 'motion_sensor', 'acoustic_sensor', 'gps_collar', 'weather_station']),
  latitude: z.number(),
  longitude: z.number(),
  conservationAreaId: z.string().uuid().optional(),
  configuration: z.any().optional(),
})

/**
 * @swagger
 * /api/sensors/data:
 *   post:
 *     summary: Process IoT Sensor Data
 *     description: Receive and process sensor data with automatic threat detection via NightGuard
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
 *               - dataType
 *               - value
 *             properties:
 *               sensorId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               dataType:
 *                 type: string
 *                 enum: [image, audio, movement, temperature, humidity, gps]
 *                 example: "image"
 *               value:
 *                 oneOf:
 *                   - type: string
 *                     example: "base64encodedimage"
 *                   - type: object
 *                     example: {"temperature": 25.5, "unit": "celsius"}
 *                 description: Sensor data value (flexible structure)
 *               metadata:
 *                 type: object
 *                 properties:
 *                   confidence:
 *                     type: number
 *                     example: 0.85
 *                   threat_detected:
 *                     type: boolean
 *                     example: true
 *                   additional_info:
 *                     type: string
 *                     example: "Motion detected in sector 3"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T14:30:00Z"
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
 *                 message:
 *                   type: string
 *                   example: "Sensor data processed successfully"
 *                 sensorId:
 *                   type: string
 *                   format: uuid
 *                 processed:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid sensor data format
 *       404:
 *         description: Sensor not found
 *       500:
 *         description: Failed to process sensor data
 */
/**
 * POST /api/sensors/data
 * Receive sensor data and trigger threat analysis
 */
router.post('/data', async (req: Request, res: Response) => {
  try {
    const validatedData = sensorDataSchema.parse(req.body)
    
    // Get sensor details to validate
    const sensor = await db
      .select()
      .from(sensors)
      .where(eq(sensors.id, validatedData.sensorId))
      .limit(1)
    
    if (!sensor[0]) {
      return res.status(404).json({
        success: false,
        error: 'Sensor not found',
      })
    }
    
    // Process through NightGuard for threat detection
    await NightGuardService.processSensorAlert({
      ...validatedData,
      timestamp: validatedData.timestamp ? new Date(validatedData.timestamp) : new Date(),
    })
    
    return res.status(200).json({
      success: true,
      message: 'Sensor data processed successfully',
      sensorId: validatedData.sensorId,
      processed: true,
    })
    
  } catch (error) {
    console.error('Sensor data processing error:', error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sensor data format',
        details: error.errors,
      })
    }
    
    return res.status(500).json({
      success: false,
      error: 'Failed to process sensor data',
    })
  }
})

/**
 * @swagger
 * /api/sensors/register:
 *   post:
 *     summary: Register New Sensor Device
 *     description: Register a new IoT sensor device in the conservation network
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
 *               - deviceId
 *               - name
 *               - type
 *               - latitude
 *               - longitude
 *             properties:
 *               deviceId:
 *                 type: string
 *                 example: "MAASAI_CAMERA_001"
 *                 description: Unique device identifier
 *               name:
 *                 type: string
 *                 example: "North Gate Camera Trap"
 *                 description: Human-readable sensor name
 *               type:
 *                 type: string
 *                 enum: [camera_trap, motion_sensor, acoustic_sensor, gps_collar, weather_station]
 *                 example: "camera_trap"
 *               latitude:
 *                 type: number
 *                 example: -1.2921
 *               longitude:
 *                 type: number
 *                 example: 36.8219
 *               conservationAreaId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *                 description: Optional conservation area assignment
 *               configuration:
 *                 type: object
 *                 properties:
 *                   sensitivity:
 *                     type: string
 *                     example: "high"
 *                   detection_range:
 *                     type: number
 *                     example: 50
 *                   battery_threshold:
 *                     type: number
 *                     example: 20
 *     responses:
 *       201:
 *         description: Sensor registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Sensor registered successfully"
 *                 sensorId:
 *                   type: string
 *                   format: uuid
 *                 sensor:
 *                   $ref: '#/components/schemas/Sensor'
 *       400:
 *         description: Invalid sensor registration data
 *       409:
 *         description: Sensor device already registered
 *       500:
 *         description: Failed to register sensor
 */
/**
 * POST /api/sensors/register
 * Register a new sensor device
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const validatedData = sensorRegistrationSchema.parse(req.body)
    
    // Check if device already exists
    const existingSensor = await db
      .select()
      .from(sensors)
      .where(eq(sensors.deviceId, validatedData.deviceId))
      .limit(1)
    
    if (existingSensor[0]) {
      return res.status(409).json({
        success: false,
        error: 'Sensor device already registered',
        sensorId: existingSensor[0].id,
      })
    }
    
    // Create new sensor
    const sensorId = crypto.randomUUID()
    
    await db.insert(sensors).values({
      id: sensorId,
      deviceId: validatedData.deviceId,
      name: validatedData.name,
      type: validatedData.type,
      latitude: validatedData.latitude.toString(),
      longitude: validatedData.longitude.toString(),
      conservationAreaId: validatedData.conservationAreaId,
      configuration: validatedData.configuration,
      status: 'active',
      installationDate: new Date(),
    })
    
    console.log(`📡 New sensor registered: ${validatedData.name} (${sensorId})`)
    
    return res.status(201).json({
      success: true,
      message: 'Sensor registered successfully',
      sensorId,
      sensor: {
        id: sensorId,
        deviceId: validatedData.deviceId,
        name: validatedData.name,
        type: validatedData.type,
        location: {
          latitude: validatedData.latitude,
          longitude: validatedData.longitude,
        },
        status: 'active',
      },
    })
    
  } catch (error) {
    console.error('Sensor registration error:', error)
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sensor registration data',
        details: error.errors,
      })
    }
    
    return res.status(500).json({
      success: false,
      error: 'Failed to register sensor',
    })
  }
})

/**
 * @swagger
 * /api/sensors/status/{sensorId}:
 *   get:
 *     summary: Get Sensor Status and Recent Data
 *     description: Retrieve detailed sensor information, statistics, and recent data readings
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the sensor to query
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Sensor status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 sensor:
 *                   $ref: '#/components/schemas/Sensor'
 *                 statistics:
 *                   type: object
 *                   properties:
 *                     totalReadingsToday:
 *                       type: integer
 *                       example: 147
 *                     threatDetections:
 *                       type: integer
 *                       example: 3
 *                     lastReading:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T14:25:00Z"
 *                     averageConfidence:
 *                       type: number
 *                       example: 0.87
 *                 recentData:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SensorData'
 *       404:
 *         description: Sensor not found
 *       500:
 *         description: Failed to get sensor status
 */
/**
 * GET /api/sensors/status/:sensorId
 * Get sensor status and recent data
 */
router.get('/status/:sensorId', async (req: Request, res: Response) => {
  try {
    const { sensorId } = req.params
    
    // Get sensor details
    const sensor = await db
      .select()
      .from(sensors)
      .where(eq(sensors.id, sensorId))
      .limit(1)
    
    if (!sensor[0]) {
      return res.status(404).json({
        success: false,
        error: 'Sensor not found',
      })
    }
    
    // Get recent sensor data
    const recentData = await db
      .select()
      .from(sensorData)
      .where(eq(sensorData.sensorId, sensorId))
      .orderBy(desc(sensorData.recordedAt))
      .limit(10)
    
    // Calculate uptime and statistics
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const todaysReadings = await db
      .select()
      .from(sensorData)
      .where(
        and(
          eq(sensorData.sensorId, sensorId),
          gte(sensorData.recordedAt, last24Hours)
        )
      )
    
    const threatDetections = todaysReadings.filter((reading: any) => 
      reading.threatLevel && reading.threatLevel !== 'none'
    )
    
    return res.status(200).json({
      success: true,
      sensor: {
        id: sensor[0].id,
        deviceId: sensor[0].deviceId,
        name: sensor[0].name,
        type: sensor[0].type,
        location: {
          latitude: parseFloat(sensor[0].latitude),
          longitude: parseFloat(sensor[0].longitude),
        },
        status: sensor[0].status,
        batteryLevel: sensor[0].batteryLevel,
        lastDataReceived: sensor[0].lastDataReceived,
        installationDate: sensor[0].installationDate,
      },
      statistics: {
        totalReadingsToday: todaysReadings.length,
        threatDetections: threatDetections.length,
        lastReading: recentData[0]?.recordedAt,
        averageConfidence: recentData.length > 0 
          ? recentData.reduce((sum: number, d: any) => sum + (parseFloat(d.detectionConfidence || '0')), 0) / recentData.length
          : 0,
      },
      recentData: recentData.map((data: any) => ({
        id: data.id,
        dataType: data.dataType,
        threatLevel: data.threatLevel,
        confidence: data.detectionConfidence,
        recordedAt: data.recordedAt,
        processedAt: data.processedAt,
        description: (data.metadata as any)?.threatAnalysis?.description || undefined,
      })),
    })
    
  } catch (error) {
    console.error('Sensor status error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to get sensor status',
    })
  }
})

/**
 * GET /api/sensors/alerts
 * Get recent night guard alerts
 */
router.get('/alerts', async (req: Request, res: Response) => {
  try {
    const { hours = '24' } = req.query
    const alertsHours = parseInt(hours as string, 10)
    
    const alertsSummary = await NightGuardService.getNightAlertsSummary(alertsHours)
    
    return res.status(200).json({
      success: true,
      summary: alertsSummary,
    })
    
  } catch (error) {
    console.error('Night alerts error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to get night alerts',
    })
  }
})

/**
 * @swagger
 * /api/sensors/network:
 *   get:
 *     summary: Get Sensor Network Overview
 *     description: Retrieve comprehensive overview of all sensors with statistics and status
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sensor network overview retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 overview:
 *                   type: object
 *                   properties:
 *                     totalSensors:
 *                       type: integer
 *                       example: 45
 *                     activeSensors:
 *                       type: integer
 *                       example: 42
 *                     onlineSensors:
 *                       type: integer
 *                       example: 38
 *                     sensorsWithThreats:
 *                       type: integer
 *                       example: 7
 *                     totalThreatsLast24h:
 *                       type: integer
 *                       example: 15
 *                     averageBatteryLevel:
 *                       type: number
 *                       example: 78.5
 *                     sensorTypes:
 *                       type: object
 *                       properties:
 *                         camera_trap:
 *                           type: integer
 *                           example: 25
 *                         motion_sensor:
 *                           type: integer
 *                           example: 15
 *                         acoustic_sensor:
 *                           type: integer
 *                           example: 5
 *                 sensors:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Sensor'
 *                       - type: object
 *                         properties:
 *                           stats:
 *                             type: object
 *                             properties:
 *                               readingsLast24h:
 *                                 type: integer
 *                                 example: 147
 *                               threatsDetected:
 *                                 type: integer
 *                                 example: 3
 *                               isOnline:
 *                                 type: boolean
 *                                 example: true
 *       500:
 *         description: Failed to get sensor network data
 */
/**
 * GET /api/sensors/network
 * Get sensor network overview
 */
router.get('/network', async (req: Request, res: Response) => {
  try {
    // Get all sensors with their status
    const allSensors = await db
      .select()
      .from(sensors)
      .orderBy(sensors.name)
    
    // Get sensor statistics
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const sensorStats = await Promise.all(
      allSensors.map(async (sensor: any) => {
        const recentData = await db
          .select()
          .from(sensorData)
          .where(
            and(
              eq(sensorData.sensorId, sensor.id),
              gte(sensorData.recordedAt, last24Hours)
            )
          )
        
        const threats = recentData.filter((d: any) => d.threatLevel && d.threatLevel !== 'none')
        
        return {
          id: sensor.id,
          deviceId: sensor.deviceId,
          name: sensor.name,
          type: sensor.type,
          location: {
            latitude: parseFloat(sensor.latitude),
            longitude: parseFloat(sensor.longitude),
          },
          status: sensor.status,
          batteryLevel: sensor.batteryLevel,
          lastDataReceived: sensor.lastDataReceived,
          stats: {
            readingsLast24h: recentData.length,
            threatsDetected: threats.length,
            isOnline: sensor.lastDataReceived && 
              (Date.now() - new Date(sensor.lastDataReceived).getTime()) < 30 * 60 * 1000, // 30 minutes
          },
        }
      })
    )
    
    // Calculate network overview
    const networkOverview = {
      totalSensors: allSensors.length,
      activeSensors: sensorStats.filter(s => s.status === 'active').length,
      onlineSensors: sensorStats.filter(s => s.stats.isOnline).length,
      sensorsWithThreats: sensorStats.filter(s => s.stats.threatsDetected > 0).length,
      totalThreatsLast24h: sensorStats.reduce((sum, s) => sum + s.stats.threatsDetected, 0),
      averageBatteryLevel: allSensors
        .filter((s: any) => s.batteryLevel !== null)
        .reduce((sum: number, s: any) => sum + (s.batteryLevel || 0), 0) / 
        allSensors.filter((s: any) => s.batteryLevel !== null).length || 0,
      sensorTypes: allSensors.reduce((types: any, sensor: any) => {
        types[sensor.type] = (types[sensor.type] || 0) + 1
        return types
      }, {}),
    }
    
    return res.status(200).json({
      success: true,
      overview: networkOverview,
      sensors: sensorStats,
    })
    
  } catch (error) {
    console.error('Sensor network error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to get sensor network data',
    })
  }
})

/**
 * POST /api/sensors/:sensorId/maintenance
 * Update sensor maintenance status
 */
router.post('/:sensorId/maintenance', async (req: Request, res: Response) => {
  try {
    const { sensorId } = req.params
    const { status, batteryLevel, notes } = req.body
    
    // Validate sensor exists
    const sensor = await db
      .select()
      .from(sensors)
      .where(eq(sensors.id, sensorId))
      .limit(1)
    
    if (!sensor[0]) {
      return res.status(404).json({
        success: false,
        error: 'Sensor not found',
      })
    }
    
    // Update sensor status
    const updateData: any = {}
    if (status) updateData.status = status
    if (batteryLevel !== undefined) updateData.batteryLevel = batteryLevel
    
    await db
      .update(sensors)
      .set(updateData)
      .where(eq(sensors.id, sensorId))
    
    console.log(`🔧 Sensor maintenance updated: ${sensorId} - Status: ${status}`)
    
    return res.status(200).json({
      success: true,
      message: 'Sensor maintenance status updated',
      sensorId,
      updates: updateData,
    })
    
  } catch (error) {
    console.error('Sensor maintenance error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to update sensor maintenance',
    })
  }
})

export default router