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
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>OutcomeLauncher — outcome-priced work for micro-SaaS. State persists in this browser until you reset.</p>
          <p>AI agents do 60–80% of the work. Humans QA. Proof unlocks escrowed payment.</p>
        </div>
      </footer>
    </div>
  )
}
