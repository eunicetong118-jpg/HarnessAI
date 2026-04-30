import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="text-center py-16 px-4">
      <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
        Real Traders Don't Just Earn.
        <br />
        <span className="text-design-pink">They Save.</span>
      </h1>

      <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
        Trade with near-zero cost. Start saving from your first trade.
      </p>

      <Link
        href="/signup"
        className="inline-block mt-6 bg-gradient-to-r from-design-pink to-design-purple text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
      >
        Start Saving Now
      </Link>

      <p className="text-sm mt-4 text-gray-400">
        No deposit required • Works with your broker
      </p>
    </section>
  );
}
