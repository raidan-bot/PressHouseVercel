// Security Middleware for PressHouse
// Phase 2: Security & Hardening Implementation

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// --- Rate Limiting Configurations ---
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(15 * 60)
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // stricter limit for auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // don't count successful logins
  message: {
    error: 'Too many authentication attempts, please try again after 15 minutes.'
  }
});

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // limit uploads
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many upload attempts, please try again later.'
  }
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit contact form submissions
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many contact form submissions, please try again later.'
  }
});

// --- Helmet Configuration ---
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // needed for some media
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// --- Auth Middleware Wrapper ---
export function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
  }
  
  next();
}
