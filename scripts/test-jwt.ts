// scripts/test-jwt.ts
import { JWTService } from '../src/utils/jwt'

// Test JWT generation and verification
console.log('🔐 Testing JWT Security...\n')

// Generate test tokens for different user roles
const communityToken = JWTService.generateTestToken({
  userId: 'user-123',
  phoneNumber: '+254712345678',
  role: 'community',
  trustScore: 0.85
})

const rangerToken = JWTService.generateTestToken({
  userId: 'ranger-456',
  phoneNumber: '+254722334455',
  role: 'ranger',
  trustScore: 0.95
})

const adminToken = JWTService.generateTestToken({
  userId: 'admin-789',
  phoneNumber: '+254733445566',
  role: 'admin',
  trustScore: 1.0
})

console.log('Generated Tokens:')
console.log('================')
console.log(`Community Token: ${communityToken.substring(0, 50)}...`)
console.log(`Ranger Token: ${rangerToken.substring(0, 50)}...`)
console.log(`Admin Token: ${adminToken.substring(0, 50)}...\n`)

// Test token verification
console.log('Token Verification:')
console.log('==================')

try {
  const communityUser = JWTService.verifyToken(communityToken)
  console.log('✅ Community Token Valid:', {
    userId: communityUser.userId,
    role: communityUser.role,
    phoneNumber: communityUser.phoneNumber,
    trustScore: communityUser.trustScore
  })

  const rangerUser = JWTService.verifyToken(rangerToken)
  console.log('✅ Ranger Token Valid:', {
    userId: rangerUser.userId,
    role: rangerUser.role,
    phoneNumber: rangerUser.phoneNumber,
    trustScore: rangerUser.trustScore
  })

  const adminUser = JWTService.verifyToken(adminToken)
  console.log('✅ Admin Token Valid:', {
    userId: adminUser.userId,
    role: adminUser.role,
    phoneNumber: adminUser.phoneNumber,
    trustScore: adminUser.trustScore
  })

} catch (error) {
  console.error('❌ Token verification failed:', error)
}

// Test invalid token
console.log('\nInvalid Token Test:')
console.log('==================')
try {
  JWTService.verifyToken('invalid-token')
  console.log('❌ Should have failed!')
} catch (error) {
  console.log('✅ Invalid token rejected:', (error as Error).message)
}

// Test header extraction
console.log('\nHeader Extraction Test:')
console.log('======================')
const validHeader = `Bearer ${communityToken}`
const invalidHeader = 'Basic invalid'
const noHeader = undefined

console.log('✅ Valid Bearer token extracted:', JWTService.extractTokenFromHeader(validHeader) ? 'Success' : 'Failed')
console.log('✅ Invalid header rejected:', JWTService.extractTokenFromHeader(invalidHeader) === null ? 'Success' : 'Failed')
console.log('✅ Missing header handled:', JWTService.extractTokenFromHeader(noHeader) === null ? 'Success' : 'Failed')

console.log('\n🎉 JWT Security Tests Completed!')
console.log('\nUsage Examples:')
console.log('===============')
console.log('# For community users:')
console.log(`Authorization: Bearer ${communityToken}`)
console.log('\n# For rangers:')
console.log(`Authorization: Bearer ${rangerToken}`)
console.log('\n# For admins:')
console.log(`Authorization: Bearer ${adminToken}`)