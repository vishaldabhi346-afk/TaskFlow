import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useStore } from '../store'
import { useUsers } from '../api'
import { LABELS, type Card, type LabelName } from '../types'
import ColumnView from '../components/ColumnView'
import CardModal from '../components/CardModal'

export default function BoardPage() {
  const { id } = useParams()
  const { state, dispatch } = useStore()
  const { users, error } = useUsers()
  const [q, setQ] = useState('')
  const [label, setLabel] = useState('')
  const [assignee, setAssignee] = useState('')
  const [colTitle, setColTitle] = useState('')
  const [editing, setEditing] = useState<Card | null>(null)

  const board = state.boards.find((b) => b.id === id)
  if (!board) return <Navigate to="/" replace />

  const matches = (c: Card) =>
    c.title.toLowerCase().includes(q.toLowerCase()) &&
    (!label || c.labels.includes(label as LabelName)) &&
    (!assignee || c.assigneeId === Number(assignee))

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link to="/" className="text-sm text-indigo-600 hover:underline">All boards</Link>
        <h1 className="mr-auto text-xl font-semibold">{board.title}</h1>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks"
          className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm" />
        <select value={label} onChange={(e) => setLabel(e.target.value)} className="rounded border border-slate-300 bg-white px-2 py-1.5 text-sm">
          <option value="">All labels</option>
          {Object.keys(LABELS).map((l) => <option key={l}>{l}</option>)}
        </select>
        <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="rounded border border-slate-300 bg-white px-2 py-1.5 text-sm">
          <option value="">Anyone</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
        </select>
      </div>
      {error && <p className="mb-3 rounded bg-amber-50 p-2 text-sm text-amber-800">{error}. Assignee names are unavailable until you are back online.</p>}

      <div className="flex items-start gap-4 overflow-x-auto pb-4">
        {board.columns.map((col) => (
          <ColumnView
            key={col.id}
            column={col}
            cards={col.cardIds.map((cid) => board.cards[cid]).filter(matches)}
            users={users}
            onAdd={(title) =>
              dispatch({ t: 'addCard', b: board.id, c: col.id, card: { id: crypto.randomUUID(), title, description: '', labels: [] } })
            }
            onDelete={() => confirm(`Delete "${col.title}" and its tasks?`) && dispatch({ t: 'delCol', b: board.id, c: col.id })}
            onOpen={setEditing}
            onDropCard={(cardId, index) => dispatch({ t: 'move', b: board.id, id: cardId, to: col.id, index })}
            indexOf={(cardId) => col.cardIds.indexOf(cardId)}
          />
        ))}
        <form
          className="w-72 shrink-0 rounded-lg bg-slate-200/70 p-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (!colTitle.trim()) return
            dispatch({ t: 'addCol', b: board.id, title: colTitle.trim() })
            setColTitle('')
          }}
        >
          <input value={colTitle} onChange={(e) => setColTitle(e.target.value)} placeholder="New column name"
            className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm" />
        </form>
      </div>

      {editing && (
        <CardModal
          card={editing}
          users={users}
          onClose={() => setEditing(null)}
          onSave={(card) => { dispatch({ t: 'updCard', b: board.id, card }); setEditing(null) }}
          onDelete={() => { dispatch({ t: 'delCard', b: board.id, id: editing.id }); setEditing(null) }}
        />
      )}
    </div>
  )
}
