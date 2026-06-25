import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { useHydration } from './useHydration'

function Probe() {
  const hydrated = useHydration()
  return <span>{hydrated ? 'ready' : 'loading'}</span>
}

describe('useHydration', () => {
  it('starts unhydrated and becomes ready after rehydration', async () => {
    render(<Probe />)
    await waitFor(() => expect(screen.getByText('ready')).toBeInTheDocument())
  })
})
