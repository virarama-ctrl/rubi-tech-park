/**
 * In-memory sliding-window rate limiter
 */

interface RateLimitRecord {
  timestamps: number[];
}

export class RateLimiter {
  private records: Map<string, RateLimitRecord> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 10 * 60 * 1000, maxRequests: number = 5) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Periodically clean up old entries every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000).unref();
  }

  public check(key: string): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let record = this.records.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.records.set(key, record);
    }

    // Filter out timestamps outside window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= this.maxRequests) {
      const oldest = record.timestamps[0];
      const retryAfterSeconds = Math.ceil((oldest + this.windowMs - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(1, retryAfterSeconds)
      };
    }

    // Allow and record
    record.timestamps.push(now);
    return {
      allowed: true,
      remaining: this.maxRequests - record.timestamps.length,
      retryAfterSeconds: 0
    };
  }

  public reset(key: string): void {
    this.records.delete(key);
  }

  private cleanup(): void {
    const windowStart = Date.now() - this.windowMs;
    for (const [key, record] of this.records.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
      if (record.timestamps.length === 0) {
        this.records.delete(key);
      }
    }
  }
}

// Global instances for public endpoints
export const enquiryRateLimiter = new RateLimiter(10 * 60 * 1000, 15); // 15 enquiries per 10 mins per IP
export const authRateLimiter = new RateLimiter(15 * 60 * 1000, 25); // 25 login attempts per 15 mins per IP
