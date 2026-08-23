import { authErrorMessage } from './authErrorMessage'

describe('authErrorMessage', () => {
  it('returns null when there is no error code', () => {
    expect(authErrorMessage(undefined)).toBeNull()
    expect(authErrorMessage('')).toBeNull()
  })

  it('maps a known code to human copy', () => {
    expect(authErrorMessage('state_mismatch')).toMatch(/expired/i)
  })

  it('never leaks an unknown code back to the user', () => {
    const message = authErrorMessage('some_internal_detail_42')
    expect(message).toBeTruthy()
    expect(message).not.toContain('some_internal_detail_42')
  })
})
