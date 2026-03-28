import '@testing-library/jest-dom/matchers'

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  interface Assertion<T = any> {
    toBeInTheDocument(): R
    toHaveAttribute(attr: string, value?: string): R
    toHaveClass(...classes: string[]): R
    toBeDisabled(): R
    toBeRequired(): R
    toHaveValue(value?: string): R
  }
}
