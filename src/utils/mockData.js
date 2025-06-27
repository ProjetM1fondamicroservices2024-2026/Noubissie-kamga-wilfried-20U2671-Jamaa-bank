// src/utils/mockData.js


export const mockBankData = {
  name: "Jamaa Bank",
  code: "JB001",
  admin: {
    name: "Admin Principal",
    role: "Administrateur",
    avatar: "A"
  }
};

export const mockBanks = [
  { id: "B001", name: "Jamaa Bank", code: "JB001", status: "active", createdAt: "2023-01-01T10:00:00Z" },
  { id: "B002", name: "Solde Bank", code: "SB001", status: "active", createdAt: "2023-03-15T14:30:00Z" },
  { id: "B003", name: "Trust Banque", code: "TB001", status: "pending", createdAt: "2024-06-01T09:15:00Z" },
  { id: "B004", name: "Avenir Banque", code: "AB001", status: "active", createdAt: "2023-09-10T11:45:00Z" },
  { id: "B005", name: "Prospère Bank", code: "PB001", status: "inactive", createdAt: "2022-12-05T16:20:00Z" }
];

export const mockPendingRequests = [
  { id: "req001", userName: "Alice Dupont", email: "alice.dupont@email.com", bankId: "B001", createdAt: "2024-06-20T08:30:00Z" },
  { id: "req002", userName: "Bob Martin", email: "bob.martin@email.com", bankId: "B002", createdAt: "2024-06-22T14:45:00Z" },
  { id: "req003", userName: "Clara Bernard", email: "clara.bernard@email.com", bankId: "B003", createdAt: "2024-06-23T10:15:00Z" }
];

export const mockPlatformStats = [
  {
    title: "Total Banks",
    value: mockBanks.length.toString(),
    change: "+10%",
    changeType: "positive",
    icon: "Banknote",
    color: "bg-blue-500"
  },
  {
    title: "Total Utilisateurs",
    value: "0", // Cette valeur sera mise à jour dynamiquement
    change: "+15%",
    changeType: "positive",
    icon: "Users",
    color: "bg-green-500"
  },
  {
    title: "Pending Requests",
    value: mockPendingRequests.length.toString(),
    change: "+3%",
    changeType: "neutral",
    icon: "UserPlus",
    color: "bg-yellow-500"
  }
];

export const mockStats = [
  {
    title: 'Total Utilisateurs',
    value: '12,543',
    change: '+12%',
    changeType: 'positive',
    icon: 'Users',
    color: 'bg-blue-500'
  },
  {
    title: 'Comptes Actifs',
    value: '8,742',
    change: '+8%',
    changeType: 'positive',
    icon: 'CreditCard',
    color: 'bg-green-500'
  },
  {
    title: 'Transactions ce Mois',
    value: '34,567',
    change: '+22%',
    changeType: 'positive',
    icon: 'ArrowUpDown',
    color: 'bg-orange-500'
  }
];

export const mockRecentTransactions = [
  {
    id: 1,
    user: 'Marie Dupont',
    type: 'Virement',
    amount: '+XAF1,250.00',
    status: 'Complété',
    time: 'Il y a 2 min',
    initials: 'MD'
  },
  {
    id: 2,
    user: 'Jean Martin',
    type: 'Retrait',
    amount: '-XAF500.00',
    status: 'Complété',
    time: 'Il y a 15 min',
    initials: 'JM'
  },
  {
    id: 3,
    user: 'Sophie Laurent',
    type: 'Dépôt',
    amount: '+XAF2,800.00',
    status: 'En cours',
    time: 'Il y a 1h',
    initials: 'SL'
  },
  {
    id: 4,
    user: 'Pierre Dubois',
    type: 'Virement',
    amount: '-XAF350.00',
    status: 'Complété',
    time: 'Il y a 2h',
    initials: 'PD'
  },
  {
    id: 5,
    user: 'Claire Bernard',
    type: 'Transfert',
    amount: '+XAF950.00',
    status: 'Complété',
    time: 'Il y a 3h',
    initials: 'CB'
  }
];

export const mockQuickActions = [
  {
    title: 'Nouveau Compte',
    description: 'Créer un nouveau compte client',
    color: 'bg-blue-600 hover:bg-blue-700',
    icon: 'Plus'
  },
  {
    title: 'Valider Transaction',
    description: 'Approuver les transactions en attente',
    color: 'bg-green-600 hover:bg-green-700',
    icon: 'Check'
  },
  {
    title: 'Générer Rapport',
    description: 'Créer un rapport d\'activité',
    color: 'bg-purple-600 hover:bg-purple-700',
    icon: 'FileText'
  },
  {
    title: 'Paramètres Système',
    description: 'Configurer les paramètres',
    color: 'bg-gray-600 hover:bg-gray-700',
    icon: 'Settings'
  }
];

export const mockAccountService = {
  getAccounts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "acc_001",
            userId: "user_001",
            accountNumber: "FR7630006000011234567890189",
            balance: 15750.50,
            accountType: "Compte Courant",
            status: "active",
            createdAt: "2023-01-15T10:30:00Z",
            owner: {
              firstName: "Jean",
              lastName: "Dupont",
              email: "ndeuna.sinclair@email.com",
              phone: "+33 6 12 34 56 78"
            },
            card: {
              cardNumber: "4532015112830366",
              holderName: "Jean Dupont",
              cardType: "VISA",
              status: "ACTIVE",
              expiryDate: "12/26",
              isVirtual: false,
              lastUsedAt: "2024-06-15T14:22:00Z"
            }
          },
          {
            id: "acc_002",
            userId: "user_002",
            accountNumber: "FR7630006000011234567890190",
            balance: 8420.75,
            accountType: "Compte Épargne",
            status: "active",
            createdAt: "2023-03-22T09:15:00Z",
            owner: {
              firstName: "Marie",
              lastName: "Martin",
              email: "marie.martin@email.com",
              phone: "+33 6 98 76 54 32"
            },
            card: {
              cardNumber: "5425233430109903",
              holderName: "Marie Martin",
              cardType: "MASTERCARD",
              status: "ACTIVE",
              expiryDate: "09/25",
              isVirtual: true,
              lastUsedAt: "2024-05-20T08:45:00Z"
            }
          },
          {
            id: "acc_003",
            userId: "user_003",
            accountNumber: "FR7630006000011234567890191",
            balance: 125000.00,
            accountType: "Compte Professionnel",
            status: "active",
            createdAt: "2022-11-08T16:45:00Z",
            owner: {
              firstName: "Pierre",
              lastName: "Leblanc",
              email: "pierre.leblanc@entreprise.com",
              phone: "+33 6 45 67 89 01"
            },
            card: {
              cardNumber: "4539012345678901",
              holderName: "Pierre Leblanc",
              cardType: "VISA",
              status: "ACTIVE",
              expiryDate: "03/27",
              isVirtual: false,
              lastUsedAt: "2024-06-10T16:30:00Z"
            }
          },
          {
            id: "acc_004",
            userId: "user_004",
            accountNumber: "FR7630006000011234567890192",
            balance: 2150.25,
            accountType: "Compte Courant",
            status: "suspended",
            createdAt: "2023-07-12T14:20:00Z",
            owner: {
              firstName: "Sophie",
              lastName: "Bernard",
              email: "sophie.bernard@email.com",
              phone: "+33 6 23 45 67 89"
            },
            card: {
              cardNumber: "5105105105105100",
              holderName: "Sophie Bernard",
              cardType: "MASTERCARD",
              status: "BLOCKED",
              expiryDate: "06/25",
              isVirtual: true,
              lastUsedAt: "2023-12-01T10:15:00Z"
            }
          },
          {
            id: "acc_005",
            userId: "user_005",
            accountNumber: "FR7630006000011234567890193",
            balance: 450.80,
            accountType: "Compte Jeune",
            status: "active",
            createdAt: "2024-01-30T11:10:00Z",
            owner: {
              firstName: "Lucas",
              lastName: "Moreau",
              email: "lucas.moreau@email.com",
              phone: "+33 6 78 90 12 34"
            },
            card: {
              cardNumber: "4532015112830367",
              holderName: "Lucas Moreau",
              cardType: "VISA",
              status: "PENDING_ACTIVATION",
              expiryDate: "01/28",
              isVirtual: true,
              lastUsedAt: null
            }
          }
        ]);
      }, 1500);
    });
  },
  getAccountById: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const accounts = [
          {
            id: "acc_001",
            userId: "user_001",
            accountNumber: "FR7630006000011234567890189",
            balance: 15750.50,
            accountType: "Compte Courant",
            status: "active",
            createdAt: "2023-01-15T10:30:00Z",
            owner: {
              firstName: "Jean",
              lastName: "Dupont",
              email: "ndeuna.sinclair@email.com",
              phone: "+33 6 12 34 56 78"
            },
            card: {
              cardNumber: "4532015112830366",
              holderName: "Jean Dupont",
              cardType: "VISA",
              status: "ACTIVE",
              expiryDate: "12/26",
              isVirtual: false,
              lastUsedAt: "2024-06-15T14:22:00Z"
            }
          },
          {
            id: "acc_002",
            userId: "user_002",
            accountNumber: "FR7630006000011234567890190",
            balance: 8420.75,
            accountType: "Compte Épargne",
            status: "active",
            createdAt: "2023-03-22T09:15:00Z",
            owner: {
              firstName: "Marie",
              lastName: "Martin",
              email: "marie.martin@email.com",
              phone: "+33 6 98 76 54 32"
            },
            card: {
              cardNumber: "5425233430109903",
              holderName: "Marie Martin",
              cardType: "MASTERCARD",
              status: "ACTIVE",
              expiryDate: "09/25",
              isVirtual: true,
              lastUsedAt: "2024-05-20T08:45:00Z"
            }
          },
          {
            id: "acc_003",
            userId: "user_003",
            accountNumber: "FR7630006000011234567890191",
            balance: 125000.00,
            accountType: "Compte Professionnel",
            status: "active",
            createdAt: "2022-11-08T16:45:00Z",
            owner: {
              firstName: "Pierre",
              lastName: "Leblanc",
              email: "pierre.leblanc@entreprise.com",
              phone: "+33 6 45 67 89 01"
            },
            card: {
              cardNumber: "4539012345678901",
              holderName: "Pierre Leblanc",
              cardType: "VISA",
              status: "ACTIVE",
              expiryDate: "03/27",
              isVirtual: false,
              lastUsedAt: "2024-06-10T16:30:00Z"
            }
          },
          {
            id: "acc_004",
            userId: "user_004",
            accountNumber: "FR7630006000011234567890192",
            balance: 2150.25,
            accountType: "Compte Courant",
            status: "suspended",
            createdAt: "2023-07-12T14:20:00Z",
            owner: {
              firstName: "Sophie",
              lastName: "Bernard",
              email: "sophie.bernard@email.com",
              phone: "+33 6 23 45 67 89"
            },
            card: {
              cardNumber: "5105105105105100",
              holderName: "Sophie Bernard",
              cardType: "MASTERCARD",
              status: "BLOCKED",
              expiryDate: "06/25",
              isVirtual: true,
              lastUsedAt: "2023-12-01T10:15:00Z"
            }
          },
          {
            id: "acc_005",
            userId: "user_005",
            accountNumber: "FR7630006000011234567890193",
            balance: 450.80,
            accountType: "Compte Jeune",
            status: "active",
            createdAt: "2024-01-30T11:10:00Z",
            owner: {
              firstName: "Lucas",
              lastName: "Moreau",
              email: "lucas.moreau@email.com",
              phone: "+33 6 78 90 12 34"
            },
            card: {
              cardNumber: "4532015112830367",
              holderName: "Lucas Moreau",
              cardType: "VISA",
              status: "PENDING_ACTIVATION",
              expiryDate: "01/28",
              isVirtual: true,
              lastUsedAt: null
            }
          }
        ];
        resolve(accounts.find(account => account.id === id) || null);
      }, 1000);
    });
  }
};