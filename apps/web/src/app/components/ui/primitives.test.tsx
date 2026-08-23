import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import '@testing-library/jest-dom'
import { Input } from './input'
import { MoneyInput } from './moneyInput'
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

  it('Input safely converts NaN defaultValue to empty string to prevent React warning', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    const { container } = render(<Input defaultValue={NaN} />)
    const input = container.querySelector('input')!
    expect(input.value).toBe('')
    expect(consoleError).not.toHaveBeenCalled()
    consoleError.mockRestore()
  })

  it('MoneyInput safely converts NaN defaultValue to empty string to prevent React warning', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    const { container } = render(<MoneyInput defaultValue={NaN} />)
    const input = container.querySelector('input')!
    expect(input.value).toBe('')
    expect(consoleError).not.toHaveBeenCalled()
    consoleError.mockRestore()
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

  it('controlled Select returns to the placeholder when its value is cleared', () => {
    const opts = [{ value: 'feta', label: 'Feta (€12.50/kg)' }]
    const { rerender } = render(
      <Select label="Ingredient" placeholder="Pick an ingredient" value="feta" onValueChange={() => {}} options={opts} />
    )
    expect(screen.getByText('Feta (€12.50/kg)')).toBeTruthy()
    rerender(
      <Select label="Ingredient" placeholder="Pick an ingredient" value="" onValueChange={() => {}} options={opts} />
    )
    expect(screen.getByText('Pick an ingredient')).toBeTruthy()
    expect(screen.queryByText('Feta (€12.50/kg)')).toBeNull()
  })

  it('controlled Select clears after a real UI selection when value resets to ""', async () => {
    // radix select needs these DOM APIs that jsdom lacks
    window.HTMLElement.prototype.scrollIntoView = jest.fn()
    window.HTMLElement.prototype.hasPointerCapture = jest.fn()
    window.HTMLElement.prototype.releasePointerCapture = jest.fn()
    class MockPointerEvent extends MouseEvent {
      pointerId: number
      pointerType: string
      constructor(type: string, props: PointerEventInit = {}) {
        super(type, props)
        this.pointerId = props.pointerId ?? 1
        this.pointerType = props.pointerType ?? 'mouse'
      }
    }
    window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent

    const Harness = () => {
      const [val, setVal] = useState('')
      return (
        <>
          <Select
            label="Ingredient"
            placeholder="Pick an ingredient"
            value={val}
            onValueChange={setVal}
            options={[{ value: 'feta', label: 'Feta' }]}
          />
          <button onClick={() => setVal('')}>clear</button>
        </>
      )
    }
    render(<Harness />)

    const trigger = screen.getByRole('combobox')
    fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false, pointerId: 1 })
    const item = await screen.findByRole('option', { name: 'Feta' })
    fireEvent.pointerUp(item)
    fireEvent.click(item)
    // selection took: the placeholder is no longer rendered in the trigger
    // (jsdom can't reflect the chosen label after a remount, so assert on the
    // placeholder; re-query — clearing remounts the trigger node)
    expect(screen.getByRole('combobox').textContent).not.toContain('Pick an ingredient')

    fireEvent.click(screen.getByText('clear'))
    const clearedTrigger = screen.getByRole('combobox')
    expect(clearedTrigger.textContent).toContain('Pick an ingredient')
    expect(clearedTrigger.textContent).not.toContain('Feta')
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
