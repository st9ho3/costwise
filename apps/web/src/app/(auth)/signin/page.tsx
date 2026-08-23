import React from 'react';
import { getServerSession } from '@/app/lib/serverSession';
import { redirect } from 'next/navigation';
import SignInForm from '@/app/components/auth/signInForm';

const SignInPage = async () => {
  const session = await getServerSession();

  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-cream-50">
      {/* Left Panel: Sign In Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-16 w-full">
        <SignInForm />
      </div>

      {/* Right Panel: Green Brand Panel with 3D Produce Illustration */}
      <div className="hidden lg:flex flex-col justify-between p-12 lg:p-16 bg-green-800 text-cream-50 relative overflow-hidden select-none">
        {/* Subtle radial glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(111,184,110,0.2),transparent_60%)]" />

        <div className="relative z-10">
          <span className="font-bold text-[11px] uppercase tracking-[0.08em] text-cream-200/80">
            For small food & beverage businesses
          </span>
          <h2 className="font-display font-extrabold text-[36px] xl:text-[42px] leading-[1.1] text-cream-50 mt-3 max-w-[480px]">
            Know exactly what you keep on every plate.
          </h2>
          <p className="font-body text-[16px] text-cream-100/90 mt-4 max-w-[440px] leading-relaxed">
            Cost every dish to the cent, catch price spikes on invoices, and make confident menu decisions before service.
          </p>
        </div>

        {/* 3D Produce Cast Illustration */}
        <div className="relative z-10 flex items-center justify-center my-6">
          <img
            src="/images/brand-illustration-cast-transparent.png"
            alt="Costwise 3D Produce Cast"
            className="w-full max-w-[420px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.25)]"
          />
        </div>

        {/* Bottom Note */}
        <div className="relative z-10 border-t border-green-700/60 pt-4 flex items-center justify-between text-[13px] text-cream-200/70 font-body">
          <span>Costwise &copy; {new Date().getFullYear()}</span>
          <span>Made for chefs, tavernas & cafés</span>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;