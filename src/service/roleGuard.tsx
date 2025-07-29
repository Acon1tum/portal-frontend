'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // Updated import for App Router
import Cookies from 'js-cookie'

// Function to decode JWT token
const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const decodedJson = atob(base64)
    return JSON.parse(decodedJson)
  } catch (error) {
    return null
  }
}

// RoleGuard Component that wraps children
const RoleGuard = ({ role, children }: { role: string; children: ReactNode }) => {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('token')

      if (!token) {
        router.push('/')
        return
      }

      const decoded = decodeJwt(token)
      if (!decoded || decoded.role !== role) {
        router.push('/not-authorized')
        return
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, role]) // Removed token from dependencies to prevent infinite loops

  if (isLoading) {
    return null // Or return a loading component: <div>Loading...</div>
  }

  if (!isAuthorized) {
    return null // Router will handle redirection
  }

  return <>{children}</>
}

export default RoleGuard