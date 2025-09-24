// src/config/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerDefinition, Options } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: '🌿 WildGuard Conservation API',
    version: '1.0.0',
    description: `
      **Protecting Africa's Wildlife Through Technology**
      
      WildGuard is a comprehensive conservation intelligence platform that enables multi-channel wildlife reporting, 
      automated threat analysis, and real-time ranger coordination across Africa.
      
      ## 🚀 Key Features
      - **📱 Multi-Channel Reporting**: SMS, USSD, Voice, and Mobile App
      - **🤖 AI Threat Analysis**: Automated risk assessment and prediction
      - **🎖️ Rangers Dashboard**: Real-time monitoring and management
      - **📡 IoT Integration**: Sensor network and Night Guard system
      - **💰 Airtime Rewards**: Incentive system for verified reports
      - **🌙 24/7 Monitoring**: Automated conservation surveillance
      
      ## 🔗 Integration Partners
      - **Africa's Talking**: SMS, USSD, Voice, and Airtime services
      - **PostgreSQL**: Geospatial database with PostGIS
      - **Render**: Cloud deployment and scaling
    `,
    contact: {
      name: 'WildGuard Development Team',
      url: 'https://github.com/AfricasTalkingHackathons/wildguard-api',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'https://wildguard-api-gubr.onrender.com',
      description: 'Production Server',
    },
    {
      url: 'http://localhost:3000',
      description: 'Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token for ranger/admin authentication',
      },
    },
    schemas: {
      // User Models
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'Unique user identifier' },
          phoneNumber: { type: 'string', pattern: '^\\+254[0-9]{9}$', example: '+254712345678' },
          name: { type: 'string', example: 'John Kamau' },
          role: { 
            type: 'string', 
            enum: ['community', 'ranger', 'admin', 'ngo'], 
            default: 'community' 
          },
          location: { type: 'string', example: 'Nairobi, Kenya' },
          trustScore: { 
            type: 'number', 
            minimum: 0, 
            maximum: 1, 
            example: 0.85,
            description: 'User reliability score (0.0 - 1.0)'
          },
          totalReports: { type: 'integer', minimum: 0, example: 23 },
          verifiedReports: { type: 'integer', minimum: 0, example: 19 },
          airtimeEarned: { type: 'number', example: 350.00, description: 'Total airtime rewards in KES' },
          isActive: { type: 'boolean', default: true },
          registeredAt: { type: 'string', format: 'date-time' },
          lastActiveAt: { type: 'string', format: 'date-time' },
        },
        required: ['phoneNumber', 'role'],
      },
      
      // Report Models
      Report: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          reporterId: { type: 'string', format: 'uuid' },
          type: {
            type: 'string',
            enum: ['poaching', 'illegal_logging', 'wildlife_sighting', 'suspicious_activity', 'injury', 'fence_breach', 'fire'],
            description: 'Type of conservation incident'
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'urgent'],
            description: 'Report urgency level'
          },
          latitude: { type: 'number', minimum: -90, maximum: 90, example: -1.2921 },
          longitude: { type: 'number', minimum: -180, maximum: 180, example: 36.8219 },
          description: { type: 'string', example: 'Herd of elephants crossing the road' },
          animalSpecies: { type: 'string', example: 'African Elephant' },
          estimatedCount: { type: 'integer', minimum: 0, example: 12 },
          mediaUrls: {
            type: 'array',
            items: { type: 'string', format: 'uri' },
            description: 'Photos or audio recordings'
          },
          verificationStatus: {
            type: 'string',
            enum: ['pending', 'verified', 'rejected', 'investigating'],
            default: 'pending'
          },
          verifiedBy: { type: 'string', format: 'uuid' },
          verificationNotes: { type: 'string' },
          conservationAreaId: { type: 'string', format: 'uuid' },
          reportMethod: {
            type: 'string',
            enum: ['sms', 'ussd', 'voice', 'app'],
            description: 'How the report was submitted'
          },
          source: { type: 'string', default: 'community' },
          isAnonymous: { type: 'boolean', default: false },
          reportedAt: { type: 'string', format: 'date-time' },
          verifiedAt: { type: 'string', format: 'date-time' },
          resolvedAt: { type: 'string', format: 'date-time' },
        },
        required: ['type', 'priority', 'reportMethod'],
      },
      
      // Sensor Models
      Sensor: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          deviceId: { type: 'string', example: 'CAMERA_TRAP_001' },
          name: { type: 'string', example: 'North Waterhole Camera' },
          type: {
            type: 'string',
            enum: ['camera_trap', 'motion_sensor', 'acoustic_sensor', 'gps_collar', 'weather_station']
          },
          latitude: { type: 'number', example: -1.2921 },
          longitude: { type: 'number', example: 36.8219 },
          conservationAreaId: { type: 'string', format: 'uuid' },
          status: {
            type: 'string',
            enum: ['active', 'inactive', 'maintenance', 'battery_low'],
            default: 'active'
          },
          batteryLevel: { type: 'integer', minimum: 0, maximum: 100, example: 85 },
          lastDataReceived: { type: 'string', format: 'date-time' },
          configuration: { type: 'object', description: 'Sensor-specific settings' },
          installationDate: { type: 'string', format: 'date-time' },
        },
        required: ['deviceId', 'name', 'type', 'latitude', 'longitude'],
      },
      
      // Conservation Area Models
      ConservationArea: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Maasai Mara National Reserve' },
          type: {
            type: 'string',
            enum: ['national_park', 'reserve', 'conservancy', 'community_land']
          },
          boundaries: { 
            type: 'object', 
            description: 'GeoJSON polygon defining area boundaries' 
          },
          riskLevel: {
            type: 'string',
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
          },
          managingOrganization: { type: 'string', example: 'Kenya Wildlife Service' },
          contactInfo: { type: 'object', description: 'Contact details for area management' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['name', 'type'],
      },
      
      // Request/Response Models
      ReportSubmission: {
        type: 'object',
        properties: {
          phoneNumber: { type: 'string', pattern: '^\\+254[0-9]{9}$', example: '+254712345678' },
          type: {
            type: 'string',
            enum: ['poaching', 'illegal_logging', 'wildlife_sighting', 'suspicious_activity', 'injury', 'fence_breach', 'fire']
          },
          description: { type: 'string', minLength: 10, example: 'Spotted 3 elephants near the waterhole' },
          latitude: { type: 'number', minimum: -90, maximum: 90 },
          longitude: { type: 'number', minimum: -180, maximum: 180 },
          animalSpecies: { type: 'string', example: 'African Elephant' },
          estimatedCount: { type: 'integer', minimum: 1 },
          mediaUrls: {
            type: 'array',
            items: { type: 'string', format: 'uri' },
            maxItems: 10
          },
          isAnonymous: { type: 'boolean', default: false },
        },
        required: ['phoneNumber', 'type', 'description'],
      },
      
      ReportVerification: {
        type: 'object',
        properties: {
          isVerified: { type: 'boolean', description: 'True to verify, false to reject' },
          notes: { type: 'string', example: 'Confirmed via drone patrol' },
          rangerId: { type: 'string', format: 'uuid', description: 'ID of verifying ranger' },
        },
        required: ['isVerified', 'rangerId'],
      },
      
      SensorDataSubmission: {
        type: 'object',
        properties: {
          sensorId: { type: 'string', format: 'uuid' },
          dataType: {
            type: 'string',
            enum: ['image', 'audio', 'movement', 'temperature', 'humidity', 'gps']
          },
          value: { 
            type: 'object', 
            description: 'Sensor reading data (flexible structure)' 
          },
          metadata: { 
            type: 'object', 
            description: 'Additional context and sensor information' 
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
        required: ['sensorId', 'dataType', 'value'],
      },
      
      // Response Models
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
      
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Validation failed' },
          details: { 
            type: 'object',
            properties: {
              field: { type: 'string' },
              message: { type: 'string' },
            },
          },
          code: { type: 'string', example: 'VALIDATION_ERROR' },
        },
      },
      
      HealthCheck: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'OK' },
          service: { type: 'string', example: 'WildGuard Conservation API' },
          version: { type: 'string', example: '1.0.0' },
          timestamp: { type: 'string', format: 'date-time' },
          features: {
            type: 'array',
            items: { type: 'string' },
            example: ['Community Reporting', 'Threat Analysis', 'Ranger Dashboard']
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'System',
      description: '🔧 System health and utilities',
    },
    {
      name: 'Community',
      description: '📱 Community reporting (SMS, USSD, Voice, Mobile)',
    },
    {
      name: 'Rangers',
      description: '🎖️ Rangers dashboard and management',
    },
    {
      name: 'Sensors',
      description: '📡 IoT sensors and Night Guard system',
    },
    {
      name: 'Authentication',
      description: '🔐 User authentication and authorization',
    },
  ],
};

const options: Options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/server.ts',
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;