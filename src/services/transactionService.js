import { transactionApi } from './api.js';

// Queries GraphQL pour les transactions
const TRANSACTION_QUERIES = {
  getAllTransactions: `
    query GetAllTransactions {
      getAllTransactions {
        transactionId
        transactionType
        idAccountSender
        idAccountReceiver
        amount
        status
        createdAt
        dateEvent
      }
    }
  `,
  
  getTransactionByIdAccount: `
    query GetTransactionByIdAccount($idAccount: ID!) {
      getTransactionByIdAccount(idAccount: $idAccount) {
        transactionId
        transactionType
        idAccountSender
        idAccountReceiver
        amount
        status
        createdAt
        dateEvent
      }
    }
  `,
  
  getTransactionsByUserId: `
    query GetTransactionsByUserId($userId: ID!) {
      getTransactionsByUserId(userId: $userId) {
        transactionId
        transactionType
        idAccountSender
        idAccountReceiver
        amount
        status
        createdAt
        dateEvent
      }
    }
  `
};

// Mutations GraphQL pour les transactions
const TRANSACTION_MUTATIONS = {
  deleteTransactionStream: `
    mutation DeleteTransactionStream {
      deleteTransactionStream
    }
  `
};

// Service pour les transactions
export const transactionService = {
  // Récupérer toutes les transactions
  getAllTransactions: async () => {
    try {
      const response = await transactionApi.post('', {
        query: TRANSACTION_QUERIES.getAllTransactions
      });
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      return response.data.data.getAllTransactions;
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      throw error;
    }
  },

  // Récupérer les transactions par ID de compte
  getTransactionByIdAccount: async (idAccount) => {
    try {
      const response = await transactionApi.post('', {
        query: TRANSACTION_QUERIES.getTransactionByIdAccount,
        variables: { idAccount }
      });
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      return response.data.data.getTransactionByIdAccount;
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions par compte:', error);
      throw error;
    }
  },

  // Récupérer les transactions par ID utilisateur
  getTransactionsByUserId: async (userId) => {
    try {
      const response = await transactionApi.post('', {
        query: TRANSACTION_QUERIES.getTransactionsByUserId,
        variables: { userId }
      });
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      return response.data.data.getTransactionsByUserId;
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions par utilisateur:', error);
      throw error;
    }
  },

  // Récupérer une transaction par ID
  getTransaction: async (id) => {
    try {
      // Pour l'instant, on récupère toutes les transactions et on filtre
      // TODO: Ajouter une query GraphQL spécifique pour récupérer une transaction par ID
      const allTransactions = await transactionService.getAllTransactions();
      const transaction = allTransactions.find(t => t.transactionId === id);
      
      if (!transaction) {
        throw new Error('Transaction non trouvée');
      }
      
      return transaction;
    } catch (error) {
      console.error('Erreur lors de la récupération de la transaction:', error);
      throw error;
    }
  },

  // Supprimer le stream de transactions
  deleteTransactionStream: async () => {
    try {
      const response = await transactionApi.post('', {
        query: TRANSACTION_MUTATIONS.deleteTransactionStream
      });
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      return response.data.data.deleteTransactionStream;
    } catch (error) {
      console.error('Erreur lors de la suppression du stream de transactions:', error);
      throw error;
    }
  }
};

export default transactionService;
