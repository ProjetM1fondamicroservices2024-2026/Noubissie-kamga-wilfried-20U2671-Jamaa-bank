#!/bin/bash

# Script de création de la structure Banking Admin Dashboard
echo "🏦 Création de la structure Banking Admin Dashboard..."

# Créer la structure des dossiers
echo "📁 Création des dossiers..."

# Dossiers principaux
mkdir -p src/assets/images
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/charts
mkdir -p src/pages/auth
mkdir -p src/pages/dashboard
mkdir -p src/pages/users
mkdir -p src/pages/accounts
mkdir -p src/pages/transactions
mkdir -p src/pages/loans
mkdir -p src/pages/settings
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/store
mkdir -p src/utils
mkdir -p src/styles

# Créer les fichiers de composants UI
echo "🎨 Création des composants UI..."
touch src/components/ui/Button.jsx
touch src/components/ui/Input.jsx
touch src/components/ui/Modal.jsx
touch src/components/ui/Table.jsx
touch src/components/ui/Card.jsx
touch src/components/ui/LoadingSpinner.jsx

# Créer les fichiers de layout
echo "🏗️ Création des composants de layout..."
touch src/components/layout/Header.jsx
touch src/components/layout/Sidebar.jsx
touch src/components/layout/Layout.jsx
touch src/components/layout/Breadcrumb.jsx

# Créer les fichiers de graphiques
echo "📊 Création des composants de graphiques..."
touch src/components/charts/BarChart.jsx
touch src/components/charts/LineChart.jsx
touch src/components/charts/PieChart.jsx

# Créer les pages d'authentification
echo "🔐 Création des pages d'authentification..."
touch src/pages/auth/Login.jsx
touch src/pages/auth/ForgotPassword.jsx

# Créer la page dashboard
echo "📈 Création du dashboard..."
touch src/pages/dashboard/Dashboard.jsx

# Créer les pages utilisateurs
echo "👥 Création des pages utilisateurs..."
touch src/pages/users/UsersList.jsx
touch src/pages/users/UserDetails.jsx
touch src/pages/users/CreateUser.jsx

# Créer les pages comptes
echo "🏦 Création des pages comptes..."
touch src/pages/accounts/AccountsList.jsx
touch src/pages/accounts/AccountDetails.jsx
touch src/pages/accounts/CreateAccount.jsx

# Créer les pages transactions
echo "💸 Création des pages transactions..."
touch src/pages/transactions/TransactionsList.jsx
touch src/pages/transactions/TransactionDetails.jsx
touch src/pages/transactions/TransactionHistory.jsx

# Créer les pages prêts
echo "💰 Création des pages prêts..."
touch src/pages/loans/LoansList.jsx
touch src/pages/loans/LoanDetails.jsx
touch src/pages/loans/LoanApproval.jsx

# Créer les pages paramètres
echo "⚙️ Création des pages paramètres..."
touch src/pages/settings/GeneralSettings.jsx
touch src/pages/settings/SecuritySettings.jsx
touch src/pages/settings/SystemSettings.jsx

# Créer les hooks personnalisés
echo "🪝 Création des hooks..."
touch src/hooks/useAuth.js
touch src/hooks/useApi.js
touch src/hooks/useLocalStorage.js

# Créer les services API
echo "🌐 Création des services API..."
touch src/services/api.js
touch src/services/authService.js
touch src/services/userService.js
touch src/services/accountService.js
touch src/services/transactionService.js
touch src/services/loanService.js

# Créer les stores
echo "🗄️ Création des stores..."
touch src/store/authStore.js
touch src/store/userStore.js
touch src/store/appStore.js

# Créer les utilitaires
echo "🛠️ Création des utilitaires..."
touch src/utils/formatters.js
touch src/utils/validators.js
touch src/utils/constants.js
touch src/utils/helpers.js

# Créer le fichier de styles
echo "🎨 Création des styles..."
touch src/styles/globals.css

# Créer un fichier README personnalisé
echo "📝 Création du README..."
cat > README.md << EOL
# Banking Admin Dashboard

Interface d'administration pour application bancaire construite avec React, Vite et Tailwind CSS.

## Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## Structure du projet

- \`/src/components\` - Composants réutilisables
- \`/src/pages\` - Pages de l'application
- \`/src/services\` - Services API
- \`/src/store\` - Gestion d'état global
- \`/src/hooks\` - Hooks personnalisés
- \`/src/utils\` - Fonctions utilitaires

## Fonctionnalités

- 🔐 Authentification
- 📈 Dashboard analytique
- 👥 Gestion des utilisateurs
- 🏦 Gestion des comptes
- 💸 Gestion des transactions
- 💰 Gestion des prêts
- ⚙️ Paramètres système
EOL

echo "✅ Structure du projet créée avec succès!"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurer Tailwind CSS dans src/styles/globals.css"
echo "2. Configurer le routage dans App.jsx"
echo "3. Configurer les services API"
echo "4. Implémenter l'authentification"
echo ""
echo "🚀 Votre projet Banking Admin Dashboard est prêt!"