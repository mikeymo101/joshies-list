interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  };

  return (
    <img
      src="/logo.svg"
      alt="Joshies List"
      className={`${sizes[size]} w-auto ${className}`}
    />
  );
}
