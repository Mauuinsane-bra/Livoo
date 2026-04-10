import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import path from 'path'
import fs from 'fs'

const DATA_FILE = path.join(process.cwd(), 'data', 'user-profiles.json')

// CPF validation algorithm (modulo 11)
function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) return false

  let sum = 0
  let remainder = 0

  // First check digit
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false

  // Second check digit
  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false

  return true
}

// CEP format validation (00000-000)
function validateCEP(cep: string): boolean {
  return /^\d{5}-\d{3}$/.test(cep)
}

// Email format validation
function validateEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

// Read profiles from file
function readProfiles(): any[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return []
  }
}

// Write profiles to file
function writeProfiles(profiles: any[]) {
  try {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(DATA_FILE, JSON.stringify(profiles, null, 2), 'utf-8')
  } catch (err) {
    console.error('[user-profile] Erro ao salvar:', err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await req.json()
    const { nomeCompleto, cpf, rg, email, username, endereco, cep } = body

    // Validação de campos obrigatórios
    if (!nomeCompleto?.trim()) {
      return NextResponse.json({ error: 'Nome completo é obrigatório' }, { status: 400 })
    }
    if (!cpf?.trim()) {
      return NextResponse.json({ error: 'CPF é obrigatório' }, { status: 400 })
    }
    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }
    if (!username?.trim()) {
      return NextResponse.json({ error: 'Login é obrigatório' }, { status: 400 })
    }
    if (!endereco?.trim()) {
      return NextResponse.json({ error: 'Endereço é obrigatório' }, { status: 400 })
    }
    if (!cep?.trim()) {
      return NextResponse.json({ error: 'CEP é obrigatório' }, { status: 400 })
    }

    // Validações de formato
    if (!validateCPF(cpf)) {
      return NextResponse.json({ error: 'CPF inválido' }, { status: 400 })
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }
    if (!validateCEP(cep)) {
      return NextResponse.json({ error: 'CEP inválido (use formato: 00000-000)' }, { status: 400 })
    }
    if (username.length < 3 || username.length > 30) {
      return NextResponse.json({ error: 'Login deve ter entre 3 e 30 caracteres' }, { status: 400 })
    }
    if (!username.match(/^[a-zA-Z0-9_-]+$/)) {
      return NextResponse.json({ error: 'Login deve conter apenas letras, números, hífen e underscore' }, { status: 400 })
    }

    // Verifique duplicatas
    const profiles = readProfiles()
    const cpfClean = cpf.replace(/\D/g, '')
    const emailLower = email.trim().toLowerCase()
    const usernameLower = username.trim().toLowerCase()

    if (profiles.some(p => p.cpf === cpfClean)) {
      return NextResponse.json({ error: 'Este CPF já está cadastrado' }, { status: 409 })
    }

    if (profiles.some(p => p.email === emailLower)) {
      return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 409 })
    }

    if (profiles.some(p => p.username === usernameLower)) {
      return NextResponse.json({ error: 'Este login já está em uso' }, { status: 409 })
    }

    // Salvar perfil
    const profile = {
      id: userId,
      clerkId: userId,
      nomeCompleto: nomeCompleto.trim(),
      cpf: cpfClean,
      rg: rg?.trim() || null,
      email: emailLower,
      username: usernameLower,
      endereco: endereco.trim(),
      cep: cep.trim(),
      profileComplete: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    profiles.push(profile)
    writeProfiles(profiles)

    return NextResponse.json({ ok: true, profile })
  } catch (err) {
    console.error('[user-profile] Erro:', err)
    return NextResponse.json({ error: 'Erro ao salvar perfil' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const profiles = readProfiles()
    const profile = profiles.find(p => p.clerkId === userId)

    if (!profile) {
      return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (err) {
    console.error('[user-profile] Erro ao buscar:', err)
    return NextResponse.json({ error: 'Erro ao buscar perfil' }, { status: 500 })
  }
}
