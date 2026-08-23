import { SignInCredentials, SignUpCredentials } from '@/shemas/auth';
import React from 'react';
import { UseFormRegister } from 'react-hook-form';

export interface InputProps {
  className?: string
  placeholder?: string
  type: string
  
  register: UseFormRegister<SignInCredentials | SignUpCredentials>
  id: "email" | "password" | "passwordConfirmation"}

const Input = ({ className, type, id, register,  }: InputProps) => {
  const baseClasses = "flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  
  // Simple class merger
  const mergedClasses = `${baseClasses} ${className || ''}`;

  return (
    <input
      {...register(`${id}`)}
      type={type}
      id={id}
      className={mergedClasses.trim()}
    />
  );
};

export default Input;
