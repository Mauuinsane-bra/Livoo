// lib/roteiro-pdf.tsx
// Gera o PDF premium do roteiro (Fase 1: texto + marca Go Livoo, sem fotos/mapa).
// Fontes da marca (Nunito/Inter) e mapa/imagens entram em fases seguintes.
import React from 'react'
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer'
import type { FullItinerary, DayPlan, BudgetCategory, ChecklistSection } from '@/app/api/roteiro/route'

const NAVY = '#0F2340'
const GOLD = '#F5A800'
const BLUE = '#1A82D8'
const INK = '#1f2937'
const MUTED = '#64748B'

const s = StyleSheet.create({
  page: { paddingTop: 44, paddingBottom: 56, paddingHorizontal: 44, fontSize: 10, fontFamily: 'Helvetica', color: INK, lineHeight: 1.5 },
  // Capa
  cover: { backgroundColor: NAVY, color: '#fff', padding: 50, height: '100%', justifyContent: 'space-between' },
  brand: { fontSize: 20, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  brandDot: { color: GOLD },
  tagline: { fontSize: 9, color: '#cbd5e1', marginTop: 4, letterSpacing: 1, textTransform: 'uppercase' },
  goldLine: { width: 60, height: 4, backgroundColor: GOLD, marginBottom: 18, borderRadius: 2 },
  coverKicker: { fontSize: 11, color: GOLD, fontFamily: 'Helvetica-Bold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 },
  coverTitle: { fontSize: 36, fontFamily: 'Helvetica-Bold', lineHeight: 1.05 },
  coverMeta: { fontSize: 12, color: '#e2e8f0', marginTop: 14 },
  coverFor: { fontSize: 11, color: '#cbd5e1', marginTop: 24 },
  coverFoot: { fontSize: 9, color: '#94a3b8' },
  // Seções
  sectionTitle: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: NAVY, marginTop: 20, marginBottom: 8, paddingBottom: 5, borderBottomWidth: 2, borderBottomColor: GOLD },
  intro: { fontSize: 10.5, color: INK, marginBottom: 6 },
  introLabel: { fontFamily: 'Helvetica-Bold', color: NAVY },
  // Orçamento
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: '#eef2f7' },
  budgetCat: { fontFamily: 'Helvetica-Bold', color: NAVY, fontSize: 10.5 },
  budgetTip: { color: MUTED, fontSize: 9, marginTop: 2 },
  budgetVal: { fontFamily: 'Helvetica-Bold', color: NAVY, fontSize: 11, textAlign: 'right' },
  budgetPct: { color: BLUE, fontSize: 9, textAlign: 'right' },
  budgetTotal: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, fontFamily: 'Helvetica-Bold', color: NAVY, fontSize: 12 },
  // Dia
  dayHeader: { backgroundColor: NAVY, color: '#fff', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 4, marginTop: 22, marginBottom: 10 },
  dayNum: { color: GOLD, fontSize: 9, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  dayTitle: { color: '#fff', fontSize: 13, fontFamily: 'Helvetica-Bold', marginTop: 2 },
  act: { flexDirection: 'row', marginBottom: 8 },
  actTime: { width: 42, color: MUTED, fontSize: 9, fontFamily: 'Helvetica-Bold' },
  actBody: { flex: 1 },
  actTitle: { fontFamily: 'Helvetica-Bold', color: NAVY, fontSize: 10.5, marginBottom: 1 },
  actDesc: { color: INK, fontSize: 10 },
  note: { marginTop: 8, paddingLeft: 10, borderLeftWidth: 3, borderLeftColor: '#e2e8f0' },
  noteLabel: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  noteText: { fontSize: 10, color: INK },
  rest: { marginTop: 3, fontSize: 10 },
  restName: { fontFamily: 'Helvetica-Bold', color: NAVY },
  // Checklist
  checkSection: { marginBottom: 10 },
  checkCat: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 4 },
  checkItem: { flexDirection: 'row', marginBottom: 3 },
  checkBullet: { color: BLUE, marginRight: 6, fontFamily: 'Helvetica-Bold' },
  // Rodapé
  footer: { position: 'absolute', bottom: 24, left: 44, right: 44, flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: MUTED, borderTopWidth: 1, borderTopColor: '#eef2f7', paddingTop: 6 },
  closing: { marginTop: 26, padding: 16, backgroundColor: '#FFF8EC', borderRadius: 6 },
  closingText: { fontSize: 10, color: '#92400e' },
})

function brl(n: number): string {
  return 'R$ ' + (n || 0).toLocaleString('pt-BR')
}

// Helvetica embutida não tem glifos fora do Latin-1 (ex: seta →). Troca por
// equivalentes seguros até embutirmos as fontes da marca (fase seguinte).
function clean(t: string): string {
  return (t || '').replace(/[→➜⟶➝]/g, '·')
}

function Note({ label, color, text }: { label: string; color: string; text?: string }) {
  if (!text) return null
  return (
    <View style={s.note}>
      <Text style={[s.noteLabel, { color }]}>{label}</Text>
      <Text style={s.noteText}>{text}</Text>
    </View>
  )
}

function Footer() {
  return (
    <View style={s.footer} fixed>
      <Text>Go Livoo · Você quer a experiência. A Go Livoo resolve o resto.</Text>
      <Text render={({ pageNumber }) => `${pageNumber}`} />
    </View>
  )
}

function RoteiroDoc({ it, clientName }: { it: FullItinerary; clientName?: string }) {
  return (
    <Document title={`Roteiro ${clean(it.destination)} — Go Livoo`} author="Go Livoo">
      {/* Capa */}
      <Page size="A4" style={{ fontFamily: 'Helvetica' }}>
        <View style={s.cover}>
          <View>
            <Text style={s.brand}>Go Livoo<Text style={s.brandDot}>.</Text></Text>
            <Text style={s.tagline}>Vá mais longe por menos</Text>
          </View>
          <View>
            <View style={s.goldLine} />
            <Text style={s.coverKicker}>Roteiro personalizado</Text>
            <Text style={s.coverTitle}>{clean(it.destination)}</Text>
            <Text style={s.coverMeta}>{it.duration}{it.totalBudget ? `  ·  Orçamento ${brl(it.totalBudget)}` : ''}</Text>
            {clientName ? <Text style={s.coverFor}>Preparado para {clientName}</Text> : null}
          </View>
          <Text style={s.coverFoot}>golivoo.com.br</Text>
        </View>
      </Page>

      {/* Conteúdo */}
      <Page size="A4" style={s.page}>
        <Text style={s.sectionTitle}>Antes de viajar</Text>
        {it.visaInfo ? <Text style={s.intro}><Text style={s.introLabel}>Documentação: </Text>{it.visaInfo}</Text> : null}
        {it.bestTime ? <Text style={s.intro}><Text style={s.introLabel}>Melhor época: </Text>{it.bestTime}</Text> : null}

        {it.budgetBreakdown && it.budgetBreakdown.length > 0 ? (
          <>
            <Text style={s.sectionTitle}>Orçamento estimado</Text>
            {it.budgetBreakdown.map((b: BudgetCategory, i: number) => (
              <View key={i} style={s.budgetRow}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={s.budgetCat}>{b.category}</Text>
                  {b.tip ? <Text style={s.budgetTip}>{b.tip}</Text> : null}
                </View>
                <View style={{ width: 90 }}>
                  <Text style={s.budgetVal}>{brl(b.estimated)}</Text>
                  <Text style={s.budgetPct}>{b.percentage}%</Text>
                </View>
              </View>
            ))}
            <View style={s.budgetTotal}>
              <Text>Total estimado</Text>
              <Text>{brl(it.totalBudget)}</Text>
            </View>
          </>
        ) : null}

        {/* Dia a dia */}
        <Text style={s.sectionTitle}>Seu roteiro dia a dia</Text>
        {it.dayByDay.map((day: DayPlan) => (
          <View key={day.day} wrap={false}>
            <View style={s.dayHeader}>
              <Text style={s.dayNum}>DIA {day.day}</Text>
              <Text style={s.dayTitle}>{day.title}</Text>
            </View>
            {day.activities.map((a, i) => (
              <View key={i} style={s.act}>
                <Text style={s.actTime}>{a.time}</Text>
                <View style={s.actBody}>
                  <Text style={s.actTitle}>{a.title}</Text>
                  <Text style={s.actDesc}>{a.desc}</Text>
                </View>
              </View>
            ))}
            <Note label="Curiosidade" color={BLUE} text={day.curiosity} />
            <Note label="Por perto" color="#16a34a" text={day.hiddenGem} />
            <Note label="Dica de viajante" color={GOLD} text={day.travelerTip} />
            {day.restaurants && day.restaurants.length > 0 ? (
              <View style={s.note}>
                <Text style={[s.noteLabel, { color: '#9333ea' }]}>Onde comer</Text>
                {day.restaurants.map((r, i) => (
                  <Text key={i} style={s.rest}><Text style={s.restName}>{r.name}</Text>{r.desc ? ` — ${r.desc}` : ''}</Text>
                ))}
              </View>
            ) : null}
          </View>
        ))}

        {/* Checklist */}
        {it.checklist && it.checklist.length > 0 ? (
          <>
            <Text style={s.sectionTitle}>Checklist de preparação</Text>
            {it.checklist.map((sec: ChecklistSection, i: number) => (
              <View key={i} style={s.checkSection}>
                <Text style={s.checkCat}>{sec.category}</Text>
                {sec.items.map((item, j) => (
                  <View key={j} style={s.checkItem}>
                    <Text style={s.checkBullet}>✓</Text>
                    <Text style={{ flex: 1 }}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        ) : null}

        <View style={s.closing}>
          <Text style={s.closingText}>
            Este roteiro foi montado pela Go Livoo especialmente para você. Bons ventos e boa viagem — e quando quiser, a gente resolve voos, hotéis e documentação por você em golivoo.com.br.
          </Text>
        </View>

        <Footer />
      </Page>
    </Document>
  )
}

export async function buildRoteiroPdf(it: FullItinerary, opts: { clientName?: string } = {}): Promise<Buffer> {
  return renderToBuffer(<RoteiroDoc it={it} clientName={opts.clientName} />)
}
