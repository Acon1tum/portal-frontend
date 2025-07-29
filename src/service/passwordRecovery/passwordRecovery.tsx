// src/service/passwordRecovery/passwordRecovery.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200'


  // sending a password reset link
export const passwordRecovery = async (email: string) => {
  const res = await fetch(`${API_URL}/auth/passwordRecovery/resetPassword`, {
    method: 'POST',
    // Move the email into a custom header:
    headers: {
      'x-user-email': email,
      'Accept': 'application/json'
    },
    credentials: 'include'
    // no JSON body any more
  })

  const text = await res.text()
  let data: any
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`Expected JSON, got:\n${text.slice(0,200)}`)
  }

  if (!res.ok) {
    throw new Error(data.error || 'Failed to send password recovery email')
  }
  return data as { message: string }
}


export const resetPassword = async (
  accessToken: string,
  refreshToken: string,
  password: string
): Promise<{ message: string }> => {
  const res = await fetch(
    `${API_URL}/auth/passwordRecovery/reset-password-callback/reset-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ accessToken, refreshToken, password }),
    }
  )

  const text = await res.text()
  let data: any
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`Expected JSON, got:\n${text.slice(0, 200)}`)
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Password reset failed')
  }

  return data
}

