#!/bin/bash
# scripts/safe-commit.sh — valida, limpa e commita com segurança
# Uso: bash scripts/safe-commit.sh "mensagem do commit" [arquivo1 arquivo2 ...]
# Se não passar arquivos, faz git add -A (todos os modificados)

set -e

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MSG="${1:-chore: atualização}"
shift || true
FILES=("$@")

echo "🔍 Limpando null bytes..."
python3 - << 'PYEOF'
import os, glob, sys

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__ if '__file__' in dir() else sys.argv[0])))
fixed = 0
for pattern in ['**/*.ts', '**/*.tsx']:
    for f in glob.glob(os.path.join(root, pattern), recursive=True):
        if 'node_modules' in f or '.next' in f: continue
        data = open(f, 'rb').read()
        if b'\x00' in data:
            open(f, 'wb').write(data.rstrip(b'\x00'))
            print(f'  Limpo: {os.path.relpath(f, root)}')
            fixed += 1
if fixed == 0:
    print('  Nenhum null byte encontrado.')
PYEOF

echo ""
echo "✅ Validando arquivos..."
node "$REPO/scripts/validate.js"

echo ""
echo "📦 Commitando..."
cd "$REPO"
if [ ${#FILES[@]} -eq 0 ]; then
  git add -A
else
  git add "${FILES[@]}"
fi

git commit -m "$MSG"
git push origin main
echo ""
echo "🚀 Deploy iniciado no Vercel!"
