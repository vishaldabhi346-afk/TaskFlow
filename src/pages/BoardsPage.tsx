import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'

export default function BoardsPage() {
  const { state, dispatch } = useStore()
  const [title, setTitle] = useState('')
  console.log(state.boards);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-2xl font-semibold">Your boards</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {state.boards.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
            <Link to={`/board/${b.id}`} className="font-medium text-indigo-700 hover:underline">
              {b.title}
              <span className="ml-2 text-sm font-normal text-slate-500">{Object.keys(b.cards).length} tasks</span>
            </Link>
            <button
              onClick={() => confirm(`Delete "${b.title}"?`) && dispatch({ t: 'delBoard', id: b.id })}
              className="text-sm text-slate-500 hover:text-rose-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {state.boards.length === 0 && <p className="text-slate-500">No boards yet. Create one below.</p>}
      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!title.trim()) return
          dispatch({ t: 'addBoard', title: title.trim() })
          setTitle('')
        }}
      >
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Board name"
          className="flex-1 rounded border border-slate-300 px-3 py-2" />
        <button className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Create board</button>
      </form>
    </div>
  )
}
