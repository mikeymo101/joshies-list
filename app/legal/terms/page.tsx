import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0a0f14]">
      <nav className="h-16 flex items-center px-6 border-b border-brand-500/10">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          <img src="/logo.svg" alt="Joshies List" className="h-6" />
        </Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-8">Last updated: April 2, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p>By accessing or using Joshies List (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">2. Platform Description</h2>
            <p>Joshies List is a platform that allows licensed contractors to share their subjective opinions and experiences regarding homeowner clients they have worked with. All content on the Platform represents <strong>user-submitted opinions</strong>, not verified facts. The Platform does not independently verify any reviews, ratings, or claims made by users.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">3. User Accounts</h2>
            <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials. Access to the Platform during the beta period requires a valid invite code.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">4. User-Generated Content</h2>
            <p><strong>You are solely responsible for all content you submit to the Platform.</strong> By submitting a review, you represent and warrant that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The review is based on your genuine, firsthand experience with the client</li>
              <li>The review reflects your honest opinion</li>
              <li>You have not been compensated or incentivized to submit the review</li>
              <li>The review does not contain knowingly false statements of fact</li>
              <li>The review does not contain personal contact information, addresses, or other private data about any individual</li>
              <li>The review does not contain threats, harassment, hate speech, or discriminatory language</li>
            </ul>
            <p className="mt-3">Reviews that violate these terms may be removed without notice. Repeated violations may result in account termination.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">5. Content Ownership and License</h2>
            <p>You retain ownership of your reviews. By submitting content, you grant Joshies List a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on the Platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">6. Content Removal and Disputes</h2>
            <p>Any individual who believes content on the Platform is inaccurate, defamatory, or violates their rights may submit a removal request through our <Link href="/legal/dispute" className="text-brand-400 hover:text-brand-300">Dispute &amp; Removal Form</Link>. We commit to reviewing all removal requests within 48 hours.</p>
            <p>Joshies List reserves the right to remove, edit, or modify any content at any time, for any reason, without notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">7. Disclaimer of Warranties</h2>
            <p><strong>THE PLATFORM IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND.</strong> All ratings, scores, grades, and reviews on the Platform are user-submitted opinions and have not been independently verified. Joshies List makes no representations about the accuracy, reliability, or completeness of any content on the Platform.</p>
            <p>Scores and grades are calculated algorithmically from user-submitted numerical ratings and should not be interpreted as factual assessments of any individual.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Joshies List and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or any content posted by users.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">9. Dispute Resolution</h2>
            <p>Any disputes arising from these Terms or use of the Platform shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You agree to waive your right to a jury trial and to participate in class action lawsuits.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">10. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Joshies List, its operators, and affiliates from any claims, damages, or expenses arising from your use of the Platform or content you submit.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">11. Modifications</h2>
            <p>We may update these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">12. Section 230 Notice</h2>
            <p>Joshies List is a neutral platform under Section 230 of the Communications Decency Act. We do not create, endorse, or verify user-generated content. Content moderation actions (including content removal) do not constitute editorial control or endorsement of remaining content.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">13. Contact</h2>
            <p>For questions about these Terms, contact us through the <Link href="/legal/dispute" className="text-brand-400 hover:text-brand-300">Dispute &amp; Removal Form</Link>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
