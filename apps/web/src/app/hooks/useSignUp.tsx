/**
 * This custom React hook manages the user sign-up process for a Next.js application.
 * The `useSignUp` hook handles the state and logic for a user registration form. It uses
 * `react-hook-form` for form management, `zod` for validation against the `signUpCredentialsSchema`,
 * and facilitates communication with a backend API endpoint (`/api/auth/signup`) to create a new user.
 * The hook also includes an `onSubmit` function that sends the validated form data to the server
 * and handles the response.
 */
import { useForm } from 'react-hook-form'
import { SignUpCredentials, signUpCredentialsSchema } from '@/shemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInCredentials, signUpCredentials } from '../constants/uathFormdefaultValues'

export interface AuthProps {
    isSignIn: boolean
}
const useSignUp = ({ isSignIn }: AuthProps) => {

    const { register, handleSubmit, formState,  reset } = useForm<SignUpCredentials>({
        defaultValues: isSignIn ? signInCredentials : signUpCredentials,
        resolver: zodResolver(signUpCredentialsSchema)
    })
    const onSubmit = async (data: SignUpCredentials) => {
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        if (!res.ok) {
            throw new Error("Res s not ok")
        }
       const response = await res.json()
       reset()
       return response
       
    }

    return {
        register,
        handleSubmit,
        onSubmit,
        formState
        
    }
}

export default useSignUp;