// mockApi.js - Données mockées adaptées aux schémas GraphQL

export const mockApi = {
  // Données des transactions selon le schéma GraphQL
  transactions: [
    {
      transactionId: "TXN001",
      transactionType: "TRANSFERT",
      idAccountSender: "ACC001",
      idAccountReceiver: "ACC002",
      amount: "1250.00",
      status: "SUCCESS",
      createdAt: "2024-06-18T10:30:00Z",
      dateEvent: "2024-06-18T10:30:03Z"
    },
    {
      transactionId: "TXN002",
      transactionType: "DEPOT",
      idAccountSender: "EXT001",
      idAccountReceiver: "ACC001",
      amount: "2500.00",
      status: "SUCCESS",
      createdAt: "2024-06-18T09:15:00Z",
      dateEvent: "2024-06-18T09:15:05Z"
    },
    {
      transactionId: "TXN003",
      transactionType: "RETRAIT",
      idAccountSender: "ACC003",
      idAccountReceiver: "ATM001",
      amount: "150.00",
      status: "SUCCESS",
      createdAt: "2024-06-18T08:45:00Z",
      dateEvent: "2024-06-18T08:45:15Z"
    },
    {
      transactionId: "TXN004",
      transactionType: "TRANSFERT",
      idAccountSender: "ACC002",
      idAccountReceiver: "EXT002",
      amount: "750.50",
      status: "FAILED",
      createdAt: "2024-06-17T16:20:00Z",
      dateEvent: "2024-06-17T16:20:00Z"
    },
    {
      transactionId: "TXN005",
      transactionType: "RETRAIT",
      idAccountSender: "ACC004",
      idAccountReceiver: "ATM002",
      amount: "300.00",
      status: "FAILED",
      createdAt: "2024-06-17T14:30:00Z",
      dateEvent: "2024-06-17T14:30:05Z"
    },
    {
      transactionId: "TXN006",
      transactionType: "DEPOT",
      idAccountSender: "EXT003",
      idAccountReceiver: "ACC001",
      amount: "1800.00",
      status: "SUCCESS",
      createdAt: "2024-06-17T12:00:00Z",
      dateEvent: "2024-06-17T12:00:05Z"
    },
    {
      transactionId: "TXN007",
      transactionType: "RECHARGE",
      idAccountSender: "ACC001",
      idAccountReceiver: "TEL001",
      amount: "50.00",
      status: "SUCCESS",
      createdAt: "2024-06-17T10:15:00Z",
      dateEvent: "2024-06-17T10:15:10Z"
    },
    {
      transactionId: "TXN008",
      transactionType: "VIREMENT",
      idAccountSender: "ACC002",
      idAccountReceiver: "EXT004",
      amount: "500.00",
      status: "SUCCESS",
      createdAt: "2024-06-16T15:30:00Z",
      dateEvent: "2024-06-16T15:30:05Z"
    }
  ],

  // Données des transferts selon le schéma GraphQL
  transferts: [
    {
      id: "TRF001",
      senderAccountId: "ACC001",
      receiverAccountId: "ACC002",
      amount: 1250.00,
      createAt: "2024-06-18T10:30:00Z"
    },
    {
      id: "TRF002",
      senderAccountId: "ACC002",
      receiverAccountId: "EXT002",
      amount: 750.50,
      createAt: "2024-06-17T16:20:00Z"
    },
    {
      id: "TRF003",
      senderAccountId: "ACC001",
      receiverAccountId: "TEL001",
      amount: 50.00,
      createAt: "2024-06-17T10:15:00Z"
    },
    {
      id: "TRF004",
      senderAccountId: "ACC002",
      receiverAccountId: "EXT004",
      amount: 500.00,
      createAt: "2024-06-16T15:30:00Z"
    }
  ],

  // Données des comptes pour référence
  accounts: [
    {
      id: "ACC001",
      number: "****1234",
      name: "Compte Courant Principal",
      type: "BANK"
    },
    {
      id: "ACC002",
      number: "****5678", 
      name: "Compte Épargne",
      type: "BANK"
    },
    {
      id: "ACC003",
      number: "****9876",
      name: "Compte Courant Secondaire", 
      type: "BANK"
    },
    {
      id: "ACC004",
      number: "****1357",
      name: "Compte Courant",
      type: "BANK"
    },
    {
      id: "EXT001",
      number: "Externe",
      name: "TechCorp Payroll",
      type: "BANK"
    },
    {
      id: "EXT002",
      number: "****2468",
      name: "Pierre Durand",
      type: "BANK"
    },
    {
      id: "EXT003",
      number: "Externe",
      name: "Assurance Auto",
      type: "BANK"
    },
    {
      id: "EXT004",
      number: "****3579",
      name: "Fournisseur Électricité",
      type: "BANK"
    },
    {
      id: "ATM001",
      number: "ATM-REP-001",
      name: "DAB Place République",
      type: "APPLICATION"
    },
    {
      id: "ATM002",
      number: "ATM-GAR-002", 
      name: "DAB Gare du Nord",
      type: "APPLICATION"
    },
    {
      id: "TEL001",
      number: "TEL-001",
      name: "Recharge Téléphone",
      type: "APPLICATION"
    }
  ],

  // Fonctions API pour les transactions
  getAllTransactions: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockApi.transactions);
      }, 500);
    });
  },

  getTransactionByIdAccount: (idAccount) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = mockApi.transactions.filter(t => 
          t.idAccountSender === idAccount || t.idAccountReceiver === idAccount
        );
        resolve(transactions);
      }, 300);
    });
  },

  getTransactionsByUserId: (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulation: on suppose que les comptes ACC001, ACC002 appartiennent à l'utilisateur
        const userAccounts = ["ACC001", "ACC002"];
        const transactions = mockApi.transactions.filter(t => 
          userAccounts.includes(t.idAccountSender) || userAccounts.includes(t.idAccountReceiver)
        );
        resolve(transactions);
      }, 400);
    });
  },

  deleteTransactionStream: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Transaction stream deleted successfully");
      }, 200);
    });
  },

  // Fonctions API pour les transferts
  getAllTransferts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockApi.transferts);
      }, 400);
    });
  },

  makeAppTransfert: (idSenderAccount, idReceiverAccount, amount) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTransfert = {
          id: `TRF${Date.now()}`,
          senderAccountId: idSenderAccount,
          receiverAccountId: idReceiverAccount,
          amount: amount,
          createAt: new Date().toISOString()
        };
        mockApi.transferts.push(newTransfert);
        resolve(newTransfert);
      }, 300);
    });
  },

  makeBankTransfert: (idSenderBank, idReceiverBank, amount) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTransfert = {
          id: `TRF${Date.now()}`,
          senderAccountId: idSenderBank,
          receiverAccountId: idReceiverBank,
          amount: amount,
          createAt: new Date().toISOString()
        };
        mockApi.transferts.push(newTransfert);
        resolve(newTransfert);
      }, 300);
    });
  },

  transfer: (request) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulation de transfert
        resolve(true);
      }, 500);
    });
  },

  // Fonctions utilitaires pour compatibilité
  getTransactions: () => mockApi.getAllTransactions(),
  getTransaction: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const transaction = mockApi.transactions.find(t => t.transactionId === id);
        resolve(transaction || null);
      }, 300);
    });
  },
  getAccounts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockApi.accounts);
      }, 300);
    });
  }
};

export default mockApi;