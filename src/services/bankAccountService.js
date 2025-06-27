import { banksAccountApi } from './api.js';

const BANK_ACCOUNT_QUERIES = {
  getBankAccountById: `
    query GetBankAccountById($id: ID!) {
      getBankAccountByBankId(bankId: $id) {
        id
        bankId
        accountNumber
        totalBalance
        createdAt
      }
    }
  `
};

export const bankAccountService = {
  getBankAccountById: async (id) => {
    try {
      const response = await banksAccountApi.post('', {
        query: BANK_ACCOUNT_QUERIES.getBankAccountById,
        variables: { id }
      });
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      return response.data.data.getBankAccountByBankId;
    } catch (error) {
      console.error('Erreur lors de la récupération du compte bancaire:', error);
      throw error;
    }
  }
};

export default bankAccountService; 