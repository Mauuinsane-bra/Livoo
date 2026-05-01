// Endpoint de diagnóstico removido por segurança — expunha detalhes internos do Sanity.
// Se precisar debugar, recriar temporariamente e remover antes de commitar.

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ error: 'Endpoint desativado' }, { status: 404 })
}
