/**
 * Lightweight in-memory API request metrics collector.
 *
 * Tracks request counts, response times, and error rates per endpoint.
 * Designed for serverless environments — metrics are per-instance and
 * reset on cold start. For production, export to Prometheus/Datadog.
 *
 * Usage:
 *   import { metrics, trackApiRequest } from '@shared/lib/api-metrics'
 *
 *   // In an API route handler:
 *   export async function GET(req: Request) {
 *     return trackApiRequest('proofread/v2', 'GET', async () => {
 *       // ... handler logic
 *       return new Response(JSON.stringify(data))
 *     })
 *   }
 *
 *   // Query current metrics:
 *   const snapshot = metrics.snapshot()
 */

type StatusCode = number

interface EndpointMetrics {
  /** Total requests received */
  requests: number
  /** Responses by status code class (2xx, 4xx, 5xx) */
  responses: Record<StatusCode, number>
  /** Cumulative response time in ms */
  totalDurationMs: number
  /** Slowest request duration in ms */
  maxDurationMs: number
  /** Last error message (if any) */
  lastError: string | null
  /** Timestamp of last error */
  lastErrorAt: string | null
}

interface ApiMetricsSnapshot {
  endpoints: Record<string, EndpointMetrics>
  uptime: string
  collectedAt: string
}

class ApiMetricsCollector {
  private endpoints: Record<string, EndpointMetrics> = {}
  private startTime: Date = new Date()

  // Expose getEndpoint for external helpers like trackPdfProcessing
  getEndpoint(key: string): EndpointMetrics {
    if (!this.endpoints[key]) {
      this.endpoints[key] = {
        requests: 0,
        responses: {},
        totalDurationMs: 0,
        maxDurationMs: 0,
        lastError: null,
        lastErrorAt: null,
      }
    }
    return this.endpoints[key]
  }

  record(endpoint: string, method: string, status: number, durationMs: number, error?: string): void {
    const key = `${method} ${endpoint}`
    const ep = this.getEndpoint(key)
    ep.requests++
    ep.responses[status] = (ep.responses[status] || 0) + 1
    ep.totalDurationMs += durationMs
    if (durationMs > ep.maxDurationMs) ep.maxDurationMs = durationMs

    if (status >= 400 && error) {
      ep.lastError = error
      ep.lastErrorAt = new Date().toISOString()
    }
  }

  snapshot(): ApiMetricsSnapshot {
    const endpoints: typeof this.endpoints = {}
    for (const [key, ep] of Object.entries(this.endpoints)) {
      endpoints[key] = {
        ...ep,
        responses: { ...ep.responses },
      }
    }
    return {
      endpoints,
      uptime: `${Math.round((Date.now() - this.startTime.getTime()) / 1000)}s`,
      collectedAt: new Date().toISOString(),
    }
  }

  /** Reset all metrics (useful for testing) */
  reset(): void {
    this.endpoints = {}
    this.startTime = new Date()
  }

  /** Get error rate for a specific endpoint */
  errorRate(endpoint: string, method: string): number {
    const key = `${method} ${endpoint}`
    const ep = this.endpoints[key]
    if (!ep || ep.requests === 0) return 0
    const errors = Object.entries(ep.responses)
      .filter(([status]) => Number(status) >= 400)
      .reduce((sum, [, count]) => sum + count, 0)
    return errors / ep.requests
  }

  /** Get average response time for a specific endpoint */
  avgResponseTime(endpoint: string, method: string): number {
    const key = `${method} ${endpoint}`
    const ep = this.endpoints[key]
    if (!ep || ep.requests === 0) return 0
    return ep.totalDurationMs / ep.requests
  }
}

/** Singleton metrics collector */
export const metrics = new ApiMetricsCollector()

/**
 * Wrap an API route handler to automatically collect metrics.
 *
 * @param endpoint - Logical endpoint name (e.g. 'proofread/v2')
 * @param method - HTTP method
 * @param handler - The actual handler function returning a Response
 * @returns Response with metrics recorded
 */
export async function trackApiRequest(
  endpoint: string,
  method: string,
  handler: () => Promise<Response>
): Promise<Response> {
  const start = performance.now()

  try {
    const response = await handler()
    const durationMs = performance.now() - start
    metrics.record(endpoint, method, response.status, durationMs)
    return response
  } catch (err) {
    const durationMs = performance.now() - start
    const errorMessage = err instanceof Error ? err.message : String(err)
    metrics.record(endpoint, method, 500, durationMs, errorMessage)
    throw err
  }
}

/**
 * Track PDF processing duration separately.
 * Useful for correlating slow requests with PDF size.
 */
export function trackPdfProcessing(endpoint: string, pageCount: number, durationMs: number): void {
  const key = `pdf:${endpoint}`
  const ep = metrics.getEndpoint(key)
  ep.requests++
  ep.totalDurationMs += durationMs
  if (durationMs > ep.maxDurationMs) ep.maxDurationMs = durationMs
  ep.responses[pageCount] = (ep.responses[pageCount] || 0) + 1
}

/**
 * Track LLM API call costs.
 * Approximate cost tracking per model.
 */
export function trackLlmCall(model: string, inputTokens: number, outputTokens: number, durationMs: number): void {
  const key = `llm:${model}`
  const ep = metrics.getEndpoint(key)
  ep.requests++
  ep.totalDurationMs += durationMs
  if (durationMs > ep.maxDurationMs) ep.maxDurationMs = durationMs
  // Store token counts as virtual status codes for aggregation
  ep.responses[inputTokens] = (ep.responses[inputTokens] || 0) + 1
}
