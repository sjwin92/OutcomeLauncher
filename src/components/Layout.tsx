import { Outlet } from 'react-router-dom'
import { Nav } from './Nav'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>OutcomeLauncher — Fiverr for outcome-priced AI work. In-browser demo; data resets on reload.</p>
          <p>AI agents do 60–80% of the work. Humans QA. Proof is auto-generated.</p>
        </div>
      </footer>
    </div>
  )
}
