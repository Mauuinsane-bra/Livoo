'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const DISPOSABLE_DOMAINS = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
  'maildrop.cc', 'sharklasers.com', 'spam4.me', 'trashmail.com', 'throwaway.email',
]

type Status = 'idle' | 'loading' | 'success' | 'error'
type PasswordStrength = 'fraca' | 'media' | 'forte' | 'muito_forte'

interface FormData {
  nomeCompleto: string
  cpf: string
  rg: string
  email: string
  username: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  senha: string
  confirmSenha: string
}

interface FormErrors {
  [key: string]: string
}

function calculatePasswordStrength(password: string): PasswordStrength {
  if (password.length === 0) return 'fraca'
  if (password.length < 8) return 'fraca'
  if (password.length < 12) {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*]/.test(password)
    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecial].filter(Boolean).length
    return score >= 3 ? 'media' : 'fraca'
  }
  if (password.length < 16) {
    const hasNumbers = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*]/.test(password)
    return hasNumbers && hasSpecial ? 'forte' : 'media'
  }
  return 'muito_forte'
}

function formatCPF(value: string): string {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`
}

function formatCEP(value: string): string {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 5) return cleaned
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`
}

function validateEmail(email: string): boolean {
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) return false
  const domain = email.split('@')[1].toLowerCase()
  return !DISPOSABLE_DOMAINS.includes(domain)
}

export default function CompletarCadastroPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FormErrors>({})
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('fraca')
  const [cepData, setCepData] = useState<any>(null)
  const [loadingCEP, setLoadingCEP] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    nomeCompleto: '',
    cpf: '',
    rg: '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    username: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    senha: '',
    confirmSenha: '',
  })

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/cadastro')
    }
  }, [isLoaded, user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    let formattedValue = value
    if (name === 'cpf') formattedValue = formatCPF(value)
    if (name === 'cep') formattedValue = formatCEP(value)
    if (name === 'username') formattedValue = value.toLowerCase().replace(/[^\w-]/g, '')
    if (name === 'senha') setPasswordStrength(calculatePasswordStrength(value))

    setFormData(prev => ({ ...prev, [name]: formattedValue }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCEPBlur = async () => {
    const cep = formData.cep.replace(/\D/g, '')
    if (cep.length !== 8) return

    setLoadingCEP(true)
    try {
      const res = await fetch(`/api/cep?code=${cep}`)
      if (res.ok) {
        const data = await res.json()
        setCepData(data)
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro || prev.endereco,
          bairro: data.bairro || prev.bairro,
          cidade: data.cidade || prev.cidade,
          estado: data.estado || prev.estado,
        }))
      }
    } catch {
      console.error('Erro ao buscar CEP')
    } finally {
      setLoadingCEP(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.nomeCompleto.trim()) newErrors.nomeCompleto = 'Nome completo é obrigatório'
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório'
    else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) newErrors.cpf = 'CPF inválido'

    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório'
    else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido ou domínio descartável'
    }

    if (!formData.username.trim()) newErrors.username = 'Login é obrigatório'
    else if (formData.username.length < 3) newErrors.username = 'Login deve ter no mínimo 3 caracteres'
    else if (!formData.username.match(/^[a-zA-Z0-9_-]+$/)) newErrors.username = 'Login inválido'

    if (!formData.endereco.trim()) newErrors.endereco = 'Rua é obrigatória'
    if (!formData.numero.trim()) newErrors.numero = 'Número é obrigatório'
    if (!formData.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório'
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória'
    if (!formData.estado.trim()) newErrors.estado = 'Estado é obrigatório'
    if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório'
    else if (!/^\d{5}-\d{3}$/.test(formData.cep)) newErrors.cep = 'CEP inválido'

    if (!formData.senha) newErrors.senha = 'Senha é obrigatória'
    else if (formData.senha.length < 8) newErrors.senha = 'Senha deve ter no mínimo 8 caracteres'

    if (formData.confirmSenha !== formData.senha) newErrors.confirmSenha = 'Senhas não conferem'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setStatus('loading')
    try {
      const res = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCompleto: formData.nomeCompleto,
          cpf: formData.cpf,
          rg: formData.rg,
          email: formData.email,
          username: formData.username,
          endereco: `${formData.endereco}, ${formData.numero}${formData.complemento ? ', ' + formData.complemento : ''}, ${formData.bairro}, ${formData.cidade}, ${formData.estado}`,
          cep: formData.cep,
        }),
      })

      if (res.ok) {
        setStatus('success')
        setTimeout(() => router.push('/'), 2000)
      } else {
        const data = await res.json()
        setErrors({ submit: data.error || 'Erro ao salvar perfil' })
        setStatus('error')
      }
    } catch (err) {
      setErrors({ submit: 'Erro de conexão' })
      setStatus('error')
    }
  }

  if (!isLoaded || !user) return <div />

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'fraca': return '#dc2626'
      case 'media': return '#f59e0b'
      case 'forte': return '#10b981'
      case 'muito_forte': return '#0891b2'
      default: return '#d0dcf0'
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'fraca': return 'Fraca'
      case 'media': return 'Média'
      case 'forte': return 'Forte'
      case 'muito_forte': return 'Muito Forte'
      default: return ''
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D1B3E 0%, #1E3A6E 100%)',
      padding: '60px 24px',
    }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '48px 36px',
          boxShadow: '0 20px 60px rgba(13, 27, 62, 0.2)',
        }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2rem',
            fontWeight: 700,
            color: '#0D1B3E',
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Completar Cadastro
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem',
            color: '#5A6A80',
            textAlign: 'center',
            marginBottom: 36,
          }}>
            Preencha seus dados para completar o registro na Go Livoo
          </p>

          {status === 'success' && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 8,
              padding: 16,
              marginBottom: 24,
              textAlign: 'center',
              color: '#047857',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9rem',
            }}>
              Cadastro completado com sucesso! Redirecionando...
            </div>
          )}

          {errors.submit && (
            <div style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: 8,
              padding: 16,
              marginBottom: 24,
              color: '#dc2626',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9rem',
            }}>
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Seção 1: Dados Pessoais */}
            <fieldset style={{ border: 'none', padding: 0, marginBottom: 32 }}>
              <legend style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#0D1B3E',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <span style={{
                  width: 32,
                  height: 32,
                  background: '#F5A623',
                  color: '#fff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 700,
                }}>
                  1
                </span>
                Dados Pessoais
              </legend>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                {/* Nome Completo */}
                <div>
                  <label style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#0D1B3E',
                    display: 'block',
                    marginBottom: 6,
                  }}>
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleInputChange}
                    placeholder="João Silva Santos"
                    className="input-field"
                    style={{
                      borderColor: errors.nomeCompleto ? '#dc2626' : undefined,
                    }}
                  />
                  {errors.nomeCompleto && (
                    <small style={{ color: '#dc2626', fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                      {errors.nomeCompleto}
                    </small>
                  )}
                </div>

                {/* CPF e RG */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0D1B3E',
                      display: 'block',
                      marginBottom: 6,
                    }}>
                      CPF
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      placeholder="000.000.000-00"
                      className="input-field"
                      maxLength={14}
                      style={{
                        borderColor: errors.cpf ? '#dc2626' : undefined,
                      }}
                    />
                    {errors.cpf && (
                      <small style={{ color: '#dc2626', fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                        {errors.cpf}
                      </small>
                    )}
                  </div>
                  <div>
                    <label style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0D1B3E',
                      display: 'block',
                      marginBottom: 6,
                    }}>
                      RG (Opcional)
                    </label>
                    <input
                      type="text"
                      name="rg"
                      value={formData.rg}
                      onChange={handleInputChange}
                      placeholder="12.345.678-9"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Seção 2: Contato */}
            <fieldset style={{ border: 'none', padding: 0, marginBottom: 32 }}>
              <legend style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#0D1B3E',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <span style={{
                  width: 32,
                  height: 32,
                  background: '#F5A623',
                  color: '#fff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 700,
                }}>
                  2
                </span>
                Contato
              </legend>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                {/* Email */}
                <div>
                  <label style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#0D1B3E',
                    display: 'block',
                    marginBottom: 6,
                  }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    className="input-field"
                    style={{
                      borderColor: errors.email ? '#dc2626' : undefined,
                    }}
                  />
                  {errors.email && (
                    <small style={{ color: '#dc2626', fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                      {errors.email}
                    </small>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#0D1B3E',
                    display: 'block',
                    marginBottom: 6,
                  }}>
                    Login
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="seulogin"
                    className="input-field"
                    style={{
                      borderColor: errors.username ? '#dc2626' : undefined,
                    }}
                  />
                  {errors.username && (
                    <small style={{ color: '#dc2626', fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                      {errors.username}
                    </small>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Seção 3: Endereço */}
            <fieldset style={{ border: 'none', padding: 0, marginBottom: 32 }}>
              <legend style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#0D1B3E',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <span style={{
                  width: 32,
                  height: 32,
                  background: '#F5A623',
                  color: '#fff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 700,
                }}>
                  3
                </span>
                Endereço
              </legend>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                {/* CEP */}
                <div>
                  <label style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#0D1B3E',
                    display: 'block',
                    marginBottom: 6,
                  }}>
                    CEP
                  </label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    onBlur={handleCEPBlur}
                    placeholder="00000-000"
                    className="input-field"
                    maxLength={9}
                    style={{
                      borderColor: errors.cep ? '#dc2626' : undefined,
                    }}
                  />
                  {loadingCEP && (
                    <small style={{ color: '#1A56DB', fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                      Buscando informações...
                    </small>
                  )}
                  {errors.cep && (
                    <small style={{ color: '#dc2626', fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                      {errors.cep}
                    </small>
                  )}
                </div>

                {/* Rua, Número, Complemento */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0D1B3E',
                      display: 'block',
                      marginBottom: 6,
                    }}>
                      Rua
                    </label>
                    <input
                      type="text"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      placeholder="Rua das Flores"
                      className="input-field"
                      style={{
                        borderColor: errors.endereco ? '#dc2626' : undefined,
                      }}
                    />
                    {errors.endereco && (
                      <small style={{ color: '#dc2626', fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                        {errors.endereco}
                      </small>
                    )}
                  </div>
                  <div>
                    <label style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0D1B3E',
                      display: 'block',
                      marginBottom: 6,
                    }}>
                      Nº
                    </label>
                    <input
                      type="text"
                      name="numero"
                      value={formData.numero}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="input-field"
                      style={{
                        borderColor: errors.numero ? '#dc2626' : undefined,
                      }}
                    />
                    {errors.numero && (
                      <small style={{ color: '#dc2626', fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                        {errors.numero}
                      </small>
                    )}
                  </div>
                  <div>
                    <label style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0D1B3E',
                      display: 'block',
                      marginBottom: 6,
                    }}>
                      Apto
                    </label>
                    <input
                      type="text"
                      name="complemento"
                      value={formData.complemento}
                      onChange={handleInputChange}
                      placeholder="Apto 456"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Bairro, Cidade, Estado */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 16 }}>
                  <div>
                    <label style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0D1B3E',
                      display: 'block',
                      marginBottom: 6,
                    }}>
                      Bairro
                    </label>
                    <input
                      type="text"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleInputChange}
                      placeholder="Centro"
                      className="input-field"
                      style={{
                        borderColor: errors.bairro ? '#dc2626' : undefined,
                      }}
                    />
                    {errors.bairro && (
                      <small style={{ color: '#dc2626', fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                        {errors.bairro}
                      </small>
                    )}
                  </div>
                  <div>
                    <label style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0D1B3E',
                      display: 'block',
                      marginBottom: 6,
                    }}>
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      placeholder="São Paulo"
                      className="input-field"
                      style={{
                        borderColor: errors.cidade ? '#dc2626' : undefined,
                      }}
                    />
                    {errors.cidade && (
                      <small style={{ color: '#dc2626', fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                        {errors.cidade}
                      </small>
                    )}
                  </div>
                  <div>
                    <label style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0D1B3E',
                      display: 'block',
                      marginBottom: 6,
                    }}>
                      UF
                    </label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="input-field"
                      style={{
                        borderColor: errors.estado ? '#dc2626' : undefined,
                      }}
                    >
                      <option value="">Selecione</option>
                      <option value="SP">SP</option>
                      <option value="RJ">RJ</option>
                      <option value="MG">MG</option>
                      <option value="BA">BA</option>
                      <option value="SC">SC</option>
                      <option value="PR">PR</option>
                      <option value="RS">RS</option>
                      <option value="PE">PE</option>
                      <option value="CE">CE</option>
                      <option value="PA">PA</option>
                      <option value="GO">GO</option>
                      <option value="PB">PB</option>
                      <option value="MA">MA</option>
                      <option value="MT">MT</option>
                      <option value="DF">DF</option>
                      <option value="ES">ES</option>
                      <option value="SE">SE</option>
                      <option value="RN">RN</option>
                      <option value="AL">AL</option>
                      <option value="RO">RO</option>
                      <option value="AC">AC</option>
                      <option value="AM">AM</option>
                      <option value="RR">RR</option>
                      <option value="AP">AP</option>
                      <option value="TO">TO</option>
                    </select>
                    {errors.estado && (
                      <small style={{ color: '#dc2626', fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                        {errors.estado}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Seção 4: Segurança */}
            <fieldset style={{ border: 'none', padding: 0, marginBottom: 32 }}>
              <legend style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#0D1B3E',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <span style={{
                  width: 32,
                  height: 32,
                  background: '#F5A623',
                  color: '#fff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 700,
                }}>
                  4
                </span>
                Segurança
              </legend>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                {/* Senha */}
                <div>
                  <label style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#0D1B3E',
                    display: 'block',
                    marginBottom: 6,
                  }}>
                    Senha
                  </label>
                  <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="input-field"
                    style={{
                      borderColor: errors.senha ? '#dc2626' : undefined,
                    }}
                  />
                  {formData.senha && (
                    <div style={{
                      marginTop: 6,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                      <div style={{
                        flex: 1,
                        height: 4,
                        background: '#e5e7eb',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: passwordStrength === 'fraca' ? '25%' : passwordStrength === 'media' ? '50%' : passwordStrength === 'forte' ? '75%' : '100%',
                          background: getPasswordStrengthColor(),
                          transition: 'all 0.3s',
                        }} />
                      </div>
                      <small style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.75rem',
                        color: getPasswordStrengthColor(),
                        fontWeight: 600,
                      }}>
                        {getPasswordStrengthText()}
                      </small>
                    </div>
                  )}
                  {errors.senha && (
                    <small style={{ color: '#dc2626', fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                      {errors.senha}
                    </small>
                  )}
                </div>

                {/* Confirmar Senha */}
                <div>
                  <label style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#0D1B3E',
                    display: 'block',
                    marginBottom: 6,
                  }}>
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    name="confirmSenha"
                    value={formData.confirmSenha}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="input-field"
                    style={{
                      borderColor: errors.confirmSenha ? '#dc2626' : undefined,
                    }}
                  />
                  {errors.confirmSenha && (
                    <small style={{ color: '#dc2626', fontSize: '0.75rem', display: 'block', marginTop: 4 }}>
                      {errors.confirmSenha}
                    </small>
                  )}
                </div>
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-gold"
              style={{
                width: '100%',
                padding: 14,
                fontSize: '1rem',
                opacity: status === 'loading' ? 0.7 : 1,
              }}
            >
              {status === 'loading' ? 'Salvando...' : 'Completar Cadastro'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
