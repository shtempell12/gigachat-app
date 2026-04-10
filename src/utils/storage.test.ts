import { describe, it, expect, beforeEach } from 'vitest'
import { loadChats, saveChats } from './storage'
import type { Chat } from '@/types'

const STORAGE_KEY = 'gigachat_chats'

const makeChat = (id: string, title: string): Chat => ({
  id,
  title,
  messages: [],
  createdAt: 0,
  updatedAt: 0,
})

beforeEach(() => {
  localStorage.clear()
})

describe('saveChats', () => {
  it('saves data to localStorage', () => {
    const chats = [makeChat('1', 'Test')]
    saveChats(chats)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(chats))
  })
})

describe('loadChats', () => {
  it('returns empty array when localStorage is empty', () => {
    expect(loadChats()).toEqual([])
  })

  it('correctly restores chats from localStorage', () => {
    const chats = [makeChat('1', 'Test'), makeChat('2', 'Another')]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
    expect(loadChats()).toEqual(chats)
  })

  it('returns empty array on invalid JSON without crashing', () => {
    localStorage.setItem(STORAGE_KEY, '{{invalid json}}')
    expect(loadChats()).toEqual([])
  })
})
