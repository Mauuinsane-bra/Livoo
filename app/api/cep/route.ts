import { NextRequest, NextResponse } from 'next/server'

// Integração com API viacep.com.br para auto-preenchimento de CEP
// Exemplo: GET /api/cep?code=01310100
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')

    if (!code || !/^\d{5}-?\d{3}$/.test(code)) {
      return NextResponse.json({ error: 'CEP inválido' }, { status: 400 })
    }

    const cepClean = code.replace(/\D/g, '')
    const response = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`)

    if (!response.ok) {
      return NextResponse.json({ error: 'Erro ao buscar CEP' }, { status: 500 })
    }

    const data = await response.json()

    if (data.erro) {
      return NextResponse.json({ error: 'CEP não encontrado' }, { status: 404 })
    }

    // Retorna os dados formatados
    return NextResponse.json({
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
    })
  } catch (err) {
    console.error('[cep] Erro:', err)
    return NextResponse.json({ error: 'Erro ao buscar CEP' }, { status: 500 })
  }
}
