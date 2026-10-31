import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import type { Board, Card } from './types'

const KEY = 'taskflow:v1'
export const uid = () => crypto.randomUUID()

type State = { boards: Board[] }
type Action =
  | { t: 'addBoard'; title: string }
  | { t: 'delBoard'; id: string }
  | { t: 'addCol'; b: string; title: string }
  | { t: 'delCol'; b: string; c: string }
  | { t: 'addCard'; b: string; c: string; card: Card }
  | { t: 'updCard'; b: string; card: Card }
  | { t: 'delCard'; b: string; id: string }
  | { t: 'move'; b: string; id: string; to: string; index: number }

const newBoard = (title: string): Board => ({
  id: uid(),
  title,
  cards: {},
  columns: ['To do', 'In progress', 'Done'].map((t) => ({ id: uid(), title: t, cardIds: [] })),
})

function withBoard(s: State, id: string, fn: (b: Board) => Board): State {
  return { boards: s.boards.map((b) => (b.id === id ? fn(b) : b)) }
}

function reducer(s: State, a: Action): State {
  switch (a.t) {
    case 'addBoard': return { boards: [...s.boards, newBoard(a.title)] }
    case 'delBoard': return { boards: s.boards.filter((b) => b.id !== a.id) }
    case 'addCol':
      return withBoard(s, a.b, (b) => ({ ...b, columns: [...b.columns, { id: uid(), title: a.title, cardIds: [] }] }))
    case 'delCol':
      return withBoard(s, a.b, (b) => {
        const col = b.columns.find((c) => c.id === a.c)
        const cards = { ...b.cards }
        col?.cardIds.forEach((id) => delete cards[id])
        return { ...b, cards, columns: b.columns.filter((c) => c.id !== a.c) }
      })
    case 'addCard':
      return withBoard(s, a.b, (b) => ({
        ...b,
        cards: { ...b.cards, [a.card.id]: a.card },
        columns: b.columns.map((c) => (c.id === a.c ? { ...c, cardIds: [...c.cardIds, a.card.id] } : c)),
      }))
    case 'updCard':
      return withBoard(s, a.b, (b) => ({ ...b, cards: { ...b.cards, [a.card.id]: a.card } }))
    case 'delCard':
      return withBoard(s, a.b, (b) => {
        const cards = { ...b.cards }
        delete cards[a.id]
        return { ...b, cards, columns: b.columns.map((c) => ({ ...c, cardIds: c.cardIds.filter((i) => i !== a.id) })) }
      })
    case 'move':
      return withBoard(s, a.b, (b) => ({
        ...b,
        columns: b.columns.map((c) => {
          const ids = c.cardIds.filter((i) => i !== a.id)
          if (c.id === a.to) ids.splice(Math.min(a.index, ids.length), 0, a.id)
          return { ...c, cardIds: ids }
        }),
      }))
  }
}

function load(): State {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '')
    if (Array.isArray(parsed?.boards)) return parsed
  } catch { /* fall through to a fresh board */ }
  return { boards: [newBoard('My first board')] }
}

const Ctx = createContext<{ state: State; dispatch: Dispatch<Action> } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage full or blocked */ }
  }, [state])
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore must be used inside StoreProvider')
  return v
}
