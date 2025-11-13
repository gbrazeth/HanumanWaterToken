/**
 * Input Validation Utilities
 * 
 * Provides robust validation for user inputs to prevent
 * security vulnerabilities and ensure data integrity.
 */

/**
 * Email validation with comprehensive regex
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false
  
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  // Additional checks
  if (email.length > 254) return false // Max email length
  if (email.split('@').length !== 2) return false
  
  const [localPart, domain] = email.split('@')
  if (localPart.length > 64) return false // Max local part length
  if (domain.length > 253) return false // Max domain length
  
  return emailRegex.test(email)
}

/**
 * Ethereum address validation
 */
export function isValidEthereumAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false
  
  // Check if it's a valid hex string with 0x prefix
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/
  return ethereumAddressRegex.test(address)
}

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Validate token amount
 */
export function isValidTokenAmount(amount: string | number): boolean {
  if (!amount) return false
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  // Check if it's a valid number
  if (isNaN(numAmount)) return false
  if (!isFinite(numAmount)) return false
  
  // Check if it's positive
  if (numAmount <= 0) return false
  
  // Check reasonable limits (max 1 billion tokens)
  if (numAmount > 1_000_000_000) return false
  
  return true
}

/**
 * Validate USD amount
 */
export function isValidUSDAmount(amount: string | number): boolean {
  if (!amount) return false
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  // Check if it's a valid number
  if (isNaN(numAmount)) return false
  if (!isFinite(numAmount)) return false
  
  // Check if it's positive
  if (numAmount <= 0) return false
  
  // Check reasonable limits (max $10 million)
  if (numAmount > 10_000_000) return false
  
  return true
}

/**
 * Validate verification code (6 digits)
 */
export function isValidVerificationCode(code: string): boolean {
  if (!code || typeof code !== 'string') return false
  
  const codeRegex = /^\d{6}$/
  return codeRegex.test(code)
}

/**
 * Validate transaction hash
 */
export function isValidTransactionHash(hash: string): boolean {
  if (!hash || typeof hash !== 'string') return false
  
  // Ethereum transaction hash is 66 characters (0x + 64 hex chars)
  const txHashRegex = /^0x[a-fA-F0-9]{64}$/
  return txHashRegex.test(hash)
}

/**
 * Validate URL
 */
export function isValidURL(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  
  try {
    const urlObj = new URL(url)
    // Only allow http and https protocols
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validate phone number (international format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false
  
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  
  // Check if it starts with + and has 10-15 digits
  const phoneRegex = /^\+\d{10,15}$/
  return phoneRegex.test(cleaned)
}

/**
 * Validate date (ISO 8601 format)
 */
export function isValidDate(date: string): boolean {
  if (!date || typeof date !== 'string') return false
  
  const timestamp = Date.parse(date)
  return !isNaN(timestamp)
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['Password is required'] }
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate JSON string
 */
export function isValidJSON(str: string): boolean {
  if (!str || typeof str !== 'string') return false
  
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

/**
 * Validate hex color
 */
export function isValidHexColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false
  
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexColorRegex.test(color)
}

/**
 * Validate file size (in bytes)
 */
export function isValidFileSize(size: number, maxSizeMB: number = 5): boolean {
  if (typeof size !== 'number' || size < 0) return false
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return size <= maxSizeBytes
}

/**
 * Validate file type
 */
export function isValidFileType(
  filename: string,
  allowedTypes: string[]
): boolean {
  if (!filename || typeof filename !== 'string') return false
  
  const extension = filename.split('.').pop()?.toLowerCase()
  if (!extension) return false
  
  return allowedTypes.includes(extension)
}

/**
 * Rate limiting check (simple in-memory implementation)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)
  
  // Clean up old records
  if (record && now > record.resetTime) {
    rateLimitStore.delete(identifier)
  }
  
  const current = rateLimitStore.get(identifier)
  
  if (!current) {
    // First request
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs
    }
  }
  
  if (current.count >= maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime
    }
  }
  
  // Increment count
  current.count++
  rateLimitStore.set(identifier, current)
  
  return {
    allowed: true,
    remaining: maxRequests - current.count,
    resetTime: current.resetTime
  }
}

/**
 * Validate and sanitize object keys
 */
export function sanitizeObjectKeys<T extends Record<string, any>>(
  obj: T,
  allowedKeys: string[]
): Partial<T> {
  const sanitized: Partial<T> = {}
  
  for (const key of allowedKeys) {
    if (key in obj) {
      sanitized[key as keyof T] = obj[key]
    }
  }
  
  return sanitized
}
