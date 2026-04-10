import { describe, it, expect } from 'vitest'
import { chatReducer } from './chatReducer'
import type { ChatState } from './chatReducer'

const emptyState: ChatState = {
  chats: [],
  activeChatId: null,
}

describe('CREATE_CHAT', () => {
  it('adds a new chat to the array', () => {
    const next = chatReducer(emptyState, { type: 'CREATE_CHAT' })
    expect(next.chats).toHaveLength(1)
  })

  it('new chat appears in the array with unique id', () => {
    const s1 = chatReducer(emptyState, { type: 'CREATE_CHAT' })
    const s2 = chatReducer(s1, { type: 'CREATE_CHAT' })
    expect(s2.chats).toHaveLength(2)
    expect(s2.chats[0].id).not.toBe(s2.chats[1].id)
  })

  it('sets activeChatId to the new chat id', () => {
    const next = chatReducer(emptyState, { type: 'CREATE_CHAT' })
    expect(next.activeChatId).toBe(next.chats[0].id)
  })

  it('prepends new chat to the beginning of the array', () => {
    const s1 = chatReducer(emptyState, { type: 'CREATE_CHAT' })
    const firstId = s1.chats[0].id
    const s2 = chatReducer(s1, { type: 'CREATE_CHAT' })
    expect(s2.chats[1].id).toBe(firstId)
  })
})

describe('ADD_MESSAGE', () => {
  it('increases messages count by 1', () => {
    const s1 = chatReducer(emptyState, { type: 'CREATE_CHAT' })
    const chatId = s1.chats[0].id
    const s2 = chatReducer(s1, {
      type: 'ADD_MESSAGE',
      chatId,
      message: { role: 'user', content: 'Hello' },
    })
    expect(s2.chats[0].messages).toHaveLength(1)
  })

  it('new message is appended to the end', () => {
    const s1 = chatReducer(emptyState, { type: 'CREATE_CHAT' })
    const chatId = s1.chats[0].id
    const s2 = chatReducer(s1, {
      type: 'ADD_MESSAGE',
      chatId,
      message: { role: 'user', content: 'First' },
    })
    const s3 = chatReducer(s2, {
      type: 'ADD_MESSAGE',
      chatId,
      message: { role: 'assistant', content: 'Second' },
    })
    const messages = s3.chats[0].messages
    expect(messages[messages.length - 1].content).toBe('Second')
  })

  it('does not affect other chats', () => {
    const s1 = chatReducer(emptyState, { type: 'CREATE_CHAT' })
    const s2 = chatReducer(s1, { type: 'CREATE_CHAT' })
    const targetId = s2.chats[1].id // second chat
    const s3 = chatReducer(s2, {
      type: 'ADD_MESSAGE',
      chatId: targetId,
      message: { role: 'user', content: 'Hi' },
    })
    expect(s3.chats[0].messages).toHaveLength(0)
    expect(s3.chats[1].messages).toHaveLength(1)
  })
})

describe('DELETE_CHAT', () => {
  it('removes the chat from the array', () => {
    const s1 = chatReducer(emptyState, { type: 'CREATE_CHAT' })
    const id = s1.chats[0].id
    const s2 = chatReducer(s1, { type: 'DELETE_CHAT', id })
    expect(s2.chats.find((c) => c.id === id)).toBeUndefined()
  })

  it('resets activeChatId to null when active chat is deleted and no chats remain', () => {
    const s1 = chatReducer(emptyState, { type: 'CREATE_CHAT' })
    const id = s1.chats[0].id
    const s2 = chatReducer(s1, { type: 'DELETE_CHAT', id })
    expect(s2.activeChatId).toBeNull()
  })

  it('switches activeChatId to the next chat when active chat is deleted', () => {
    const s1 = chatReducer(emptyState, { type: 'CREATE_CHAT' })
    const s2 = chatReducer(s1, { type: 'CREATE_CHAT' })
    const activeId = s2.activeChatId!
    const otherId = s2.chats.find((c) => c.id !== activeId)!.id
    const s3 = chatReducer(s2, { type: 'DELETE_CHAT', id: activeId })
    expect(s3.activeChatId).toBe(otherId)
  })

  it('keeps activeChatId unchanged when a non-active chat is deleted', () => {
    const s1 = chatReducer(emptyState, { type: 'CREATE_CHAT' })
    const s2 = chatReducer(s1, { type: 'CREATE_CHAT' })
    const activeId = s2.activeChatId!
    const otherId = s2.chats.find((c) => c.id !== activeId)!.id
    const s3 = chatReducer(s2, { type: 'DELETE_CHAT', id: otherId })
    expect(s3.activeChatId).toBe(activeId)
  })
})

describe('RENAME_CHAT', () => {
  it('correctly updates the title by id', () => {
    const s1 = chatReducer(emptyState, { type: 'CREATE_CHAT' })
    const id = s1.chats[0].id
    const s2 = chatReducer(s1, { type: 'RENAME_CHAT', id, title: 'Renamed' })
    expect(s2.chats[0].title).toBe('Renamed')
  })

  it('does not affect other chats', () => {
    const s1 = chatReducer(emptyState, { type: 'CREATE_CHAT' })
    const s2 = chatReducer(s1, { type: 'CREATE_CHAT' })
    const targetId = s2.chats[0].id
    const otherId = s2.chats[1].id
    const s3 = chatReducer(s2, { type: 'RENAME_CHAT', id: targetId, title: 'New name' })
    expect(s3.chats.find((c) => c.id === otherId)!.title).toBe('Новый чат')
  })
})
