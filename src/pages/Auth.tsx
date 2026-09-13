import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Alert, Button, Field, Select, TextInput } from '../components/ui'
import { useStore } from '../data/store'
import type { Role } from '../data/types'
import { useToast } from '../motion/ToastProvider'

export function SignIn() {
  const { signIn } = useStore()
  const { pushToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'
  const [email, setEmail] = useState('buyer@demo.com')
  const [password, setPassword] = useState('demo1234')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  function fail(message: string) {
    setError(message)
    setShake(false)
    requestAnimationFrame(() => {
      void document.body.offsetWidth
      setShake(true)
    })
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const result = signIn(email, password)
    if (!result.ok) {
      fail(result.error ?? 'Could not sign in.')
      return
    }
    pushToast('Signed in')
    navigate(from, { replace: true })
  }

  return (
    <AuthShell title="Sign in" subtitle="Demo accounts persist in this browser. Password: demo1234.">
      <form className="space-y-4" onSubmit={onSubmit}>
        {error ? <Alert tone="error">{error}</Alert> : null}
        <div className={`t-input-wrap ${error ? 'is-error' : ''}`}>
          <Field label="Email">
            <TextInput
              className={`t-input ${error ? 'is-error' : ''} ${shake ? 'is-shaking' : ''}`}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password">
            <TextInput
              className={`t-input ${error ? 'is-error' : ''} ${shake ? 'is-shaking' : ''}`}
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <p className="t-error-msg mt-1 text-xs text-rose-600">{error || ' '}</p>
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
      <DemoAccounts />
      <p className="mt-4 text-sm text-slate-600">
        No account? <Link to="/signup" className="font-semibold text-indigo-600">Create one</Link>
      </p>
    </AuthShell>
  )
}

export function SignUp() {
  const { signUp } = useStore()
  const { pushToast } = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [role, setRole] = useState<Role>(params.get('role') === 'seller' ? 'seller' : 'buyer')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  function fail(message: string) {
    setError(message)
    setShake(false)
    requestAnimationFrame(() => {
      void document.body.offsetWidth
      setShake(true)
    })
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) {
      fail('Name is required.')
      return
    }
    if (password.length < 8) {
      fail('Password must be at least 8 characters.')
      return
    }
    const result = signUp({ email, password, name, company, role })
    if (!result.ok) {
      fail(result.error ?? 'Could not create account.')
      return
    }
    pushToast('Account created')
    navigate('/dashboard', { replace: true })
  }

  return (
    <AuthShell title="Create your account" subtitle="Sellers list outcomes. Buyers purchase fixed-scope results.">
      <form className="space-y-4" onSubmit={onSubmit}>
        {error ? <Alert tone="error">{error}</Alert> : null}
        <Field label="I want to">
          <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option value="buyer">Buy outcomes</option>
            <option value="seller">Sell outcomes</option>
          </Select>
        </Field>
        <div className={`t-input-wrap ${error ? 'is-error' : ''}`}>
          <Field label="Name">
            <TextInput className={`t-input ${shake ? 'is-shaking' : ''} ${error ? 'is-error' : ''}`} required value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Company">
            <TextInput value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" />
          </Field>
          <Field label="Email">
            <TextInput className={`t-input ${error ? 'is-error' : ''}`} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password" hint="At least 8 characters.">
            <TextInput className={`t-input ${error ? 'is-error' : ''}`} type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <p className="t-error-msg mt-1 text-xs text-rose-600">{error || ' '}</p>
        </div>
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account? <Link to="/signin" className="font-semibold text-indigo-600">Sign in</Link>
      </p>
    </AuthShell>
  )
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="card p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

function DemoAccounts() {
  return (
    <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
      <p className="font-semibold text-slate-800">Demo logins (password: demo1234)</p>
      <ul className="mt-2 space-y-1">
        <li>buyer@demo.com — buyer</li>
        <li>seller@demo.com — verified seller</li>
        <li>admin@outcomelauncher.com — admin + seller</li>
      </ul>
    </div>
  )
}
