import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Avatar } from './avatar'

describe('Avatar', () => {
  it('renders initials when no src is provided', () => {
    const { container } = render(<Avatar name="John Doe" />)
    expect(container.textContent).toBe('JD')
  })

  it('renders img with referrerPolicy="no-referrer" when src is provided', () => {
    const { container } = render(<Avatar name="Google User" src="https://lh3.googleusercontent.com/a/test-pic" />)
    const img = container.querySelector('img')
    expect(img).toBeTruthy()
    expect(img?.getAttribute('referrerpolicy')).toBe('no-referrer')
    expect(img?.getAttribute('src')).toBe('https://lh3.googleusercontent.com/a/test-pic')
  })

  it('falls back to initials when image errors out', () => {
    const { container } = render(<Avatar name="Google User" src="https://lh3.googleusercontent.com/a/test-pic" />)
    const img = container.querySelector('img')!
    expect(img).toBeTruthy()

    fireEvent.error(img)

    expect(container.querySelector('img')).toBeNull()
    expect(container.textContent).toBe('GU')
  })
})
