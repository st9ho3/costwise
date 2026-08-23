"use client";
import { useForm } from "react-hook-form";
import { SignUpCredentials, signUpCredentialsSchema } from "@costwise/shared/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInCredentials, signUpCredentials } from "../constants/uathFormdefaultValues";
import { authClient } from "../lib/authClient";

export interface AuthProps {
  isSignIn: boolean;
}

const useSignUp = ({ isSignIn }: AuthProps) => {
  const { register, handleSubmit, formState, reset } = useForm<SignUpCredentials>({
    defaultValues: isSignIn ? signInCredentials : signUpCredentials,
    resolver: zodResolver(signUpCredentialsSchema),
  });

  const onSubmit = async (data: SignUpCredentials) => {
    const { data: response, error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.email.split("@")[0],
      callbackURL: "/",
    });
    if (error) {
      throw new Error(error.message || "Failed to sign up");
    }
    reset();
    return response;
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    formState,
  };
};

export default useSignUp;