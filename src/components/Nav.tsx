import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../data/store'
import { isAdminEmail } from '../lib/utils'

export function Nav() {
  const { currentUser, signOut } = useStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const admin = currentUser && isAdminEmail(currentUser.email)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${
      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2" onClick={close}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-emerald-50">
            OL
          </span>
          <span className="text-base font-bold tracking-tight text-slate-900">OutcomeLauncher</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/marketplace" className={linkClass}>
            Marketplace
          </NavLink>
          {currentUser ? (
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          ) : null}
          {currentUser ? (
            <NavLink to="/orders" className={linkClass}>
              Orders
            </NavLink>
          ) : null}
          {admin ? (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          ) : null}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {currentUser ? (
            <>
              <span className="max-w-[180px] truncate text-xs text-slate-500">
                {currentUser.name} · {currentUser.role}
              </span>
              <button
                className="btn-secondary"
                onClick={() => {
                  signOut()
                  navigate('/')
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn-ghost">
                Sign in
              </Link>
              <Link to="/signup" className="btn-primary">
                Start selling
              </Link>
            </>
          )}
        </div>

        <button
          className="btn-secondary md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-100 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            <NavLink to="/marketplace" className={linkClass} onClick={close}>
              Marketplace
            </NavLink>
            {currentUser ? (
              <NavLink to="/dashboard" className={linkClass} onClick={close}>
                Dashboard
              </NavLink>
            ) : null}
            {currentUser ? (
              <NavLink to="/orders" className={linkClass} onClick={close}>
                Orders
              </NavLink>
            ) : null}
            {admin ? (
              <NavLink to="/admin" className={linkClass} onClick={close}>
                Admin
              </NavLink>
            ) : null}
            {currentUser ? (
              <button
                className="btn-secondary mt-2"
                onClick={() => {
                  signOut()
                  close()
                  navigate('/')
                }}
              >
                Sign out
              </button>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link to="/signin" className="btn-secondary flex-1" onClick={close}>
                  Sign in
                </Link>
                <Link to="/signup" className="btn-primary flex-1" onClick={close}>
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
