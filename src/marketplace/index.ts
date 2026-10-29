/**
 * Preset Marketplace — protocol and API for sharing presets.
 *
 * Defines the contract for:
 * - Preset discovery (search/list)
 * - Preset download (load remote preset)
 * - Preset publishing (submit preset)
 * - Preset caching (local cache management)
 */

import type { PresetSchema } from '../preset/types'
import { validatePreset } from '../preset/validation'

/** Marketplace preset metadata */
export interface MarketplacePresetMeta {
  id: string
  name: string
  version: string
  author: string
  description: string
  tags: string[]
  thumbnail?: string
  downloads: number
  rating: number
  createdAt: string
  updatedAt: string
}

/** Marketplace search query */
export interface MarketplaceSearchQuery {
  query?: string
  tags?: string[]
  author?: string
  sortBy?: 'popular' | 'recent' | 'rating' | 'name'
  limit?: number
  offset?: number
}

/** Marketplace search result */
export interface MarketplaceSearchResult {
  presets: MarketplacePresetMeta[]
  total: number
  offset: number
  limit: number
}

/** Preset cache entry */
export interface PresetCacheEntry {
  preset: PresetSchema
  meta: MarketplacePresetMeta
  cachedAt: number
  expiresAt: number
}

/** Preset Loader — loads and caches remote presets */
export class PresetLoader {
  private cache = new Map<string, PresetCacheEntry>()
  private cacheTTL: number

  constructor(cacheTTL = 3600000) { // 1 hour default
    this.cacheTTL = cacheTTL
  }

  /** Load a preset from URL */
  async loadFromURL(url: string): Promise<PresetSchema> {
    // Check cache first
    const cached = this.cache.get(url)
    if (cached && cached.expiresAt > Date.now()) {
      return cached.preset
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load preset: ${response.status} ${response.statusText}`)
    }

    const preset = await response.json() as PresetSchema
    const validation = validatePreset(preset)
    if (!validation.valid) {
      throw new Error(`Invalid preset: ${validation.errors.map(e => e.message).join(', ')}`)
    }

    // Cache it
    const now = Date.now()
    this.cache.set(url, {
      preset,
      meta: {
        id: preset.id,
        name: preset.metadata?.name ?? preset.id,
        version: preset.version,
        author: preset.metadata?.author ?? 'unknown',
        description: preset.metadata?.description ?? '',
        tags: [],
        downloads: 0,
        rating: 0,
        createdAt: now.toString(),
        updatedAt: now.toString(),
      },
      cachedAt: now,
      expiresAt: now + this.cacheTTL,
    })

    return preset
  }

  /** Load a preset from local JSON string */
  loadFromJSON(json: string): PresetSchema {
    const preset = JSON.parse(json) as PresetSchema
    const validation = validatePreset(preset)
    if (!validation.valid) {
      throw new Error(`Invalid preset: ${validation.errors.map(e => e.message).join(', ')}`)
    }
    return preset
  }

  /** Check if a URL is cached */
  isCached(url: string): boolean {
    const entry = this.cache.get(url)
    return entry !== undefined && entry.expiresAt > Date.now()
  }

  /** Clear the cache */
  clearCache(): void {
    this.cache.clear()
  }

  /** Remove expired entries */
  pruneCache(): void {
    const now = Date.now()
    for (const [url, entry] of this.cache) {
      if (entry.expiresAt <= now) {
        this.cache.delete(url)
      }
    }
  }

  /** Get cache size */
  get cacheSize(): number {
    return this.cache.size
  }
}

/** Create a preset loader */
export function createPresetLoader(cacheTTL?: number): PresetLoader {
  return new PresetLoader(cacheTTL)
}

/** Marketplace API interface */
export interface MarketplaceAPI {
  search(query: MarketplaceSearchQuery): Promise<MarketplaceSearchResult>
  getPreset(id: string): Promise<PresetSchema>
  getMeta(id: string): Promise<MarketplacePresetMeta>
  publish(preset: PresetSchema): Promise<string>
  download(id: string): Promise<PresetSchema>
}

/** Create a mock marketplace API (for testing) */
export function createMockMarketplaceAPI(): MarketplaceAPI {
  return {
    async search(query) {
      return { presets: [], total: 0, offset: query.offset ?? 0, limit: query.limit ?? 20 }
    },
    async getPreset(id) {
      throw new Error(`Preset not found: ${id}`)
    },
    async getMeta(id) {
      throw new Error(`Preset not found: ${id}`)
    },
    async publish() {
      return 'mock-preset-id'
    },
    async download(id) {
      throw new Error(`Preset not found: ${id}`)
    },
  }
}
