interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-navy-200 border-white/10',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    warning: 'bg-brand-500/15 text-brand-400 border-brand-500/20',
    danger: 'bg-red-500/15 text-red-400 border-red-500/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
