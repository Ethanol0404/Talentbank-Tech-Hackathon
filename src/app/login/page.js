'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { KeyRound, Loader2, LockKeyhole } from 'lucide-react'
import { useAppState } from '@/context/AppStateContext'
import { supabase } from '@/lib/supabase'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { enterPersona, currentUser } = useAppState()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = searchParams.get('redirectTo')

  // If already logged in, redirect away
  useEffect(() => {
    if (currentUser) {
      if (redirectTo) {
        router.push(redirectTo)
      } else {
        const routeByRole = {
          candidate: '/candidate',
          university: '/university',
          employer: '/employer'
        }
        router.push(routeByRole[currentUser.role] || '/')
      }
    }
  }, [currentUser, router, redirectTo])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMsg('')
    
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setErrorMsg('Please enter both email and password.')
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password
      })

      if (error) {
        throw error
      }

      if (!data?.user) {
        throw new Error('No user data returned.')
      }

      // 2. Fetch user role from persons table
      const { data: person, error: personError } = await supabase
        .from('persons')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (personError || !person) {
        throw new Error('Failed to retrieve user profile or role.')
      }

      const role = person.role
      
      // Update local persona context mapping
      const personaByRole = {
        candidate: 'student',
        university: 'university',
        employer: 'employer'
      }
      enterPersona(personaByRole[role])

      // 3. Redirect to appropriate dashboard
      if (redirectTo) {
        router.push(redirectTo)
      } else {
        const routeByRole = {
          candidate: '/candidate',
          university: '/university',
          employer: '/employer'
        }
        router.push(routeByRole[role] || '/')
      }
    } catch (error) {
      setErrorMsg(error.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="register-page">
      <section className="register-shell">
        <div className="register-panel register-intro">
          <img src="/logo.jpg" alt="UniOS Logo" className="register-logo" />
          <p className="data-label">Secure Authentication</p>
          <h1>Log in to UniOS</h1>
          <p>Access your secure role-based talent alignment workspace, directories, and dashboard panels.</p>

          <div className="register-lock-note" style={{ marginTop: 'auto' }}>
            <LockKeyhole size={18} />
            <span>Encrypted connection. Enforced with multi-tier role validations.</span>
          </div>
        </div>

        <form className="register-panel register-form" onSubmit={handleSubmit}>
          <div>
            <div className="register-form-heading">
              <KeyRound size={22} />
              <div>
                <h2>Welcome Back</h2>
                <p>Enter your credentials to log in to your dashboard.</p>
              </div>
            </div>

            <div className="register-fields-grid" style={{ gridTemplateColumns: '1fr' }}>
              <label className="register-field" htmlFor="login-email">
                <span>Email Address <b aria-hidden="true">*</b></span>
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                  className="form-input"
                />
              </label>

              <label className="register-field" htmlFor="login-password">
                <span>Password <b aria-hidden="true">*</b></span>
                <input
                  id="login-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                  className="form-input"
                />
              </label>
            </div>
          </div>

          {errorMsg && <div className="register-error-banner">{errorMsg}</div>}

          <div className="register-actions" style={{ flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
            <button type="submit" className="btn btn-primary w-fill" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="register-spinner" size={18} /> : null}
              Sign In
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link href="/register" style={{ color: 'var(--accent-blue)', fontWeight: 600, textDecoration: 'underline' }}>
                Register here
              </Link>
            </div>
          </div>
        </form>
      </section>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="loading-container">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
