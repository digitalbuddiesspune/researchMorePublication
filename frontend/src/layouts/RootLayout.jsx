import { Outlet } from 'react-router-dom'
import Header from '../components/Header.jsx'

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header />
      <main className="relative isolate overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

