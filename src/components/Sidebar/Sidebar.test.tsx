import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from './Sidebar'
import { useChatStore } from '@/store/chatStore'

beforeEach(() => {
  localStorage.clear()
  useChatStore.setState({
    chats: [
      { id: '1', title: 'React hooks', messages: [], createdAt: 0, updatedAt: 0 },
      { id: '2', title: 'TypeScript tips', messages: [], createdAt: 0, updatedAt: 0 },
      { id: '3', title: 'Zustand store', messages: [], createdAt: 0, updatedAt: 0 },
    ],
    currentChatId: null,
    searchQuery: '',
    isLoading: false,
    abortController: null,
  })
})

describe('Sidebar — search', () => {
  it('shows all chats when query is empty', () => {
    render(<Sidebar />)
    expect(screen.getAllByText('React hooks').length).toBeGreaterThan(0)
    expect(screen.getAllByText('TypeScript tips').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Zustand store').length).toBeGreaterThan(0)
  })

  it('filters chats by search query in real time', async () => {
    const user = userEvent.setup()
    render(<Sidebar />)
    await user.type(screen.getByPlaceholderText('Поиск по чатам...'), 'React')
    expect(screen.getAllByText('React hooks').length).toBeGreaterThan(0)
    expect(screen.queryByText('TypeScript tips')).not.toBeInTheDocument()
    expect(screen.queryByText('Zustand store')).not.toBeInTheDocument()
  })

  it('shows all chats again when search is cleared', async () => {
    const user = userEvent.setup()
    render(<Sidebar />)
    const input = screen.getByPlaceholderText('Поиск по чатам...')
    await user.type(input, 'React')
    await user.clear(input)
    expect(screen.getAllByText('TypeScript tips').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Zustand store').length).toBeGreaterThan(0)
  })
})

describe('Sidebar — delete confirmation', () => {
  it('shows confirmation buttons after clicking Delete', async () => {
    const user = userEvent.setup()
    render(<Sidebar />)
    const deleteButtons = screen.getAllByTitle('Удалить')
    await user.click(deleteButtons[0])
    expect(screen.getByText('Да')).toBeInTheDocument()
    expect(screen.getByText('Нет')).toBeInTheDocument()
  })

  it('removes the chat when deletion is confirmed', async () => {
    const user = userEvent.setup()
    render(<Sidebar />)
    // Click delete on the first chat item (React hooks)
    const sidebar = screen.getAllByRole('complementary')[0]
    const deleteBtn = within(sidebar).getAllByTitle('Удалить')[0]
    await user.click(deleteBtn)
    await user.click(screen.getByText('Да'))
    expect(useChatStore.getState().chats).toHaveLength(2)
  })

  it('hides confirmation without deleting when cancelled', async () => {
    const user = userEvent.setup()
    render(<Sidebar />)
    const deleteButtons = screen.getAllByTitle('Удалить')
    await user.click(deleteButtons[0])
    await user.click(screen.getByText('Нет'))
    expect(screen.queryByText('Да')).not.toBeInTheDocument()
    expect(useChatStore.getState().chats).toHaveLength(3)
  })
})
