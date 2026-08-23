import { render } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders its text content', () => {
    const { getByRole } = render(<Button>Save</Button>)
    expect(getByRole('button').textContent).toBe('Save')
  })

  it('applies the destructive variant classes', () => {
    const { getByRole } = render(<Button variant="destructive">Delete</Button>)
    expect(getByRole('button').className).toContain('bg-tomato-600')
  })

  it('merges a custom className', () => {
    const { getByRole } = render(<Button className="w-full">Wide</Button>)
    expect(getByRole('button').className).toContain('w-full')
  })

  it('forwards the onClick handler', () => {
    const onClick = jest.fn()
    const { getByRole } = render(<Button onClick={onClick}>Go</Button>)
    getByRole('button').click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
