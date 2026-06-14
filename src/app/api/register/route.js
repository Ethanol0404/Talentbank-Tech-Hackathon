import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

const ROLE_CONFIG = {
  candidate: {
    table: 'candidates',
    redirectTo: '/?dashboard=candidate',
    required: ['student_id', 'university_name', 'faculty', 'programme', 'current_year', 'graduation_year'],
    fields: [
      'student_id',
      'university_name',
      'faculty',
      'programme',
      'cgpa',
      'current_year',
      'graduation_year',
      'github_url',
      'portfolio_url',
      'resume_url',
      'career_interest',
      'preferred_location',
      'employment_type',
      'skills_summary',
    ],
  },
  university: {
    table: 'universities',
    redirectTo: '/?dashboard=university',
    required: ['staff_id', 'university_name', 'faculty', 'department', 'position'],
    fields: ['staff_id', 'university_name', 'faculty', 'department', 'position'],
  },
  employer: {
    table: 'employers',
    redirectTo: '/?dashboard=employer',
    required: ['company_name', 'company_role', 'industry'],
    fields: ['company_name', 'company_role', 'industry'],
  },
}

const PERSON_FIELDS = ['email', 'full_name', 'linkedin_url', 'phone', 'bio', 'avatar_url']

function cleanString(value) {
  if (typeof value !== 'string') return value ?? null
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

function cleanRecord(source, fields) {
  return fields.reduce((record, field) => {
    record[field] = cleanString(source?.[field])
    return record
  }, {})
}

function parseNumber(value, parser) {
  if (value === null || value === undefined || value === '') return null
  const parsed = parser(value)
  return Number.isFinite(parsed) ? parsed : NaN
}

function validateRequired(source, fields) {
  return fields.filter((field) => {
    const value = source?.[field]
    return value === undefined || value === null || String(value).trim() === ''
  })
}

export async function POST(request) {
  let body

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 })
  }

  const role = cleanString(body.role)
  const config = ROLE_CONFIG[role]

  if (!config) {
    return NextResponse.json({ error: 'Invalid role selected.' }, { status: 400 })
  }

  const basic = body.basic ?? {}
  const profile = body.profile ?? {}
  const email = cleanString(basic.email)?.toLowerCase()
  const password = basic.password
  const fullName = cleanString(basic.full_name)

  if (!email || !fullName || typeof password !== 'string' || password.length < 8) {
    return NextResponse.json(
      { error: 'Email, full name, and a password of at least 8 characters are required.' },
      { status: 400 }
    )
  }

  const missingProfileFields = validateRequired(profile, config.required)
  if (missingProfileFields.length > 0) {
    return NextResponse.json(
      { error: 'Missing required role-specific fields.', fields: missingProfileFields },
      { status: 400 }
    )
  }

  const roleFromProfile = cleanString(profile.role)
  if (roleFromProfile && roleFromProfile !== role) {
    return NextResponse.json({ error: 'Role mismatch detected.' }, { status: 400 })
  }

  const rolePayload = cleanRecord(profile, config.fields)

  if (role === 'candidate') {
    rolePayload.cgpa = parseNumber(rolePayload.cgpa, Number.parseFloat)
    rolePayload.current_year = parseNumber(rolePayload.current_year, Number.parseInt)
    rolePayload.graduation_year = parseNumber(rolePayload.graduation_year, Number.parseInt)

    if ([rolePayload.cgpa, rolePayload.current_year, rolePayload.graduation_year].some(Number.isNaN)) {
      return NextResponse.json({ error: 'CGPA, current year, and graduation year must be valid numbers.' }, { status: 400 })
    }
  }
  let supabase
  let createdUserId = null

  try {
    supabase = createSupabaseAdmin()
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role,
      },
    })

    if (authError) throw authError

    createdUserId = authData.user.id

    const personPayload = {
      id: createdUserId,
      ...cleanRecord({ ...basic, email, full_name: fullName }, PERSON_FIELDS),
      role,
    }

    const { error: personError } = await supabase.from('persons').insert(personPayload)
    if (personError) throw personError

    const { error: roleError } = await supabase.from(config.table).insert({
      id: createdUserId,
      ...rolePayload,
    })

    if (roleError) throw roleError

    return NextResponse.json({
      userId: createdUserId,
      role,
      redirectTo: config.redirectTo,
    })
  } catch (error) {
    if (createdUserId && supabase) {
      await supabase.auth.admin.deleteUser(createdUserId)
    }

    return NextResponse.json(
      { error: error.message || 'Registration failed.' },
      { status: 400 }
    )
  }
}


