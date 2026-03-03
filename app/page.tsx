import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practica - AI Spanish & Portuguese Conversation Practice",
  description:
    "Improve your Spanish and Portuguese fluency through natural AI conversations. Practice real scenarios like restaurants, travel, and making friends. 10 difficulty levels, voice recognition, and instant grammar correction.",
  openGraph: {
    title: "Practica - AI Spanish & Portuguese Conversation Practice",
    description:
      "Natural AI-powered conversations to build real language fluency. 10 difficulty levels, 6 real-world scenarios, voice recognition.",
    url: "https://practice-languages.onrender.com",
    siteName: "Practica",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">Practica</span>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Terms
            </Link>
            <Link
              href="/practice"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Start Practicing
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 sm:px-6 pt-16 pb-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Practice Spanish & Portuguese Through Real Conversation
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Have natural conversations with an AI tutor that adapts to your
            level. From your first words to fluent discussion — practice
            speaking in real-world scenarios, get instant grammar corrections,
            and build confidence at your own pace.
          </p>
          <Link
            href="/practice"
            className="inline-block px-8 py-3.5 bg-blue-500 text-white rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25"
          >
            Start a Conversation — Free
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Everything You Need to Build Fluency
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                10 Difficulty Levels
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Progress from complete beginner to advanced speaker. Each level
                adjusts vocabulary complexity, sentence structure, and
                conversation depth so you are always challenged but never
                overwhelmed. Start with basic greetings and work up to nuanced
                discussions about culture, current events, and abstract topics.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">🎭</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                6 Real-World Scenarios
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Practice conversations you will actually have. Order food at a
                restaurant, ask for directions in a new city, negotiate prices
                while shopping, make friends at a social event, navigate travel
                situations, or have open-ended free chat. Each scenario has
                multiple variations so every conversation feels fresh.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">🎤</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Voice Recognition
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Speak naturally and see your words transcribed in real time.
                Built-in speech recognition lets you practice pronunciation and
                conversational flow without typing. This is closer to how real
                conversations work and helps you develop the muscle memory of
                actually speaking the language out loud.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Real-Time Conversation Mode
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Toggle on real-time mode for an immersive experience. The AI
                speaks its response aloud, then automatically starts listening
                for yours — just like a real conversation. A gentle countdown
                keeps the dialogue flowing naturally and helps you think on your
                feet.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">✏️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Instant Grammar Correction
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every message you send gets checked for grammar mistakes. See
                corrections inline so you learn from errors in real time, not
                after the fact. The corrections are context-aware — they
                understand the full conversation, not just isolated sentences —
                so the feedback is accurate and helpful.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI That Adapts to You
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Powered by advanced language models, your conversation partner
                adapts vocabulary and sentence complexity to match your chosen
                level. It responds naturally, asks follow-up questions, and
                keeps the dialogue engaging — creating an experience that feels
                like chatting with a patient native speaker.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Pick Your Scenario and Level
                </h3>
                <p className="text-gray-600 text-sm">
                  Choose from six real-world conversation scenarios and set your
                  difficulty level from 1 (absolute beginner) to 10 (near-native).
                  The AI calibrates its vocabulary, grammar complexity, and
                  conversation style accordingly.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Have a Natural Conversation
                </h3>
                <p className="text-gray-600 text-sm">
                  Type or speak your responses. The AI plays a role in the
                  scenario — a waiter, a local giving directions, a new
                  friend — and keeps the conversation flowing naturally. Each
                  exchange has a different variation so you never repeat the same
                  dialogue.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Learn From Your Mistakes
                </h3>
                <p className="text-gray-600 text-sm">
                  After each message, see inline grammar corrections that
                  explain what you got wrong and how to fix it. Over time, you
                  will internalize correct patterns and make fewer mistakes
                  naturally.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Level Up When You Are Ready
                </h3>
                <p className="text-gray-600 text-sm">
                  Once a level feels comfortable, bump it up. The jump from
                  level 3 to 4 introduces more complex tenses; from 7 to 8, the
                  AI starts using colloquial expressions and idioms. There is
                  always a next step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Learn Spanish */}
      <section className="px-4 sm:px-6 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Why Practice Conversational Spanish?
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
            <p>
              Spanish is the second most spoken native language in the world,
              with over 500 million native speakers across more than 20
              countries. It is the official language of Spain, Mexico, Colombia,
              Argentina, and much of Central and South America. Whether you are
              planning a trip to Barcelona, doing business in Mexico City, or
              simply want to connect with Spanish-speaking friends and neighbors,
              conversational ability opens doors that vocabulary lists alone
              cannot.
            </p>
            <p>
              Most language learners hit a plateau between textbook knowledge and
              real conversation. You might know hundreds of words and understand
              grammar rules, but freeze when someone actually talks to you.
              Conversation practice bridges that gap. By simulating real
              scenarios — ordering at a restaurant, asking a local for
              directions, meeting someone new — you train your brain to retrieve
              words under pressure and form sentences in real time.
            </p>
            <p>
              Portuguese, spoken by over 250 million people worldwide, shares
              much of its vocabulary and grammar with Spanish. If you already
              speak some Spanish, Portuguese becomes significantly easier to
              learn. Practica supports both languages so you can build on your
              existing skills or start fresh with either one.
            </p>
            <p>
              Research consistently shows that active practice — speaking and
              responding, not just reading or listening — is the most effective
              way to build lasting fluency. Practica gives you a patient,
              always-available conversation partner that meets you at your
              current level and helps you improve with every exchange.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Is Practica free to use?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes. You can create an account and have unlimited conversations
                for free. A brief ad is shown between conversations to support
                the service. You can remove ads with a one-time $5 payment.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                What level should I start at?
              </h3>
              <p className="text-gray-600 text-sm">
                If you are a complete beginner, start at level 1 or 2. The AI
                will use simple greetings and basic vocabulary. If you have taken
                some classes or used apps like Duolingo, try level 3 or 4. If
                you can hold a basic conversation already, jump to level 5 or 6
                and adjust from there.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Does it work on mobile?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes. Practica is a web app that works on any device with a
                modern browser. Voice recognition works best on Chrome for
                Android and Safari for iOS. No app download is required.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                How is this different from a chatbot?
              </h3>
              <p className="text-gray-600 text-sm">
                Unlike generic chatbots, Practica is purpose-built for language
                learning. The AI stays in character for each scenario, calibrates
                its language to your level, provides grammar corrections, and
                ends conversations naturally. It is designed to simulate a real
                interaction, not just answer questions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Can I practice Portuguese too?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes. You can switch between Spanish and Brazilian Portuguese in
                the settings. All scenarios and difficulty levels are available
                in both languages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-16 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Speaking?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Create a free account and have your first conversation in under a
            minute.
          </p>
          <Link
            href="/practice"
            className="inline-block px-8 py-3.5 bg-white text-blue-600 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Practicing Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
