import { signIn } from 'next-auth/react';
import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  isSignIn: boolean;
  mode: "google" | "credentials";
  type: "button" | "submit"
}

/**
 * A customizable button component with pre-defined styles.
 */
const Button = ({ children, variant = 'default', isSignIn, mode, type }: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = variant === 'default'
    ? "bg-gray-900 text-white hover:bg-gray-800"
    : "border border-gray-300 bg-transparent hover:bg-gray-100";

  // Simple class merger
  const mergedClasses = `w-full h-10 px-4 py-2 ${baseClasses} ${variantClasses}`;

  if (isSignIn && mode === "google") {
    return (
      <button type={type} onClick={() => signIn("google")} className="
                flex items-center justify-center w-full h-12 gap-3
                rounded-full border border-gray-200 bg-white
                text-sm font-medium text-gray-700
                hover:bg-gray-50 hover:border-gray-300 transition-all duration-200
            " >
        {children}
      </button>
    );
  }
  
  if (mode !== "google") {
     return (
      <button type={type} className={mergedClasses.trim()} >
        {children}
      </button>
    );
  }
  
  return 
};

export default Button;