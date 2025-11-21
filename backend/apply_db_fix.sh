#!/bin/bash

# Script para aplicar correções de foreign key no banco de dados

echo "=========================================="
echo "Aplicando correções no banco de dados..."
echo "=========================================="
echo ""
echo "Este script irá modificar as constraints de foreign key"
echo "para permitir a deleção de usuários."
echo ""

# Executar o script SQL
mysql -u root -p jcpe_db < db_cascade_fix_safe.sql

# Verificar se foi bem-sucedido
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Correções aplicadas com sucesso!"
    echo ""
    echo "Agora você pode deletar usuários sem problemas."
    echo ""
    echo "Comportamento após as alterações:"
    echo "  - Comentários: deletados automaticamente (CASCADE)"
    echo "  - Curtidas: deletadas automaticamente (CASCADE)"
    echo "  - Avaliações: deletadas automaticamente (CASCADE)"
    echo "  - Compartilhamentos: deletados automaticamente (CASCADE)"
    echo "  - Notícias: permanecem sem autor (SET NULL)"
    echo ""
else
    echo ""
    echo "❌ Erro ao aplicar as correções."
    echo "Verifique se a senha está correta e se o MySQL está rodando."
    echo ""
fi
