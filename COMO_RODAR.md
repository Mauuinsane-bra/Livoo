# Como rodar a Livoo localmente

> Tempo estimado: 10–15 minutos na primeira vez.

---

## O que você precisa instalar (só uma vez)

### 1. Node.js
- Acesse: https://nodejs.org
- Baixe a versão **LTS** (recomendada)
- Instale normalmente (Next, Next, Next...)
- Para verificar se instalou: abra o terminal e digite `node --version`
  - Deve aparecer algo como `v20.x.x` ✓

### 2. Editor de código (recomendado)
- Baixe o **VS Code**: https://code.visualstudio.com
- Gratuito e excelente para este projeto

---

## Passo a passo para rodar

### Passo 1 — Abra a pasta do projeto no VS Code
- Abra o VS Code
- Vá em **File → Open Folder**
- Selecione a pasta `livoo` (esta pasta onde está este arquivo)

### Passo 2 — Abra o terminal integrado
- No VS Code: menu **Terminal → New Terminal**
- Um terminal aparece na parte de baixo da tela

### Passo 3 — Instale as dependências
Digite no terminal e pressione Enter:
```
npm install
```
Aguarde. Vai baixar as bibliotecas necessárias (~1–2 minutos).

### Passo 4 — Crie o arquivo de configuração
No terminal:
```
copy .env.local.example .env.local
```
*(No Mac/Linux use `cp` em vez de `copy`)*

O arquivo `.env.local` já vem configurado para rodar localmente — não precisa preencher nada agora.

### Passo 5 — Crie o banco de dados local
```
npm run db:init
```
Isso cria um arquivo `prisma/livoo.db` na sua máquina (o banco de dados SQLite). Não precisa instalar nada extra.

### Passo 6 — Rode o projeto
```
npm run dev
```

### Passo 7 — Abra no navegador
Acesse: **http://localhost:3000**

O site da Livoo aparece! 🎉

---

## O que funciona sem configurar APIs

| Funcionalidade | Sem APIs | Com APIs |
|---|---|---|
| Homepage completa | ✅ Funciona | ✅ |
| Formulário de lista de espera | ✅ Salva localmente | ✅ + envia email |
| Widget de busca (visual) | ✅ Funciona | ✅ |
| Roteiro com IA | ⚠️ Modo demo | ✅ GPT-4o real |
| Busca de voos | ⚠️ Não funciona | ✅ Sky Scrapper (RapidAPI) |
| Livoo Prep (docs) | ⚠️ Modo demo | ✅ Sherpa real |
| Política de privacidade | ✅ Funciona | ✅ |

---

## Ver os emails cadastrados na lista de espera

Para ver quem se cadastrou, abra uma segunda aba no terminal e rode:
```
npm run db:studio
```
Abre uma interface visual do banco de dados no navegador (http://localhost:5555).

---

## Parar o servidor

No terminal onde rodou `npm run dev`, pressione **Ctrl + C**.

---

## Quando quiser ir ao ar (publicar online)

1. Crie conta gratuita em https://vercel.com
2. Conecte com GitHub e importe a pasta `livoo`
3. Configure as variáveis de ambiente (substitua o SQLite por Supabase)
4. Clique em Deploy

---

## Problemas comuns

**"npm não reconhecido"**
→ Node.js não foi instalado corretamente. Reinstale em nodejs.org.

**"Cannot find module '@prisma/client'"**
→ Rode `npm install` novamente.

**"Port 3000 is already in use"**
→ Já tem algo rodando na porta 3000. Rode `npm run dev -- -p 3001` para usar a porta 3001.

**Página aparece sem estilos**
→ Aguarde alguns segundos e atualize a página. O Tailwind compila na primeira vez.

---

*Livoo — Empresa em constituição, 2026*
