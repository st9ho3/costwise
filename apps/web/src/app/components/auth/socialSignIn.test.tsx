import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

const social = jest.fn()

jest.mock('@/app/lib/authClient', () => ({
  authClient: {
    signIn: {
      social: (...args: unknown[]) => social(...args),
      email: jest.fn(),
    },
  },
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), refresh: jest.fn() }),
}))

import SignInForm from './signInForm'
import SignUpForm from './signUpForm'

describe('Google sign-in callbackURL', () => {
  beforeEach(() => social.mockClear())

  // The API lives on its own origin. Better Auth redirects the browser to the
  // callbackURL verbatim from the callback route, so a relative "/" resolves
  // against the API host and lands on its 404 instead of the web app.
  it.each([
    ['SignInForm', SignInForm],
    ['SignUpForm', SignUpForm],
  ])('%s sends an absolute callbackURL to the web origin', (_name, Form) => {
    render(<Form />)
    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }))

    expect(social).toHaveBeenCalledTimes(1)
    const { callbackURL } = social.mock.calls[0][0] as { callbackURL: string }
    expect(callbackURL).toMatch(/^https?:\/\//)
    expect(callbackURL.startsWith(window.location.origin)).toBe(true)
  })
})
