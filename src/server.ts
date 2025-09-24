import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger'

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
  origin: true, // Allow all origins for now (frontend development)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
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
  res.redirect('/docs')
})

// Swagger UI setup
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #2d8659; }
    .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px; }
  `,
  customSiteTitle: "WildGuard Conservation API Documentation",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showExtensions: true,
    tryItOutEnabled: true,
  },
}))

// OpenAPI spec endpoint
app.get('/api/openapi.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
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