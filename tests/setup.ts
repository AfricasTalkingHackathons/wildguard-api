// Test setup file
import dotenv from 'dotenv'

// Load test environment variables
dotenv.config({ path: '.env.test' })

// Mock Africa's Talking to avoid real API calls during tests
jest.mock('../src/services/africasTalking', () => ({
  AfricasTalkingService: {
    sendSMS: jest.fn().mockResolvedValue({ 
      SMSMessageData: { 
        Recipients: [{ statusCode: 101, number: '+254700000000' }] 
      } 
    }),
    sendAirtime: jest.fn().mockResolvedValue({
      entries: [{ transactionId: 'mock-tx-123', status: 'Success' }]
    }),
    sendConservationAlert: jest.fn().mockResolvedValue({ success: true }),
    sendReportConfirmation: jest.fn().mockResolvedValue({ success: true }),
    sendRewardNotification: jest.fn().mockResolvedValue({ success: true }),
    buildUSSDMenu: jest.fn().mockReturnValue('CON Welcome to WildGuard 🌿\nWildlife Protection Platform\n\n1. Report Wildlife Sighting\n2. Report Poaching/Illegal Activity\n3. Report Injured Animal\n4. Check My Trust Score\n5. View Rewards Earned'),
  }
}))

// Mock database to avoid real DB calls during tests
jest.mock('../src/db', () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    // Mock successful operations
    then: jest.fn().mockResolvedValue([]),
  },
  users: {},
  reports: {},
  sensors: {},
  // ... other tables
}))

// Increase timeout for integration tests
jest.setTimeout(15000)

// Global test cleanup
let server: any

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()
})

afterEach(async () => {
  // Clean up any open handles
  if (server && server.close) {
    await new Promise<void>((resolve) => {
      server.close(() => resolve())
    })
  }
})

afterAll(async () => {
  // Force cleanup
  await new Promise(resolve => setTimeout(resolve, 100))
})

console.log('Test environment configured 🧪')