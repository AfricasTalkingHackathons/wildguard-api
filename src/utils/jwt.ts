// src/utils/jwt.ts
import jwt from 'jsonwebtoken'
import { env } from '../env'

export interface JWTPayload {
  userId: string
  phoneNumber: string
  role: 'community' | 'ranger' | 'admin' | 'ngo'
  trustScore?: number
}

export class JWTService {
  private static readonly EXPIRES_IN = '7d' // Token expires in 7 days
  
  /**
   * Generate a JWT token for a user
   */
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(
      {
        ...payload,
        iat: Math.floor(Date.now() / 1000), // Issued at time
      },
      env.JWT_SECRET,
      {
        expiresIn: this.EXPIRES_IN,
        issuer: 'wildguard-api',
        audience: 'wildguard-users',
      }
    )
  }

  /**
   * Verify and decode a JWT token
   */
  static verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET, {
        issuer: 'wildguard-api',
        audience: 'wildguard-users',
      }) as jwt.JwtPayload & JWTPayload

      return {
        userId: decoded.userId,
        phoneNumber: decoded.phoneNumber,
        role: decoded.role,
        trustScore: decoded.trustScore,
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired')
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token')
      }
      throw new Error('Token verification failed')
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    return authHeader.substring(7) // Remove 'Bearer ' prefix
  }

  /**
   * Generate a token for testing purposes
   */
  static generateTestToken(overrides?: Partial<JWTPayload>): string {
    const defaultPayload: JWTPayload = {
      userId: 'test-user-id',
      phoneNumber: '+254700000000',
      role: 'community',
      trustScore: 0.75,
    }

    return this.generateToken({ ...defaultPayload, ...overrides })
  }
}

// Express middleware for JWT authentication
export const authenticateJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization
  const token = JWTService.extractTokenFromHeader(authHeader)

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token is missing',
      code: 'MISSING_TOKEN',
    })
  }

  try {
    const payload = JWTService.verifyToken(token)
    req.user = payload // Attach user info to request
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : 'Token verification failed',
      code: 'INVALID_TOKEN',
    })
  }
}

// Role-based authorization middleware
export const authorizeRole = (...allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED',
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSIONS',
      })
    }

    next()
  }
}