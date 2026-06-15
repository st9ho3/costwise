import { render } from '@testing-library/react'
import { Input } from './input'
import { Label } from './label'
import { Badge } from './badge'
import { Card, CardTitle } from './card'

describe('primitives', () => {
  it('Input forwards className and renders an input', () => {
    const { container } = render(<Input className="custom-in" placeholder="x" />)
    const input = container.querySelector('input')!
    expect(input).toBeTruthy()
    expect(input.className).toContain('custom-in')
  })

  it('Label renders mono uppercase styling', () => {
    const { container } = render(<Label>Name</Label>)
    const label = container.querySelector('label')!
    expect(label.className).toContain('uppercase')
    expect(label.textContent).toBe('Name')
  })

  it('Badge applies the success variant', () => {
    const { container } = render(<Badge variant="success">Active</Badge>)
    expect(container.firstChild!.textContent).toBe('Active')
    expect((container.firstChild as HTMLElement).className).toContain('bg-success')
  })

  it('Card renders title text', () => {
    const { container } = render(<Card><CardTitle>Hello</CardTitle></Card>)
    expect(container.textContent).toContain('Hello')
  })
})
