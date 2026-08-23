'use client';

import React from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import useSignIn from '@/app/hooks/useSignIn';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Logo } from '../ui/logo';
import GoogleIcon from './authComponents/googleComponent';

const SignInForm = () => {
  const { register, handleSubmit, onSubmit } = useSignIn({ isSignIn: true });

  return (
    <div className="w-full max-w-[420px] p-6 sm:p-8 bg-white rounded-[28px] shadow-[0_4px_8px_rgba(27,26,22,0.05),0_20px_40px_-12px_rgba(27,26,22,0.16)] border border-[#EFE8DA] flex flex-col gap-6">
      {/* Brand & Heading */}
      <div className="flex flex-col gap-3">
        <Logo size="md" />
        <div>
          <h1 className="font-display font-bold text-[28px] sm:text-[32px] text-ink-900 leading-tight tracking-[-0.02em]">
            Come on in.
          </h1>
          <p className="font-body text-[15px] text-stone-500 mt-1">
            Your numbers are right where you left them.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email address"
          type="email"
          placeholder="name@example.com"
          size="lg"
          {...register('email')}
        />

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="font-bold text-[13px] text-ink-900 select-none">
              Password
            </label>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            size="lg"
            {...register('password')}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" block size="lg">
            Sign in
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#EFE8DA] w-full" />
        <span className="bg-white px-3 font-bold text-[11px] uppercase tracking-[0.08em] text-stone-500 absolute">
          or
        </span>
      </div>

      {/* Google Login */}
      <Button
        variant="outline"
        block
        size="lg"
        onClick={() => signIn('google', { redirectTo: '/' })}
        iconLeft={<GoogleIcon />}
      >
        Continue with Google
      </Button>

      {/* Footer */}
      <div className="text-center pt-1">
        <p className="font-body text-[14px] text-stone-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-bold text-green-800 hover:underline transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;