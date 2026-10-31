import { useState } from 'react'
import { LABELS, type Card, type Column, type User } from '../types'

interface Props {
  column: Column
  cards: Card[]
  users: User[]
  onAdd: (title: string) => void
  onDelete: () => void
  onOpen: (c: Card) => void
  onDropCard: (cardId: string, index: number) => void
  indexOf: (cardId: string) => number
}

export default function ColumnView({ column, cards, users, onAdd, onDelete, onOpen, onDropCard, indexOf }: Props) {
  const [title, setTitle] = useState('')
  const [over, setOver] = useState(false)

  return (
    <section
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        onDropCard(e.dataTransfer.getData('text/plain'), Number.MAX_SAFE_INTEGER)
      }}
      className={`w-72 shrink-0 rounded-lg p-3 ${over ? 'bg-indigo-100' : 'bg-slate-200/70'}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-medium">{column.title} <span className="text-sm text-slate-500">{column.cardIds.length}</span></h2>
        <button onClick={onDelete} aria-label={`Delete ${column.title}`} className="text-slate-400 hover:text-rose-600">✕</button>
      </div>

      <ul className="min-h-4 space-y-2">
        {cards.map((c) => {
          const user = users.find((u) => u.id === c.assigneeId)
          const overdue = c.dueDate && c.dueDate < new Date().toISOString().slice(0, 10) && column.title !== 'Done'
          return (
            <li
              key={c.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', c.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setOver(false)
                onDropCard(e.dataTransfer.getData('text/plain'), indexOf(c.id))
              }}
              onClick={() => onOpen(c)}
              className="cursor-grab rounded-md bg-white p-3 shadow-sm hover:shadow active:cursor-grabbing"
            >
              {c.labels.length > 0 && (
                <div className="mb-1 flex flex-wrap gap-1">
                  {c.labels.map((l) => <span key={l} className={`rounded px-1.5 py-0.5 text-xs ${LABELS[l]}`}>{l}</span>)}
                </div>
              )}
              <p className="text-sm">{c.title}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span className={overdue ? 'font-medium text-rose-600' : ''}>{c.dueDate ? `Due ${c.dueDate}` : ''}</span>
                {user && <img src={user.image} alt={`${user.firstName} ${user.lastName}`} title={`${user.firstName} ${user.lastName}`} className="h-6 w-6 rounded-full bg-slate-200" />}
              </div>
            </li>
          )
        })}
      </ul>

      <form
        className="mt-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!title.trim()) return
          onAdd(title.trim())
          setTitle('')
        }}
      >
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task"
          className="w-full rounded border border-transparent bg-white/60 px-2 py-1.5 text-sm focus:border-indigo-400 focus:bg-white focus:outline-none" />
      </form>
    </section>
  )
}
