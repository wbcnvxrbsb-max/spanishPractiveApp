import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Practica language learning app",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: March 2026</p>

        <div className="prose prose-gray max-w-none text-gray-600 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              What Data We Collect
            </h2>
            <p>
              When you create an account, we collect your name and email
              address. If you sign in with Google, we receive your name, email,
              and profile picture from Google. We do not collect or store your
              Google password.
            </p>
            <p>
              When you use the app, your conversation messages are sent to our
              AI service for processing. We do not permanently store your
              conversation history on our servers — conversations exist only
              during your active session.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              How We Use Your Data
            </h2>
            <p>
              Your account information is used to identify you when you sign in
              and to manage your subscription status. Your email is not shared
              with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Third-Party Services
            </h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Google OAuth</strong> — for sign-in authentication.
                Google receives standard authentication data as described in
                their privacy policy.
              </li>
              <li>
                <strong>Stripe</strong> — for processing payments. When you
                purchase the ad-free upgrade, your payment information is
                handled directly by Stripe. We do not see or store your credit
                card number.
              </li>
              <li>
                <strong>Groq</strong> — for AI-powered conversations. Your
                conversation messages are sent to Groq&apos;s API for processing
                and are subject to their data handling policies.
              </li>
              <li>
                <strong>Google AdSense</strong> — for displaying advertisements
                to free-tier users. See the &quot;Advertising and Cookies&quot;
                section below.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Advertising and Cookies
            </h2>
            <p>
              We use Google AdSense to display advertisements to users who have
              not purchased the ad-free upgrade. Google AdSense and its partners
              may use cookies and web beacons to serve ads based on your prior
              visits to this website and other websites on the internet.
            </p>
            <p>
              Google&apos;s use of advertising cookies enables it and its
              partners to serve ads to you based on your visit to this site
              and/or other sites on the internet. You may opt out of
              personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                Google Ads Settings
              </a>
              .
            </p>
            <p>
              Third-party vendors, including Google, use cookies to serve ads
              based on your prior visits. You can opt out of third-party
              vendor&apos;s use of cookies for personalized advertising by
              visiting{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                www.aboutads.info/choices
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Data Storage and Security
            </h2>
            <p>
              Your account data is stored in a PostgreSQL database hosted on
              Render. All data is transmitted over HTTPS. We take reasonable
              measures to protect your information, but no method of
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Your Rights
            </h2>
            <p>
              You may request deletion of your account and associated data at
              any time by contacting us. Upon deletion, all personal data
              associated with your account will be removed from our systems.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. Changes will
              be posted on this page with an updated revision date.
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
