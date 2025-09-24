import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

// Import routes
import communityRoutes from './routes/community'
import rangerRoutes from './routes/rangers'
import sensorRoutes from './routes/sensors'
import ApiController from './controllers/apiController'

// Create Express application
const app = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://wildguard.conservation'] // Replace with your domain
    : true, // Allow all origins in development
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// API routes
app.get('/health', ApiController.health)
app.get('/api/stats', ApiController.stats)
app.post('/api/test-sms', ApiController.testAT)
app.post('/api/emergency-alert', ApiController.emergencyAlert)
app.post('/api/sensor-data', ApiController.processSensorData)

// Community routes (SMS, USSD, Voice, Mobile App)
app.use('/api/community', communityRoutes)

// Rangers dashboard routes
app.use('/api/rangers', rangerRoutes)

// Sensor network routes
app.use('/api/sensors', sensorRoutes)

// Real-time WebSocket for live updates (placeholder)
app.get('/api/ws', (req: Request, res: Response) => {
  res.json({
    message: 'WebSocket endpoint - implement with Socket.IO for real-time updates',
    endpoints: {
      alerts: '/api/rangers/alerts/stream',
      reports: 'ws://localhost:3000/reports',
      threats: 'ws://localhost:3000/threats',
    }
  })
})

// API documentation endpoint
app.get('/api/docs', (req: Request, res: Response) => {
  res.json({
    title: 'WildGuard Conservation API',
    version: '1.0.0',
    description: 'Unified conservation intelligence platform for Africa',
    endpoints: {
      community: {
        ussd: 'POST /api/community/ussd - USSD callback for Africa\'s Talking',
        sms: 'POST /api/community/sms - SMS webhook for Africa\'s Talking',
        voice: 'POST /api/community/voice - Voice callback for Africa\'s Talking',
        report: 'POST /api/community/report - Submit report via mobile app',
        profile: 'GET /api/community/profile/:phoneNumber - Get user profile',
      },
      rangers: {
        dashboard: 'GET /api/rangers/dashboard - Ranger dashboard overview',
        reports: 'GET /api/rangers/reports - List all reports with filters',
        verify: 'POST /api/rangers/reports/:id/verify - Verify a report',
        threats: 'GET /api/rangers/threats - Get threat predictions',
        analyze: 'POST /api/rangers/threats/analyze - Analyze threats at location',
        alerts: 'GET /api/rangers/alerts/stream - Real-time alert stream',
        analytics: 'GET /api/rangers/analytics - Conservation analytics',
      },
      sensors: {
        data: 'POST /api/sensors/data - Submit sensor data for processing',
        register: 'POST /api/sensors/register - Register new sensor device',
        status: 'GET /api/sensors/status/:sensorId - Get sensor status',
        alerts: 'GET /api/sensors/alerts - Get recent night guard alerts',
        network: 'GET /api/sensors/network - Get sensor network overview',
        maintenance: 'POST /api/sensors/:sensorId/maintenance - Update sensor maintenance',
      },
      system: {
        health: 'GET /health - System health check',
        stats: 'GET /api/stats - API usage statistics',
        test: 'POST /api/test-sms - Test Africa\'s Talking SMS',
        emergency: 'POST /api/emergency-alert - Send emergency alerts',
        sensors: 'POST /api/sensor-data - Process IoT sensor data',
      },
    },
    features: [
      'Community reporting via SMS, USSD, Voice, and Mobile App',
      'Automated threat analysis and prediction',
      'Real-time ranger dashboard and alerts',
      'Airtime rewards for verified reports',
      'Trust network for crowd-sourced verification',
      'IoT sensor data integration',
      'Night Guard automated monitoring',
      'Predictive conservation analytics',
    ],
  })
})

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: '/api/docs'
  })
})

// Export the app for use in other modules (like tests)
export { app }

// Default export for convenience
export default app