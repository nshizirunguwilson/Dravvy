import type { ZodTypeAny } from 'zod'

/** field path -> message, e.g. { position: 'Position is required' } */
export type FieldErrors = Record<string, string>

/**
 * Runs a Zod schema and returns the first message per field.
 *
 * These schemas already existed in `src/lib/validations/resume.ts` and were
 * tested but never used: the forms checked required fields by hand and threw a
 * single toast that named no field. This is what connects them to the UI.
 */
export function validate(schema: ZodTypeAny, value: unknown): FieldErrors {
  const result = schema.safeParse(value)
  if (result.success) return {}

  const errors: FieldErrors = {}
  for (const issue of result.error.issues) {
    // `description.1` collapses to `description` so the group shows one message.
    const path = issue.path.filter((part) => typeof part === 'string').join('.')
    const key = path || 'form'
    if (!errors[key]) errors[key] = issue.message
  }
  return errors
}

/** Validates every entry in a collection, keyed by entry id. */
export function validateAll<T extends { id: string }>(
  schema: ZodTypeAny,
  items: T[],
): Record<string, FieldErrors> {
  const out: Record<string, FieldErrors> = {}
  for (const item of items) {
    const errors = validate(schema, item)
    if (Object.keys(errors).length > 0) out[item.id] = errors
  }
  return out
}

export const countErrors = (all: Record<string, FieldErrors>) =>
  Object.values(all).reduce((total, errors) => total + Object.keys(errors).length, 0)
