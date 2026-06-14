'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BriefcaseBusiness, Building2, Check, GraduationCap, Loader2, LockKeyhole, UserRound } from 'lucide-react'
import { useAppState } from '@/context/AppStateContext'
import { supabase } from '@/lib/supabase'

const ROLES = {
  candidate: {
    label: 'Candidate',
    description: 'Student profile, portfolio, skills, and career preferences.',
    icon: GraduationCap,
    persona: 'student',
  },
  university: {
    label: 'University Staff',
    description: 'Staff identity, department, faculty, and institution details.',
    icon: Building2,
    persona: 'university',
  },
  employer: {
    label: 'Employer',
    description: 'Company profile, industry, and recruiter role information.',
    icon: BriefcaseBusiness,
    persona: 'employer',
  },
}

const BASIC_FIELDS = [
  { name: 'full_name', label: 'Full name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true, helper: 'Minimum 8 characters' },
  { name: 'phone', label: 'Phone', type: 'tel' },
  { name: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
  { name: 'avatar_url', label: 'Avatar URL', type: 'url' },
  { name: 'bio', label: 'Bio', type: 'textarea', className: 'register-field-wide' },
]

const ROLE_FIELDS = {
  candidate: [
    { name: 'student_id', label: 'Student ID', required: true },
    { name: 'university_name', label: 'University name', required: true },
    { name: 'faculty', label: 'Faculty', required: true },
    { name: 'programme', label: 'Programme', required: true },
    { name: 'cgpa', label: 'CGPA', type: 'number', step: '0.01', min: '0', max: '4' },
    { name: 'current_year', label: 'Current year', type: 'number', required: true, min: '1' },
    { name: 'graduation_year', label: 'Graduation year', type: 'number', required: true, min: '2024' },
    { name: 'github_url', label: 'GitHub URL', type: 'url' },
    { name: 'portfolio_url', label: 'Portfolio URL', type: 'url' },
    { name: 'resume_url', label: 'Resume URL', type: 'url' },
    { name: 'career_interest', label: 'Career interest' },
    { name: 'preferred_location', label: 'Preferred location' },
    { name: 'employment_type', label: 'Employment type', type: 'select', options: ['', 'Internship', 'Full-time', 'Part-time', 'Contract'] },
    { name: 'skills_summary', label: 'Skills summary', type: 'textarea', className: 'register-field-wide' },
  ],
  university: [
    { name: 'staff_id', label: 'Staff ID', required: true },
    { name: 'university_name', label: 'University name', required: true },
    { name: 'faculty', label: 'Faculty', required: true },
    { name: 'department', label: 'Department', required: true },
    { name: 'position', label: 'Position', required: true },
  ],
  employer: [
    { name: 'company_name', label: 'Company name', required: true },
    { name: 'company_role', label: 'Company role', required: true },
    { name: 'industry', label: 'Industry', required: true },
  ],
}

const STEP_LABELS = ['Select role', 'Basic info', 'Role details']

function emptyFields(fields) {
  return fields.reduce((values, field) => ({ ...values, [field.name]: '' }), {})
}

function Field({ field, value, error, onChange }) {
  const id = `register-${field.name}`
  const commonProps = {
    id,
    name: field.name,
    value,
    required: field.required,
    onChange: (event) => onChange(field.name, event.target.value),
    className: `form-input ${error ? 'register-input-error' : ''}`,
  }

  return (
    <label className={`register-field ${field.className || ''}`} htmlFor={id}>
      <span>
        {field.label}
        {field.required && <b aria-hidden="true"> *</b>}
      </span>
      {field.type === 'textarea' ? (
        <textarea {...commonProps} rows={4} />
      ) : field.type === 'select' ? (
        <select {...commonProps}>
          {field.options.map((option) => (
            <option key={option || 'empty'} value={option}>
              {option || 'Select an option'}
            </option>
          ))}
        </select>
      ) : (
        <input {...commonProps} type={field.type || 'text'} step={field.step} min={field.min} max={field.max} />
      )}
      {field.helper && <small>{field.helper}</small>}
      {error && <strong>{error}</strong>}
    </label>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const { enterPersona } = useAppState()
  const [step, setStep] = useState(0)
  const [role, setRole] = useState('')
  const [basic, setBasic] = useState(emptyFields(BASIC_FIELDS))
  const [profiles, setProfiles] = useState({
    candidate: emptyFields(ROLE_FIELDS.candidate),
    university: emptyFields(ROLE_FIELDS.university),
    employer: emptyFields(ROLE_FIELDS.employer),
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activeRole = ROLES[role]
  const activeRoleFields = useMemo(() => (role ? ROLE_FIELDS[role] : []), [role])
  const progress = ((step + 1) / STEP_LABELS.length) * 100

  const updateBasic = (name, value) => {
    setBasic((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const updateProfile = (name, value) => {
    setProfiles((current) => ({
      ...current,
      [role]: { ...current[role], [name]: value },
    }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const validateFields = (fields, values) => {
    const nextErrors = {}

    fields.forEach((field) => {
      if (field.required && !String(values[field.name] || '').trim()) {
        nextErrors[field.name] = `${field.label} is required.`
      }
    })

    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (values.password && values.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

    return nextErrors
  }

  const handleNext = () => {
    setSubmitError('')

    if (step === 0 && !role) {
      setSubmitError('Choose a role before continuing.')
      return
    }

    if (step === 1) {
      const nextErrors = validateFields(BASIC_FIELDS, basic)
      setErrors(nextErrors)
      if (Object.keys(nextErrors).length) return
    }

    setStep((current) => Math.min(current + 1, STEP_LABELS.length - 1))
  }

  const handleBack = () => {
    setSubmitError('')
    setStep((current) => Math.max(current - 1, 0))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')

    if (!role) {
      setSubmitError('Choose a role before submitting.')
      return
    }

    const nextErrors = {
      ...validateFields(BASIC_FIELDS, basic),
      ...validateFields(activeRoleFields, profiles[role]),
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          basic,
          profile: profiles[role],
        }),
      })

      const responseText = await response.text()
      let result = {}

      try {
        result = responseText ? JSON.parse(responseText) : {}
      } catch {
        result = { error: responseText || 'Registration failed.' }
      }

      if (!response.ok) {
        throw new Error(result.error || `Registration failed with status ${response.status}.`)
      }

      // Auto login user after registration to create the Supabase session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: basic.email,
        password: basic.password,
      })

      if (signInError) {
        throw signInError
      }

      enterPersona(activeRole.persona)
      
      const routeByRole = {
        candidate: '/candidate',
        university: '/university',
        employer: '/employer'
      }
      router.push(routeByRole[role] || '/')
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="register-page">
      <section className="register-shell">
        <div className="register-panel register-intro">
          <img src="/logo.jpg" alt="UniOS Logo" className="register-logo" />
          <p className="data-label">Secure registration</p>
          <h1>Create your UniOS account</h1>
          <p>Choose one role, complete the matching profile, and UniOS will send you straight to the correct workspace.</p>

          <div className="register-progress" aria-label="Registration progress">
            <span style={{ width: `${progress}%` }} />
          </div>

          <ol className="register-steps">
            {STEP_LABELS.map((label, index) => (
              <li key={label} className={index === step ? 'active' : index < step ? 'done' : ''}>
                <span>{index < step ? <Check size={16} /> : index + 1}</span>
                {label}
              </li>
            ))}
          </ol>

          {role && (
            <div className="register-lock-note">
              <LockKeyhole size={18} />
              <span>Role locked as {activeRole.label}. The server will reject mismatched role data.</span>
            </div>
          )}
        </div>

        <form className="register-panel register-form" onSubmit={handleSubmit}>
          {step === 0 && (
            <div>
              <div className="register-form-heading">
                <UserRound size={22} />
                <div>
                  <h2>Select your role</h2>
                  <p>Your role determines which database table receives your profile details.</p>
                </div>
              </div>

              <div className="register-role-grid">
                {Object.entries(ROLES).map(([key, config]) => {
                  const Icon = config.icon
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`register-role-card ${role === key ? 'selected' : ''}`}
                      onClick={() => setRole(key)}
                    >
                      <Icon size={28} />
                      <span>{config.label}</span>
                      <p>{config.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="register-form-heading">
                <UserRound size={22} />
                <div>
                  <h2>Basic information</h2>
                  <p>These fields are stored in the shared persons table for every role.</p>
                </div>
              </div>

              <div className="register-fields-grid">
                {BASIC_FIELDS.map((field) => (
                  <Field key={field.name} field={field} value={basic[field.name]} error={errors[field.name]} onChange={updateBasic} />
                ))}
              </div>
            </div>
          )}

          {step === 2 && role && (
            <div>
              <div className="register-form-heading">
                {React.createElement(activeRole.icon, { size: 22 })}
                <div>
                  <h2>{activeRole.label} details</h2>
                  <p>These fields are inserted only into the matching {role} profile table.</p>
                </div>
              </div>

              <div className="register-fields-grid">
                {activeRoleFields.map((field) => (
                  <Field key={field.name} field={field} value={profiles[role][field.name]} error={errors[field.name]} onChange={updateProfile} />
                ))}
              </div>
            </div>
          )}

          {submitError && <div className="register-error-banner">{submitError}</div>}

          <div className="register-actions">
            {step > 0 ? (
              <button type="button" className="btn btn-secondary" onClick={handleBack} disabled={isSubmitting}>
                Back
              </button>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={() => router.push('/')} disabled={isSubmitting}>
                Cancel
              </button>
            )}

            {step < STEP_LABELS.length - 1 ? (
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Continue
              </button>
            ) : (
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="register-spinner" size={18} /> : null}
                Create account
              </button>
            )}
          </div>
        </form>
      </section>
    </main>
  )
}


