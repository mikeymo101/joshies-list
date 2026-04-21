import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0f14]">
      <nav className="h-16 flex items-center px-6 border-b border-brand-500/10">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          <img src="/logo.svg" alt="Joshies List" className="h-6" />
        </Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-8">Last updated: April 2, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
            <h3 className="text-lg font-medium text-white/90">From Registered Users (Contractors)</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Email address and password (for account creation)</li>
              <li>First name, last name, business name</li>
              <li>Trade type, primary state, years in business</li>
              <li>Phone number (optional)</li>
              <li>Reviews and ratings you submit</li>
            </ul>

            <h3 className="text-lg font-medium text-white/90 mt-4">About Reviewed Clients (Homeowners)</h3>
            <p>We collect <strong>only minimal, partially anonymized information</strong> about reviewed clients:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>First name and last initial only (no full last names)</li>
              <li>City, state, and ZIP code (no street addresses)</li>
              <li>Numerical ratings across 5 categories</li>
            </ul>
            <p className="mt-2"><strong>We do NOT collect or store:</strong> full names, home addresses, phone numbers, email addresses, Social Security numbers, or any other personally identifiable information about reviewed clients beyond first name and last initial.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">2. How We Use Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To operate and improve the Platform</li>
              <li>To calculate aggregate scores and grades from user-submitted ratings</li>
              <li>To display area-level insights (ZIP code averages)</li>
              <li>To communicate with registered users about their accounts</li>
              <li>To enforce our Terms of Service and Content Guidelines</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">3. Information Sharing</h2>
            <p>We do not sell, rent, or share personal information with third parties for marketing purposes. We may share information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>As displayed on the Platform (reviews, scores, grades)</li>
              <li>Through our API to authorized integrations</li>
              <li>When required by law or legal process</li>
              <li>To protect the rights and safety of users and the public</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">4. Data Retention</h2>
            <p>Account data is retained as long as your account is active. Reviews may be retained after account deletion to maintain the integrity of aggregate scores, but will be disassociated from your identity.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">5. Your Rights</h2>
            <p><strong>Registered users</strong> can:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access and edit their profile information</li>
              <li>Delete their own reviews</li>
              <li>Export their review data (CSV)</li>
              <li>Request account deletion</li>
            </ul>
            <p className="mt-3"><strong>Reviewed individuals</strong> can:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Request content removal through our <Link href="/legal/dispute" className="text-brand-400 hover:text-brand-300">Dispute &amp; Removal Form</Link></li>
              <li>All removal requests are reviewed within 48 hours</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">6. California Privacy Rights</h2>
            <p>California residents have additional rights under the CCPA, including the right to know what personal information we collect, the right to deletion, and the right to opt out of data sales. We do not sell personal information. To exercise your rights, submit a request through our <Link href="/legal/dispute" className="text-brand-400 hover:text-brand-300">Dispute &amp; Removal Form</Link>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">7. Security</h2>
            <p>We use industry-standard security measures including encrypted data transmission (HTTPS), hashed passwords, and encrypted API keys. However, no system is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">8. Cookies</h2>
            <p>We use essential cookies for authentication and session management. We do not use tracking cookies or third-party advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy at any time. We will notify registered users of material changes via email or in-app notification.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">10. Contact</h2>
            <p>For privacy-related inquiries, use our <Link href="/legal/dispute" className="text-brand-400 hover:text-brand-300">Dispute &amp; Removal Form</Link>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
