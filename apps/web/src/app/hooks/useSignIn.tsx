"use client"
/**
 * This custom React hook manages the authentication process for a Next.js application,
 * specifically for user sign-in.
 * The `useSignIn` hook provides the necessary state management and functions for a sign-in form.
 * It integrates with `react-hook-form` for efficient form handling, `zod` for robust data validation,
 * and `next-auth` for credential-based authentication. The hook handles the form submission
 * logic, validates user input, and attempts to sign the user in with the provided credentials.
 * It is designed to be used on the client side.
 */
import { useForm } from 'react-hook-form'
import { SignInCredentials, signInCredentialsSchema } from '@costwise/shared/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInCredentials, signUpCredentials } from '../constants/uathFormdefaultValues'
import { signIn } from 'next-auth/react'

export interface AuthProps {
    isSignIn: boolean
}

const useSignIn = ({ isSignIn }: AuthProps) => {

    const { register, handleSubmit } = useForm<SignInCredentials>({
        defaultValues: isSignIn ? signInCredentials : signUpCredentials,
        resolver: zodResolver(signInCredentialsSchema)
    })

    const onSubmit = async (formData: SignInCredentials) => {

        try {
            const {data, success, error} = signInCredentialsSchema.safeParse(formData)

            if (success) {
                 const user = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirectTo: "/" 
                 })
                 return user
                 
            }
           
            if (error) {

                throw new Error(`${error}`)
            }
        } catch(err) {

            throw new Error(`${err}`)
        }
    }

    return {
        register,
        handleSubmit,
        onSubmit
    }
}

export default useSignIn;