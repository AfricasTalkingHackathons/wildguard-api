// src/db/seed.ts
import { db } from './index'
import { users, conservationAreas, reports, sensors, rewards, threatPredictions, sensorData as sensorDataTable } from './schema'

async function seedDatabase() {
  console.log('🌱 Seeding comprehensive WildGuard database...')

  try {
    // Clear existing data first
    console.log('🗑️  Clearing existing data...')
    await db.delete(rewards)
    await db.delete(threatPredictions)
    await db.delete(sensorDataTable)
    await db.delete(sensors)
    await db.delete(reports)
    await db.delete(users)
    await db.delete(conservationAreas)
    console.log('✅ Existing data cleared')

    // Create multiple conservation areas
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

    const [amboselii] = await db.insert(conservationAreas).values({
      name: 'Amboseli National Park',
      type: 'national_park', 
      riskLevel: 'medium',
      managingOrganization: 'Kenya Wildlife Service',
      boundaries: {
        type: 'Polygon',
        coordinates: [[
          [37.2, -2.7],
          [37.4, -2.7],
          [37.4, -2.5],
          [37.2, -2.5],
          [37.2, -2.7]
        ]]
      },
      contactInfo: {
        phone: '+254987654321',
        email: 'amboseli@kws.go.ke'
      }
    }).returning()

    const [laikipia] = await db.insert(conservationAreas).values({
      name: 'Laikipia Wildlife Conservancy',
      type: 'conservancy', // Changed from 'private_conservancy' to match schema
      riskLevel: 'high',
      managingOrganization: 'Laikipia Wildlife Forum',
      boundaries: {
        type: 'Polygon',
        coordinates: [[
          [36.8, 0.0],
          [37.2, 0.0],
          [37.2, 0.4],
          [36.8, 0.4],
          [36.8, 0.0]
        ]]
      },
      contactInfo: {
        phone: '+254712345678',
        email: 'info@laikipia.org'
      }
    }).returning()

    console.log('✅ Created conservation areas:', maasaiMara.name, amboselii.name, laikipia.name)

    // Create diverse community users
    const communityUsers = await db.insert(users).values([
      {
        phoneNumber: '+254712345678',
        name: 'John Maasai',
        role: 'community',
        location: 'Talek Village',
        trustScore: '0.85',  // Changed from 85.5 to 0.85
        totalReports: 23,
        verifiedReports: 19,
        airtimeEarned: '180.00'
      },
      {
        phoneNumber: '+254722334455', 
        name: 'Mary Kimani',
        role: 'community',
        location: 'Sekenani Gate',
        trustScore: '0.92',  // Changed from 92.0 to 0.92
        totalReports: 31,
        verifiedReports: 28,
        airtimeEarned: '245.00'
      },
      {
        phoneNumber: '+254733556677',
        name: 'David Sankale',
        role: 'community', 
        location: 'Oloololo Gate',
        trustScore: '0.78',  // Changed from 78.5 to 0.78
        totalReports: 15,
        verifiedReports: 12,
        airtimeEarned: '95.00'
      },
      {
        phoneNumber: '+254744778899',
        name: 'Grace Wanjiku',
        role: 'community',
        location: 'Amboseli Gateway',
        trustScore: '0.88',  // Changed from 88.0 to 0.88
        totalReports: 19,
        verifiedReports: 16,
        airtimeEarned: '135.00'
      }
    ]).returning()

    // Create ranger users
    const rangers = await db.insert(users).values([
      {
        phoneNumber: '+254755667788',
        name: 'Sarah Kiptoo',
        role: 'ranger',
        location: 'Mara Triangle Station',
        trustScore: '0.95',  // Changed from 95.0 to 0.95
        totalReports: 45,
        verifiedReports: 45,
        airtimeEarned: '0.00'
      },
      {
        phoneNumber: '+254766889900',
        name: 'James Mutua',
        role: 'ranger',
        location: 'Amboseli Headquarters',
        trustScore: '0.96',  // Changed from 96.5 to 0.96
        totalReports: 38,
        verifiedReports: 38,
        airtimeEarned: '0.00'
      },
      {
        phoneNumber: '+254777991122',
        name: 'Peter Lekishon',
        role: 'ranger',
        location: 'Laikipia Patrol Base',
        trustScore: '0.94',  // Changed from 94.0 to 0.94
        totalReports: 52,
        verifiedReports: 50,
        airtimeEarned: '0.00'
      }
    ]).returning()

    // Create admin users
    const [admin] = await db.insert(users).values({
      phoneNumber: '+254788112233',
      name: 'Dr. Jane Mwangi',
      role: 'admin',
      location: 'WildGuard Headquarters',
      trustScore: '1.00',  // Changed from 100.0 to 1.00 (maximum trust score)
      totalReports: 0,
      verifiedReports: 0,
      airtimeEarned: '0.00'
    }).returning()

    console.log('✅ Created users:', communityUsers.length, 'community,', rangers.length, 'rangers, 1 admin')

    // Create diverse wildlife reports
    const testReports = await db.insert(reports).values([
      {
        reporterId: communityUsers[0].id,
        type: 'wildlife_sighting',
        priority: 'medium',
        latitude: '-1.4061',
        longitude: '35.0117',
        description: 'Large elephant herd crossing Mara River. Estimated 35+ individuals including several calves. Peaceful behavior, drinking water.',
        animalSpecies: 'African Elephant',
        estimatedCount: 35,
        conservationAreaId: maasaiMara.id,
        reportMethod: 'ussd',
        verificationStatus: 'verified',
        verifiedBy: rangers[0].id,
        verificationNotes: 'Confirmed by drone patrol. Healthy herd, no threats detected.',
        verifiedAt: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        reporterId: communityUsers[1].id,
        type: 'poaching',
        priority: 'urgent',
        latitude: '-1.3899',
        longitude: '35.0532',
        description: 'Spotted 3 men with rifles near Oloololo area. Vehicle parked behind acacia trees. Armed and dangerous.',
        conservationAreaId: maasaiMara.id,
        reportMethod: 'sms',
        verificationStatus: 'verified',
        verifiedBy: rangers[0].id,
        verificationNotes: 'Rangers responded immediately. 3 poachers arrested with illegal weapons.',
        verifiedAt: new Date(Date.now() - 172800000) // 2 days ago
      },
      {
        reporterId: communityUsers[2].id,
        type: 'fire',
        priority: 'urgent', 
        latitude: '0.1234',
        longitude: '36.9876',
        description: 'Grassland fire spreading rapidly near Laikipia conservancy. Strong winds pushing flames toward wildlife corridor.',
        conservationAreaId: laikipia.id,
        reportMethod: 'voice',
        verificationStatus: 'verified',
        verifiedBy: rangers[2].id,
        verificationNotes: 'Fire suppression team deployed. Contained after 4 hours.',
        verifiedAt: new Date(Date.now() - 259200000) // 3 days ago
      },
      {
        reporterId: communityUsers[3].id,
        type: 'wildlife_sighting',
        priority: 'high',
        latitude: '-2.6500',
        longitude: '37.3500',
        description: 'Rare black rhino sighting! Single adult male near Amboseli swamps. Appeared healthy and calm.',
        animalSpecies: 'Black Rhinoceros',
        estimatedCount: 1,
        conservationAreaId: amboselii.id,
        reportMethod: 'app',
        verificationStatus: 'verified',
        verifiedBy: rangers[1].id,
        verificationNotes: 'Confirmed rare sighting. Additional security deployed to area.',
        verifiedAt: new Date(Date.now() - 345600000) // 4 days ago
      },
      {
        reporterId: communityUsers[0].id,
        type: 'illegal_logging',
        priority: 'high',
        latitude: '-1.4200',
        longitude: '35.1000',
        description: 'Heard chainsaws operating at night near Mara river. Found fresh tree stumps and truck tire tracks.',
        conservationAreaId: maasaiMara.id,
        reportMethod: 'sms',
        verificationStatus: 'pending'
      },
      {
        reporterId: communityUsers[1].id,
        type: 'injury',
        priority: 'high',
        latitude: '-1.3950',
        longitude: '35.0600',
        description: 'Young elephant calf limping severely. Appears to have injured left front leg. Mother staying close.',
        animalSpecies: 'African Elephant',
        estimatedCount: 2,
        conservationAreaId: maasaiMara.id,
        reportMethod: 'ussd',
        verificationStatus: 'pending'
      }
    ]).returning()

    console.log('✅ Created', testReports.length, 'diverse wildlife reports')

    // Create comprehensive sensor network
    const sensorData = await db.insert(sensors).values([
      {
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
          nightVision: true,
          storageCapacity: '128GB'
        }
      },
      {
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
          sensitivity: 'high',
          alertThreshold: 3
        }
      },
      {
        deviceId: 'AS-AMB-003',
        name: 'Amboseli Acoustic Monitor',
        type: 'acoustic_sensor',
        latitude: '-2.6500',
        longitude: '37.3500',
        conservationAreaId: amboselii.id,
        status: 'active',
        batteryLevel: 91,
        configuration: {
          frequencyRange: '20Hz-20kHz',
          recordingMode: 'continuous',
          bufferSize: '24hours'
        }
      },
      {
        deviceId: 'WS-LAIK-004',
        name: 'Laikipia Weather Station',
        type: 'weather_station',
        latitude: '0.1000',
        longitude: '37.0000', 
        conservationAreaId: laikipia.id,
        status: 'active',
        batteryLevel: 88,
        configuration: {
          measurementInterval: '15min',
          parameters: ['temperature', 'humidity', 'wind', 'rainfall'],
          alertThresholds: { windSpeed: 50, rainfall: 25 }
        }
      },
      {
        deviceId: 'CT-MARA-005',
        name: 'Sekenani Camera Trap',
        type: 'camera_trap',
        latitude: '-1.4500',
        longitude: '35.2000',
        conservationAreaId: maasaiMara.id,
        status: 'battery_low',
        batteryLevel: 15,
        configuration: {
          triggerSensitivity: 'high',
          captureMode: 'photo',
          nightVision: true
        }
      },
      {
        deviceId: 'WS-LAIK-006',
        name: 'Laikipia Weather Monitor',
        type: 'weather_station',
        latitude: '0.1500',
        longitude: '37.1000',
        conservationAreaId: laikipia.id,
        status: 'active',
        batteryLevel: 100,
        configuration: {
          measurementInterval: '15min',
          parameters: ['temperature', 'humidity', 'wind', 'rainfall'],
          alertThresholds: { windSpeed: 50, rainfall: 25 }
        }
      }
    ]).returning()

    console.log('✅ Created', sensorData.length, 'IoT sensors across all areas')

    // Create reward records for verified reports
    const rewardRecords = await db.insert(rewards).values([
      {
        userId: communityUsers[0].id,
        reportId: testReports[0].id,
        amount: '2.00',
        reason: 'verified_report',
        status: 'sent',
        sentAt: new Date(Date.now() - 86400000),
        transactionId: 'AT_TX_001_' + Date.now()
      },
      {
        userId: communityUsers[1].id,
        reportId: testReports[1].id,
        amount: '5.00',
        reason: 'verified_report',
        status: 'sent', 
        sentAt: new Date(Date.now() - 172800000),
        transactionId: 'AT_TX_002_' + Date.now()
      },
      {
        userId: communityUsers[2].id,
        reportId: testReports[2].id,
        amount: '5.00',
        reason: 'verified_report',
        status: 'sent',
        sentAt: new Date(Date.now() - 259200000),
        transactionId: 'AT_TX_003_' + Date.now()
      },
      {
        userId: communityUsers[3].id,
        reportId: testReports[3].id,
        amount: '3.00',
        reason: 'verified_report',
        status: 'sent',
        sentAt: new Date(Date.now() - 345600000),
        transactionId: 'AT_TX_004_' + Date.now()
      }
    ]).returning()

    console.log('✅ Created', rewardRecords.length, 'airtime reward records')

    // Create AI threat predictions
    const predictions = await db.insert(threatPredictions).values([
      {
        predictionType: 'poaching_risk',
        latitude: '35.0800',
        longitude: '-1.4200',
        riskScore: '0.85',
        confidence: '0.92',
        timeWindow: 'next_24h',
        factors: [
          'Increased vehicle activity at night',
          'Proximity to elephant migration route',
          'Historical poaching incidents in area',
          'Reduced ranger patrols during rainy season'
        ],
        conservationAreaId: maasaiMara.id,
        recommendedActions: [
          'Increase night patrols in sector 7',
          'Deploy additional camera traps',
          'Coordinate with community scouts',
          'Alert mobile response unit'
        ],
        validFrom: new Date(),
        validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        predictionType: 'human_activity',
        latitude: '37.0500',
        longitude: '0.2000',
        riskScore: '0.73',
        confidence: '0.88',
        timeWindow: 'next_week',
        factors: [
          'Drought conditions driving wildlife to water sources',
          'Increased livestock grazing near conservancy',
          'Recent crop damage reports',
          'Community complaints about property damage'
        ],
        conservationAreaId: laikipia.id,
        recommendedActions: [
          'Install wildlife-friendly barriers',
          'Coordinate with livestock owners',
          'Provide alternative water sources',
          'Community education programs'
        ],
        validFrom: new Date(),
        validTo: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
      },
      {
        predictionType: 'fire_risk',
        latitude: '37.3000',
        longitude: '-2.6800',
        riskScore: '0.67',
        confidence: '0.79',
        timeWindow: 'next_week',
        factors: [
          'High demand for construction materials',
          'Limited road access makes detection difficult',
          'Seasonal worker camps in nearby areas',
          'Reduced enforcement during wet season'
        ],
        conservationAreaId: amboselii.id,
        recommendedActions: [
          'Increase forest patrols',
          'Community awareness campaigns',
          'Coordinate with forestry department',
          'Install acoustic monitoring systems'
        ],
        validFrom: new Date(),
        validTo: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
      }
    ]).returning()

    console.log('✅ Created', predictions.length, 'AI threat predictions')

    console.log('\n🎉 Comprehensive WildGuard database seeded successfully!')
    console.log(`📊 Database Statistics:
    🌍 Conservation Areas: ${maasaiMara.name}, ${amboselii.name}, ${laikipia.name}
    👥 Community Users: ${communityUsers.length} active reporters
    🎖️  Rangers: ${rangers.length} field officers  
    👨‍💼 Admins: 1 system administrator
    📋 Reports: ${testReports.length} (4 verified, 2 pending)
    📡 IoT Sensors: ${sensorData.length} active devices
    💰 Rewards: ${rewardRecords.length} airtime payments (${rewardRecords.reduce((sum: number, r: any) => sum + parseFloat(r.amount), 0)} KES total)
    🤖 AI Predictions: ${predictions.length} active threat assessments
    
    🚀 Ready for Africa's Talking integration testing!`)

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