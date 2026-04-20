// sanity.config.ts — configuração do Sanity Studio embutido no Next.js
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'go-livoo',
  title: 'Go Livoo · Blog',
  projectId: 'r1ne031h',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Go Livoo')
          .items([
            S.listItem()
              .title('Posts do Blog')
              .schemaType('blogPost')
              .child(S.documentTypeList('blogPost').title('Posts do Blog')),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})