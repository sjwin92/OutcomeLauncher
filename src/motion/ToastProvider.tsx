import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

export interface ToastItem {
  id: string
  message: string
  tone?: 'info' | 'success' | 'error'
}

interface ToastApi {
  toasts: ToastItem[]
  pushToast: (message: string, tone?: ToastItem['tone']) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Array<ToastItem & { open: boolean }>>([])

  const pushToast = useCallback((message: string, tone: ToastItem['tone'] = 'success') => {
    const id = `toast_${Math.random().toString(36).slice(2, 8)}`
    setToasts((prev) => [...prev, { id, message, tone, open: false }])
    requestAnimationFrame(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, open: true } : t)))
    })
    window.setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, open: false } : t)))
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 250)
    }, 2800)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, pushToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            data-open={toast.open ? 'true' : 'false'}
            className={`t-toast pointer-events-auto rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
              toast.tone === 'error'
                ? 'bg-rose-600 text-white'
                : toast.tone === 'info'
                  ? 'bg-slate-900 text-white'
                  : 'bg-emerald-600 text-white'
            } ${toast.open ? 'is-open' : ''}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export function useCloseMs(varName: string, fallback: number): number {
  const ref = useRef(fallback)
  useEffect(() => {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(varName)
    const parsed = parseFloat(raw)
    if (Number.isFinite(parsed)) ref.current = parsed
  }, [varName])
  return ref.current
}
