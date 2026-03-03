import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Practica language learning app",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Practica
          </Link>
          <Link
            href="/practice"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Start Practicing
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: March 2026</p>

        <div className="prose prose-gray max-w-none text-gray-600 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Service Description
            </h2>
            <p>
              Practica is a web-based language learning tool that lets you
              practice conversational Spanish and Portuguese with an AI-powered
              tutor. The service includes text and voice conversation,
              grammar correction, and multiple conversation scenarios across
              ten difficulty levels.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Accounts
            </h2>
            <p>
              You must create an account to use Practica. You can sign in with
              Google or create an account with your email and password. You are
              responsible for maintaining the security of your account
              credentials. You must provide accurate information when creating
              your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Free and Premium Tiers
            </h2>
            <p>
              Practica is free to use with advertisements displayed between
              conversations. You may purchase an ad-free upgrade for a one-time
              payment of $5 USD processed through Stripe. This payment removes
              ads permanently for your account. Refunds may be requested within
              7 days of purchase by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Acceptable Use
            </h2>
            <p>
              You agree to use Practica for its intended purpose of language
              learning practice. You may not attempt to abuse, exploit, or
              circumvent the AI system, use the service for any illegal purpose,
              or attempt to access other users&apos; accounts or data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Disclaimers
            </h2>
            <p>
              Practica is an AI-powered tool and does not guarantee specific
              language learning outcomes. The AI may occasionally produce
              incorrect grammar corrections or unnatural responses. The service
              is provided &quot;as is&quot; without warranty of any kind.
            </p>
            <p>
              Practica is not a substitute for formal language education,
              professional tutoring, or immersion-based learning. It is intended
              as a supplementary practice tool.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Availability
            </h2>
            <p>
              We make reasonable efforts to keep the service available but do
              not guarantee uninterrupted access. The service may be
              temporarily unavailable due to maintenance, updates, or
              circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Changes to These Terms
            </h2>
            <p>
              We may update these terms from time to time. Continued use of the
              service after changes constitutes acceptance of the updated terms.
              Material changes will be communicated through the service.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-400">
            Practica &mdash; AI-powered language conversation practice
          </span>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
