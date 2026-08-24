/**
 * Human-readable copy for the `?error=` codes Better Auth appends when it
 * redirects a failed OAuth attempt back to the app.
 *
 * Unknown codes fall through to a generic message on purpose: the raw code is
 * an internal detail and should never be rendered to the user.
 */
const MESSAGES: Record<string, string> = {
  state_mismatch:
    "That sign-in link expired before we could use it. Please try again.",
  state_not_found:
    "That sign-in link expired before we could use it. Please try again.",
  invalid_callback_request:
    "Something went wrong finishing that sign-in. Please try again.",
  access_denied: "Sign-in was cancelled.",
  unable_to_create_user:
    "We could not set up your account. Please try again, or use email and password.",
  account_not_linked:
    "That email is already registered with a different sign-in method. Try signing in with your password.",
};

export const authErrorMessage = (code: string | undefined): string | null => {
  if (!code) return null;
  return MESSAGES[code] ?? "Sign-in did not go through. Please try again.";
};
