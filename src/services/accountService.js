import { accountApi } from './api.js';

// Queries GraphQL pour les comptes
const ACCOUNT_QUERIES = {
  getAllTransferts: `
    query GetAllTransferts {
      getAllTransferts {
        id
        senderAccountId
        receiverAccountId
        amount
        createAt
      }
    }
  `,
  getAccount: `
    query GetAccount($id: ID!) {
      getAccount(id: $id) {
        id
        accountNumber
        balance
        createdAt
        userId
      }
    }
  `
};

// Mutations GraphQL pour les comptes
const ACCOUNT_MUTATIONS = {
  makeAppTransfert: `
    mutation MakeAppTransfert($idSenderAccount: ID!, $idReceiverAccount: ID!, $amount: Float!) {
      makeAppTransfert(
        idSenderAccount: $idSenderAccount
        idReceiverAccount: $idReceiverAccount
        amount: $amount
      ) {
        id
        senderAccountId
        receiverAccountId
        amount
        createAt
      }
    }
  `,
  
  makeBankTransfert: `
    mutation MakeBankTransfert($idSenderBank: ID!, $idReceiverBank: ID!, $amount: Float!) {
      makeBankTransfert(
        idSenderBank: $idSenderBank
        idReceiverBank: $idReceiverBank
        amount: $amount
      ) {
        id
        senderAccountId
        receiverAccountId
        amount
        createAt
      }
    }
  `,
  
  transfer: `
    mutation Transfer($request: TransferRequest!) {
      transfer(request: $request)
    }
  `
};

// Service pour les comptes
export const accountService = {
  // Récupérer tous les transferts
  getAllTransferts: async () => {
    try {
      const response = await accountApi.post('', {
        query: ACCOUNT_QUERIES.getAllTransferts
      });
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      return response.data.data.getAllTransferts;
    } catch (error) {
      console.error('Erreur lors de la récupération des transferts:', error);
      throw error;
    }
  },

  // Effectuer un transfert d'application
  makeAppTransfert: async (idSenderAccount, idReceiverAccount, amount) => {
    try {
      const response = await accountApi.post('', {
        query: ACCOUNT_MUTATIONS.makeAppTransfert,
        variables: {
          idSenderAccount,
          idReceiverAccount,
          amount
        }
      });
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      return response.data.data.makeAppTransfert;
    } catch (error) {
      console.error('Erreur lors du transfert d\'application:', error);
      throw error;
    }
  },

  // Effectuer un transfert bancaire
  makeBankTransfert: async (idSenderBank, idReceiverBank, amount) => {
    try {
      const response = await accountApi.post('', {
        query: ACCOUNT_MUTATIONS.makeBankTransfert,
        variables: {
          idSenderBank,
          idReceiverBank,
          amount
        }
      });
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      return response.data.data.makeBankTransfert;
    } catch (error) {
      console.error('Erreur lors du transfert bancaire:', error);
      throw error;
    }
  },

  // Effectuer un transfert générique
  transfer: async (request) => {
    try {
      const response = await accountApi.post('', {
        query: ACCOUNT_MUTATIONS.transfer,
        variables: { request }
      });
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      return response.data.data.transfer;
    } catch (error) {
      console.error('Erreur lors du transfert:', error);
      throw error;
    }
  },

  // Correction de la fonction pour utiliser getAccount
  getAccountById: async (id) => {
    try {
      const response = await accountApi.post('', {
        query: ACCOUNT_QUERIES.getAccount,
        variables: { id }
      });
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      return response.data.data.getAccount;
    } catch (error) {
      console.error('Erreur lors de la récupération du compte:', error);
      throw error;
    }
  }
};

export default accountService;
