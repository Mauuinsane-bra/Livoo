// sanity/schemaTypes/blogPost.ts
import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Post do Blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: Rule => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Resumo (aparece nos cards e no SEO)',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().max(300),
    }),
    defineField({
      name: 'content',
      title: 'Conteúdo',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Citação', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Negrito', value: 'strong' },
              { title: 'Itálico', value: 'em' },
              { title: 'Código', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL' },
                  {
                    name: 'blank',
                    title: 'Abrir em nova aba?',
                    type: 'boolean',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Texto alternativo' },
            { name: 'caption', type: 'string', title: 'Legenda' },
          ],
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Copa do Mundo 2026', value: 'Copa do Mundo 2026' },
          { title: 'Automobilismo', value: 'Automobilismo' },
          { title: 'Festivais', value: 'Festivais' },
          { title: 'Cultura', value: 'Cultura' },
          { title: 'Dicas de Viagem', value: 'Dicas de Viagem' },
          { title: 'Esportes', value: 'Esportes' },
          { title: 'Aventura', value: 'Aventura' },
          { title: 'Gastronomia', value: 'Gastronomia' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Imagem de capa',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Texto alternativo' },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Data de publicação',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'readTime',
      title: 'Tempo de leitura (minutos)',
      type: 'number',
      initialValue: 5,
    }),
    defineField({
      name: 'tags',
      title: 'Tags (SEO)',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'featured',
      title: 'Destacar na página do blog?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'autoPost',
      title: 'Publicar automaticamente no Instagram e Facebook?',
      description: 'Quando ativado, ao publicar este post o sistema gera uma legenda com IA e posta nas redes sociais.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'coverImage',
      publishedAt: 'publishedAt',
    },
    prepare({ title, category, media, publishedAt }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString('pt-BR')
        : ''
      return {
        title: title || 'Sem título',
        subtitle: `${category || ''} · ${date}`,
        media,
      }
    },
  },
})