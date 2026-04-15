'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: '', email: '', assunto: '', mensagem: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    // Simula envio (integração com Resend pode ser adicionada depois)
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    setSending(false)
  }

  return (
    <div style={{ background: '#F4F7FF', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0D1B3E 0%, #1E3A6E 100%)',
        padding: '80px 24px 88px',
        textAlign: 'center',
      }}>
        <span style={{
          display: 'inline-block',
          background: 'rgba(245,166,35,0.15)',
          color: '#F5A623',
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
          fontFamily: 'Fraunces, serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          color: '#fff',
          marginBottom: 16,
          lineHeight: 1.2,
        }}>
          Estamos aqui para ajudar
        </h1>
        <p style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
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
              border: '1px solid #D0DCF0',
            }}>
              <h3 style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '1.05rem',
                color: '#0D1B3E',
                marginBottom: 8,
              }}>
                Email
              </h3>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.9rem',
                color: '#1A56DB',
                margin: 0,
              }}>
                contato@golivoo.com.br
              </p>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: '28px 28px',
              border: '1px solid #D0DCF0',
            }}>
              <h3 style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '1.05rem',
                color: '#0D1B3E',
                marginBottom: 8,
              }}>
                Tempo de resposta
              </h3>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.88rem',
                color: '#5A6A80',
                margin: 0,
                lineHeight: 1.65,
              }}>
                Respondemos em até 48 horas úteis. Para dúvidas rápidas, consulte nossa página
                {' '}<Link href="/como-funciona" style={{ color: '#1A56DB', fontWeight: 600 }}>Como funciona</Link>.
              </p>
            </div>

            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: '28px 28px',
              border: '1px solid #D0DCF0',
            }}>
              <h3 style={{
                fontFamily: 'Fraunces, serif',
                fontSize: '1.05rem',
                color: '#0D1B3E',
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
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.82rem',
                    color: '#5A6A80',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <span style={{ color: '#1A56DB', fontWeight: 700 }}>→</span>
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
            border: '1px solid #D0DCF0',
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
                  fontSize: 28,
                }}>
                  ✓
                </div>
                <h3 style={{
                  fontFamily: 'Fraunces, serif',
                  fontSize: '1.4rem',
                  color: '#0D1B3E',
                  marginBottom: 12,
                }}>
                  Mensagem enviada!
                </h3>
                <p style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.92rem',
                  color: '#5A6A80',
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}>
                  Recebemos sua mensagem e responderemos em até 48 horas no email informado.
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
                  fontFamily: 'Fraunces, serif',
                  fontSize: '1.4rem',
                  color: '#0D1B3E',
                  marginBottom: 28,
                }}>
                  Enviar mensagem
                </h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#0D1B3E',
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
                          border: '1.5px solid #D0DCF0',
                          borderRadius: 10,
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                          fontSize: '0.9rem',
                          color: '#0D1B3E',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#0D1B3E',
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
                          border: '1.5px solid #D0DCF0',
                          borderRadius: 10,
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                          fontSize: '0.9rem',
                          color: '#0D1B3E',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#0D1B3E',
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
                        border: '1.5px solid #D0DCF0',
                        borderRadius: 10,
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '0.9rem',
                        color: form.assunto ? '#0D1B3E' : '#9AAABB',
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
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#0D1B3E',
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
                        border: '1.5px solid #D0DCF0',
                        borderRadius: 10,
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '0.9rem',
                        color: '#0D1B3E',
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
                    {sending ? 'Enviando...' : 'Enviar mensagem'}
                  </button>

                  <p style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.75rem',
                    color: '#9AAABB',
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                    Ao enviar, você concorda com nossa{' '}
                    <Link href="/privacidade" style={{ color: '#1A56DB' }}>Política de Privacidade</Link>.
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
