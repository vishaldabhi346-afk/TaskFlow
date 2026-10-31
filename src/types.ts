export type LabelName = 'bug' | 'feature' | 'design' | 'urgent'
export const LABELS: Record<LabelName, string> = {
  bug: 'bg-rose-100 text-rose-700',
  feature: 'bg-emerald-100 text-emerald-700',
  design: 'bg-violet-100 text-violet-700',
  urgent: 'bg-amber-100 text-amber-800',
}

export interface User { id: number; firstName: string; lastName: string; image: string }
export interface Card {
  id: string
  title: string
  description: string
  assigneeId?: number
  labels: LabelName[]
  dueDate?: string
}
export interface Column { id: string; title: string; cardIds: string[] }
export interface Board { id: string; title: string; columns: Column[]; cards: Record<string, Card> }
