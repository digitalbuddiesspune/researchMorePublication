export default function SiteFooter() {
  return (
    <footer className="bg-neutral-100 text-neutral-800">
      <div className="mx-auto max-w-6xl px-6 py-12 text-sm lg:px-0">
        <div className="grid gap-8 border-b border-neutral-300 pb-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Get to know us
            </h3>
            <ul className="mt-3 space-y-1">
              <li>About researchMorePublication</li>
              <li>Our editorial boards</li>
              <li>Partnerships</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Explore
            </h3>
            <ul className="mt-3 space-y-1">
              <li>All journals</li>
              <li>All articles</li>
              <li>Research topics</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Support
            </h3>
            <ul className="mt-3 space-y-1">
              <li>Help center</li>
              <li>Publishing policies</li>
              <li>Contact support</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Connect
            </h3>
            <ul className="mt-3 space-y-1">
              <li>Twitter</li>
              <li>LinkedIn</li>
              <li>YouTube</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-6 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} researchMorePublication. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <button>Privacy policy</button>
            <button>Terms &amp; conditions</button>
            <button>Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  )
}

