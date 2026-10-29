/**
 * Preset Validation — validates preset schema and constraints.
 */

import type { PresetSchema } from './types'

/** Validation error */
export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
}

/** Validation result */
export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

/** Validate a preset schema */
export function validatePreset(preset: PresetSchema): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // Required fields
  if (!preset.id || preset.id.trim() === '') {
    errors.push({ field: 'id', message: 'Preset ID is required', severity: 'error' })
  }

  if (!preset.version || !/^\d+\.\d+\.\d+$/.test(preset.version)) {
    errors.push({ field: 'version', message: 'Version must be in MAJOR.MINOR.PATCH format', severity: 'error' })
  }

  // Geometry validation
  if (preset.geometry) {
    if (preset.geometry.type && !isValidGeometryType(preset.geometry.type)) {
      warnings.push({ field: 'geometry.type', message: `Unknown geometry type: ${preset.geometry.type}`, severity: 'warning' })
    }
    if (preset.geometry.count !== undefined && typeof preset.geometry.count === 'number' && (preset.geometry.count < 0 || preset.geometry.count > 10000)) {
      errors.push({ field: 'geometry.count', message: 'Geometry count must be between 0 and 10000', severity: 'error' })
    }
  }

  // Semantic validation
  if (preset.semantic) {
    const semanticFields = ['density', 'complexity', 'energy', 'softness', 'depth', 'rhythm', 'turbulence', 'focus'] as const
    for (const field of semanticFields) {
      const value = preset.semantic[field]
      if (value !== undefined && (value < 0 || value > 1)) {
        errors.push({ field: `semantic.${field}`, message: `${field} must be between 0 and 1`, severity: 'error' })
      }
    }
  }

  // Material validation
  if (preset.material) {
    if (preset.material.opacity !== undefined && (preset.material.opacity < 0 || preset.material.opacity > 1)) {
      errors.push({ field: 'material.opacity', message: 'Opacity must be between 0 and 1', severity: 'error' })
    }
  }

  // Metadata warnings
  if (!preset.metadata?.name) {
    warnings.push({ field: 'metadata.name', message: 'Preset should have a display name', severity: 'warning' })
  }

  if (!preset.metadata?.description) {
    warnings.push({ field: 'metadata.description', message: 'Preset should have a description', severity: 'warning' })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/** Check if a geometry type is valid */
function isValidGeometryType(type: string): boolean {
  const knownTypes = [
    'point', 'line', 'curve', 'polyline', 'bezier', 'spline',
    'circle', 'wave', 'ribbon', 'arc', 'polygon', 'mesh',
  ]
  return knownTypes.includes(type)
}

/** Validate preset constraints against performance profile */
export function validatePresetConstraints(
  preset: PresetSchema,
  maxGeometryCount: number,
  maxComplexity: number,
): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  if (preset.geometry?.count !== undefined && typeof preset.geometry.count === 'number' && preset.geometry.count > maxGeometryCount) {
    errors.push({
      field: 'geometry.count',
      message: `Geometry count ${preset.geometry.count} exceeds max ${maxGeometryCount}`,
      severity: 'error',
    })
  }

  if (preset.semantic?.complexity && preset.semantic.complexity > maxComplexity) {
    warnings.push({
      field: 'semantic.complexity',
      message: `Complexity ${preset.semantic.complexity} exceeds recommended max ${maxComplexity}`,
      severity: 'warning',
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
