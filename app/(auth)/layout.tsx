import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      <nav className="h-16 flex items-center px-6">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          <img src="/logo.svg" alt="Joshies List" className="h-6" />
        </Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-amber-500/20 bg-[#12121a] p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
