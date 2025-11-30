#!/bin/bash

# ============================================
# Script de déploiement automatique avec maintenance
# devtools.vezinbastien.com
# ============================================

set -e

# Configuration
PROJECT_DIR="/var/www/devtools.vezinbastien.com"
COMPOSE_FILE="docker-compose.prod.yml"
BRANCH="main"
LOG_FILE="$PROJECT_DIR/logs/deploy.log"
NGINX_SITE="/etc/nginx/sites-enabled/devtools.vezinbastien.com"
NGINX_MAINTENANCE="/etc/nginx/sites-available/devtools-maintenance.conf"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Créer le dossier de logs si nécessaire
mkdir -p "$PROJECT_DIR/logs"

# Fonctions de logging
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    echo "[ERROR] $1" >> "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    echo "[WARNING] $1" >> "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
    echo "[INFO] $1" >> "$LOG_FILE"
}

maintenance() {
    echo -e "${PURPLE}[MAINTENANCE]${NC} $1"
    echo "[MAINTENANCE] $1" >> "$LOG_FILE"
}

# Fonction pour activer la page de maintenance
enable_maintenance() {
    maintenance "🚧 Activation de la page de maintenance..."
    
    # Sauvegarder la config actuelle
    sudo cp "$NGINX_SITE" "$NGINX_SITE.backup"
    
    # Activer la config de maintenance
    sudo cp "$NGINX_MAINTENANCE" "$NGINX_SITE"
    
    # Recharger Nginx
    sudo nginx -t && sudo systemctl reload nginx
    
    maintenance "✅ Page de maintenance activée"
    log "🌐 Le site affiche maintenant la page de maintenance"
}

# Fonction pour désactiver la page de maintenance
disable_maintenance() {
    maintenance "✨ Désactivation de la page de maintenance..."
    
    # Restaurer la config normale
    if [ -f "$NGINX_SITE.backup" ]; then
        sudo mv "$NGINX_SITE.backup" "$NGINX_SITE"
        sudo nginx -t && sudo systemctl reload nginx
        maintenance "✅ Configuration normale restaurée"
    else
        error "Fichier de backup introuvable!"
    fi
}

# Fonction pour vérifier si l'app est prête
wait_for_app() {
    info "⏳ Attente du démarrage de l'application..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s http://localhost:5175 > /dev/null 2>&1; then
            log "✅ Application prête après $attempt tentatives"
            return 0
        fi
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    error "L'application n'a pas démarré après $max_attempts tentatives"
    return 1
}

# Fonction de rollback
rollback() {
    local old_commit=$1
    error "🔄 Rollback au commit $old_commit..."
    
    git reset --hard "$old_commit"
    docker-compose -f "$COMPOSE_FILE" down
    docker-compose -f "$COMPOSE_FILE" up -d --build
    
    if wait_for_app; then
        disable_maintenance
        log "✅ Rollback réussi"
    else
        error "❌ Rollback échoué - maintenance maintenue"
        exit 1
    fi
}

# ============================================
# DÉBUT DU SCRIPT
# ============================================

echo ""
echo "======================================"
log "🚀 DÉMARRAGE DU DÉPLOIEMENT"
echo "======================================"
echo ""

# 1. Vérifications initiales
info "📁 Vérification du répertoire..."
if [ ! -d "$PROJECT_DIR" ]; then
    error "Le répertoire $PROJECT_DIR n'existe pas!"
    exit 1
fi

cd "$PROJECT_DIR"
log "✅ Répertoire: $(pwd)"

# 2. Vérifier Git
info "🔍 Vérification de Git..."
if [ ! -d ".git" ]; then
    error "Ce n'est pas un repository Git!"
    exit 1
fi
log "✅ Repository Git trouvé"

# 3. Sauvegarder le commit actuel
OLD_COMMIT=$(git rev-parse HEAD)
log "📌 Commit actuel: ${OLD_COMMIT:0:7}"

# 4. Vérifier la branche
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    warning "Passage sur la branche '$BRANCH'..."
    git checkout "$BRANCH" || {
        error "Impossible de changer de branche!"
        exit 1
    }
fi
log "✅ Branche: $BRANCH"

# 5. Git pull
info "📥 Git pull en cours..."
git fetch origin "$BRANCH"

if git diff --quiet HEAD origin/"$BRANCH"; then
    warning "Aucun changement détecté"
    read -p "Rebuilder quand même? (o/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Oo]$ ]]; then
        log "❌ Déploiement annulé"
        exit 0
    fi
fi

git pull origin "$BRANCH" || {
    error "Git pull échoué!"
    exit 1
}

NEW_COMMIT=$(git rev-parse HEAD)
log "✅ Nouveau commit: ${NEW_COMMIT:0:7}"

# 6. Afficher les changements
if [ "$OLD_COMMIT" != "$NEW_COMMIT" ]; then
    echo ""
    info "📝 Changements:"
    git log --oneline --graph "$OLD_COMMIT".."$NEW_COMMIT" | head -10
    echo ""
fi

# ============================================
# ACTIVATION DE LA MAINTENANCE
# ============================================

enable_maintenance

# 7. Arrêter les conteneurs
info "⏸️  Arrêt des conteneurs..."
docker-compose -f "$COMPOSE_FILE" down || {
    error "Impossible d'arrêter les conteneurs!"
    disable_maintenance
    exit 1
}
log "✅ Conteneurs arrêtés"

# 8. Nettoyage
info "🧹 Nettoyage..."
docker image prune -f > /dev/null 2>&1
log "✅ Images nettoyées"

# 9. Build
info "🔨 Build de la nouvelle image..."
if ! docker-compose -f "$COMPOSE_FILE" build --no-cache; then
    error "Build échoué!"
    rollback "$OLD_COMMIT"
    exit 1
fi
log "✅ Build réussi"

# 10. Démarrage
info "▶️  Démarrage des conteneurs..."
if ! docker-compose -f "$COMPOSE_FILE" up -d; then
    error "Démarrage échoué!"
    rollback "$OLD_COMMIT"
    exit 1
fi
log "✅ Conteneurs démarrés"

# 11. Attendre que l'app soit prête
if ! wait_for_app; then
    error "L'application ne répond pas!"
    rollback "$OLD_COMMIT"
    exit 1
fi

# ============================================
# DÉSACTIVATION DE LA MAINTENANCE
# ============================================

disable_maintenance

# 12. Vérifications finales
info "🏥 Vérifications finales..."

if ! docker ps | grep -q "dev-tools-prod"; then
    error "Le conteneur ne tourne pas!"
    docker-compose -f "$COMPOSE_FILE" logs --tail=50
    exit 1
fi
log "✅ Conteneur actif"

if ! curl -f -s http://localhost:5175 > /dev/null; then
    warning "L'application ne répond pas au test HTTP"
fi

# 13. Résumé final
echo ""
echo "======================================"
log "✨ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!"
echo "======================================"
echo ""
info "📊 Informations:"
echo "   🌐 URL: https://devtools.vezinbastien.com"
echo "   🔖 Commit: ${NEW_COMMIT:0:7}"
echo "   📅 Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo "   ⏱️  Durée totale: ${SECONDS}s"
echo ""

info "📋 Conteneurs actifs:"
docker ps --filter name=dev-tools --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

info "📝 Commandes utiles:"
echo "   Logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "   Rollback: git reset --hard $OLD_COMMIT && ./deploy.sh"
echo ""

log "🎉 Le site est de nouveau en ligne!"

