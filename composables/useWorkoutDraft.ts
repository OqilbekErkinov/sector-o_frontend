/**
 * Client-only "in-progress workout" draft.
 *
 * The workout diary form (tracking.vue → workout tab) only writes to the
 * server when the user presses "Kunni saqlash", and that button is disabled
 * until every set has a real weight/rep count. So a half-entered session —
 * weights typed for two of five exercises, app backgrounded mid-set — used
 * to be lost entirely on reload.
 *
 * This stores that live form state in localStorage on every edit and hands
 * it back when the user returns *on the same calendar day*. A draft from a
 * previous day is discarded on read: yesterday's unfinished session must
 * never resurface as today's. The draft is explicitly cleared once the day
 * is saved to the server (or the day rolls over under a long-lived tab).
 *
 * Per-device by design — the scenario is "I switched apps and came back",
 * not "continue on another phone". Cross-device sync would need a server
 * model and is out of scope here.
 */

const KEY = 'sectoro_workout_draft_v1'

export interface WorkoutDraftSet {
  set_number: number
  weight_kg: number
  reps: number
}

export interface WorkoutDraftExercise {
  exercise: number | null
  name: string
  muscle_group: string
  order: number
  sets: WorkoutDraftSet[]
}

export interface WorkoutDraft {
  /** todayISO() at the moment the draft was last written. */
  date: string
  /** UserProgramDay id this session is following, if any. */
  programDayId: number | null
  /** Set when the draft is unsaved edits on top of an already-saved log,
   *  so the eventual save PATCHes that log instead of creating a duplicate. */
  editingLogId: number | null
  exercises: WorkoutDraftExercise[]
}

export const useWorkoutDraft = () => {
  const read = (): WorkoutDraft | null => {
    if (!import.meta.client) return null
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? (JSON.parse(raw) as WorkoutDraft) : null
    } catch {
      return null
    }
  }

  /** Returns the stored draft only if it belongs to `today`; a stale
   *  (earlier-day) draft is dropped so it can never be restored. */
  const readForToday = (today: string): WorkoutDraft | null => {
    const draft = read()
    if (!draft) return null
    if (draft.date !== today) {
      clear()
      return null
    }
    return draft
  }

  const save = (draft: WorkoutDraft) => {
    if (!import.meta.client) return
    try {
      localStorage.setItem(KEY, JSON.stringify(draft))
    } catch {
      /* private mode / quota — silently fall back to no-draft behaviour */
    }
  }

  const clear = () => {
    if (!import.meta.client) return
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
  }

  return { readForToday, save, clear }
}
