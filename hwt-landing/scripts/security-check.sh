#!/bin/bash

# HWT Security Check Script
# Executa verificações de segurança automatizadas

echo "🔍 HWT Security Check - $(date)"
echo "=================================="

# 1. Verificar vulnerabilidades
echo "📊 Verificando vulnerabilidades..."
npm audit --audit-level=high

# 2. Verificar dependências desatualizadas
echo ""
echo "📦 Verificando dependências desatualizadas..."
npm outdated

# 3. Verificar licenças
echo ""
echo "📄 Verificando licenças..."
npx license-checker --summary

# 4. Verificar tamanho do bundle
echo ""
echo "📏 Analisando tamanho do bundle..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
    du -sh .next/ 2>/dev/null || echo "❌ Build folder not found"
else
    echo "❌ Build failed"
fi

# 5. Verificar variáveis de ambiente
echo ""
echo "🔐 Verificando configurações de segurança..."
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local encontrado - verificar se não contém dados sensíveis"
fi

if [ -f ".env" ]; then
    echo "⚠️  .env encontrado - verificar se não está no git"
fi

echo ""
echo "✅ Security check completo!"
echo "=================================="
