"use client";
import { useForm } from "react-hook-form";
import { SignInCredentials, signInCredentialsSchema } from "@costwise/shared/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInCredentials, signUpCredentials } from "../constants/uathFormdefaultValues";
import { authClient } from "../lib/authClient";

export interface AuthProps {
  isSignIn: boolean;
}

const useSignIn = ({ isSignIn }: AuthProps) => {
  const { register, handleSubmit } = useForm<SignInCredentials>({
    defaultValues: isSignIn ? signInCredentials : signUpCredentials,
    resolver: zodResolver(signInCredentialsSchema),
  });

  const onSubmit = async (formData: SignInCredentials) => {
    try {
      const { data, success, error } = signInCredentialsSchema.safeParse(formData);

      if (success) {
        const { error: signInError } = await authClient.signIn.email({
          email: data.email,
          password: data.password,
          callbackURL: "/",
        });
        if (signInError) {
          throw new Error(signInError.message || "Failed to sign in");
        }
        return;
      }

      if (error) {
        throw new Error(`${error}`);
      }
    } catch (err) {
      throw new Error(`${err}`);
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
  };
};

export default useSignIn;