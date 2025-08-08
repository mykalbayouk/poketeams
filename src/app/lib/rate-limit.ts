import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create rate limiter: X requests per 24 hours
export const teamGenerationLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(Number(process.env.TEAM_PER_DAY_LIMIT) || 5, "24h"), // 5 requests per 24 hours
  analytics: true, // Track usage statistics
});

// Helper function to get user identifier (IP address)
export function getUserIdentifier(request: Request): string {
  // Try to get real IP address from headers (for production)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  // In development, use a fallback
  return forwarded?.split(",")[0] || realIp || "127.0.0.1";
}
