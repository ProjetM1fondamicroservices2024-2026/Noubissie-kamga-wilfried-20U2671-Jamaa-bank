import { banksApi } from './api.js';

const BANKS_QUERIES = {
  getAllBanks: `
    query GetAllBanks {
      banks {
        id
        name
        logoUrl
        isActive
      }
    }
  `
};

export const banksService = {
  getAllBanks: async () => {
    try {
      const response = await banksApi.post('', {
        query: BANKS_QUERIES.getAllBanks
      });
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      return response.data.data.banks;
    } catch (error) {
      console.error('Erreur lors de la récupération des banques:', error);
      throw error;
    }
  }
};

export default banksService; 