import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMe, getWebToken } from '../../services/authService.js'

export default function useRequireSubmitAccess() {
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let isMounted = true

    const checkUser = async () => {
      try {
        if (!getWebToken()) {
          navigate('/login?next=/submit', { replace: true })
          return
        }
        await fetchMe()
      } catch {
        navigate('/login?next=/submit', { replace: true })
      } finally {
        if (isMounted) {
          setIsChecking(false)
        }
      }
    }

    checkUser()

    return () => {
      isMounted = false
    }
  }, [navigate])

  return { isChecking }
}
