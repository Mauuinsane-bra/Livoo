#!/usr/bin/env node
// scripts/validate.js — valida arquivos TS/TSX antes de commitar
// Uso: node scripts/validate.js [arquivo opcional]

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
let errors = 0
let warnings = 0

function check(file) {
  const abs = path.join(ROOT, file)
  if (!fs.existsSync(abs)) return
  const data = fs.readFileSync(abs)

  // Null bytes
  const nulls = [...data].filter(b => b === 0).length
  if (nulls > 0) {
    console.error(`✗ NULL BYTES (${nulls}): ${file}`)
    errors++
    return
  }

  const text = data.toString('utf-8')

  // UTF-8 válido
  try { Buffer.from(text, 'utf-8') } catch {
    console.error(`✗ UTF-8 INVÁLIDO: ${file}`)
    errors++
    return
  }

  // Balanceamento de chaves e parênteses
  const opens  = (text.match(/\{/g) || []).length
  const closes = (text.match(/\}/g) || []).length
  const po = (text.match(/\(/g) || []).length
  const pc = (text.match(/\)/g) || []).length
  const ticks = (text.match(/`/g) || []).length

  if (opens !== closes) {
    console.error(`✗ CHAVES DESBALANCEADAS (${opens - closes}): ${file}`)
    errors++
  }
  if (po !== pc) {
    console.error(`✗ PARÊNTESES DESBALANCEADOS (${po - pc}): ${file}`)
    errors++
  }
  if (ticks % 2 !== 0) {
    console.error(`✗ BACKTICKS ÍMPARES (${ticks}): ${file}`)
    errors++
  }

  if (errors === 0) console.log(`✓ ${file}`)
}

// Coletar arquivos a validar
let files = process.argv.slice(2)
if (files.length === 0) {
  // Todos os .ts e .tsx do projeto (exceto node_modules e .next)
  const result = execSync(
    'git -C "' + ROOT + '" ls-files "*.ts" "*.tsx"',
    { encoding: 'utf-8' }
  )
  files = result.trim().split('\n').filter(Boolean)
}

console.log(`\nValidando ${files.length} arquivo(s)...\n`)
files.forEach(check)

console.log(`\n${errors === 0 ? '✓ Tudo OK — seguro para commitar' : `✗ ${errors} erro(s) encontrado(s) — NÃO commitar`}`)
if (errors > 0) process.exit(1)
