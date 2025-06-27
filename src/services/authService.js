const TOKEN_KEY = 'auth_token';
const BANK_ID_KEY = 'bank_id';
const BANK_NAME_KEY = 'bank_name';
const USERNAME_KEY = 'username';

// GraphQL endpoint
const GRAPHQL_ENDPOINT = 'http://109.199.113.94:30079/service-banks/graphql';

// Query pour récupérer toutes les banques
const GET_ALL_BANKS_QUERY = `
  query GetAllBanks {
    banks {
      id
      name
    }
  }
`;

const authService = {
  login: async (username, password) => {
    // Connexion par défaut avec admin/admin123
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem(TOKEN_KEY, 'fake-jamaa-token');
      localStorage.setItem(BANK_ID_KEY, '1'); // ID par défaut pour admin
      localStorage.setItem(BANK_NAME_KEY, 'Jamaa Bank'); // Nom spécifique pour admin
      localStorage.setItem(USERNAME_KEY, username);
      return { success: true, bankId: '1', bankName: 'Jamaa Bank' };
    }
    
    // Vérification pour les autres usernames avec password admin123
    if (password === 'admin123') {
      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: GET_ALL_BANKS_QUERY
          })
        });

        const data = await response.json();
        
        if (data.data && data.data.banks) {
          // Recherche insensible à la casse
          const bank = data.data.banks.find(bank => 
            bank.name.toLowerCase() === username.toLowerCase()
          );
          
          if (bank) {
            localStorage.setItem(TOKEN_KEY, 'fake-jamaa-token');
            localStorage.setItem(BANK_ID_KEY, bank.id);
            localStorage.setItem(BANK_NAME_KEY, bank.name);
            localStorage.setItem(USERNAME_KEY, username);
            return { success: true, bankId: bank.id, bankName: bank.name };
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du backend:', error);
        throw new Error('Erreur de connexion au serveur');
      }
    }
    
    throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
  },
  
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(BANK_ID_KEY);
    localStorage.removeItem(BANK_NAME_KEY);
    localStorage.removeItem(USERNAME_KEY);
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
  
  getBankId: () => {
    return localStorage.getItem(BANK_ID_KEY) || '1';
  },
  
  getBankName: () => {
    return localStorage.getItem(BANK_NAME_KEY) || 'Jamaa Bank';
  },
  
  getUsername: () => {
    return localStorage.getItem(USERNAME_KEY) || 'admin';
  },
  
  isAdmin: () => {
    return localStorage.getItem(USERNAME_KEY) === 'admin';
  }
};

export default authService;
