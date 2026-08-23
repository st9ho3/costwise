import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Input } from './input'
import { Label } from './label'
import { Badge } from './badge'
import { Card, CardTitle } from './card'
import { Select, NativeSelect } from './select'
import { Skeleton } from './skeleton'
import { IngredientsPageSkeleton } from '../ingredients/ingredientsSkeleton'
import { RecipesPageSkeleton } from '../recipes/recipesSkeleton'
import { SuppliersPageSkeleton } from '../suppliers/suppliersSkeleton'
import { TodayViewSkeleton } from '../home/todaySkeleton'

describe('primitives', () => {
  it('Input forwards className and renders an input', () => {
    const { container } = render(<Input className="custom-in" placeholder="x" />)
    const input = container.querySelector('input')!
    expect(input).toBeTruthy()
    expect(input.className).toContain('custom-in')
  })

  it('Label renders mono uppercase styling', () => {
    const { container } = render(<Label overline>Name</Label>)
    const label = container.querySelector('label')!
    expect(label.className).toContain('uppercase')
    expect(label.textContent).toBe('Name')
  })

  it('Badge applies the success variant', () => {
    const { container } = render(<Badge variant="success">Active</Badge>)
    expect(container.firstChild!.textContent).toBe('Active')
    expect((container.firstChild as HTMLElement).className).toContain('bg-green-100')
  })

  it('Card renders title text', () => {
    const { container } = render(<Card><CardTitle>Hello</CardTitle></Card>)
    expect(container.textContent).toContain('Hello')
  })

  it('Select renders trigger with placeholder and label', () => {
    render(
      <Select
        label="Course category"
        placeholder="Pick a course"
        options={[
          { value: 'starter', label: 'Starter' },
          { value: 'main', label: 'Main course' },
        ]}
      />
    )
    expect(screen.getByText('Course category')).toBeTruthy()
    expect(screen.getByText('Pick a course')).toBeTruthy()
  })

  it('Select renders with defaultValue', () => {
    render(
      <Select
        label="Unit"
        defaultValue="kg"
        options={[
          { value: 'kg', label: 'Kilos (kg)' },
          { value: 'g', label: 'Grams (g)' },
        ]}
      />
    )
    expect(screen.getByText('Kilos (kg)')).toBeTruthy()
  })

  it('Select renders error message when error prop is provided', () => {
    render(
      <Select
        label="Unit"
        error="Unit is required"
        options={[{ value: 'kg', label: 'Kilos' }]}
      />
    )
    expect(screen.getByText('Unit is required')).toBeTruthy()
  })

  it('NativeSelect alias renders popup Select without errors', () => {
    render(
      <NativeSelect
        label="Supplier"
        placeholder="Choose supplier"
        options={[{ value: 'sup1', label: 'Metro' }]}
      />
    )
    expect(screen.getByText('Supplier')).toBeTruthy()
    expect(screen.getByText('Choose supplier')).toBeTruthy()
  })

  it('Skeleton renders with animate-pulse and circle variant', () => {
    const { container } = render(<Skeleton circle className="size-8" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('animate-pulse')
    expect(el.className).toContain('rounded-full')
    expect(el.className).toContain('size-8')
  })

  it('IngredientsPageSkeleton renders without crashing', () => {
    const { container } = render(<IngredientsPageSkeleton />)
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(10)
  })

  it('RecipesPageSkeleton renders without crashing', () => {
    const { container } = render(<RecipesPageSkeleton />)
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(10)
  })

  it('SuppliersPageSkeleton renders without crashing', () => {
    const { container } = render(<SuppliersPageSkeleton />)
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(10)
  })

  it('TodayViewSkeleton renders without crashing', () => {
    const { container } = render(<TodayViewSkeleton />)
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(10)
  })
})
