"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignUpCredentials, signUpCredentialsSchema } from "@costwise/shared/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInCredentials, signUpCredentials } from "../constants/uathFormdefaultValues";
import { authClient } from "../lib/authClient";

export interface AuthProps {
  isSignIn: boolean;
}

const useSignUp = ({ isSignIn }: AuthProps) => {
  const [authError, setAuthError] = useState<string | null>(null);

  const { register, handleSubmit, formState, reset } = useForm<SignUpCredentials>({
    defaultValues: isSignIn ? signInCredentials : signUpCredentials,
    resolver: zodResolver(signUpCredentialsSchema),
  });

  const onSubmit = async (data: SignUpCredentials) => {
    setAuthError(null);
    try {
      const { data: response, error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.email.split("@")[0],
        callbackURL: "/",
      });
      if (error) {
        setAuthError(error.message || "Failed to create account");
        return;
      }
      reset();
      return response;
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Failed to sign up. Please try again.");
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    formState,
    authError,
  };
};

export default useSignUp;