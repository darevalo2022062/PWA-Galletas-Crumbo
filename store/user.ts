'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
  isLoggedIn: () => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      isLoggedIn: () => !!get().user,
    }),
    { name: 'crumbo-user' }
  )
)
