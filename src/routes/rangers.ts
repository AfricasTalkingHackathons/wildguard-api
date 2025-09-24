// src/routes/rangers.ts
import { Router, Request, Response } from 'express'
import ReportProcessingService from '../services/reportProcessing'
import { ThreatAnalysisService } from '../services/threatAnalysis'

const router = Router()

/**
 * @swagger
 * /rangers/dashboard:
 *   get:
 *     summary: Get Ranger Dashboard Overview
 *     description: Retrieve comprehensive dashboard data with recent reports, threat analysis, and statistics
 *     tags: [Rangers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalReports:
 *                       type: integer
 *                       example: 47
 *                     urgentReports:
 *                       type: integer
 *                       example: 8
 *                     pendingVerifications:
 *                       type: integer
 *                       example: 12
 *                     verifiedToday:
 *                       type: integer
 *                       example: 5
 *                 recentReports:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *                 threatSummary:
 *                   type: object
 *                   properties:
 *                     riskLevel:
 *                       type: string
 *                       enum: [low, medium, high, critical]
 *                       example: "medium"
 *                     threatAreas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           area:
 *                             type: string
 *                             example: "North Sector"
 *                           riskScore:
 *                             type: number
 *                             example: 0.65
 *                 pendingReports:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *                 lastUpdated:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T14:30:00Z"
 *       500:
 *         description: Failed to load dashboard
 */
// Get dashboard overview for rangers
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const today = new Date()
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get recent reports
    const recentReports = await ReportProcessingService.getReports({
      timeRange: { start: sevenDaysAgo, end: today },
      limit: 20,
    })

    // Get threat predictions
    const threatSummary = await ThreatAnalysisService.generateDailyThreatSummary()

    // Get pending verifications
    const pendingReports = await ReportProcessingService.getReports({
      status: 'pending',
      limit: 10,
    })

    // Calculate statistics
    const stats = {
      totalReports: recentReports.length,
      urgentReports: recentReports.filter((r: any) => r.priority === 'urgent').length,
      pendingVerifications: pendingReports.length,
      verifiedToday: recentReports.filter((r: any) => 
        r.verificationStatus === 'verified' && 
        new Date(r.verifiedAt).toDateString() === today.toDateString()
      ).length,
    }

    const dashboard = {
      stats,
      recentReports: recentReports.slice(0, 10),
      threatSummary,
      pendingReports,
      lastUpdated: new Date().toISOString(),
    }

    res.json(dashboard)
    
  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ error: 'Failed to load dashboard' })
  }
})

/**
 * @swagger
 * /rangers/reports:
 *   get:
 *     summary: Get Filtered Reports List
 *     description: Retrieve reports with filtering, pagination, and sorting options for ranger review
 *     tags: [Rangers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, verified, rejected]
 *         description: Filter by verification status
 *         example: pending
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [poaching, illegal_logging, wildlife_sighting, suspicious_activity, injury, fence_breach, fire]
 *         description: Filter by report type
 *         example: poaching
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Filter by conservation area
 *         example: "Maasai Mara"
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter reports from this date
 *         example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter reports until this date
 *         example: "2024-01-31"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           minimum: 1
 *           maximum: 100
 *         description: Number of reports per page
 *         example: 20
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination
 *         example: 1
 *     responses:
 *       200:
 *         description: Reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reports:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     total:
 *                       type: integer
 *                       example: 47
 *       500:
 *         description: Failed to get reports
 */
// Get all reports with filtering
router.get('/reports', async (req: Request, res: Response) => {
  try {
    const {
      status,
      type,
      area,
      startDate,
      endDate,
      limit = 50,
      page = 1,
    } = req.query

    const filters: any = { limit: parseInt(limit as string) }

    if (status) filters.status = status
    if (type) filters.type = type
    if (area) filters.area = area
    if (startDate && endDate) {
      filters.timeRange = {
        start: new Date(startDate as string),
        end: new Date(endDate as string),
      }
    }

    const reports = await ReportProcessingService.getReports(filters)

    res.json({
      reports,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: reports.length,
      },
    })
    
  } catch (error) {
    console.error('Reports retrieval error:', error)
    res.status(500).json({ error: 'Failed to get reports' })
  }
})

/**
 * @swagger
 * /rangers/reports/{reportId}/verify:
 *   post:
 *     summary: Verify or Reject Report
 *     description: Mark a report as verified or rejected with ranger notes
 *     tags: [Rangers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the report to verify
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isVerified
 *               - rangerId
 *             properties:
 *               isVerified:
 *                 type: boolean
 *                 example: true
 *                 description: Whether to verify (true) or reject (false) the report
 *               notes:
 *                 type: string
 *                 example: "Confirmed poaching activity - evidence found on-site"
 *                 description: Ranger's verification notes
 *               rangerId:
 *                 type: string
 *                 example: "ranger_john_kamau"
 *                 description: ID of the verifying ranger
 *     responses:
 *       200:
 *         description: Report verification completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Report verified successfully"
 *       400:
 *         description: Missing ranger ID
 *       500:
 *         description: Failed to verify report
 */
// Verify a report
router.post('/reports/:reportId/verify', async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params
    const { isVerified, notes, rangerId } = req.body

    if (!rangerId) {
      return res.status(400).json({ error: 'Ranger ID required' })
    }

    await ReportProcessingService.verifyReport(reportId, rangerId, isVerified, notes)

    return res.json({
      success: true,
      message: `Report ${isVerified ? 'verified' : 'rejected'} successfully`,
    })
    
  } catch (error) {
    console.error('Report verification error:', error)
    return res.status(500).json({ error: 'Failed to verify report' })
  }
})

/**
 * @swagger
 * /rangers/threats:
 *   get:
 *     summary: Get Threat Predictions for Location
 *     description: Retrieve current threat predictions and risk assessment for a specific location
 *     tags: [Rangers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude coordinate
 *         example: -1.2921
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude coordinate
 *         example: 36.8219
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 0.05
 *         description: Search radius in decimal degrees
 *         example: 0.1
 *     responses:
 *       200:
 *         description: Threat data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 threats:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ThreatPrediction'
 *                 location:
 *                   type: object
 *                   properties:
 *                     lat:
 *                       type: number
 *                       example: -1.2921
 *                     lng:
 *                       type: number
 *                       example: 36.8219
 *                 radius:
 *                   type: number
 *                   example: 0.05
 *       400:
 *         description: Missing latitude or longitude
 *       500:
 *         description: Failed to get threats
 */
// Get threat predictions for an area
router.get('/threats', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = 0.05 } = req.query

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude required' })
    }

    const threats = await ThreatAnalysisService.getCurrentThreats(
      parseFloat(lat as string),
      parseFloat(lng as string),
      parseFloat(radius as string)
    )

    return res.json({
      threats,
      location: { lat: parseFloat(lat as string), lng: parseFloat(lng as string) },
      radius: parseFloat(radius as string),
    })
    
  } catch (error) {
    console.error('Threat retrieval error:', error)
    return res.status(500).json({ error: 'Failed to get threats' })
  }
})

// Get threat analysis for specific location
router.post('/threats/analyze', async (req: Request, res: Response) => {
  try {
    const { lat, lng, reportType } = req.body

    if (!lat || !lng || !reportType) {
      return res.status(400).json({ 
        error: 'Latitude, longitude, and report type required' 
      })
    }

    const analysis = await ThreatAnalysisService.analyzeThreat(lat, lng, reportType)

    return res.json({
      analysis,
      message: 'Threat analysis completed',
    })
    
  } catch (error) {
    console.error('Threat analysis error:', error)
    return res.status(500).json({ error: 'Failed to analyze threat' })
  }
})

// Real-time alerts endpoint (for WebSocket or Server-Sent Events)
router.get('/alerts/stream', async (req: Request, res: Response) => {
  try {
    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date() })}\n\n`)

    // In production, you'd connect to a real-time system (Redis, WebSockets, etc.)
    // For demo, we'll send periodic updates
    const interval = setInterval(async () => {
      try {
        // Get recent urgent reports
        const urgentReports = await ReportProcessingService.getReports({
          status: 'pending',
          limit: 5,
        })

        const urgentAlerts = urgentReports.filter((r: any) => r.priority === 'urgent')

        if (urgentAlerts.length > 0) {
          res.write(`data: ${JSON.stringify({
            type: 'urgent_reports',
            data: urgentAlerts,
            timestamp: new Date(),
          })}\n\n`)
        }
      } catch (error) {
        console.error('Alert stream error:', error)
      }
    }, 30000) // Check every 30 seconds

    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(interval)
      res.end()
    })
    
  } catch (error) {
    console.error('Alert stream setup error:', error)
    res.status(500).json({ error: 'Failed to setup alert stream' })
  }
})

// Get patrol routes and assignments
router.get('/patrols', async (req: Request, res: Response) => {
  try {
    // This would be implemented with a proper patrol management system
    const patrols = [
      {
        id: '1',
        name: 'Morning Perimeter Check',
        status: 'active',
        leadRanger: 'John Kamau',
        area: 'North Sector',
        startTime: new Date(),
        waypoints: [
          { lat: -1.2921, lng: 36.8219 },
          { lat: -1.2925, lng: 36.8225 },
          { lat: -1.2930, lng: 36.8230 },
        ],
      },
    ]

    res.json(patrols)
    
  } catch (error) {
    console.error('Patrols retrieval error:', error)
    res.status(500).json({ error: 'Failed to get patrols' })
  }
})

// Analytics endpoint for conservation insights
router.get('/analytics', async (req: Request, res: Response) => {
  try {
    const { timeframe = '30d' } = req.query

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (timeframe) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      default:
        startDate.setDate(endDate.getDate() - 30)
    }

    const reports = await ReportProcessingService.getReports({
      timeRange: { start: startDate, end: endDate },
      limit: 1000,
    })

    // Generate analytics
    const analytics = {
      timeframe,
      summary: {
        totalReports: reports.length,
        verifiedReports: reports.filter((r: any) => r.verificationStatus === 'verified').length,
        poachingIncidents: reports.filter((r: any) => r.type === 'poaching').length,
        wildlifeSightings: reports.filter((r: any) => r.type === 'wildlife_sighting').length,
      },
      trends: {
        reportsByType: groupReportsByType(reports),
        reportsByDay: groupReportsByDay(reports),
        hotspots: identifyHotspots(reports),
      },
      insights: generateInsights(reports),
    }

    res.json(analytics)
    
  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ error: 'Failed to generate analytics' })
  }
})

// Helper functions for analytics
function groupReportsByType(reports: any[]) {
  const grouped: { [key: string]: number } = {}
  reports.forEach(report => {
    grouped[report.type] = (grouped[report.type] || 0) + 1
  })
  return grouped
}

function groupReportsByDay(reports: any[]) {
  const grouped: { [key: string]: number } = {}
  reports.forEach(report => {
    const day = new Date(report.reportedAt).toISOString().split('T')[0]
    grouped[day] = (grouped[day] || 0) + 1
  })
  return grouped
}

function identifyHotspots(reports: any[]) {
  // Simple clustering by rounding coordinates
  const clusters: { [key: string]: number } = {}
  
  reports.forEach(report => {
    if (report.latitude && report.longitude) {
      const lat = Math.round(parseFloat(report.latitude) * 100) / 100
      const lng = Math.round(parseFloat(report.longitude) * 100) / 100
      const key = `${lat},${lng}`
      clusters[key] = (clusters[key] || 0) + 1
    }
  })

  return Object.entries(clusters)
    .map(([coords, count]) => {
      const [lat, lng] = coords.split(',').map(Number)
      return { lat, lng, count }
    })
    .filter(cluster => cluster.count > 1)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Top 10 hotspots
}

function generateInsights(reports: any[]) {
  const insights = []
  
  const poachingReports = reports.filter(r => r.type === 'poaching')
  if (poachingReports.length > 5) {
    insights.push({
      type: 'alert',
      message: `High poaching activity detected: ${poachingReports.length} incidents`,
      recommendation: 'Increase ranger patrols in affected areas',
    })
  }

  const verificationRate = reports.length > 0 
    ? (reports.filter(r => r.verificationStatus === 'verified').length / reports.length * 100)
    : 0

  if (verificationRate < 70) {
    insights.push({
      type: 'warning',
      message: `Low verification rate: ${verificationRate.toFixed(1)}%`,
      recommendation: 'Review verification process and train more rangers',
    })
  }

  return insights
}

export default router