'use client';

import React from 'react';
import Link from 'next/link';
import { authClient } from '@/app/lib/authClient';
import useSignUp from '@/app/hooks/useSignUp';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Logo } from '../ui/logo';
import GoogleIcon from './authComponents/googleComponent';

const SignUpForm = () => {
  const { register, handleSubmit, onSubmit, authError, formState: { errors } } = useSignUp({ isSignIn: false });

  return (
    <div className="w-full max-w-[420px] p-6 sm:p-8 bg-white rounded-[28px] shadow-[0_4px_8px_rgba(27,26,22,0.05),0_20px_40px_-12px_rgba(27,26,22,0.16)] border border-[#EFE8DA] flex flex-col gap-6">
      {/* Brand & Heading */}
      <div className="flex flex-col gap-3">
        <Logo size="md" />
        <div>
          <h1 className="font-display font-bold text-[28px] sm:text-[32px] text-ink-900 leading-tight tracking-[-0.02em]">
            Set me up.
          </h1>
          <p className="font-body text-[15px] text-stone-500 mt-1">
            Start costing what goes on the plate.
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
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          size="lg"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          size="lg"
          error={errors.passwordConfirmation?.message}
          {...register('passwordConfirmation')}
        />

        <div className="pt-2">
          <Button type="submit" block size="lg">
            Create account
          </Button>
        </div>

        {authError && (
          <div className="p-3 rounded-[12px] bg-tomato-50 border border-tomato-200 text-tomato-700 text-[13px] font-medium text-center">
            {authError}
          </div>
        )}
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
        onClick={() => authClient.signIn.social({ provider: 'google', callbackURL: '/' })}
        iconLeft={<GoogleIcon />}
      >
        Continue with Google
      </Button>

      {/* Footer */}
      <div className="text-center pt-1">
        <p className="font-body text-[14px] text-stone-500">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="font-bold text-green-800 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;