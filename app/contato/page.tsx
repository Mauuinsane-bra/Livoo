'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: '', email: '', assunto: '', mensagem: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const ASSUNTO_LABEL: Record<string, string> = {
    roteiro:  'Dúvida sobre roteiro gerado',
    prep:     'Problema com Livoo Prep',
    evento:   'Sugestão de evento',
    parceria: 'Parceria comercial',
    imprensa: 'Imprensa e mídia',
    outro:    'Outro',
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)

    // Abre o cliente de email do usuário com a mensagem pronta para enviar.
    // Isso garante que a mensagem realmente chegue ao destinatário
    // (contato@golivoo.com.br) sem depender de backend ainda não configurado.
    const assuntoLabel = ASSUNTO_LABEL[form.assunto] || form.assunto || 'Contato pelo site'
    const subject = `[Go Livoo] ${assuntoLabel}`
    const body = [
      `Nome: ${form.nome}`,
      `Email: ${form.email}`,
      `Assunto: ${assuntoLabel}`,
      '',
      'Mensagem:',
      form.mensagem,
    ].join('\n')

    const mailto = `mailto:contato@golivoo.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    // Pequena pausa para o usuário ver o estado "enviando"
    await new Promise(r => setTimeout(r, 400))

    if (typeof window !== 'undefined') {
      window.location.href = mailto
    }

    setSent(true)
    setSending(false)
  }

  return (
    <div style={{ background: '#F4F6F9', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0F2340 0%, #1A82D8 60%, #2B9FEE 100%)',
        padding: '80px 24px 88px',
        textAlign: 'center',
      }}>
        <span style={{
          display: 'inline-block',
          background: 'rgba(245,166,35,0.15)',
          color: '#F5A800',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          padding: '5px 14px',
          borderRadius: 50,
          marginBottom: 20,
          border: '1px solid rgba(245,166,35,0.3)',
        }}>
          Fale conosco
        </span>
        <h1 style={{
          fontFamily: 'Nunito, sans-serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: '#fff',
          marginBottom: 16,
          lineHeight: 1.2,
        }}>
          Estamos aqui para ajudar
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1.05rem',
          color: 'rgba(255,255,255,0.65)',
          maxWidth: 520,
          margin: '0 auto',
          lineHeight: 1.75,
        }}>
          Tem dúvida sobre um roteiro, um evento ou sobre como funciona a plataforma? Nos mande uma mensagem.
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: 32,
          alignItems: 'start',
        }}>

          {/* Info lateral */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: '28px 28px',
              border: '1px solid #E2E8F0',
            }}>
              <h3 style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '1.05rem',
                color: '#0F2340',
                marginBottom: 8,
              }}>
                Email
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                color: '#1A82D8',
                margin: 0,
              }}>
                contato@golivoo.com.br
              </p>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: '28px 28px',
              border: '1px solid #E2E8F0',
            }}>
              <h3 style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '1.05rem',
                color: '#0F2340',
                marginBottom: 8,
              }}>
                Tempo de resposta
              </h3>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.88rem',
                color: '#64748B',
                margin: 0,
                lineHeight: 1.65,
              }}>
                Respondemos em até 48 horas úteis. Para dúvidas rápidas, consulte nossa página
                {' '}<Link href="/como-funciona" style={{ color: '#1A82D8', fontWeight: 600 }}>Como funciona</Link>.
              </p>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: '28px 28px',
              border: '1px solid #E2E8F0',
            }}>
              <h3 style={{
                fontFamily: 'Nunito, sans-serif',
                fontSize: '1.05rem',
                color: '#0F2340',
                marginBottom: 12,
              }}>
                Assuntos frequentes
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Dúvida sobre roteiro gerado',
                  'Problema com o Livoo Prep',
                  'Sugestão de evento',
                  'Parceria comercial',
                  'Imprensa e mídia',
                ].map(item => (
                  <span key={item} style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.82rem',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <span style={{ color: '#1A82D8', fontWeight: 700 }}>→</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '40px 44px',
            boxShadow: '0 4px 24px rgba(13,27,62,0.08)',
            border: '1px solid #E2E8F0',
          }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{
                  width: 64, height: 64,
                  borderRadius: '50%',
                  background: 'rgba(22,163,74,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <h3 style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '1.4rem',
                  color: '#0F2340',
                  marginBottom: 12,
                }}>
                  Seu email foi preparado
                </h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.92rem',
                  color: '#64748B',
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}>
                  Abrimos seu cliente de email com a mensagem pronta para{' '}
                  <strong style={{ color: '#0F2340' }}>contato@golivoo.com.br</strong>.
                  Revise e clique em enviar — respondemos em até 48 horas úteis.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ nome: '', email: '', assunto: '', mensagem: '' }) }}
                  className="btn-outline"
                  style={{ fontSize: '0.88rem' }}
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <>
                <h2 style={{
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '1.4rem',
                  color: '#0F2340',
                  marginBottom: 28,
                }}>
                  Enviar mensagem
                </h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#0F2340',
                        marginBottom: 6,
                      }}>
                        Nome *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.nome}
                        onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                        placeholder="Seu nome"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1.5px solid #E2E8F0',
                          borderRadius: 10,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.9rem',
                          color: '#0F2340',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#0F2340',
                        marginBottom: 6,
                      }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="seu@email.com"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1.5px solid #E2E8F0',
                          borderRadius: 10,
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.9rem',
                          color: '#0F2340',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#0F2340',
                      marginBottom: 6,
                    }}>
                      Assunto *
                    </label>
                    <select
                      required
                      value={form.assunto}
                      onChange={e => setForm(f => ({ ...f, assunto: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: 10,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.9rem',
                        color: form.assunto ? '#0F2340' : '#9AAABB',
                        background: '#fff',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="" disabled>Selecione o assunto</option>
                      <option value="roteiro">Dúvida sobre roteiro gerado</option>
                      <option value="prep">Problema com Livoo Prep</option>
                      <option value="evento">Sugestão de evento</option>
                      <option value="parceria">Parceria comercial</option>
                      <option value="imprensa">Imprensa e mídia</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#0F2340',
                      marginBottom: 6,
                    }}>
                      Mensagem *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.mensagem}
                      onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))}
                      placeholder="Descreva sua dúvida ou solicitação..."
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: 10,
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.9rem',
                        color: '#0F2340',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary"
                    style={{ fontSize: '0.92rem', padding: '13px 0', opacity: sending ? 0.7 : 1 }}
                  >
                    {sending ? 'Preparando...' : 'Abrir no meu email'}
                  </button>

                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem',
                    color: '#9AAABB',
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                    Ao enviar, você concorda com nossa{' '}
                    <Link href="/privacidade" style={{ color: '#1A82D8' }}>Política de Privacidade</Link>.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
