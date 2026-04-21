import Link from 'next/link';

export default function ContentGuidelines() {
  return (
    <div className="min-h-screen bg-[#0a0f14]">
      <nav className="h-16 flex items-center px-6 border-b border-brand-500/10">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          <img src="/logo.svg" alt="Joshies List" className="h-6" />
        </Link>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Content Guidelines</h1>
        <p className="text-white/40 text-sm mb-8">Last updated: April 2, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white">What Joshies List Is</h2>
            <p>Joshies List is a platform for licensed contractors to share <strong>their subjective opinions</strong> about their professional experiences working with homeowner clients. All reviews represent personal opinions, not verified facts.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Review Standards</h2>
            <p>When submitting a review, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Base reviews on real experience</strong> — only review clients you have actually worked with</li>
              <li><strong>Be honest</strong> — your numerical ratings should reflect your genuine opinion of the experience</li>
              <li><strong>Stay professional</strong> — reviews are numerical scores across 5 categories, designed to be objective and fair</li>
              <li><strong>Protect privacy</strong> — never include personal contact information, addresses, or private details</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Prohibited Content</h2>
            <p>The following content is prohibited and will be removed:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>False reviews (reviewing someone you haven&apos;t worked with)</li>
              <li>Reviews motivated by personal disputes unrelated to the job</li>
              <li>Personal contact information (phone numbers, addresses, emails)</li>
              <li>Threats, harassment, or intimidation</li>
              <li>Discriminatory content based on race, gender, religion, ethnicity, or other protected characteristics</li>
              <li>Content that presents unverified claims as established facts</li>
              <li>Coordinated or incentivized reviews</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Opinion vs. Fact</h2>
            <p>All content on Joshies List is framed as <strong>user opinion</strong>. Our scoring system reflects the collective subjective experience of contractors. Grades (A-F) and scores are algorithmic calculations of submitted opinions, not factual determinations about any individual.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Moderation</h2>
            <p>Joshies List actively moderates content. We:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Review flagged content promptly</li>
              <li>Require contractor verification to submit reviews</li>
              <li>Track reviewer identity for accountability</li>
              <li>Remove content that violates these guidelines</li>
              <li>Suspend or terminate accounts of repeat violators</li>
              <li>Log all moderation actions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Disputes and Removal</h2>
            <p>If you are the subject of a review and believe it violates these guidelines, you may submit a removal request through our <Link href="/legal/dispute" className="text-brand-400 hover:text-brand-300">Dispute &amp; Removal Form</Link>. All requests are reviewed within 48 hours.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Consequences</h2>
            <p>Violations of these guidelines may result in:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Content removal</li>
              <li>Account warning</li>
              <li>Temporary suspension</li>
              <li>Permanent account termination</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
