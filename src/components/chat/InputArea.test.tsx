import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputArea } from './InputArea'

const mockSend = vi.fn()

vi.mock('@/hooks/useChat', () => ({
  useChat: () => ({ send: mockSend }),
}))

vi.mock('@/store/chatStore', () => ({
  useChatStore: () => ({
    isLoading: false,
    stopGeneration: vi.fn(),
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  mockSend.mockResolvedValue(undefined)
})

describe('InputArea', () => {
  it('Send button is disabled when input is empty', () => {
    render(<InputArea />)
    expect(screen.getByTitle('Отправить (Enter)')).toBeDisabled()
  })

  it('Send button becomes enabled after typing', async () => {
    const user = userEvent.setup()
    render(<InputArea />)
    await user.type(screen.getByPlaceholderText('Напишите сообщение...'), 'Hello')
    expect(screen.getByTitle('Отправить (Enter)')).toBeEnabled()
  })

  it('calls send with message text when Send button is clicked', async () => {
    const user = userEvent.setup()
    render(<InputArea />)
    await user.type(screen.getByPlaceholderText('Напишите сообщение...'), 'Привет')
    await user.click(screen.getByTitle('Отправить (Enter)'))
    expect(mockSend).toHaveBeenCalledWith('Привет', undefined)
  })

  it('calls send when Enter is pressed', async () => {
    const user = userEvent.setup()
    render(<InputArea />)
    await user.type(screen.getByPlaceholderText('Напишите сообщение...'), 'Привет{Enter}')
    expect(mockSend).toHaveBeenCalledWith('Привет', undefined)
  })

  it('clears input after sending', async () => {
    const user = userEvent.setup()
    render(<InputArea />)
    const textarea = screen.getByPlaceholderText('Напишите сообщение...')
    await user.type(textarea, 'Hello{Enter}')
    expect(textarea).toHaveValue('')
  })

  it('does not call send when input is whitespace only', async () => {
    const user = userEvent.setup()
    render(<InputArea />)
    await user.type(screen.getByPlaceholderText('Напишите сообщение...'), '   {Enter}')
    expect(mockSend).not.toHaveBeenCalled()
  })
})
