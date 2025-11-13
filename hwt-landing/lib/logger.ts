/**
 * Professional Logging System
 * 
 * Usage:
 * - logger.info('Message', { data })
 * - logger.error('Error', error)
 * - logger.debug('Debug info')
 * 
 * In production, only errors and warnings are logged.
 * In development, all levels are logged.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogData {
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isTest = process.env.NODE_ENV === 'test'

  /**
   * Mask sensitive data in logs
   */
  private maskSensitiveData(data: any): any {
    if (typeof data === 'string') {
      // Mask API keys (show first 4 and last 4 chars)
      if (data.startsWith('sk_') || data.startsWith('pk_')) {
        return `${data.slice(0, 7)}...${data.slice(-4)}`
      }
      // Mask private keys
      if (data.startsWith('0x') && data.length > 20) {
        return `${data.slice(0, 6)}...${data.slice(-4)}`
      }
      return data
    }

    if (typeof data === 'object' && data !== null) {
      const masked: any = Array.isArray(data) ? [] : {}
      for (const key in data) {
        // Skip sensitive keys
        if (
          key.toLowerCase().includes('password') ||
          key.toLowerCase().includes('secret') ||
          key.toLowerCase().includes('private') ||
          key.toLowerCase().includes('key')
        ) {
          masked[key] = '***REDACTED***'
        } else {
          masked[key] = this.maskSensitiveData(data[key])
        }
      }
      return masked
    }

    return data
  }

  /**
   * Format log message
   */
  private formatMessage(level: LogLevel, message: string, data?: LogData): string {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`
    
    if (data) {
      const maskedData = this.maskSensitiveData(data)
      return `${prefix} ${message} ${JSON.stringify(maskedData, null, 2)}`
    }
    
    return `${prefix} ${message}`
  }

  /**
   * Check if should log based on environment and level
   */
  private shouldLog(level: LogLevel): boolean {
    if (this.isTest) return false
    if (this.isDevelopment) return true
    
    // In production, only log warnings and errors
    return level === 'warn' || level === 'error'
  }

  /**
   * Debug level - only in development
   */
  debug(message: string, data?: LogData): void {
    if (!this.shouldLog('debug')) return
    console.log(this.formatMessage('debug', message, data))
  }

  /**
   * Info level - only in development
   */
  info(message: string, data?: LogData): void {
    if (!this.shouldLog('info')) return
    console.info(this.formatMessage('info', message, data))
  }

  /**
   * Warning level - always logged
   */
  warn(message: string, data?: LogData): void {
    if (!this.shouldLog('warn')) return
    console.warn(this.formatMessage('warn', message, data))
  }

  /**
   * Error level - always logged
   */
  error(message: string, error?: Error | any, data?: LogData): void {
    if (!this.shouldLog('error')) return
    
    const errorData = {
      ...data,
      error: error instanceof Error ? {
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
        name: error.name
      } : error
    }
    
    console.error(this.formatMessage('error', message, errorData))
  }

  /**
   * Log API request
   */
  apiRequest(method: string, url: string, data?: LogData): void {
    this.info(`API Request: ${method} ${url}`, data)
  }

  /**
   * Log API response
   */
  apiResponse(method: string, url: string, status: number, data?: LogData): void {
    if (status >= 400) {
      this.error(`API Error: ${method} ${url} - Status ${status}`, undefined, data)
    } else {
      this.info(`API Response: ${method} ${url} - Status ${status}`, data)
    }
  }

  /**
   * Log blockchain transaction
   */
  transaction(action: string, data?: LogData): void {
    this.info(`Blockchain Transaction: ${action}`, data)
  }

  /**
   * Log wallet connection
   */
  wallet(action: string, address?: string): void {
    const maskedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A'
    this.info(`Wallet ${action}`, { address: maskedAddress })
  }
}

// Export singleton instance
export const logger = new Logger()

// Export for testing
export { Logger }
