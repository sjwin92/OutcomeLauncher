import { nowIso, uid } from '../lib/utils'
import type { Order, Outcome, ProofReport, WorkflowLog } from './types'

export interface WorkflowStepDef {
  step: string
  start: string
  done: string
  delayMs: () => number
}

/** 1–3s per step. Realistic agent + human QA narrative. */
export function workflowStepsFor(outcome: Outcome): WorkflowStepDef[] {
  return [
    {
      step: 'Intake parse',
      start: `Reading buyer intake for “${outcome.title}” and checking required inputs.`,
      done: 'Intake mapped to a structured brief. Missing optional fields flagged, required fields present.',
      delayMs: () => 1000 + Math.round(Math.random() * 800),
    },
    {
      step: 'Agent research',
      start: 'Agents collecting source material, baselines, and constraints from the provided inputs.',
      done: 'Research pack ready: baseline metrics, constraints, and a draft outline for deliverables.',
      delayMs: () => 1200 + Math.round(Math.random() * 1000),
    },
    {
      step: 'Draft generation',
      start: 'AI agents producing first-pass deliverables (typically 60–80% of the work).',
      done: `First-pass pack generated for ${outcome.deliverables.length} deliverable${outcome.deliverables.length === 1 ? '' : 's'}.`,
      delayMs: () => 1400 + Math.round(Math.random() * 1200),
    },
    {
      step: 'Human QA',
      start: 'Human specialist reviewing success criteria, brand/voice, and SLA constraints.',
      done: 'QA passed with notes. Success definition is measurable from the delivered artifacts.',
      delayMs: () => 1100 + Math.round(Math.random() * 900),
    },
    {
      step: 'Proof compile',
      start: 'Compiling the auto-generated proof of work report.',
      done: 'Proof report attached. Ready for the seller to mark completed or request a manual fix.',
      delayMs: () => 900 + Math.round(Math.random() * 700),
    },
  ]
}

export function startLog(step: WorkflowStepDef): WorkflowLog {
  return {
    id: uid('log'),
    timestamp: nowIso(),
    step: step.step,
    message: step.start,
    status: 'running',
  }
}

export function finishLog(log: WorkflowLog, step: WorkflowStepDef): WorkflowLog {
  return {
    ...log,
    timestamp: nowIso(),
    message: step.done,
    status: 'done',
  }
}

export function generateProof(outcome: Outcome, order: Order): ProofReport {
  const intakePreview = Object.entries(order.intakeData)
    .slice(0, 2)
    .map(([key, value]) => `${key}: ${value.slice(0, 80)}`)
    .join(' · ')

  return {
    summary: `Agents completed ~70% of “${outcome.title}”; a human QA’d the pack against the published success criteria. Artifacts are ready for the buyer.`,
    whatWasDone: [
      ...outcome.deliverables.map((item) => `Delivered: ${item}`),
      `Success check: ${outcome.successCriteria}`,
    ],
    beforeAfter: [
      {
        label: 'Scope clarity',
        before: 'Buyer request as free-text intake',
        after: `Fixed-scope outcome with SLA ${outcome.slaHours}h and explicit success criteria`,
      },
      {
        label: 'Work product',
        before: intakePreview || 'No prior artifacts',
        after: outcome.deliverables.join('; '),
      },
    ],
    metrics: [
      { label: 'Agent share of work', value: '≈70%' },
      { label: 'Human QA', value: 'Passed' },
      { label: 'Base fee', value: `$${outcome.basePrice.toLocaleString()}` },
      {
        label: 'Bonus rule',
        value: outcome.bonusFormula ?? 'None on this outcome',
      },
    ],
    logs: [
      `${nowIso()} workflow finished`,
      `outcome=${outcome.id} order=${order.id}`,
      `criteria="${outcome.successCriteria.slice(0, 120)}"`,
    ],
  }
}

export function manualFixLog(): WorkflowLog {
  return {
    id: uid('log'),
    timestamp: nowIso(),
    step: 'Manual fix',
    message: 'Seller requested a manual fix. Human specialist re-opened the pack and appended QA notes.',
    status: 'done',
  }
}

export function disputeLog(): WorkflowLog {
  return {
    id: uid('log'),
    timestamp: nowIso(),
    step: 'Dispute',
    message: 'Order flagged as disputed. Platform hold placed on payout (demo).',
    status: 'error',
  }
}
