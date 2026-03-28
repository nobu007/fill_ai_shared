import '@testing-library/jest-dom/matchers'

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<_T = any> {
    toBeInTheDocument(): void
    toHaveAttribute(attr: string, value?: string): void
    toHaveClass(...classes: string[]): void
    toBeDisabled(): void
    toBeRequired(): void
    toHaveValue(value?: string): void
  }
}
