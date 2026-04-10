import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Message } from './Message'
import type { Message as MessageType } from '@/types'

const userMessage: MessageType = {
  id: '1',
  role: 'user',
  content: 'Hello from user',
  timestamp: 0,
}

const assistantMessage: MessageType = {
  id: '2',
  role: 'assistant',
  content: 'Hello from assistant',
  timestamp: 0,
}

describe('Message — variant user', () => {
  it('renders the message text', () => {
    render(<Message message={userMessage} />)
    expect(screen.getByText('Hello from user')).toBeInTheDocument()
  })

  it('has right-aligned layout (justify-end)', () => {
    const { container } = render(<Message message={userMessage} />)
    expect(container.querySelector('.justify-end')).toBeInTheDocument()
  })

  it('does not show the copy button', () => {
    render(<Message message={userMessage} />)
    expect(screen.queryByTitle('Копировать')).not.toBeInTheDocument()
  })
})

describe('Message — variant assistant', () => {
  it('renders the message text', () => {
    render(<Message message={assistantMessage} />)
    expect(screen.getByText('Hello from assistant')).toBeInTheDocument()
  })

  it('has left-aligned layout (justify-start)', () => {
    const { container } = render(<Message message={assistantMessage} />)
    expect(container.querySelector('.justify-start')).toBeInTheDocument()
  })

  it('shows the copy button', () => {
    render(<Message message={assistantMessage} />)
    expect(screen.getByTitle('Копировать')).toBeInTheDocument()
  })
})
