// src/db/schema.ts
import { pgTable, serial, text, timestamp, decimal, integer, boolean, jsonb, uuid, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table - community members, rangers, admins
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phoneNumber: text('phone_number').unique().notNull(),
  name: text('name'),
  role: text('role', { enum: ['community', 'ranger', 'admin', 'ngo'] }).notNull().default('community'),
  location: text('location'), // General area/village
  trustScore: decimal('trust_score', { precision: 3, scale: 2 }).default('0.50'), // 0.00 to 1.00
  totalReports: integer('total_reports').default(0),
  verifiedReports: integer('verified_reports').default(0),
  airtimeEarned: decimal('airtime_earned', { precision: 10, scale: 2 }).default('0.00'),
  isActive: boolean('is_active').default(true),
  registeredAt: timestamp('registered_at').defaultNow(),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
})

// Conservation areas and protected zones
export const conservationAreas = pgTable('conservation_areas', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: text('type', { enum: ['national_park', 'reserve', 'conservancy', 'community_land'] }).notNull(),
  boundaries: jsonb('boundaries'), // GeoJSON polygon
  riskLevel: text('risk_level', { enum: ['low', 'medium', 'high', 'critical'] }).default('medium'),
  managingOrganization: text('managing_organization'),
  contactInfo: jsonb('contact_info'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  nameIdx: index('area_name_idx').on(table.name),
}))

// Wildlife and conservation reports from community
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  reporterId: uuid('reporter_id').references(() => users.id),
  type: text('type', { 
    enum: ['poaching', 'illegal_logging', 'wildlife_sighting', 'suspicious_activity', 'injury', 'fence_breach', 'fire'] 
  }).notNull(),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  description: text('description'),
  animalSpecies: text('animal_species'),
  estimatedCount: integer('estimated_count'),
  mediaUrls: jsonb('media_urls'), // Array of image/audio URLs
  verificationStatus: text('verification_status', { 
    enum: ['pending', 'verified', 'rejected', 'investigating'] 
  }).default('pending'),
  verifiedBy: uuid('verified_by').references(() => users.id),
  verificationNotes: text('verification_notes'),
  conservationAreaId: uuid('conservation_area_id').references(() => conservationAreas.id),
  reportMethod: text('report_method', { enum: ['sms', 'ussd', 'voice', 'app'] }).notNull(),
  source: text('source').default('community'), // community, sensor, satellite
  isAnonymous: boolean('is_anonymous').default(false),
  reportedAt: timestamp('reported_at').defaultNow(),
  verifiedAt: timestamp('verified_at'),
  resolvedAt: timestamp('resolved_at'),
}, (table) => ({
  locationIdx: index('report_location_idx').on(table.latitude, table.longitude),
  typeIdx: index('report_type_idx').on(table.type),
  statusIdx: index('report_status_idx').on(table.verificationStatus),
  timeIdx: index('report_time_idx').on(table.reportedAt),
}))

// IoT sensors and monitoring devices
export const sensors = pgTable('sensors', {
  id: uuid('id').primaryKey().defaultRandom(),
  deviceId: text('device_id').unique().notNull(),
  name: text('name').notNull(),
  type: text('type', { enum: ['camera_trap', 'motion_sensor', 'acoustic_sensor', 'gps_collar', 'weather_station'] }).notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  conservationAreaId: uuid('conservation_area_id').references(() => conservationAreas.id),
  status: text('status', { enum: ['active', 'inactive', 'maintenance', 'battery_low'] }).default('active'),
  batteryLevel: integer('battery_level'), // 0-100
  lastDataReceived: timestamp('last_data_received'),
  configuration: jsonb('configuration'), // Sensor-specific settings
  installationDate: timestamp('installation_date').defaultNow(),
}, (table) => ({
  deviceIdx: index('sensor_device_idx').on(table.deviceId),
  locationIdx: index('sensor_location_idx').on(table.latitude, table.longitude),
  statusIdx: index('sensor_status_idx').on(table.status),
}))

// Sensor data readings
export const sensorData = pgTable('sensor_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  sensorId: uuid('sensor_id').references(() => sensors.id),
  dataType: text('data_type', { enum: ['image', 'audio', 'movement', 'temperature', 'humidity', 'gps'] }).notNull(),
  value: jsonb('value'), // Flexible data structure
  metadata: jsonb('metadata'), // Additional context
  detectionConfidence: decimal('detection_confidence', { precision: 3, scale: 2 }), // AI confidence 0-1
  speciesDetected: text('species_detected'),
  threatLevel: text('threat_level', { enum: ['none', 'low', 'medium', 'high'] }).default('none'),
  processingStatus: text('processing_status', { enum: ['raw', 'processing', 'analyzed', 'flagged'] }).default('raw'),
  recordedAt: timestamp('recorded_at').notNull(),
  processedAt: timestamp('processed_at'),
}, (table) => ({
  sensorIdx: index('sensor_data_sensor_idx').on(table.sensorId),
  timeIdx: index('sensor_data_time_idx').on(table.recordedAt),
  threatIdx: index('sensor_data_threat_idx').on(table.threatLevel),
}))

// Ranger patrols and operations
export const patrols = pgTable('patrols', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadRangerId: uuid('lead_ranger_id').references(() => users.id),
  name: text('name'),
  type: text('type', { enum: ['routine', 'investigation', 'emergency', 'community_engagement'] }).notNull(),
  status: text('status', { enum: ['planned', 'active', 'completed', 'cancelled'] }).default('planned'),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'urgent'] }).default('medium'),
  route: jsonb('route'), // Array of lat/lng waypoints
  conservationAreaId: uuid('conservation_area_id').references(() => conservationAreas.id),
  relatedReportIds: jsonb('related_report_ids'), // Array of report UUIDs
  startTime: timestamp('start_time'),
  endTime: timestamp('end_time'),
  actualRoute: jsonb('actual_route'), // GPS tracked route
  findings: text('findings'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  rangerIdx: index('patrol_ranger_idx').on(table.leadRangerId),
  statusIdx: index('patrol_status_idx').on(table.status),
  timeIdx: index('patrol_time_idx').on(table.startTime),
}))

// Threat predictions and risk assessments
export const threatPredictions = pgTable('threat_predictions', {
  id: uuid('id').primaryKey().defaultRandom(),
  predictionType: text('prediction_type', { enum: ['poaching_risk', 'fire_risk', 'animal_movement', 'human_activity'] }).notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  riskScore: decimal('risk_score', { precision: 3, scale: 2 }).notNull(), // 0-1
  confidence: decimal('confidence', { precision: 3, scale: 2 }).notNull(), // 0-1
  timeWindow: text('time_window'), // e.g., "next_24h", "next_week"
  factors: jsonb('factors'), // Contributing factors
  conservationAreaId: uuid('conservation_area_id').references(() => conservationAreas.id),
  recommendedActions: jsonb('recommended_actions'),
  validFrom: timestamp('valid_from').notNull(),
  validTo: timestamp('valid_to').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  locationIdx: index('prediction_location_idx').on(table.latitude, table.longitude),
  riskIdx: index('prediction_risk_idx').on(table.riskScore),
  timeIdx: index('prediction_time_idx').on(table.validFrom, table.validTo),
}))

// Airtime rewards and incentives
export const rewards = pgTable('rewards', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  reportId: uuid('report_id').references(() => reports.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('KES'), // Kenya Shillings by default
  transactionId: text('transaction_id'), // Africa's Talking transaction ID
  status: text('status', { enum: ['pending', 'sent', 'failed'] }).default('pending'),
  reason: text('reason', { enum: ['verified_report', 'first_reporter', 'quality_bonus', 'community_champion'] }).notNull(),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('reward_user_idx').on(table.userId),
  statusIdx: index('reward_status_idx').on(table.status),
}))

// Trust network - peer verification
export const trustNetwork = pgTable('trust_network', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportId: uuid('report_id').references(() => reports.id),
  verifierId: uuid('verifier_id').references(() => users.id),
  verification: text('verification', { enum: ['confirm', 'dispute', 'unsure'] }).notNull(),
  confidence: decimal('confidence', { precision: 3, scale: 2 }), // How confident in the verification
  notes: text('notes'),
  verifiedAt: timestamp('verified_at').defaultNow(),
}, (table) => ({
  reportIdx: index('trust_report_idx').on(table.reportId),
  verifierIdx: index('trust_verifier_idx').on(table.verifierId),
}))

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports, { relationName: 'reporter' }),
  verifiedReports: many(reports, { relationName: 'verifier' }),
  patrols: many(patrols),
  rewards: many(rewards),
  trustVerifications: many(trustNetwork),
}))

export const reportsRelations = relations(reports, ({ one, many }) => ({
  reporter: one(users, { 
    fields: [reports.reporterId], 
    references: [users.id],
    relationName: 'reporter'
  }),
  verifier: one(users, { 
    fields: [reports.verifiedBy], 
    references: [users.id],
    relationName: 'verifier'
  }),
  conservationArea: one(conservationAreas, {
    fields: [reports.conservationAreaId],
    references: [conservationAreas.id],
  }),
  trustVerifications: many(trustNetwork),
  rewards: many(rewards),
}))

export const sensorsRelations = relations(sensors, ({ one, many }) => ({
  conservationArea: one(conservationAreas, {
    fields: [sensors.conservationAreaId],
    references: [conservationAreas.id],
  }),
  data: many(sensorData),
}))

export const conservationAreasRelations = relations(conservationAreas, ({ many }) => ({
  reports: many(reports),
  sensors: many(sensors),
  patrols: many(patrols),
  threatPredictions: many(threatPredictions),
}))