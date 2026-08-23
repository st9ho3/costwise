/**
 * - Provides initial empty credential objects for sign-in and sign-up forms.
 * - Used as default state to ensure type safety and consistent structure based on `SignInCredentials` and `SignUpCredentials` schemas.
 */
import { SignInCredentials, SignUpCredentials } from "@/shemas/auth"


export const signInCredentials: SignInCredentials = {
      email: "",
      password: ""
}
export const signUpCredentials: SignUpCredentials = {
      email: "",
      password: "",
      passwordConfirmation: ""
}