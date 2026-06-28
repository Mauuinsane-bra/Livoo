import {defineField, defineType} from 'sanity'

// Tipo "Evento" — alimenta o banner de destaque e a grade de eventos da home.
// A home mostra SOMENTE eventos cuja data ainda não passou. Não é preciso
// apagar evento vencido: ele some sozinho da home quando a data passa.
export const event = defineType({
  name: 'event',
  title: 'Evento',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome do evento',
      description: 'Ex: "GP de Mônaco — F1 2026", "Rock in Rio 2026".',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'date',
      title: 'Data do evento (início)',
      description: 'Quando o evento começa. A home esconde o evento depois que essa data (ou a data de término) passa.',
      type: 'date',
      options: {dateFormat: 'DD/MM/YYYY'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Data de término (opcional)',
      description: 'Só para eventos de vários dias (ex: Oktoberfest). Deixe vazio se for de um dia.',
      type: 'date',
      options: {dateFormat: 'DD/MM/YYYY'},
    }),
    defineField({
      name: 'location',
      title: 'Local',
      description: 'Ex: "Monte Carlo, Mônaco", "Rio de Janeiro · Brasil".',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          {title: 'Festivais & Shows', value: 'Festival'},
          {title: 'Esportes', value: 'Esportes'},
          {title: 'Automobilismo', value: 'Automobilismo'},
          {title: 'Gastronomia', value: 'Gastronomia'},
          {title: 'Cultura', value: 'Cultura'},
          {title: 'Aventura', value: 'Aventura'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categoryDetail',
      title: 'Detalhe da categoria (opcional)',
      description: 'Complemento curto que aparece junto da categoria. Ex: "5 dias", "Domingo", "7 noites".',
      type: 'string',
    }),
    defineField({
      name: 'badge',
      title: 'Selo (opcional)',
      description: 'Texto do selo dourado no card. Se deixar vazio, mostra o mês e ano automaticamente (ex: "Julho 2026").',
      type: 'string',
    }),
    defineField({
      name: 'coverImage',
      title: 'Foto de capa',
      description: 'Foto que aparece no card. Use uma imagem horizontal de boa qualidade que represente o evento.',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', type: 'string', title: 'Texto alternativo (acessibilidade)'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'includes',
      title: 'O que o roteiro inclui',
      description: 'Itens que aparecem como etiquetas no card. Ex: "Voo", "Hotel: 4 noites", "Ingresso".',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'link',
      title: 'Link do botão (opcional)',
      description: 'Para onde o botão "Montar roteiro" leva. Deixe vazio para usar a página geral de eventos (/eventos).',
      type: 'string',
    }),
  ],
  preview: {
    select: {title: 'title', location: 'location', date: 'date', media: 'coverImage'},
    prepare({title, location, date, media}) {
      const d = date ? new Date(date).toLocaleDateString('pt-BR') : 'sem data'
      return {title: title || 'Sem nome', subtitle: `${d} · ${location || ''}`, media}
    },
  },
})
