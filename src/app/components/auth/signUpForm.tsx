"use client"

import { Button } from '@/app/constants/components'
import useSignUp from '@/app/hooks/useSignUp';
import Link from 'next/link';
import { Mail, LockKeyhole, ShieldCheck } from 'lucide-react';

const SignUpForm = () => {
  const { register, handleSubmit, onSubmit } = useSignUp({ isSignIn: false });

  return (
    // CARD CONTAINER:
    // Matches the SignInForm: Rounded-2xl (Large shape), High Shadow, Spacious
    <div className="w-full max-w-md p-8 bg-white rounded-[28px] shadow-xl border border-gray-100">
      
      {/* Header */}
      <div className="flex flex-col text-center mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Get Started
        </h1>
        <p className="text-sm text-gray-500">
          Create a free account to start tracking your inventory.
        </p>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          
          {/* EMAIL INPUT */}
          <div className="space-y-1.5">
            <label 
              htmlFor="email" 
              className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1"
            >
              Email Address
            </label>
            <div className={`
              flex items-center w-full px-4 h-12
              bg-white border border-gray-200 rounded-xl
              transition-all duration-200 ease-in-out
              focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10
            `}>
              <Mail className="text-gray-400 mr-3 shrink-0" size={20} strokeWidth={2} />
              <input 
                id="email" 
                type="email" 
                placeholder="name@example.com"
                className="w-full h-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400"
                {...register('email')}
              />
            </div>
          </div>

          {/* PASSWORD INPUT */}
          <div className="space-y-1.5">
            <label 
              htmlFor="password" 
              className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1"
            >
              Password
            </label>
            <div className={`
              flex items-center w-full px-4 h-12
              bg-white border border-gray-200 rounded-xl
              transition-all duration-200 ease-in-out
              focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10
            `}>
              <LockKeyhole className="text-gray-400 mr-3 shrink-0" size={20} strokeWidth={2} />
              <input 
                id="password" 
                type="password"
                placeholder="••••••••"
                className="w-full h-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400"
                {...register('password')}
              />
            </div>
          </div>

          {/* CONFIRM PASSWORD INPUT */}
          <div className="space-y-1.5">
            <label 
              htmlFor="passwordConfirmation" 
              className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1"
            >
              Confirm Password
            </label>
            <div className={`
              flex items-center w-full px-4 h-12
              bg-white border border-gray-200 rounded-xl
              transition-all duration-200 ease-in-out
              focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10
            `}>
              {/* Shield Icon to imply security/verification */}
              <ShieldCheck className="text-gray-400 mr-3 shrink-0" size={20} strokeWidth={2} />
              <input 
                id="passwordConfirmation" 
                type="password"
                placeholder="••••••••"
                className="w-full h-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400"
                {...register('passwordConfirmation')}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button isSignIn={false} mode='credentials' type="submit">
                Create Account
            </Button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;