import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-950';

  const variants = {
    primary:
      'bg-brand-500 text-navy-950 hover:bg-brand-400 focus:ring-brand-500 shadow-lg shadow-brand-500/25 hover:shadow-brand-400/30',
    secondary:
      'bg-white/10 text-white hover:bg-white/15 focus:ring-white/30 border border-white/10',
    danger:
      'bg-red-500 text-white hover:bg-red-400 focus:ring-red-500 shadow-lg shadow-red-500/25',
    ghost:
      'text-navy-300 hover:text-white hover:bg-white/5 focus:ring-white/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
