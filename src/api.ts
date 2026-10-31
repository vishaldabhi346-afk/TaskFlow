import { useEffect, useState } from 'react'
import type { User } from './types'

let cache: User[] | null = null

export async function fetchUsers(): Promise<User[]> {
  if (cache) return cache
  const res = await fetch('/public/user.json')
  if (!res.ok) throw new Error(`Could not load users (${res.status})`)
  cache = (await res.json()) as User[]
  return cache
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>(cache ?? [])
  const [error, setError] = useState('')
  useEffect(() => {
    if (cache) return
    fetchUsers().then(setUsers).catch((e: Error) => setError(e.message))
  }, [])
  return { users, error }
}
