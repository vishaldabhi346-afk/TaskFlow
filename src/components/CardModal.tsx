import { useState } from 'react'
import { LABELS, type Card, type LabelName, type User } from '../types'

interface Props {
  card: Card
  users: User[]
  onSave: (c: Card) => void
  onDelete: () => void
  onClose: () => void
}

export default function CardModal({ card, users, onSave, onDelete, onClose }: Props) {
  const [draft, setDraft] = useState(card)
  const toggle = (l: LabelName) =>
    setDraft((d) => ({ ...d, labels: d.labels.includes(l) ? d.labels.filter((x) => x !== l) : [...d.labels, l] }))

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); if (draft.title.trim()) onSave({ ...draft, title: draft.title.trim() }) }}
        className="w-full max-w-md space-y-3 rounded-lg bg-white p-5 shadow-xl"
      >
        <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          className="w-full rounded border border-slate-300 px-3 py-2 font-medium" aria-label="Title" />
        <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          rows={3} placeholder="Description" className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
        <div className="flex gap-2">
          <select value={draft.assigneeId ?? ''} aria-label="Assignee"
            onChange={(e) => setDraft({ ...draft, assigneeId: e.target.value ? Number(e.target.value) : undefined })}
            className="flex-1 rounded border border-slate-300 px-2 py-2 text-sm">
            <option value="">Unassigned</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
          </select>
          <input type="date" value={draft.dueDate ?? ''} aria-label="Due date"
            onChange={(e) => setDraft({ ...draft, dueDate: e.target.value || undefined })}
            className="rounded border border-slate-300 px-2 py-2 text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(LABELS) as LabelName[]).map((l) => (
            <button type="button" key={l} onClick={() => toggle(l)} aria-pressed={draft.labels.includes(l)}
              className={`rounded px-2 py-1 text-xs ${draft.labels.includes(l) ? LABELS[l] + ' ring-2 ring-current' : 'bg-slate-100 text-slate-600'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex justify-between pt-2">
          <button type="button" onClick={onDelete} className="text-sm text-rose-600 hover:underline">Delete task</button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">Cancel</button>
            <button className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700">Save task</button>
          </div>
        </div>
      </form>
    </div>
  )
}
