"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignInCredentials, signInCredentialsSchema } from "@costwise/shared/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInCredentials, signUpCredentials } from "../constants/uathFormdefaultValues";
import { authClient } from "../lib/authClient";

interface AuthProps {
  isSignIn: boolean;
}

const useSignIn = ({ isSignIn }: AuthProps) => {
  const [authError, setAuthError] = useState<string | null>(null);

  const { register, handleSubmit, formState } = useForm<SignInCredentials>({
    defaultValues: isSignIn ? signInCredentials : signUpCredentials,
    resolver: zodResolver(signInCredentialsSchema),
  });

  const onSubmit = async (formData: SignInCredentials) => {
    setAuthError(null);
    try {
      const { data, success, error } = signInCredentialsSchema.safeParse(formData);

      if (success) {
        const { error: signInError } = await authClient.signIn.email({
          email: data.email,
          password: data.password,
          callbackURL: "/",
        });
        if (signInError) {
          setAuthError(signInError.message || "Invalid email or password");
          return;
        }
        return;
      }

      if (error) {
        setAuthError(error.errors[0]?.message || "Invalid credentials");
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Failed to sign in. Please try again.");
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    authError,
    formState,
    errors: formState.errors,
  };
};

export default useSignIn;