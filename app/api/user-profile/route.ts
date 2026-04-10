import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { createRateLimiter, sanitizeString } from '@/lib/rate-limit'

const rateLimit = createRateLimiter('user-profile', { maxRequests: 10, windowMs: 60_000 })

// Admin client — server-side only, bypass RLS
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// CPF validation (modulo 11 algorithm)
function validateCPF(cpf: string): boolean {
  const c = cpf.replace(/\D/g, '')
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false

  let sum = 0
  for (let i = 1; i <= 9; i++) sum += parseInt(c[i - 1]) * (11 - i)
  let rem = (sum * 10) % 11
  if (rem === 10 || rem === 11) rem = 0
  if (rem !== parseInt(c[9])) return false

  sum = 0
  for (let i = 1; i <= 10; i++) sum += parseInt(c[i - 1]) * (12 - i)
  rem = (sum * 10) % 11
  if (rem === 10 || rem === 11) rem = 0
  return rem === parseInt(c[10])
}

function validateEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

function validateCEP(cep: string): boolean {
  return /^\d{5}-\d{3}$/.test(cep)
}

// ── POST — criar/atualizar perfil ────────────────────────

export async function POST(req: NextRequest) {
  const limited = rateLimit(req)
  if (limited) return limited

  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await req.json()
    const { nomeCompleto, cpf, rg, email, username, endereco, cep } = body

    // ── Campos obrigatórios
    if (!nomeCompleto?.trim()) return NextResponse.json({ error: 'Nome completo é obrigatório' }, { status: 400 })
    if (!cpf?.trim())          return NextResponse.json({ error: 'CPF é obrigatório' }, { status: 400 })
    if (!email?.trim())        return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    if (!username?.trim())     return NextResponse.json({ error: 'Login é obrigatório' }, { status: 400 })
    if (!endereco?.trim())     return NextResponse.json({ error: 'Endereço é obrigatório' }, { status: 400 })
    if (!cep?.trim())          return NextResponse.json({ error: 'CEP é obrigatório' }, { status: 400 })

    // ── Validações de formato
    if (!validateCPF(cpf))  return NextResponse.json({ error: 'CPF inválido' }, { status: 400 })
    if (!validateEmail(email)) return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    if (!validateCEP(cep))  return NextResponse.json({ error: 'CEP inválido (use formato: 00000-000)' }, { status: 400 })

    const usernameClean = sanitizeString(username, 30).toLowerCase()
    if (usernameClean.length < 3) {
      return NextResponse.json({ error: 'Login deve ter entre 3 e 30 caracteres' }, { status: 400 })
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(usernameClean)) {
      return NextResponse.json({ error: 'Login deve conter apenas letras, números, hífen e underscore' }, { status: 400 })
    }

    const cpfClean    = cpf.replace(/\D/g, '')
    const emailLower  = email.trim().toLowerCase()

    const supabase = getSupabaseAdmin()

    // ── Verificar duplicatas (excluindo o próprio usuário para updates)
    if (supabase) {
      const { data: byCpf } = await supabase
        .from('user_profiles')
        .select('clerk_id')
        .eq('cpf', cpfClean)
        .neq('clerk_id', userId)
        .maybeSingle()
      if (byCpf) return NextResponse.json({ error: 'Este CPF já está cadastrado' }, { status: 409 })

      const { data: byEmail } = await supabase
        .from('user_profiles')
        .select('clerk_id')
        .eq('email', emailLower)
        .neq('clerk_id', userId)
        .maybeSingle()
      if (byEmail) return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 409 })

      const { data: byUsername } = await supabase
        .from('user_profiles')
        .select('clerk_id')
        .eq('username', usernameClean)
        .neq('clerk_id', userId)
        .maybeSingle()
      if (byUsername) return NextResponse.json({ error: 'Este login já está em uso' }, { status: 409 })
    }

    const profile = {
      clerk_id:        userId,
      nome_completo:   sanitizeString(nomeCompleto, 120),
      cpf:             cpfClean,
      rg:              rg?.trim() ? sanitizeString(rg, 20) : null,
      email:           emailLower,
      username:        usernameClean,
      endereco:        sanitizeString(endereco, 300),
      cep:             cep.trim(),
      profile_complete: true,
      updated_at:      new Date().toISOString(),
    }

    // ── Upsert no Supabase
    if (supabase) {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(profile, { onConflict: 'clerk_id' })
        .select()
        .single()

      if (error) {
        console.error('[user-profile] Supabase error:', error)
        return NextResponse.json({ error: 'Erro ao salvar perfil' }, { status: 500 })
      }

      return NextResponse.json({ ok: true, profile: data })
    }

    // Supabase não configurado — retorna o objeto sem persistir (dev local)
    console.warn('[user-profile] SUPABASE não configurado — perfil não persistido')
    return NextResponse.json({ ok: true, profile, _warning: 'Supabase não configurado' })

  } catch (err) {
    console.error('[user-profile] Erro inesperado:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// ── GET — buscar perfil do usuário logado ────────────────

export async function GET(req: NextRequest) {
  const limited = rateLimit(req)
  if (limited) return limited

  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Serviço indisponível' }, { status: 503 })
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_id', userId)
      .maybeSingle()

    if (error) {
      console.error('[user-profile] GET error:', error)
      return NextResponse.json({ error: 'Erro ao buscar perfil' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
    }

    return NextResponse.json(data)

  } catch (err) {
    console.error('[user-profile] GET erro inesperado:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
