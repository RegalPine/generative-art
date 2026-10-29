/**
 * Preset Version — MAJOR.MINOR.PATCH parsing and comparison.
 */

/** Parsed version */
export interface ParsedVersion {
  major: number
  minor: number
  patch: number
}

/** Parse a version string */
export function parseVersion(version: string): ParsedVersion {
  const parts = version.split('.').map(Number)
  return {
    major: parts[0] ?? 0,
    minor: parts[1] ?? 0,
    patch: parts[2] ?? 0,
  }
}

/** Compare two versions: returns -1, 0, or 1 */
export function compareVersions(a: string, b: string): -1 | 0 | 1 {
  const va = parseVersion(a)
  const vb = parseVersion(b)

  if (va.major !== vb.major) return va.major > vb.major ? 1 : -1
  if (va.minor !== vb.minor) return va.minor > vb.minor ? 1 : -1
  if (va.patch !== vb.patch) return va.patch > vb.patch ? 1 : -1
  return 0
}

/** Check if version satisfies a range (simple >= check) */
export function satisfiesVersion(version: string, minVersion: string): boolean {
  return compareVersions(version, minVersion) >= 0
}

/** Format a version to string */
export function formatVersion(v: ParsedVersion): string {
  return `${v.major}.${v.minor}.${v.patch}`
}

/** Bump version */
export function bumpVersion(version: string, type: 'major' | 'minor' | 'patch'): string {
  const v = parseVersion(version)
  switch (type) {
    case 'major':
      return formatVersion({ major: v.major + 1, minor: 0, patch: 0 })
    case 'minor':
      return formatVersion({ major: v.major, minor: v.minor + 1, patch: 0 })
    case 'patch':
      return formatVersion({ major: v.major, minor: v.minor, patch: v.patch + 1 })
  }
}
