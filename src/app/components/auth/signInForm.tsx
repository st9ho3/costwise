"use client"

import { Button, GoogleIcon } from '@/app/constants/components'
import useSignIn from '@/app/hooks/useSignIn';
import Link from 'next/link';
import { Mail, LockKeyhole } from 'lucide-react';

const SignInForm = () => {
  const { register, handleSubmit, onSubmit } = useSignIn({ isSignIn: true });

  return (
    // CARD CONTAINER:
    // 1. rounded-[28px]: Google Material Large Shape
    // 2. max-w-md: Wider than before for better breathing room
    // 3. shadow-xl: High elevation
    <div className="w-full max-w-md p-8 bg-white rounded-[28px] shadow-xl border border-gray-100">
      
      {/* Header */}
      <div className="flex flex-col text-center mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500">
          Enter your details to access your dashboard.
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
            <div className="flex justify-between items-center ml-1">
                <label 
                  htmlFor="password" 
                  className="text-xs font-bold text-gray-500 uppercase tracking-wide"
                >
                  Password
                </label>
                <Link href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    Forgot Password?
                </Link>
            </div>
            
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

          {/* Primary Action Button */}
          {/* Using container to ensure Button component fills width if it doesn't default to it */}
          <div className="pt-2">
            <Button isSignIn={true} mode='credentials' type="submit">
                Sign In
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-white px-4 text-gray-400 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        {/* Styled manually or passed to Button component to ensure the "Outlined" look */}
        <Button 
            mode='google' isSignIn={true} type='button'
        >
          <GoogleIcon /> {/* Assuming this handles the SVG sizing internally */}
          <span>Sign in with Google</span>
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;