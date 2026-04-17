import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()

  const handleDemoLogin = () => {
    localStorage.setItem('token', 'demo-myfrontiers-token')
    navigate('/', { replace: true })
  }

  return (
    <section className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
      <h1 className="text-2xl font-semibold text-neutral-900">Login</h1>
      <p className="mt-3 text-sm text-neutral-600">
        Please log in to continue and submit your research.
      </p>
      <button
        type="button"
        onClick={handleDemoLogin}
        className="mt-6 rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
      >
        Demo login
      </button>
    </section>
  )
}
