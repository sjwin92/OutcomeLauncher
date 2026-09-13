/**
 * Repository boundary for OutcomeLauncher state.
 * Today: versioned localStorage. Next: swap these functions for Supabase.
 */
import { DEFAULT_SETTINGS, SEED_ORDERS, SEED_OUTCOMES, SEED_USERS } from './seed'
import type { PersistedSnapshot } from './types'

export const STORAGE_KEY = 'outcomelauncher:v2'
export const STORAGE_VERSION = 2

function memorySafeStorage(): Storage | null {
  try {
    if (typeof localStorage === 'undefined') return null
    return localStorage
  } catch {
    return null
  }
}

export function createSeedSnapshot(sessionUserId: string | null = null): PersistedSnapshot {
  return {
    version: STORAGE_VERSION,
    users: structuredClone(SEED_USERS),
    outcomes: structuredClone(SEED_OUTCOMES),
    orders: structuredClone(SEED_ORDERS),
    settings: structuredClone(DEFAULT_SETTINGS),
    sessionUserId,
  }
}

export function loadSnapshot(): PersistedSnapshot {
  const storage = memorySafeStorage()
  if (!storage) return createSeedSnapshot()
  const raw = storage.getItem(STORAGE_KEY)
  if (!raw) return createSeedSnapshot()
  try {
    const parsed = JSON.parse(raw) as PersistedSnapshot
    if (!parsed || parsed.version !== STORAGE_VERSION) return createSeedSnapshot()
    if (!Array.isArray(parsed.users) || !Array.isArray(parsed.outcomes) || !Array.isArray(parsed.orders)) {
      return createSeedSnapshot()
    }
    return {
      version: STORAGE_VERSION,
      users: parsed.users,
      outcomes: parsed.outcomes,
      orders: parsed.orders,
      settings: parsed.settings ?? structuredClone(DEFAULT_SETTINGS),
      sessionUserId: parsed.sessionUserId ?? null,
    }
  } catch {
    return createSeedSnapshot()
  }
}

export function saveSnapshot(snapshot: PersistedSnapshot): void {
  const storage = memorySafeStorage()
  if (!storage) return
  const payload: PersistedSnapshot = { ...snapshot, version: STORAGE_VERSION }
  storage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function resetSnapshot(sessionUserId: string | null = null): PersistedSnapshot {
  const next = createSeedSnapshot(sessionUserId)
  if (next.sessionUserId && !next.users.some((u) => u.id === next.sessionUserId)) {
    next.sessionUserId = null
  }
  saveSnapshot(next)
  return next
}

export function hasPersistedSnapshot(): boolean {
  const storage = memorySafeStorage()
  return Boolean(storage?.getItem(STORAGE_KEY))
}
