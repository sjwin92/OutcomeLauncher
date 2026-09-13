import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { clsx } from '../lib/utils'
import { usePrefersReducedMotion } from './ToastProvider'

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  function reset() {
    const tilt = wrapRef.current
    const card = cardRef.current
    if (!tilt || !card) return
    tilt.classList.remove('is-hover')
    card.classList.remove('is-tilting')
    card.style.setProperty('--tilt-rx', '0deg')
    card.style.setProperty('--tilt-ry', '0deg')
  }

  function track(e: PointerEvent<HTMLDivElement>) {
    if (reduced) return
    const tilt = wrapRef.current
    const card = cardRef.current
    if (!tilt || !card) return
    const r = tilt.getBoundingClientRect()
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    const MAX = 12
    tilt.classList.add('is-hover')
    card.classList.add('is-tilting')
    card.style.setProperty('--tilt-ry', `${((px - 0.5) * MAX).toFixed(2)}deg`)
    card.style.setProperty('--tilt-rx', `${((0.5 - py) * MAX).toFixed(2)}deg`)
    card.style.setProperty('--tilt-gx', `${(px * 100).toFixed(1)}%`)
    card.style.setProperty('--tilt-gy', `${(py * 100).toFixed(1)}%`)
  }

  return (
    <div
      ref={wrapRef}
      className={clsx('t-tilt h-full', className)}
      onPointerMove={track}
      onPointerUp={reset}
      onPointerCancel={reset}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') reset()
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== 'mouse') {
          try {
            wrapRef.current?.setPointerCapture(e.pointerId)
          } catch {
            /* ignore */
          }
        }
      }}
    >
      <div ref={cardRef} className="t-tilt-card h-full">
        {children}
        <div className="t-tilt-glare" />
      </div>
    </div>
  )
}

export function TextsReveal({
  lines,
  className,
  shown = true,
}: {
  lines: Array<{ text: string; as?: 'h1' | 'p' | 'span'; className?: string }>
  className?: string
  shown?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const block = ref.current
    if (!block) return
    block.classList.remove('is-hiding')
    block.classList.remove('is-shown')
    void block.offsetHeight
    if (shown) block.classList.add('is-shown')
  }, [shown, lines.map((l) => l.text).join('|')])

  return (
    <div ref={ref} className={clsx('t-stagger', className)}>
      {lines.map((line, i) => {
        const Tag = line.as ?? (i === 0 ? 'h1' : 'p')
        return (
          <Tag key={`${i}-${line.text}`} className={clsx(`t-stagger-line t-stagger-line--${i + 1}`, line.className)}>
            {line.text}
          </Tag>
        )
      })}
    </div>
  )
}

export function ShimmerText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={clsx('t-shimmer', className)} data-text={text}>
      {text}
    </span>
  )
}

export function SlidingTabs<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T
  options: Array<{ id: T; label: string }>
  onChange: (value: T) => void
  ariaLabel?: string
}) {
  const barRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const bar = barRef.current
    const pill = pillRef.current
    if (!bar || !pill) return
    const tab = bar.querySelector<HTMLElement>(`[data-tab-id="${CSS.escape(value)}"]`)
    if (!tab) return
    const prev = pill.style.transition
    pill.style.transition = 'none'
    pill.style.transform = `translateX(${tab.offsetLeft}px)`
    pill.style.width = `${tab.offsetWidth}px`
    void pill.offsetWidth
    pill.style.transition = prev
  }, [value, options.length])

  function select(next: T, tab: HTMLButtonElement) {
    const pill = pillRef.current
    if (pill) {
      pill.style.transform = `translateX(${tab.offsetLeft}px)`
      pill.style.width = `${tab.offsetWidth}px`
    }
    onChange(next)
  }

  return (
    <div ref={barRef} className="t-tabs" role="tablist" aria-label={ariaLabel}>
      <span ref={pillRef} className="t-tabs-pill" aria-hidden="true" />
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="tab"
          data-tab-id={opt.id}
          className="t-tab text-sm font-medium"
          aria-selected={value === opt.id}
          onClick={(e) => select(opt.id, e.currentTarget)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function Accordion({
  items,
}: {
  items: Array<{ q: string; a: string }>
}) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className="t-acc rounded-xl border border-slate-200 bg-white" data-open={isOpen ? 'true' : 'false'}>
            <button
              type="button"
              className="t-acc-head flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="text-sm font-semibold text-slate-900">{item.q}</span>
              <span className="t-acc-chevron text-slate-500" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            <div className="t-acc-panel">
              <div className="t-acc-panel-inner px-4 pb-3 text-sm leading-6 text-slate-600">{item.a}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ModalFrame({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  const [shown, setShown] = useState(open)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (open) {
      setShown(true)
      setClosing(false)
      return
    }
    if (!shown) return
    setClosing(true)
    const closeMs = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--modal-close-dur')) || 150
    const timer = window.setTimeout(() => {
      setShown(false)
      setClosing(false)
    }, closeMs)
    return () => window.clearTimeout(timer)
  }, [open, shown])

  if (!shown) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        className={clsx('t-modal w-full max-w-md', open && !closing && 'is-open', closing && 'is-closing')}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  const [init, setInit] = useState(false)
  return (
    <label className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-on={checked ? 'true' : 'false'}
        className={clsx('t-toggle', init && 'is-init')}
        onClick={() => {
          setInit(true)
          onChange(!checked)
        }}
      >
        <span className="t-toggle-thumb" />
      </button>
      <span className="text-sm font-medium text-slate-800">{label}</span>
    </label>
  )
}

export function SuccessCheck({ done }: { done: boolean }) {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const svg = ref.current
    if (!svg || !done) return
    const path = svg.querySelector('path')
    if (path) {
      const len = Math.ceil(path.getTotalLength()) + 1
      path.style.strokeDasharray = String(len)
      path.style.strokeDashoffset = String(len)
      void (svg as unknown as HTMLElement).offsetWidth
    }
  }, [done])

  return (
    <span className="t-success-check" data-state={done ? 'in' : 'out'} aria-hidden="true">
      <svg ref={ref} viewBox="0 0 48 48" width="36" height="36" fill="none">
        <circle cx="24" cy="24" r="22" fill="#059669" />
        <path d="M14 25.5l6.5 6.5 13.5-14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function MatrixLoader({ variant = 'orbit' }: { variant?: 'scan' | 'twinkle' | 'orbit' | 'pulse' }) {
  const delays = variant === 'scan'
    ? [0, 120, 240, 360, 0, 120, 240, 360, 0, 120, 240, 360, 0, 120, 240, 360]
    : variant === 'pulse'
      ? [192, 192, 192, 192, 192, 0, 0, 192, 192, 0, 0, 192, 192, 192, 192, 192]
      : [0, 150, 300, 450, 1050, 0, 0, 600, 900, 0, 0, 750, 0, 1200, 1350, 0]

  return (
    <span className="t-matrix" data-variant={variant} aria-hidden="true">
      {Array.from({ length: 16 }, (_, idx) => (
        <i key={idx} style={{ ['--d' as string]: delays[idx] }} className={variant === 'orbit' && [5, 6, 9, 10].includes(idx) ? 'is-gap' : undefined} />
      ))}
    </span>
  )
}

export function SpinningStat({ value, label }: { value: string; label: string }) {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = host.current
    if (!root) return
    root.innerHTML = ''
    const digits = value.replace(/[^0-9]/g, '')
    const prefix = value.match(/^[^\d]*/)?.[0] ?? ''
    const suffix = value.slice(prefix.length + digits.length)
    if (prefix) {
      const span = document.createElement('span')
      span.textContent = prefix
      root.appendChild(span)
    }
    digits.split('').forEach((digit, col) => {
      const colEl = document.createElement('span')
      colEl.className = 't-reel-col'
      const strip = document.createElement('span')
      strip.className = 't-reel-strip'
      for (let n = 0; n < 10; n++) {
        const cell = document.createElement('span')
        cell.className = 't-reel-digit'
        cell.textContent = String(n)
        strip.appendChild(cell)
      }
      colEl.appendChild(strip)
      root.appendChild(colEl)
      const target = Number(digit)
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      requestAnimationFrame(() => {
        strip.style.transition = reduce
          ? 'none'
          : `transform var(--reel-dur) var(--reel-ease) ${col} * 1ms`.replace(
              `${col} * 1ms`,
              `calc(${col} * var(--reel-stagger))`,
            )
        strip.style.transform = `translateY(calc(-1 * (10 + ${target}) * var(--reel-cell)))`
      })
      // Extra 0-9 for a full spin then land
      for (let n = 0; n < 10; n++) {
        const cell = document.createElement('span')
        cell.className = 't-reel-digit'
        cell.textContent = String(n)
        strip.appendChild(cell)
      }
    })
    if (suffix) {
      const span = document.createElement('span')
      span.textContent = suffix
      root.appendChild(span)
    }
  }, [value])

  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <div ref={host} className="t-reel mt-1 text-2xl font-bold text-slate-900" />
    </div>
  )
}

export function NumberPop({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.remove('is-animating')
    void el.offsetWidth
    el.classList.add('is-animating')
  }, [value])

  const chars = value.split('')
  return (
    <span ref={ref} className="t-digit-group is-animating">
      {chars.map((ch, i) => (
        <span key={`${ch}-${i}`} className="t-digit" data-stagger={i >= chars.length - 2 ? String(chars.length - i) : undefined}>
          {ch}
        </span>
      ))}
    </span>
  )
}

export function SearchClear({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (next: string) => void
  placeholder?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [clearing, setClearing] = useState(false)

  function clear() {
    const wrap = wrapRef.current
    if (!wrap || !value) {
      onChange('')
      return
    }
    setClearing(true)
    wrap.classList.add('is-clearing')
    const ms = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--clear-out-dur')) || 400
    window.setTimeout(() => {
      onChange('')
      wrap.classList.remove('is-clearing')
      setClearing(false)
    }, ms)
  }

  return (
    <div ref={wrapRef} className={clsx('t-clear', value && 'has-value', clearing && 'is-clearing')}>
      <input
        className="input pr-10"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="t-clear-mirror" aria-hidden="true">
        {value}
      </div>
      <div className="t-clear-placeholder" aria-hidden="true">
        {placeholder}
      </div>
      <div className="t-clear-glow" aria-hidden="true" />
      {value ? (
        <button type="button" className="t-clear-btn" aria-label="Clear" onClick={clear}>
          ×
        </button>
      ) : null}
    </div>
  )
}

export function StreamText({ text, active }: { text: string; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const words = text.split(/\s+/).filter(Boolean)
    root.innerHTML = words.map((w) => `<span class="t-stream-w">${w} </span>`).join('')
    if (!active) {
      root.querySelectorAll('.t-stream-w').forEach((el) => el.classList.add('is-in'))
      return
    }
    const spans = [...root.querySelectorAll<HTMLElement>('.t-stream-w')]
    spans.forEach((el) => {
      el.style.transition = 'none'
      el.classList.remove('is-in')
    })
    void root.offsetWidth
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stream-gap')) || 60
    spans.forEach((el, i) => {
      window.setTimeout(() => {
        el.style.transition = ''
        el.classList.add('is-in')
      }, i * gap)
    })
  }, [text, active])
  return <div ref={ref} className="t-stream text-sm leading-6 text-slate-700" />
}

export function ReasonStream({ lines }: { lines: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const scroll = scrollRef.current
    if (!scroll) return
    const hold = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--reason-hold')) || 840
    const step = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--reason-step')) || 500
    const lineH = 22
    let offset = 0
    const timer = window.setInterval(() => {
      offset += 2 * lineH
      const max = scroll.scrollHeight / 2
      if (offset >= max) offset = 0
      scroll.style.transition = `transform ${step}ms var(--reason-ease)`
      scroll.style.transform = `translateY(-${offset}px)`
    }, hold + step)
    return () => window.clearInterval(timer)
  }, [lines.join('|')])

  return (
    <div className="t-reason">
      <div className="t-reason-viewport">
        <div ref={scrollRef} className="t-reason-scroll">
          <div className="t-reason-text">
            {lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="t-reason-text" aria-hidden="true">
            {lines.map((line) => (
              <p key={`dup-${line}`}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ThinkLine({ states, running }: { states: string[]; running: boolean }) {
  const textRef = useRef<HTMLSpanElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!running) return
    const hold = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--think-hold')) || 2000
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % states.length), hold)
    return () => window.clearInterval(timer)
  }, [running, states.length])

  useEffect(() => {
    const el = textRef.current
    if (!el) return
    el.classList.add('is-exit')
    const swap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--think-swap')) || 150
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--think-gap')) || 50
    const next = states[index]
    window.setTimeout(() => {
      el.textContent = next
      el.setAttribute('data-text', next)
      el.classList.remove('is-exit')
      el.classList.add('is-enter-start')
      void el.offsetWidth
      el.classList.remove('is-enter-start')
    }, swap + gap)
  }, [index, states])

  const current = states[index]
  return (
    <span className="t-think" role="status">
      <span className="t-think-sizer" aria-hidden="true">
        {states.reduce((a, b) => (a.length >= b.length ? a : b), '')}
      </span>
      <span ref={textRef} className="t-think-text" data-text={current}>
        {current}
      </span>
    </span>
  )
}
