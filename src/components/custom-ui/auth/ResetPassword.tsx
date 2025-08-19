'use client'

import { useState, FormEvent } from 'react'
import { passwordRecovery } from '@/service/passwordRecovery/passwordRecovery'
import { CardDescription, CardTitle } from '../../ui/card'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { User } from 'lucide-react'

export function ResetPasswordForm({
  onBackToLogin,
  onLoadingChange
}: {
  onBackToLogin?: () => void
  onLoadingChange?: (loading: boolean) => void
}) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    onLoadingChange?.(true) // Trigger full-screen loading

    try {
      const { message } = await passwordRecovery(email)
      setSuccess(message)
      setEmail('')
      // Loading screen will stay visible - user can manually close or navigate
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
      onLoadingChange?.(false) // Only hide loading on error
    }
    // Removed finally block - loading stays visible on success
  }

  return (
    <form
      className="flex flex-col gap-6 w-full"
      onSubmit={handleSubmit}
    >
      <div>
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription className="text-xs">
          Enter your email to receive a reset link.
        </CardDescription>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="reset-email">Email</Label>
        <div className="relative">
          <User
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-green-500"
          />
          <Input
            id="reset-email"
            type="email"
            required
            className="pl-10 rounded-full"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}
      {success && (
        <div className="text-sm text-green-500">{success}</div>
      )}

      <Button
        type="submit"
        className="w-full rounded-full bg-gradient-to-r from-green-400 via-green-600 to-green-800 text-white"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  )
}

export default ResetPasswordForm
