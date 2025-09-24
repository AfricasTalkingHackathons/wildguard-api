// src/db/seed.ts
import { db } from './index'
import { users, conservationAreas, reports, sensors } from './schema'

async function seedDatabase() {
  console.log('🌱 Seeding database...')

  try {
    // Create a conservation area
    const [maasaiMara] = await db.insert(conservationAreas).values({
      name: 'Maasai Mara National Reserve',
      type: 'national_park',
      riskLevel: 'high',
      managingOrganization: 'Kenya Wildlife Service',
      boundaries: {
        type: 'Polygon',
        coordinates: [[
          [35.0, -1.5],
          [35.5, -1.5],
          [35.5, -1.0],
          [35.0, -1.0],
          [35.0, -1.5]
        ]]
      },
      contactInfo: {
        phone: '+254123456789',
        email: 'info@maasaimara.com'
      }
    }).returning()

    console.log('✅ Created conservation area:', maasaiMara.name)

    // Create test users
    const [communityUser] = await db.insert(users).values({
      phoneNumber: '+254712345678',
      name: 'John Maasai',
      role: 'community',
      location: 'Talek Village',
      trustScore: '0.85'
    }).returning()

    const [ranger] = await db.insert(users).values({
      phoneNumber: '+254722334455',
      name: 'Sarah Kiptoo',
      role: 'ranger',
      location: 'Mara Triangle',
      trustScore: '0.95'
    }).returning()

    console.log('✅ Created users:', communityUser.name, '&', ranger.name)

    // Create a test report
    const [testReport] = await db.insert(reports).values({
      reporterId: communityUser.id,
      type: 'wildlife_sighting',
      priority: 'medium',
      latitude: '-1.4061',
      longitude: '35.0117',
      description: 'Large herd of elephants near the river crossing. Estimated 30+ individuals including calves.',
      animalSpecies: 'African Elephant',
      estimatedCount: 35,
      conservationAreaId: maasaiMara.id,
      reportMethod: 'ussd',
      source: 'community'
    }).returning()

    console.log('✅ Created test report:', testReport.type)

    // Create test sensors
    const [cameraTrap] = await db.insert(sensors).values({
      deviceId: 'CT-MARA-001',
      name: 'Mara River Crossing Camera',
      type: 'camera_trap',
      latitude: '-1.4061',
      longitude: '35.0117',
      conservationAreaId: maasaiMara.id,
      status: 'active',
      batteryLevel: 85,
      configuration: {
        triggerSensitivity: 'medium',
        captureMode: 'photo_video',
        nightVision: true
      }
    }).returning()

    const [motionSensor] = await db.insert(sensors).values({
      deviceId: 'MS-MARA-002',
      name: 'Oloololo Gate Motion Detector',
      type: 'motion_sensor',
      latitude: '-1.3500',
      longitude: '35.0000',
      conservationAreaId: maasaiMara.id,
      status: 'active',
      batteryLevel: 72,
      configuration: {
        detectionRange: 50,
        sensitivity: 'high'
      }
    }).returning()

    console.log('✅ Created sensors:', cameraTrap.name, '&', motionSensor.name)

    console.log('\n🎉 Database seeded successfully!')
    console.log(`📊 Created:
    - 1 Conservation Area (${maasaiMara.name})
    - 2 Users (${communityUser.name} & ${ranger.name})
    - 1 Test Report (${testReport.type})
    - 2 Sensors (Camera Trap & Motion Sensor)`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Only run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error)
      process.exit(1)
    })
}

export { seedDatabase }