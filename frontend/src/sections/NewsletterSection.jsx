export default function NewsletterSection() {
  return (
    <section className="bg-blue-50">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-blue-950 lg:px-0">
        <h2 className="text-2xl font-semibold">Get the latest research updates</h2>
        <p className="mt-2 text-sm text-blue-900/80">
          Subscribe to our newsletter for highlights across journals, topics, and
          disciplines.
        </p>
        <form className="mt-8 grid gap-4 sm:grid-cols-3">
          <input
            type="text"
            placeholder="First name"
            className="h-11 rounded-full border border-blue-200 bg-white px-4 text-sm placeholder:text-blue-300 focus:border-blue-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Last name"
            className="h-11 rounded-full border border-blue-200 bg-white px-4 text-sm placeholder:text-blue-300 focus:border-blue-400 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email address"
            className="h-11 rounded-full border border-blue-200 bg-white px-4 text-sm placeholder:text-blue-300 focus:border-blue-400 focus:outline-none sm:col-span-3"
          />
        </form>
        <button className="mt-6 rounded-full bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700">
          Subscribe
        </button>
      </div>
    </section>
  )
}

