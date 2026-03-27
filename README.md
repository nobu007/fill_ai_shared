# fill_ai_shared

Shared library extracted from `fill_ai`.

## Purpose

- Keep cross-app code in a dedicated repository
- Consume it from app repositories via `git submodule`
- Preserve the existing `@/shared/*` import surface through app-level aliasing

## Layout

- `src/auth`
- `src/config.ts`
- `src/lib`
- `src/llm`
- `src/types`
- `src/ui`

## Notes

- This repository currently ships raw TypeScript/TSX source.
- The parent app resolves `@/shared/*` to this repository's `src/*`.
- Runtime dependencies are provided by the parent app for now.
