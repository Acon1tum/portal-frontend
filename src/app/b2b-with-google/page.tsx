'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { resendOTP } from '@/service/authservice'

export default function B2BWithGoogle() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')

  const [secondsLeft, setSecondsLeft] = useState(0)
  const [loading, setLoading] = useState(false)

  // ① start the 60s cooldown as soon as the page loads (once userId is known)
  useEffect(() => {
    if (userId) {
      setSecondsLeft(60)
    }
  }, [userId])

  // ② countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [secondsLeft])

  const handleResend = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const { message } = await resendOTP(userId)
      alert(message)
      setSecondsLeft(60)   // restart cooldown on manual click
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4">
      <p>Check your email to finish signing in…</p>
      <button
        onClick={handleResend}
        disabled={secondsLeft > 0 || loading}
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      >
        {loading
          ? 'Sending…'
          : secondsLeft > 0
          ? `Resend OTP (${secondsLeft}s)`
          : 'Resend OTP'}
      </button>
    </div>
  )
}
