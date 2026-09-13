import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { hoursFromNowIso, mockHash, nowIso, uid } from '../lib/utils'
import { ADMIN_ID } from './seed'
import { loadSnapshot, resetSnapshot, saveSnapshot } from './repository'
import { TEMPLATES } from './templates'
import type {
  EscrowStatus,
  Order,
  OrderRating,
  Outcome,
  OutcomeDraft,
  OutcomeStatus,
  PlatformSettings,
  Role,
  SubscriptionTier,
  SubscriptionTierName,
  User,
} from './types'
import { disputeLog, finishLog, generateProof, manualFixLog, startLog, workflowStepsFor } from './workflow'

export interface SignUpInput {
  email: string
  password: string
  name: string
  company: string
  role: Role
}

export interface StoreApi {
  users: User[]
  outcomes: Outcome[]
  orders: Order[]
  settings: PlatformSettings
  templates: typeof TEMPLATES
  currentUser: User | null
  runningOrderIds: string[]
  signIn: (email: string, password: string) => { ok: boolean; error?: string }
  signUp: (input: SignUpInput) => { ok: boolean; error?: string }
  signOut: () => void
  createOutcome: (draft: OutcomeDraft, status: OutcomeStatus) => { ok: boolean; outcome?: Outcome; error?: string }
  updateOutcome: (id: string, draft: OutcomeDraft, status: OutcomeStatus) => { ok: boolean; error?: string }
  duplicateOutcome: (id: string) => Outcome | null
  toggleOutcomeStatus: (id: string) => { ok: boolean; error?: string }
  cloneTemplate: (templateId: string) => { ok: boolean; outcome?: Outcome; error?: string }
  createOrder: (
    outcomeId: string,
    intakeData: Record<string, string>,
    options?: { bonusPrice?: number; measurementConnected?: boolean },
  ) => { ok: boolean; order?: Order; error?: string }
  runWorkflow: (orderId: string) => Promise<{ ok: boolean; error?: string }>
  markCompleted: (orderId: string) => { ok: boolean; error?: string }
  requestManualFix: (orderId: string) => { ok: boolean; error?: string }
  flagDispute: (orderId: string) => { ok: boolean; error?: string }
  rateOrder: (orderId: string, rating: OrderRating) => { ok: boolean; error?: string }
  updateTakeRate: (rate: number) => void
  updateTier: (name: SubscriptionTierName, patch: Partial<SubscriptionTier>) => void
  toggleVerified: (userId: string) => void
  acceptProof: (orderId: string) => { ok: boolean; error?: string }
  connectMeasurement: (orderId: string, connected: boolean) => { ok: boolean; error?: string }
  resetDemoData: () => void
}

const StoreContext = createContext<StoreApi | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [snapshot] = useState(() => loadSnapshot())
  const [users, setUsers] = useState<User[]>(() => snapshot.users)
  const [outcomes, setOutcomes] = useState<Outcome[]>(() => snapshot.outcomes)
  const [orders, setOrders] = useState<Order[]>(() => snapshot.orders)
  const [settings, setSettings] = useState<PlatformSettings>(() => snapshot.settings)
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => snapshot.sessionUserId)
  const [runningOrderIds, setRunningOrderIds] = useState<string[]>([])

  useEffect(() => {
    saveSnapshot({
      version: 2,
      users,
      outcomes,
      orders,
      settings,
      sessionUserId: currentUserId,
    })
  }, [users, outcomes, orders, settings, currentUserId])

  const currentUser = users.find((u) => u.id === currentUserId) ?? null

  const signIn = useCallback((email: string, password: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!user || user.passwordHash !== mockHash(password)) {
      return { ok: false, error: 'Invalid email or password.' }
    }
    setCurrentUserId(user.id)
    return { ok: true }
  }, [users])

  const signUp = useCallback((input: SignUpInput) => {
    const email = input.email.trim().toLowerCase()
    if (!email || !input.password || !input.name.trim()) {
      return { ok: false, error: 'Email, password, and name are required.' }
    }
    if (input.password.length < 8) {
      return { ok: false, error: 'Password must be at least 8 characters.' }
    }
    if (users.some((u) => u.email.toLowerCase() === email)) {
      return { ok: false, error: 'An account with that email already exists.' }
    }
    const user: User = {
      id: uid('usr'),
      email,
      passwordHash: mockHash(input.password),
      role: input.role,
      name: input.name.trim(),
      company: input.company.trim(),
      subscriptionTier: 'Starter',
      verified: false,
    }
    setUsers((prev) => [...prev, user])
    setCurrentUserId(user.id)
    return { ok: true }
  }, [users])

  const signOut = useCallback(() => setCurrentUserId(null), [])

  const liveLimitCheck = useCallback(
    (seller: User, nextStatus: OutcomeStatus, editingId?: string) => {
      if (nextStatus !== 'live') return { ok: true as const }
      const tier = settings.subscriptionTiers.find((t) => t.name === seller.subscriptionTier)
      if (!tier || tier.liveOutcomeLimit == null) return { ok: true as const }
      const live = outcomes.filter(
        (o) => o.sellerId === seller.id && o.status === 'live' && o.id !== editingId,
      ).length
      if (live >= tier.liveOutcomeLimit) {
        return {
          ok: false as const,
          error: `${tier.name} allows ${tier.liveOutcomeLimit} live outcomes. Pause one or upgrade.`,
        }
      }
      return { ok: true as const }
    },
    [outcomes, settings.subscriptionTiers],
  )

  const createOutcome = useCallback(
    (draft: OutcomeDraft, status: OutcomeStatus) => {
      if (!currentUser || currentUser.role !== 'seller') {
        return { ok: false, error: 'Only sellers can create outcomes.' }
      }
      const limit = liveLimitCheck(currentUser, status)
      if (!limit.ok) return limit
      const outcome: Outcome = {
        ...draft,
        kind: draft.kind ?? 'one_off',
        id: uid('out'),
        sellerId: currentUser.id,
        status,
        stats: { totalOrders: 0, completionRate: 0, avgTimeToOutcomeHours: 0 },
      }
      setOutcomes((prev) => [outcome, ...prev])
      return { ok: true, outcome }
    },
    [currentUser, liveLimitCheck],
  )

  const updateOutcome = useCallback(
    (id: string, draft: OutcomeDraft, status: OutcomeStatus) => {
      if (!currentUser) return { ok: false, error: 'Sign in required.' }
      const existing = outcomes.find((o) => o.id === id)
      if (!existing || existing.sellerId !== currentUser.id) {
        return { ok: false, error: 'Outcome not found.' }
      }
      const limit = liveLimitCheck(currentUser, status, id)
      if (!limit.ok) return limit
      setOutcomes((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...draft, status, sellerId: o.sellerId, id: o.id, stats: o.stats } : o)),
      )
      return { ok: true }
    },
    [currentUser, liveLimitCheck, outcomes],
  )

  const duplicateOutcome = useCallback(
    (id: string) => {
      if (!currentUser) return null
      const source = outcomes.find((o) => o.id === id && o.sellerId === currentUser.id)
      if (!source) return null
      const copy: Outcome = {
        ...structuredClone(source),
        id: uid('out'),
        title: `${source.title} (copy)`,
        status: 'draft',
        stats: { totalOrders: 0, completionRate: 0, avgTimeToOutcomeHours: 0 },
      }
      setOutcomes((prev) => [copy, ...prev])
      return copy
    },
    [currentUser, outcomes],
  )

  const toggleOutcomeStatus = useCallback(
    (id: string) => {
      if (!currentUser) return { ok: false, error: 'Sign in required.' }
      const existing = outcomes.find((o) => o.id === id && o.sellerId === currentUser.id)
      if (!existing) return { ok: false, error: 'Outcome not found.' }
      const next: OutcomeStatus = existing.status === 'live' ? 'paused' : 'live'
      const limit = liveLimitCheck(currentUser, next, id)
      if (!limit.ok) return limit
      setOutcomes((prev) => prev.map((o) => (o.id === id ? { ...o, status: next } : o)))
      return { ok: true }
    },
    [currentUser, liveLimitCheck, outcomes],
  )

  const cloneTemplate = useCallback(
    (templateId: string) => {
      if (!currentUser || currentUser.role !== 'seller') {
        return { ok: false, error: 'Only sellers can clone templates.' }
      }
      const template = TEMPLATES.find((t) => t.id === templateId)
      if (!template) return { ok: false, error: 'Template not found.' }
      const outcome: Outcome = {
        id: uid('out'),
        sellerId: currentUser.id,
        templateId: template.id,
        title: template.title,
        description: template.description,
        vertical: template.vertical,
        category: template.category,
        kind: template.kind,
        inputs: template.inputs.map((f) => ({ ...f })),
        deliverables: [...template.deliverables],
        notIncluded: [...template.notIncluded],
        successCriteria: template.successCriteria,
        slaHours: template.slaHours,
        basePrice: template.basePrice,
        priceNote: template.priceNote,
        bonusDescription: template.bonusDescription,
        bonusFormula: template.bonusFormula,
        monthlyMetric: template.monthlyMetric,
        capacity: template.capacity,
        status: 'draft',
        stats: { totalOrders: 0, completionRate: 0, avgTimeToOutcomeHours: 0 },
        faqs: template.faqs.map((f) => ({ ...f })),
        stack: template.stack ? [...template.stack] : currentUser.stack,
      }
      setOutcomes((prev) => [outcome, ...prev])
      return { ok: true, outcome }
    },
    [currentUser],
  )

  const createOrder = useCallback(
    (outcomeId: string, intakeData: Record<string, string>, options?: { bonusPrice?: number; measurementConnected?: boolean }) => {
      if (!currentUser) return { ok: false, error: 'Sign in to purchase an outcome.' }
      const outcome = outcomes.find((o) => o.id === outcomeId)
      if (!outcome || outcome.status !== 'live') {
        return { ok: false, error: 'This outcome is not available.' }
      }
      if (outcome.sellerId === currentUser.id) {
        return { ok: false, error: 'You cannot buy your own outcome.' }
      }
      const active = orders.filter(
        (o) => o.outcomeId === outcomeId && (o.status === 'paid' || o.status === 'in_progress'),
      ).length
      if (active >= outcome.capacity) {
        return { ok: false, error: 'This seller is at capacity for this outcome. Try again later.' }
      }
      const order: Order = {
        id: uid('ord'),
        outcomeId,
        buyerId: currentUser.id,
        intakeData,
        basePrice: outcome.basePrice,
        bonusPrice: options?.bonusPrice,
        status: 'paid',
        createdAt: nowIso(),
        deadlineAt: hoursFromNowIso(outcome.slaHours),
        workflowLogs: [],
        escrowStatus: 'escrowed' satisfies EscrowStatus,
        measurementConnected: Boolean(options?.measurementConnected),
      }
      setOrders((prev) => [order, ...prev])
      setOutcomes((prev) =>
        prev.map((o) =>
          o.id === outcomeId ? { ...o, stats: { ...o.stats, totalOrders: o.stats.totalOrders + 1 } } : o,
        ),
      )
      return { ok: true, order }
    },
    [currentUser, orders, outcomes],
  )

  const runWorkflow = useCallback(async (orderId: string) => {
    const snapshot = orders.find((o) => o.id === orderId)
    const outcome = snapshot ? outcomes.find((o) => o.id === snapshot.outcomeId) : undefined
    if (!snapshot || !outcome) return { ok: false, error: 'Order not found.' }
    if (snapshot.status === 'completed' || snapshot.status === 'disputed') {
      return { ok: false, error: 'This order is already closed.' }
    }
    if (runningOrderIds.includes(orderId)) {
      return { ok: false, error: 'Workflow already running.' }
    }

    setRunningOrderIds((ids) => [...ids, orderId])
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'in_progress', proofReport: undefined } : o)),
    )

    const steps = workflowStepsFor(outcome)
    try {
      for (const step of steps) {
        const log = startLog(step)
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, workflowLogs: [...o.workflowLogs, log] } : o)),
        )
        await new Promise((resolve) => setTimeout(resolve, step.delayMs()))
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, workflowLogs: o.workflowLogs.map((l) => (l.id === log.id ? finishLog(l, step) : l)) }
              : o,
          ),
        )
      }
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o
          return { ...o, proofReport: generateProof(outcome, o) }
        }),
      )
      return { ok: true }
    } finally {
      setRunningOrderIds((ids) => ids.filter((id) => id !== orderId))
    }
  }, [orders, outcomes, runningOrderIds])

  const markCompleted = useCallback((orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return { ok: false, error: 'Order not found.' }
    if (!order.proofReport) return { ok: false, error: 'Run the agent workflow before marking completed.' }
    const started = new Date(order.createdAt).getTime()
    const hours = Math.max(1, Math.round((Date.now() - started) / 36e5))
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'completed', escrowStatus: 'released' } : o)),
    )
    setOutcomes((prev) =>
      prev.map((o) => {
        if (o.id !== order.outcomeId) return o
        const completed = orders.filter((x) => x.outcomeId === o.id && (x.status === 'completed' || x.id === orderId)).length
        const total = o.stats.totalOrders || 1
        const prevAvg = o.stats.avgTimeToOutcomeHours
        const avg =
          o.stats.avgTimeToOutcomeHours === 0
            ? hours
            : Math.round((prevAvg * Math.max(completed - 1, 0) + hours) / Math.max(completed, 1))
        return {
          ...o,
          stats: {
            ...o.stats,
            completionRate: Math.min(1, completed / total),
            avgTimeToOutcomeHours: avg,
          },
        }
      }),
    )
    return { ok: true }
  }, [orders])

  const requestManualFix = useCallback((orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return { ok: false, error: 'Order not found.' }
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'in_progress', workflowLogs: [...o.workflowLogs, manualFixLog()] }
          : o,
      ),
    )
    return { ok: true }
  }, [orders])

  const flagDispute = useCallback((orderId: string) => {
    if (!orders.some((o) => o.id === orderId)) return { ok: false, error: 'Order not found.' }
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'disputed', workflowLogs: [...o.workflowLogs, disputeLog()] }
          : o,
      ),
    )
    return { ok: true }
  }, [orders])

  const rateOrder = useCallback((orderId: string, rating: OrderRating) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order || order.status !== 'completed') {
      return { ok: false, error: 'You can rate an order after it is completed.' }
    }
    if (currentUser?.id !== order.buyerId) return { ok: false, error: 'Only the buyer can rate this order.' }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, rating } : o)))
    return { ok: true }
  }, [currentUser, orders])

  const updateTakeRate = useCallback((rate: number) => {
    setSettings((prev) => ({ ...prev, takeRate: rate }))
  }, [])

  const updateTier = useCallback((name: SubscriptionTierName, patch: Partial<SubscriptionTier>) => {
    setSettings((prev) => ({
      ...prev,
      subscriptionTiers: prev.subscriptionTiers.map((t) => (t.name === name ? { ...t, ...patch, name } : t)),
    }))
  }, [])

  const toggleVerified = useCallback((userId: string) => {
    if (userId === ADMIN_ID) return
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, verified: !u.verified } : u)))
  }, [])

  const acceptProof = useCallback((orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return { ok: false, error: 'Order not found.' }
    if (!order.proofReport) return { ok: false, error: 'Proof is not ready yet.' }
    if (currentUser?.id !== order.buyerId) return { ok: false, error: 'Only the buyer can accept proof.' }
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, escrowStatus: 'released', status: o.status === 'paid' || o.status === 'in_progress' ? 'completed' : o.status }
          : o,
      ),
    )
    return { ok: true }
  }, [currentUser, orders])

  const connectMeasurement = useCallback((orderId: string, connected: boolean) => {
    if (!orders.some((o) => o.id === orderId)) return { ok: false, error: 'Order not found.' }
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, measurementConnected: connected } : o)))
    return { ok: true }
  }, [orders])

  const resetDemoData = useCallback(() => {
    const next = resetSnapshot()
    setUsers(next.users)
    setOutcomes(next.outcomes)
    setOrders(next.orders)
    setSettings(next.settings)
    setCurrentUserId(next.sessionUserId)
    setRunningOrderIds([])
  }, [])

  const value = useMemo<StoreApi>(
    () => ({
      users,
      outcomes,
      orders,
      settings,
      templates: TEMPLATES,
      currentUser,
      runningOrderIds,
      signIn,
      signUp,
      signOut,
      createOutcome,
      updateOutcome,
      duplicateOutcome,
      toggleOutcomeStatus,
      cloneTemplate,
      createOrder,
      runWorkflow,
      markCompleted,
      requestManualFix,
      flagDispute,
      rateOrder,
      updateTakeRate,
      updateTier,
      toggleVerified,
      acceptProof,
      connectMeasurement,
      resetDemoData,
    }),
    [
      users,
      outcomes,
      orders,
      settings,
      currentUser,
      runningOrderIds,
      signIn,
      signUp,
      signOut,
      createOutcome,
      updateOutcome,
      duplicateOutcome,
      toggleOutcomeStatus,
      cloneTemplate,
      createOrder,
      runWorkflow,
      markCompleted,
      requestManualFix,
      flagDispute,
      rateOrder,
      updateTakeRate,
      updateTier,
      toggleVerified,
      acceptProof,
      connectMeasurement,
      resetDemoData,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
