# Intégration Backend - Dashboard Banking Admin

## Configuration

### Services GraphQL intégrés

1. **Service Transactions** (`service-transactions`)
   - Endpoint: `http://109.199.113.94:30079/service-transactions/graphql`
   - Gère les transactions bancaires

2. **Service Account** (`service-account`) 
   - Endpoint: `http://109.199.113.94:30079/service-account/graphql`
   - Gère les transferts entre comptes

3. **Service Users** (`service-users`)
   - Endpoint: `http://109.199.113.94:30079/service-users/graphql`
   - Gère les utilisateurs (Customers et SuperAdmins)

## Structure des données

### Transactions
```graphql
type Transaction {
  transactionId: ID!
  transactionType: TransactionType!
  idAccountSender: ID!
  idAccountReceiver: ID!
  amount: String!
  status: TransactionStatus!
  createdAt: String!
  dateEvent: String!
}

enum TransactionType {
  TRANSFERT, DEPOT, RETRAIT, RECHARGE, VIREMENT
}

enum TransactionStatus {
  FAILED, SUCCESS
}
```

### Transferts
```graphql
type Transfert {
  id: ID!
  senderAccountId: ID!
  receiverAccountId: ID!
  amount: Float!
  createAt: String!
}

enum AccountType {
  APPLICATION, BANK
}
```

## Services créés

### `src/services/transactionService.js`
- `getAllTransactions()` - Récupère toutes les transactions
- `getTransactionByIdAccount(idAccount)` - Transactions par compte
- `getTransactionsByUserId(userId)` - Transactions par utilisateur
- `getTransaction(id)` - Transaction spécifique
- `deleteTransactionStream()` - Supprime le stream de transactions

### `src/services/accountService.js`
- `getAllTransferts()` - Récupère tous les transferts
- `makeAppTransfert()` - Transfert d'application
- `makeBankTransfert()` - Transfert bancaire
- `transfer()` - Transfert générique

## Gestion des erreurs

### Communication directe avec le backend
L'application communique directement avec le backend GraphQL sans fallback vers des données mockées. En cas d'erreur de connexion, l'erreur est propagée vers l'interface utilisateur.

### Messages d'erreur
- Affichage d'erreurs utilisateur-friendly
- Bouton "Réessayer" pour relancer les requêtes
- Logs détaillés dans la console pour le debugging

## Composants adaptés

### `TransactionsList.jsx`
- ✅ Intégration avec `transactionService.getAllTransactions()`
- ✅ Gestion des erreurs avec affichage utilisateur
- ✅ Affichage des IDs de comptes émetteur/destinataire
- ✅ Filtrage par type et statut

### `TransactionDetails.jsx`
- ✅ Intégration avec `transactionService.getTransaction()`
- ✅ Affichage détaillé des transactions
- ✅ Informations des comptes impliqués

## Configuration réseau

### Base URL
```
http://109.199.113.94:30079
```

### Headers par défaut
```javascript
{
  'Content-Type': 'application/json'
}
```

## Développement

### Ajout de nouvelles queries
1. Définir la query GraphQL dans le service approprié
2. Créer la méthode correspondante
3. Gérer les erreurs de manière appropriée
4. Tester avec le backend déployé

### Debugging
- Vérifier les logs de la console pour les erreurs GraphQL
- Utiliser les outils de développement réseau pour inspecter les requêtes
- Tester les endpoints directement avec GraphQL Playground

## Déploiement

L'application est prête pour la production avec :
- ✅ Communication directe avec le backend GraphQL
- ✅ Gestion des erreurs appropriée
- ✅ Interface utilisateur responsive
- ✅ Intégration complète avec le backend déployé 