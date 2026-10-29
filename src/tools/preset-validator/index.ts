/**
 * Preset Validator — validates preset JSON files.
 *
 * Can be used as a library or CLI tool.
 */

import type { PresetSchema } from '../../preset/types'
import { validatePreset } from '../../preset/validation'
import type { ValidationResult } from '../../preset/validation'

/** Validation result with file info */
export interface PresetFileResult {
  file: string
  result: ValidationResult
  preset?: PresetSchema
}

/** Validate a preset JSON string */
export function validatePresetJSON(json: string): ValidationResult {
  try {
    const parsed = JSON.parse(json) as PresetSchema
    return validatePreset(parsed)
  } catch (err) {
    return {
      valid: false,
      errors: [{ field: 'json', message: `Invalid JSON: ${(err as Error).message}`, severity: 'error' }],
      warnings: [],
    }
  }
}

/** Validate a preset object */
export function validatePresetObject(preset: unknown): ValidationResult {
  if (!preset || typeof preset !== 'object') {
    return {
      valid: false,
      errors: [{ field: 'preset', message: 'Preset must be an object', severity: 'error' }],
      warnings: [],
    }
  }

  return validatePreset(preset as PresetSchema)
}

/** Format validation result as human-readable string */
export function formatValidationResult(file: string, result: ValidationResult): string {
  const lines: string[] = []

  if (result.valid) {
    lines.push(`✅ ${file}: Valid preset`)
  } else {
    lines.push(`❌ ${file}: Invalid preset`)
  }

  for (const error of result.errors) {
    lines.push(`  ERROR [${error.field}]: ${error.message}`)
  }

  for (const warning of result.warnings) {
    lines.push(`  WARN  [${warning.field}]: ${warning.message}`)
  }

  return lines.join('\n')
}

/** CLI entry point (for use with npx or script) */
export function runPresetValidator(files: string[]): void {
  console.log('Preset Validator')
  console.log('================\n')

  for (const file of files) {
    try {
      // In Node.js environment, read file
      // In browser, this would need a different approach
      console.log(`Checking: ${file}`)
      console.log(`  (File reading requires Node.js environment)`)
    } catch (err) {
      console.log(`❌ ${file}: ${(err as Error).message}`)
    }
  }
}
