import { portal } from '../data/config'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Authentication against the portal in `portal.identity`, brokered by this portal's own access server.
 *
 * Credentials are posted to /api/auth/login on this origin. The server exchanges
 * them with the portal named by `portal.identity` for a token and keeps it in a signed,
 * HttpOnly session cookie, then attaches it to every proxied request.
 *
 * The token rides in that cookie, so page scripts cannot read it (HttpOnly) —
 * but it is not encrypted, only signed. Treat the cookie itself as a secret.
 * This context only ever sees who the user is, never their password or token.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  // Ask the server who we are. The session lives in an HttpOnly cookie, so this
  // is the only way the client can find out.
  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session', { credentials: 'include' })
      const data = await res.json()
      setUser(data.authenticated ? data.user : null)
    } catch {
      setUser(null)
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      user,
      checking,
      async signIn(username, password) {
        if (!String(username || '').trim() || !String(password || '')) {
          return { ok: false, error: `Enter your ${portal.identity.name} username and password.` }
        }
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
          })
          const data = await res.json().catch(() => ({}))
          if (!res.ok || !data.authenticated) {
            return { ok: false, error: data.error || 'Invalid username or password.' }
          }
          setUser(data.user)
          return { ok: true }
        } catch {
          return { ok: false, error: 'Could not reach the portal server. Is it running?' }
        }
      },
      async signOut() {
        try {
          await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
        } finally {
          setUser(null)
        }
      },
    }),
    [user, checking],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}
