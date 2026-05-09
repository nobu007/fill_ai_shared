import { describe, it, expect, beforeEach } from 'vitest'
import { metrics, trackApiRequest, trackPdfProcessing, trackLlmCall } from './api-metrics'

describe('ApiMetricsCollector', () => {
  beforeEach(() => {
    metrics.reset()
  })

  describe('basic recording', () => {
    it('records a successful request', () => {
      metrics.record('proofread/v2', 'POST', 200, 150)

      const snap = metrics.snapshot()
      const ep = snap.endpoints['POST proofread/v2']
      expect(ep).toBeDefined()
      expect(ep.requests).toBe(1)
      expect(ep.responses[200]).toBe(1)
      expect(ep.totalDurationMs).toBe(150)
      expect(ep.maxDurationMs).toBe(150)
      expect(ep.lastError).toBeNull()
    })

    it('records a failed request with error message', () => {
      metrics.record('proofread/v2', 'POST', 500, 300, 'LLM timeout')

      const snap = metrics.snapshot()
      const ep = snap.endpoints['POST proofread/v2']
      expect(ep.requests).toBe(1)
      expect(ep.responses[500]).toBe(1)
      expect(ep.lastError).toBe('LLM timeout')
      expect(ep.lastErrorAt).not.toBeNull()
    })

    it('aggregates multiple requests to same endpoint', () => {
      metrics.record('proofread/v2', 'POST', 200, 100)
      metrics.record('proofread/v2', 'POST', 200, 200)
      metrics.record('proofread/v2', 'POST', 500, 300, 'error')

      const ep = metrics.snapshot().endpoints['POST proofread/v2']
      expect(ep.requests).toBe(3)
      expect(ep.responses[200]).toBe(2)
      expect(ep.responses[500]).toBe(1)
      expect(ep.totalDurationMs).toBe(600)
      expect(ep.maxDurationMs).toBe(300)
    })

    it('tracks different methods separately', () => {
      metrics.record('proofread/v2', 'GET', 200, 50)
      metrics.record('proofread/v2', 'POST', 200, 100)

      const snap = metrics.snapshot()
      expect(snap.endpoints['GET proofread/v2']).toBeDefined()
      expect(snap.endpoints['POST proofread/v2']).toBeDefined()
      expect(snap.endpoints['GET proofread/v2'].requests).toBe(1)
      expect(snap.endpoints['POST proofread/v2'].requests).toBe(1)
    })

    it('tracks different endpoints separately', () => {
      metrics.record('proofread/v2', 'POST', 200, 100)
      metrics.record('wp/sync', 'POST', 200, 200)

      const snap = metrics.snapshot()
      expect(Object.keys(snap.endpoints)).toHaveLength(2)
      expect(snap.endpoints['POST proofread/v2'].requests).toBe(1)
      expect(snap.endpoints['POST wp/sync'].requests).toBe(1)
    })
  })

  describe('snapshot', () => {
    it('includes uptime and timestamp', () => {
      metrics.record('proofread/v2', 'GET', 200, 50)

      const snap = metrics.snapshot()
      expect(snap.uptime).toBeDefined()
      expect(snap.collectedAt).toBeDefined()
      expect(snap.endpoints).toBeDefined()
    })

    it('returns a copy of endpoints (not live object)', () => {
      metrics.record('proofread/v2', 'GET', 200, 50)

      const snap1 = metrics.snapshot()
      metrics.record('proofread/v2', 'GET', 200, 50)

      const snap2 = metrics.snapshot()
      // snap1 should not have the second request
      expect(snap1.endpoints['GET proofread/v2'].requests).toBe(1)
      expect(snap2.endpoints['GET proofread/v2'].requests).toBe(2)
    })
  })

  describe('errorRate', () => {
    it('returns 0 for endpoint with no requests', () => {
      expect(metrics.errorRate('nonexistent', 'GET')).toBe(0)
    })

    it('returns 0 for endpoint with only success', () => {
      metrics.record('proofread/v2', 'POST', 200, 100)
      metrics.record('proofread/v2', 'POST', 200, 100)
      expect(metrics.errorRate('proofread/v2', 'POST')).toBe(0)
    })

    it('returns correct error rate', () => {
      metrics.record('proofread/v2', 'POST', 200, 100)
      metrics.record('proofread/v2', 'POST', 500, 100, 'error')
      metrics.record('proofread/v2', 'POST', 200, 100)
      // 1 error out of 3 requests = 0.333...
      expect(metrics.errorRate('proofread/v2', 'POST')).toBeCloseTo(0.333, 2)
    })

    it('returns correct error rate for 4xx', () => {
      metrics.record('proofread/v2', 'POST', 200, 100)
      metrics.record('proofread/v2', 'POST', 400, 100, 'bad request')
      // 1 error out of 2 requests = 0.5
      expect(metrics.errorRate('proofread/v2', 'POST')).toBe(0.5)
    })
  })

  describe('avgResponseTime', () => {
    it('returns 0 for endpoint with no requests', () => {
      expect(metrics.avgResponseTime('nonexistent', 'GET')).toBe(0)
    })

    it('returns correct average', () => {
      metrics.record('proofread/v2', 'POST', 200, 100)
      metrics.record('proofread/v2', 'POST', 200, 200)
      metrics.record('proofread/v2', 'POST', 200, 300)
      // (100 + 200 + 300) / 3 = 200
      expect(metrics.avgResponseTime('proofread/v2', 'POST')).toBe(200)
    })
  })

  describe('trackApiRequest', () => {
    it('wraps handler and records success', async () => {
      const response = await trackApiRequest('proofread/v2', 'POST', async () => {
        return new Response(JSON.stringify({ ok: true }), { status: 200 })
      })

      expect(response.status).toBe(200)
      const snap = metrics.snapshot()
      expect(snap.endpoints['POST proofread/v2']).toBeDefined()
      expect(snap.endpoints['POST proofread/v2'].requests).toBe(1)
      expect(snap.endpoints['POST proofread/v2'].responses[200]).toBe(1)
    })

    it('wraps handler and records error on non-2xx', async () => {
      await trackApiRequest('proofread/v2', 'POST', async () => {
        return new Response(JSON.stringify({ error: 'bad' }), { status: 400 })
      })

      const snap = metrics.snapshot()
      expect(snap.endpoints['POST proofread/v2'].responses[400]).toBe(1)
    })

    it('wraps handler and records 500 on throw', async () => {
      await expect(
        trackApiRequest('proofread/v2', 'POST', async () => {
          throw new Error('test error')
        })
      ).rejects.toThrow('test error')

      const snap = metrics.snapshot()
      expect(snap.endpoints['POST proofread/v2'].responses[500]).toBe(1)
      expect(snap.endpoints['POST proofread/v2'].lastError).toBe('test error')
    })

    it('records response time', async () => {
      await trackApiRequest('proofread/v2', 'GET', async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return new Response('ok', { status: 200 })
      })

      const ep = metrics.snapshot().endpoints['GET proofread/v2']
      expect(ep.totalDurationMs).toBeGreaterThanOrEqual(10)
    })
  })

  describe('trackPdfProcessing', () => {
    it('records PDF processing metrics', () => {
      trackPdfProcessing('fill/extract', 5, 300)

      const snap = metrics.snapshot()
      const ep = snap.endpoints['pdf:fill/extract']
      expect(ep).toBeDefined()
      expect(ep.requests).toBe(1)
      expect(ep.totalDurationMs).toBe(300)
      expect(ep.maxDurationMs).toBe(300)
      expect(ep.responses[5]).toBe(1) // pageCount as "status"
    })

    it('aggregates multiple PDF processing calls', () => {
      trackPdfProcessing('fill/extract', 5, 300)
      trackPdfProcessing('fill/extract', 10, 600)

      const ep = metrics.snapshot().endpoints['pdf:fill/extract']
      expect(ep.requests).toBe(2)
      expect(ep.totalDurationMs).toBe(900)
      expect(ep.maxDurationMs).toBe(600)
      expect(ep.responses[5]).toBe(1)
      expect(ep.responses[10]).toBe(1)
    })
  })

  describe('trackLlmCall', () => {
    it('records LLM call metrics', () => {
      trackLlmCall('glm-4', 1000, 500, 200)

      const snap = metrics.snapshot()
      const ep = snap.endpoints['llm:glm-4']
      expect(ep).toBeDefined()
      expect(ep.requests).toBe(1)
      expect(ep.totalDurationMs).toBe(200)
      expect(ep.responses[1000]).toBe(1) // inputTokens as "status"
    })

    it('aggregates multiple LLM calls', () => {
      trackLlmCall('glm-4', 1000, 500, 200)
      trackLlmCall('glm-4', 2000, 1000, 400)

      const ep = metrics.snapshot().endpoints['llm:glm-4']
      expect(ep.requests).toBe(2)
      expect(ep.totalDurationMs).toBe(600)
      expect(ep.maxDurationMs).toBe(400)
    })
  })
})
