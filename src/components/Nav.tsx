import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../data/store'
import { isAdminEmail } from '../lib/utils'

export function Nav() {
  const { currentUser, signOut } = useStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuClosing, setMenuClosing] = useState(false)
  const admin = currentUser && isAdminEmail(currentUser.email)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium ${
      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  const close = () => setOpen(false)

  function closeMenu() {
    setMenuOpen(false)
    setMenuClosing(true)
    const ms = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dropdown-close-dur')) || 150
    window.setTimeout(() => setMenuClosing(false), ms)
  }

  useEffect(() => {
    if (!menuOpen) return
    const onDoc = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) return
      if (!(event.target as HTMLElement).closest('[data-user-menu]')) closeMenu()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-2" onClick={close}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-emerald-50">
            OL
          </span>
          <span className="truncate text-sm font-bold tracking-tight text-slate-900 sm:text-base">
            OutcomeLauncher
          </span>
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
            <div className="relative" data-user-menu>
              <button
                className="btn-secondary"
                aria-expanded={menuOpen}
                onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
              >
                {currentUser.name}
              </button>
              {(menuOpen || menuClosing) && (
                <div
                  className={`t-dropdown card p-2 ${menuOpen ? 'is-open' : ''} ${menuClosing ? 'is-closing' : ''}`}
                  data-origin="top-right"
                >
                  <p className="px-3 py-2 text-xs text-slate-500">
                    {currentUser.email} · {currentUser.role}
                  </p>
                  <Link to="/dashboard" className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50" onClick={closeMenu}>
                    Dashboard
                  </Link>
                  <button
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                    onClick={() => {
                      signOut()
                      closeMenu()
                      navigate('/')
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signin" className="btn-ghost">
                Sign in
              </Link>
              <Link to="/signup?role=seller" className="btn-primary">
                Start selling
              </Link>
            </>
          )}
        </div>

        <button
          className="btn-secondary shrink-0 px-3 py-2 md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>

      <div className="overflow-hidden md:hidden">
        <div className="t-panel-slide border-t border-slate-100 px-4 py-3" data-open={open ? 'true' : 'false'}>
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
      </div>
    </header>
  )
}
