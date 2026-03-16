import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white px-6 py-8 shadow-sm ring-1 ring-neutral-200">
        <div className="mb-4 flex items-center justify-between text-sm">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to home
          </Link>
        </div>

        <h1 className="text-center text-2xl font-semibold text-neutral-900">Login</h1>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Don&apos;t have an account?{' '}
          <button className="font-semibold text-blue-600 hover:text-blue-700">
            Register
          </button>
        </p>

        <form className="mt-6 space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-neutral-800">
              Email address<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="h-11 w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-neutral-800">
              Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className="h-11 w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-neutral-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember me</span>
            </label>
            <button className="text-blue-600 hover:text-blue-700">
              Forgot password
            </button>
          </div>

          <button
            type="submit"
            className="mt-4 h-11 w-full rounded-full bg-blue-600 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
          >
            Log in with email
          </button>
        </form>
      </div>
    </div>
  )
}

