#!/bin/bash

# Script de rollback
PROJECT_DIR="/var/www/devtools.vezinbastien.com"
COMPOSE_FILE="docker-compose.prod.yml"

echo "🔄 ROLLBACK AU COMMIT PRÉCÉDENT"

cd "$PROJECT_DIR"

# Afficher les 5 derniers commits
echo "📝 Derniers commits:"
git log --oneline -5

echo ""
read -p "Entrez le hash du commit vers lequel revenir (ou 'HEAD~1' pour le précédent): " COMMIT

if [ -z "$COMMIT" ]; then
    COMMIT="HEAD~1"
fi

echo "⏪ Rollback vers $COMMIT..."
git reset --hard "$COMMIT"

echo "🐳 Redéploiement..."
docker-compose -f "$COMPOSE_FILE" down
docker-compose -f "$COMPOSE_FILE" up -d --build

echo "✅ Rollback terminé!"
docker ps | grep dev-tools
