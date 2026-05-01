// lib/sherpa.ts
// Integração com Sherpa API para requisitos de entrada por país
// Documentação: https://developers.sherpa.com/

export interface EntryRequirements {
  destination:         string
  nationality:         string
  visaRequired:        boolean
  visaType:            'not_required' | 'on_arrival' | 'e_visa' | 'embassy' | 'unknown'
  visaInfo:            string
  passportValidity:    string   // ex: "Mín. 6 meses após a data de retorno"
  vaccinesRequired:    Vaccine[]
  vaccinesRecommended: Vaccine[]
  entryRestrictions:   string[]
  lastUpdated:         string
  source:              string
}

export interface Vaccine {
  name:    string
  status:  'required' | 'recommended'
  details: string
}

export async function checkEntryRequirements(
  nationality: string,    // código ISO 2 letras, ex: 'BR'
  destination: string,    // código ISO 2 letras, ex: 'GE'
): Promise<EntryRequirements> {
  const res = await fetch(
    `https://sherpa.com/api/v2/entry-requirements?nationality=${nationality}&destination=${destination}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SHERPA_API_KEY!}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache por 1 hora (dados mudam pouco)
    }
  )

  if (!res.ok) {
    throw new Error(`Sherpa API error: ${res.status}`)
  }

  const data = await res.json()

  // Mapear resposta Sherpa para o nosso schema
  return {
    destination,
    nationality,
    visaRequired:        data.visa?.required ?? false,
    visaType:            data.visa?.type ?? 'unknown',
    visaInfo:            data.visa?.info ?? 'Consulte o consulado',
    passportValidity:    data.passport?.validity ?? 'Verificar',
    vaccinesRequired:    (data.vaccines?.required ?? []).map((v: Record<string, string>) => ({
      name:    v.name,
      status:  'required' as const,
      details: v.details ?? '',
    })),
    vaccinesRecommended: (data.vaccines?.recommended ?? []).map((v: Record<string, string>) => ({
      name:    v.name,
      status:  'recommended' as const,
      details: v.details ?? '',
    })),
    entryRestrictions:   data.restrictions ?? [],
    lastUpdated:         data.last_updated ?? new Date().toISOString(),
    source:              'Sherpa API',
  }
}
