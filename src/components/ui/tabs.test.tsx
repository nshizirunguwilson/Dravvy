import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

function Example() {
  return (
    <Tabs defaultValue="a">
      <TabsList>
        <TabsTrigger value="a">Tab A</TabsTrigger>
        <TabsTrigger value="b">Tab B</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Panel A</TabsContent>
      <TabsContent value="b">Panel B</TabsContent>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('shows the default tab content', () => {
    render(<Example />)
    expect(screen.getByText('Panel A')).toBeVisible()
    expect(screen.queryByText('Panel B')).not.toBeInTheDocument()
  })

  it('switches content when another tab is selected', async () => {
    render(<Example />)
    await userEvent.click(screen.getByRole('tab', { name: 'Tab B' }))
    expect(screen.getByText('Panel B')).toBeVisible()
    expect(screen.queryByText('Panel A')).not.toBeInTheDocument()
  })
})
