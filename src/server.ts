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

// Security middleware - Configure Helmet with CSP for Swagger UI
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", "https:", "data:", "https://fonts.gstatic.com"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      objectSrc: ["'none'"],
      scriptSrc: [
        "'self'", 
        "'unsafe-eval'", // Required for Swagger UI JavaScript execution
        "'unsafe-inline'", // May be needed for some Swagger UI inline scripts
        "https://unpkg.com", // CDN resources that Swagger UI might use
      ],
      scriptSrcAttr: ["'none'"],
      styleSrc: [
        "'self'", 
        "https:", 
        "'unsafe-inline'", // Required for Swagger UI CSS styling
        "https://fonts.googleapis.com",
        "https://unpkg.com"
      ],
      connectSrc: ["'self'", "https:", "wss:", "ws:"], // Allow API calls and WebSocket connections
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable COEP for better compatibility
}))

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

// Middleware to set permissive CSP for Swagger UI specifically
app.use('/docs', (req: Request, res: Response, next: NextFunction) => {
  // Set very permissive CSP for Swagger UI to work properly
  res.setHeader('Content-Security-Policy', 
    "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; " +
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' data: blob: https:; " +
    "style-src 'self' 'unsafe-inline' data: blob: https:; " +
    "font-src 'self' data: blob: https:; " +
    "img-src 'self' data: blob: https:; " +
    "connect-src 'self' data: blob: https: wss: ws:; " +
    "media-src 'self' data: blob: https:; " +
    "frame-src 'self' data: blob: https:; " +
    "object-src 'none';"
  )
  
  // Additional headers for Swagger UI compatibility
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
  
  next()
})

// Swagger UI setup
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #2d8659; }
    .swagger-ui .scheme-container { background: #f8f9fa; padding: 15px; border-radius: 5px; }
    .swagger-ui .opblock { cursor: pointer !important; }
    .swagger-ui .opblock-summary { pointer-events: auto !important; }
  `,
  customSiteTitle: "WildGuard Conservation API Documentation",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list', // Ensure sections can be expanded
    filter: true,
    showExtensions: true,
    tryItOutEnabled: true,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    validatorUrl: null, // Disable validator to prevent external calls
    layout: "BaseLayout",
    deepLinking: true,
    showCommonExtensions: true,
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1
  },
  customJs: [
    `
    // Ensure all operations are expandable
    window.addEventListener('load', function() {
      setTimeout(function() {
        // Force enable all expand/collapse functionality
        const operations = document.querySelectorAll('.opblock');
        operations.forEach(function(op) {
          op.style.pointerEvents = 'auto';
          op.style.cursor = 'pointer';
        });
        
        // Ensure click handlers work
        const summaries = document.querySelectorAll('.opblock-summary');
        summaries.forEach(function(summary) {
          summary.style.pointerEvents = 'auto';
          summary.style.cursor = 'pointer';
        });
      }, 1000);
    });
    `
  ]
}))

// OpenAPI spec endpoint
app.get('/api/openapi.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

// Root endpoint - Welcome page
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'WildGuard Conservation API',
    version: '1.0.0',
    status: 'running',
    description: 'Unified conservation intelligence platform for Africa',
    documentation: {
      interactive: `${req.protocol}://${req.get('host')}/docs`,
      openapi_spec: `${req.protocol}://${req.get('host')}/api/openapi.json`,
    },
    endpoints: {
      health: '/health',
      stats: '/api/stats',
      community: {
        ussd: '/api/community/ussd',
        sms: '/api/community/sms',
        voice: '/api/community/voice',
        reports: '/api/community/report',
        profile: '/api/community/profile/:phoneNumber',
      },
      rangers: {
        dashboard: '/api/rangers/dashboard',
        reports: '/api/rangers/reports',
        verification: '/api/rangers/reports/:reportId/verify',
        threats: '/api/rangers/threats',
      },
      sensors: {
        data: '/api/sensors/data',
        register: '/api/sensors/register',
        status: '/api/sensors/status/:sensorId',
        network: '/api/sensors/network',
      },
    },
    features: [
      'Community Reporting (SMS/USSD/Voice/Mobile)',
      'Threat Analysis & Prediction',
      'Ranger Dashboard & Verification',
      'IoT Sensor Network Integration',
      'Trust Scoring & Airtime Rewards',
      'Real-time Alerts',
      'Africa\'s Talking Integration',
    ],
    support: {
      github: 'https://github.com/AfricasTalkingHackathons/wildguard-api',
      documentation: `${req.protocol}://${req.get('host')}/docs`,
    },
    timestamp: new Date().toISOString(),
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