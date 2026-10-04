// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { transformSync } from 'esbuild'
import { ENV_VAR_NAMES } from './env'

const source = readFileSync(new URL('./env.ts', import.meta.url), 'utf8')
const publicValues = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://browser-fixture.example',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'public-fixture-anon',
  NEXT_PUBLIC_APP_NAME: 'Fixture application',
  NEXT_PUBLIC_APP_DESCRIPTION: 'Fixture description',
  NEXT_PUBLIC_APP_ICON: 'fixture-icon',
  NEXT_PUBLIC_APP_URL: 'https://application-fixture.example',
  NEXT_PUBLIC_VERCEL_URL: 'fixture.vercel.app',
}

function compiledClient(values: Record<string, string>) {
  const code = transformSync(source, { loader: 'ts', format: 'cjs', define: Object.fromEntries(
    Object.entries(values).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)]),
  ) }).code
  const module = { exports: {} as Record<string, (...args: unknown[]) => unknown> }
  const environment: Record<string, string> = {}
  runInNewContext(code, { module, exports: module.exports, process: { env: environment } })
  return { api: module.exports, environment }
}

describe('browser environment inlining', () => {
  it('retains all supported public values after literal substitution with an empty browser environment', () => {
    expect(Object.keys(publicValues).sort()).toEqual(
      ENV_VAR_NAMES.filter(key => key.startsWith('NEXT_PUBLIC_')).sort(),
    )
    const { api, environment } = compiledClient(publicValues)
    for (const [key, value] of Object.entries(publicValues)) {
      expect(api.getEnv(key)).toBe(value)
      expect(api.getEnvWithDefault(key, 'fallback')).toBe(value)
      expect(api.requireEnv(key)).toBe(value)
    }
    expect(api.getEnv('ENCRYPTION_KEY')).toBe('')
    environment.ENCRYPTION_KEY = 'server-runtime-fixture-key'
    expect(api.getEnv('ENCRYPTION_KEY')).toBe('server-runtime-fixture-key')
    environment.NEXT_PUBLIC_APP_NAME = 'changed after build'
    expect(api.getEnv('NEXT_PUBLIC_APP_NAME')).toBe(publicValues.NEXT_PUBLIC_APP_NAME)
  })

  it('preserves missing and explicitly empty values across getter defaults', () => {
    const { api } = compiledClient({ NEXT_PUBLIC_APP_NAME: '' })
    expect(api.getEnv('NEXT_PUBLIC_APP_NAME')).toBe('')
    expect(api.getEnvWithDefault('NEXT_PUBLIC_APP_NAME', 'fallback')).toBe('')
    expect(api.getEnvWithDefault('NEXT_PUBLIC_APP_URL', 'fallback')).toBe('fallback')
    expect(api.getEnvNumber('NEXT_PUBLIC_APP_NAME', 10)).toBe(10)
    expect(api.getEnvBool('NEXT_PUBLIC_APP_NAME', true)).toBe(true)
  })
})
