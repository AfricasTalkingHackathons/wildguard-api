// src/utils/validation.ts
import { z } from 'zod'

// Validation schemas for API requests
export const reportSchema = z.object({
  phoneNumber: z.string().min(10).max(15),
  type: z.enum(['poaching', 'illegal_logging', 'wildlife_sighting', 'suspicious_activity', 'injury', 'fence_breach', 'fire']),
  description: z.string().min(10).max(500),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  animalSpecies: z.string().optional(),
  estimatedCount: z.number().positive().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  isAnonymous: z.boolean().optional(),
})

export const verificationSchema = z.object({
  reportId: z.string().uuid(),
  isVerified: z.boolean(),
  notes: z.string().optional(),
  rangerId: z.string().uuid(),
})

export const emergencyAlertSchema = z.object({
  alertType: z.enum(['poaching', 'fire', 'injury', 'illegal_logging']),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  description: z.string().min(10).max(200),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  targetAudience: z.enum(['rangers', 'community', 'all']).optional(),
})

export const sensorDataSchema = z.object({
  sensorId: z.string().min(3),
  dataPoints: z.array(z.object({
    id: z.string().optional(),
    type: z.string(),
    value: z.any(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    threatLevel: z.enum(['none', 'low', 'medium', 'high', 'critical']),
    timestamp: z.string().datetime().optional(),
    description: z.string().optional(),
  })),
})

// Helper functions for validation
export function validateReport(data: any) {
  return reportSchema.safeParse(data)
}

export function validateVerification(data: any) {
  return verificationSchema.safeParse(data)
}

export function validateEmergencyAlert(data: any) {
  return emergencyAlertSchema.safeParse(data)
}

export function validateSensorData(data: any) {
  return sensorDataSchema.safeParse(data)
}

// Phone number formatting for Africa's Talking
export function formatPhoneNumber(phone: string, countryCode: string = '+254'): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Handle different formats
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`
  } else if (cleaned.startsWith('0')) {
    return `${countryCode}${cleaned.substring(1)}`
  } else if (cleaned.length === 9) {
    return `${countryCode}${cleaned}`
  }
  
  return phone // Return original if can't format
}

// Coordinate validation and formatting
export function validateCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

export function formatCoordinates(lat: number, lng: number): { lat: number; lng: number } {
  return {
    lat: Math.round(lat * 1000000) / 1000000, // 6 decimal places
    lng: Math.round(lng * 1000000) / 1000000,
  }
}

// Distance calculation using Haversine formula
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Text sanitization for SMS and reports
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/[^\w\s.,!?-]/g, '') // Remove special characters except basic punctuation
    .substring(0, 500) // Limit length
}

// Generate report summary for SMS notifications
export function generateReportSummary(report: any): string {
  const type = report.type.replace('_', ' ').toUpperCase()
  const location = report.latitude && report.longitude 
    ? `at ${report.latitude.substring(0, 7)}, ${report.longitude.substring(0, 7)}` 
    : 'location not specified'
  
  return `${type} reported ${location}. Priority: ${report.priority.toUpperCase()}`
}

export default {
  validateReport,
  validateVerification,
  validateEmergencyAlert,
  validateSensorData,
  formatPhoneNumber,
  validateCoordinates,
  formatCoordinates,
  calculateDistance,
  sanitizeText,
  generateReportSummary,
}