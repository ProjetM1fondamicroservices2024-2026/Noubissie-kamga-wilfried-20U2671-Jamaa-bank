import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  Download,
  MoreVertical,
  Activity,
  Shield,
  Clock,
  AlertCircle
} from 'lucide-react';
import { userApi, cardApi, bankApi,  transactionApi, banksAccountApi } from '../../services/api'; // Import des APIs nécessaires
import authService from '../../services/authService'; // Import du service d'authentification


// GraphQL query to get cards by bank ID with active status
const GET_CARDS_BY_BANK = `
  query GetCardsByBank($bankId: ID!) {
    cardsByBank(bankId: $bankId) {
      id
      status
      bankId
    }
  }
`;

// Requête GraphQL pour récupérer les détails d'une banque
const GET_BANK_DETAILS = `
  query GetBank($id: ID!) {
    bank(id: $id) {
      id
      name
      slogan
      logoUrl
      isActive
    }
  }
`;

// GraphQL query to get all transactions with pagination and sorting
const GET_ALL_TRANSACTIONS = `
  query GetAllTransactions {
    getAllTransactions {
      transactionId
      transactionType
      amount
      status
      idAccountSender
      idAccountReceiver
      createdAt
      dateEvent
      bankId
    }
  }
`;

// GraphQL query to get bank account balance
const GET_BANK_ACCOUNT = `
  query GetBankAccount($bankId: ID!) {
    getBankAccountByBankId(bankId: $bankId) {
      id
      bankId
      totalBalance
      totalWithdrawFees
      totalInternalTransferFees
      totalExternalTransferFees
    }
  }
`;

const Dashboard = () => {
  // État central pour l'ID de la banque - récupéré depuis authService
  const [currentBankId, setCurrentBankId] = useState(authService.getBankId());
  
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [bankBalance, setBankBalance] = useState({
    total: 0,
    loading: true,
    error: null
  });
  const [stats, setStats] = useState({
    totalUsers: { value: 0, loading: true, error: null },
    accounts: { value: 0, loading: true, error: null },
    monthlyTransactions: { value: 0, loading: true, error: null },
    failedTransactions: { value: 0, loading: true, error: null },
    totalTransactions: { value: 0, loading: true, error: null }
  });
  
  const [bankName, setBankName] = useState(authService.getBankName());
  useEffect(() => {
    const fetchBankDetails = async () => {
      const bankId = currentBankId; // Utiliser l'ID centralisé
      
      try {
        const response = await bankApi.post('', {
          query: GET_BANK_DETAILS,
          variables: { id: bankId }
        });
        
        const bankData = response.data?.data?.bank;
        if (bankData && bankData.name) {
          setBankName(bankData.name);
          // Vous pouvez aussi stocker d'autres informations de la banque ici
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la banque:", error);
      }
    };

    fetchBankDetails();
  }, [currentBankId]); // Ajouter currentBankId comme dépendance
  
  const [recentTransactions, setRecentTransactions] = useState({
    data: [],
    loading: true,
    error: null,
    page: 0,
    total: 0,
    pageSize: 5,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });
  
  // État pour les statistiques des transactions
  const [transactionStats, setTransactionStats] = useState({
    loading: true,
    error: null,
    total: 0,
    byType: {
      DEPOSIT: { count: 0, amount: 0, color: 'bg-green-500' },
      WITHDRAWAL: { count: 0, amount: 0, color: 'bg-yellow-500' },
      TRANSFER: { count: 0, amount: 0, color: 'bg-blue-500' }
    }
  });
  
  const iconComponents = {
    Users,
    CreditCard,
    TrendingUp,
    ArrowUpDown,
    Activity,
    AlertCircle,
    Eye,
    EyeOff,
    Download,
    MoreVertical,
    Shield,
    Clock,
    ArrowUpRight,
    ArrowDownRight
  };

  // Format currency
  const formatCurrency = (amount) => {
    // Convertir en nombre si ce n'est pas déjà le cas
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    
    // Vérifier si le montant est un nombre valide
    if (isNaN(numAmount)) {
      console.error('Montant invalide pour le formatage:', amount);
      return '0,00 FCFA';
    }
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numAmount).replace('XAF', 'FCFA');
  };
  

  // Fonction pour récupérer les statistiques des transactions
  const fetchTransactionStats = async () => {
    try {
      setTransactionStats(prev => ({ ...prev, loading: true, error: null }));
      
      console.log('Récupération des statistiques des transactions...');
      
      // Utilisation de la requête GET_ALL_TRANSACTIONS avec le bankId
      const response = await transactionApi.post('', {
        query: GET_ALL_TRANSACTIONS,
        variables: {
          bankId: currentBankId // Utiliser l'ID centralisé
        }
      });
      
      console.log('Réponse reçue pour les statistiques:', response.data);
      
      const transactions = response.data?.data?.getAllTransactions || [];
      console.log('Transactions reçues pour les statistiques:', transactions);
      
      // Calculer les statistiques par type de transaction
      const stats = {
        total: transactions.length,
        byType: {
          DEPOT: { count: 0, amount: 0, color: 'bg-green-500', label: 'Dépôts' },
          RETRAIT: { count: 0, amount: 0, color: 'bg-yellow-500', label: 'Retraits' },
          TRANSFERT: { count: 0, amount: 0, color: 'bg-blue-500', label: 'Transferts' },
          RECHARGE: { count: 0, amount: 0, color: 'bg-purple-500', label: 'Recharges' },
          VIREMENT: { count: 0, amount: 0, color: 'bg-indigo-500', label: 'Virements' }
        }
      };
      
      transactions.forEach(transaction => {
        const type = transaction.transactionType || 'TRANSFERT';
        console.log(`Traitement de la transaction de type: ${type}`, transaction);
        if (stats.byType[type]) {
          stats.byType[type].count += 1;
          stats.byType[type].amount += parseFloat(transaction.amount || 0);
        }
      });
      
      console.log('Statistiques calculées:', stats);
      
      setTransactionStats({
        loading: false,
        error: null,
        ...stats
      });
      
    } catch (err) {
      console.error('Error fetching transaction stats:', err);
      if (err.response) {
        console.error('Détails de l\'erreur:', {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        });
      }
      setTransactionStats(prev => ({
        ...prev,
        loading: false,
        error: 'Erreur lors du chargement des statistiques des transactions'
      }));
    }
  };
  
  // Récupérer les transactions récentes
  const fetchRecentTransactions = useCallback(async () => {
    try {
      setRecentTransactions(prev => ({ ...prev, loading: true }));
      
      console.log(`[fetchRecentTransactions] Début`);
      
      // 1. Récupérer toutes les transactions
      console.log('[fetchRecentTransactions] Envoi de la requête API...');
      const response = await transactionApi.post('', {
        query: GET_ALL_TRANSACTIONS
      });
      
      console.log('[fetchRecentTransactions] Réponse API reçue:', response);

      // 2. Traiter les transactions reçues
      let transactions = [];
      if (response.data?.data?.getAllTransactions) {
        console.log('[fetchRecentTransactions] Transactions brutes reçues:', response.data.data.getAllTransactions);
        // Ne filtrons plus par bankId car l'API ne le supporte pas
        transactions = response.data.data.getAllTransactions;
      }
      
      console.log(`[fetchRecentTransactions] ${transactions.length} transactions filtrées pour la banque ${currentBankId}`, transactions);
      
      // 3. Trier par date de création décroissante et prendre les 5 premières
      const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      console.log('[fetchRecentTransactions] Transactions triées et limitées:', recentTransactions);
      
      // 4. Mettre à jour l'état avec les données filtrées
      const newState = {
        data: recentTransactions,
        loading: false,
        error: null,
        total: transactions.length,
        filteredCount: recentTransactions.length,
        sortBy: 'createdAt',
        sortOrder: 'DESC'
      };
      
      console.log('[fetchRecentTransactions] Mise à jour de l\'état avec:', newState);
      setRecentTransactions(newState);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      setRecentTransactions(prev => ({
        ...prev,
        loading: false,
        error: `Erreur lors du chargement des transactions pour la banque ${currentBankId}`
      }));
    }
  }, [currentBankId]); // La fonction sera recréée si currentBankId change
  

  
  // Gestion du tri des colonnes
  const handleSort = (column) => {
    setRecentTransactions(prev => {
      // Si on clique sur la même colonne, on inverse l'ordre
      const isAsc = prev.sortBy === column && prev.sortOrder === 'asc';
      
      // Trier les données
      const sortedData = [...prev.data].sort((a, b) => {
        // Gérer le tri par date
        if (column === 'createdAt') {
          return isAsc 
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        }
        
        // Gérer le tri par montant
        if (column === 'amount') {
          return isAsc 
            ? parseFloat(a.amount) - parseFloat(b.amount)
            : parseFloat(b.amount) - parseFloat(a.amount);
        }
        
        // Tri par défaut pour les autres colonnes
        return isAsc 
          ? String(a[column] || '').localeCompare(String(b[column] || ''))
          : String(b[column] || '').localeCompare(String(a[column] || ''));
      });
      
      return {
        ...prev,
        data: sortedData,
        sortBy: column,
        sortOrder: isAsc ? 'desc' : 'asc',
        page: 0 // Reset à la première page lors du tri
      };
    });
  };
  
  // Gestion du changement de page
  const handlePageChange = (newPage) => {
    setRecentTransactions(prev => ({
      ...prev,
      page: newPage
    }));
  };
  
  // Fonction pour charger les statistiques
  const fetchStats = useCallback(async () => {
    try {
      console.log(`Récupération des statistiques pour la banque ID: ${currentBankId}`);
      const bankId = currentBankId;
      
      // 1. Récupérer le solde du compte bancaire
      const bankAccountResponse = await banksAccountApi.post('', {
        query: GET_BANK_ACCOUNT,
        variables: { bankId }
      });
      
      const bankAccount = bankAccountResponse.data.data?.getBankAccountByBankId;
      if (bankAccount) {
        setBankBalance({
          total: bankAccount.totalBalance || 0,
          loading: false,
          error: null
        });
      }
      
      // 2. Récupérer les cartes de la banque
      let totalCardsCount = 0;
      let activeCardsCount = 0;
      
      try {
        console.log('Récupération des cartes...');
        const cardsResponse = await cardApi.post('', { 
          query: `
            query GetAllCards {
              allCards {
                id
                status
                bankId
              }
            }
          `
        });
        
        // Filtrer les cartes pour la banque courante
        if (cardsResponse.data?.data?.allCards) {
          const bankCards = cardsResponse.data.data.allCards.filter(
            card => String(card.bankId) === String(bankId)
          );
          
          totalCardsCount = bankCards.length;
          activeCardsCount = bankCards.filter(card => card.status === 'ACTIVE').length;
          
          console.log(`Cartes trouvées: ${totalCardsCount} (dont ${activeCardsCount} actives)`);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des cartes:', error);
      }
      
      // 3. Mettre à jour les statistiques
      setStats({
        totalUsers: { value: totalCardsCount, loading: false, error: null },
        accounts: { value: totalCardsCount, loading: false, error: null },
        monthlyTransactions: { value: 0, loading: false, error: null },
        failedTransactions: { value: 0, loading: false, error: null },
        totalTransactions: { value: 0, loading: false, error: null }
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return false;
    }
  }, [currentBankId]);
  
  // Fonction pour charger les détails de la banque
  const fetchBankDetails = useCallback(async () => {
    try {
      console.log(`Récupération des détails de la banque ID: ${currentBankId}`);
      
      const response = await bankApi.post('', {
        query: GET_BANK_DETAILS,
        variables: { id: currentBankId }
      });
      
      const bankData = response.data?.data?.bank;
      if (bankData) {
        setBankName(bankData.name || "Jamaa Bank");
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la banque:', error);
      return false;
    }
  }, [currentBankId]);
  
  // Charger les données au montage et quand currentBankId change
  useEffect(() => {
    const loadData = async () => {
      console.log('Chargement des données pour la banque ID:', currentBankId);
      try {
        await Promise.all([
          fetchBankDetails(),
          fetchStats(),
          fetchRecentTransactions(),
          fetchTransactionStats()
        ]);
        console.log('Données chargées avec succès pour la banque ID:', currentBankId);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    
    loadData();
  }, [currentBankId, fetchBankDetails, fetchStats, fetchRecentTransactions]);
  
  // Formatage des statistiques pour l'affichage
  const statsData = [
    {
      title: 'Total Cartes',
      value: stats.totalUsers.loading 
        ? '...' 
        : stats.totalUsers.error || stats.totalUsers.value.toLocaleString('fr-FR'),
      trend: stats.totalUsers.loading 
        ? 'Chargement...' 
        : `${stats.totalUsers.value} carte${stats.totalUsers.value > 1 ? 's' : ''} enregistrée${stats.totalUsers.value > 1 ? 's' : ''}`,
      icon: 'CreditCard',
      color: 'bg-blue-500',
      change: '', // Retiré le pourcentage fictif
      changeType: 'neutral'
    },
    {
      title: 'Comptes Actifs',
      value: stats.accounts.loading 
        ? '...' 
        : stats.accounts.error || (stats.accounts.value || 0).toLocaleString('fr-FR'),
      trend: stats.accounts.loading 
        ? 'Chargement...' 
        : `${stats.accounts.value || 0} compte${stats.accounts.value !== 1 ? 's' : ''} actif${stats.accounts.value > 1 ? 's' : ''}`,
      icon: 'Users',
      color: 'bg-green-500',
      change: '', // Retiré le pourcentage fictif
      changeType: 'neutral'
    },
    {
      title: 'Transactions ce Mois',
      value: stats.monthlyTransactions?.loading 
        ? '...' 
        : stats.monthlyTransactions?.error || 
          (() => {
            const value = stats.monthlyTransactions?.value ?? 0;
            console.log(`Affichage des transactions mensuelles: ${value}`);
            return value.toLocaleString('fr-FR');
          })(),
      trend: stats.monthlyTransactions?.loading 
        ? 'Chargement...' 
        : (() => {
            const value = stats.monthlyTransactions?.value ?? 0;
            const total = stats.totalTransactions?.value ?? 0;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${value.toLocaleString('fr-FR')} transactions (${percentage}% du total)`;
          })(),
      icon: 'ArrowUpDown',
      color: 'bg-orange-500',
      change: stats.monthlyTransactions?.loading 
        ? '...' 
        : (() => {
            // Simulation d'évolution par rapport au mois précédent
            const change = Math.floor(Math.random() * 20) + 5; // 5-25%
            return `+${change}%`;
          })(),
      changeType: 'positive',
      lastUpdated: stats.monthlyTransactions?.lastUpdated
    }
  ];
  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };
  
  // Calculate percentages for the chart
  const getPercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };
  
  // Get transaction type label
  const getTransactionTypeLabel = (type) => {
    const labels = {
      DEPOT: 'Dépôts',
      RETRAIT: 'Retraits',
      TRANSFERT: 'Transferts',
      RECHARGE: 'Recharges'
    };
    return labels[type] || type;
  };
  
  // Get color class for transaction type (for SVG)
  const getTransactionColor = (color) => {
    const colors = {
      'bg-green-500': '#10B981',
      'bg-yellow-500': '#F59E0B',
      'bg-blue-500': '#3B82F6'
    };
    return colors[color] || '#6B7280';
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-x-hidden">
      <div className="w-full max-w-[90%] mx-auto px-6 py-6 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* Header Section */}
        <div className="w-full">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-xs sm:text-sm lg:text-lg">{bankName.charAt(0)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-900 truncate">
                  {bankName}
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 truncate">Tableau de bord administrateur</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:flex-shrink-0">
              <div className="bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Système opérationnel</span>
                </div>
              </div>
             
            </div>
          </div>
        </div>

        {/* Section Solde Total */}
        <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16 sm:-translate-y-24 sm:translate-x-24 lg:-translate-y-32 lg:translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-white bg-opacity-5 rounded-full translate-y-12 -translate-x-12 sm:translate-y-16 sm:-translate-x-16"></div>
          
          <div className="relative">
            <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white bg-opacity-20 rounded-xl lg:rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xl flex-shrink-0">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div className="text-white min-w-0 flex-1">
                  <p className="text-sm sm:text-base lg:text-xl font-bold opacity-90 uppercase tracking-wider mb-2">Solde Total de la Banque</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="text-2xl sm:text-3xl lg:text-5xl font-bold">
                      {bankBalance.loading 
                        ? 'Chargement...' 
                        : bankBalance.error || (isBalanceVisible 
                          ? formatCurrency(bankBalance.total)
                          : '••••••••••')}
                    </div>
                    <button 
                      onClick={toggleBalanceVisibility}
                      className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl transition-all duration-300 backdrop-blur-sm shadow-lg self-start sm:self-auto"
                      disabled={bankBalance.loading || bankBalance.error}
                    >
                      {isBalanceVisible ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span className="text-xs sm:text-sm font-semibold">Masquer</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span className="text-xs sm:text-sm font-semibold">Afficher</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm opacity-80 mt-2">
                    {bankBalance.loading ? 'Récupération du solde...' : bankBalance.error || 'Solde total de la banque'}
                  </p>
                </div>
              </div>
              
              <div className="text-right text-white flex-shrink-0">
                <div className="flex items-center gap-2 bg-emerald-500 bg-opacity-30 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl backdrop-blur-sm mb-2 sm:mb-3 shadow-lg justify-end">
                  <ArrowUpRight className="w-4 h-4 text-emerald-200" />
                  <span className="text-base sm:text-lg lg:text-xl font-bold">+5.2%</span>
                </div>
                <p className="text-xs sm:text-sm opacity-75">vs mois dernier</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-white border-opacity-20 gap-2 sm:gap-0 mt-4 sm:mt-6">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-white">Sécurisé SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-300 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-white">Temps réel</span>
                </div>
              </div>
              <div className="text-xs text-white opacity-70">
                Mise à jour: {new Date().toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Statistiques */}
          <div className="xl:col-span-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {statsData.map((stat, index) => {
                const Icon = iconComponents[stat.icon];
                const isPositive = stat.changeType === 'positive';
                
                return (
                  <div key={index} className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                        <div className={`mt-2 flex items-center ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isPositive ? (
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 mr-1" />
                          )}
                          <span className="text-xs font-medium">{stat.trend}</span>
                        </div>
                      </div>
                      <div className={`p-2 sm:p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color.replace('bg-', 'text-').replace('-500', '-600')}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Diagrammes sous les statistiques */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Répartition des Transactions</h3>
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-48 h-48 md:w-64 md:h-64">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      {Object.entries(transactionStats.byType).map(([type, data], index, array) => {
                        if (data.count === 0) return null;
                        const percentage = getPercentage(data.count, transactionStats.total);
                        const offset = array.slice(0, index).reduce((acc, [_, d]) => {
                          return acc + getPercentage(d.count, transactionStats.total);
                        }, 0);
                        
                        return (
                          <path
                            key={type}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={getTransactionColor(data.color)}
                            strokeWidth="3"
                            strokeDasharray={`${percentage}, 100`}
                            strokeDashoffset={`-${offset}`}
                          />
                        );
                      })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {transactionStats.total.toLocaleString('fr-FR')}
                        </p>
                        <p className="text-sm text-gray-500">Total</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-auto space-y-3">
                    {Object.entries(transactionStats.byType).map(([type, data]) => {
                      if (data.count === 0) return null;
                      const percentage = getPercentage(data.count, transactionStats.total);
                      const colorName = data.color.split('-')[1];
                      const colorClass = `bg-${colorName}-50`;
                      const textColorClass = `text-${colorName}-700`;
                      
                      return (
                        <div key={type} className={`flex items-center justify-between p-3 ${colorClass} rounded-lg`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 ${data.color} rounded-full`}></div>
                            <span className="text-sm font-medium text-gray-700">
                              {getTransactionTypeLabel(type)}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${textColorClass}`}>
                              {data.count.toLocaleString('fr-FR')}
                            </p>
                            <p className="text-xs text-gray-500">{percentage}%</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            {/* Diagramme Circulaire */}
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">Répartition des Transactions</h3>
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
              </div>
            
              <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {Object.entries(transactionStats.byType).map(([type, data], index, array) => {
                      if (data.count === 0) return null;
                      const percentage = getPercentage(data.count, transactionStats.total);
                      const offset = array.slice(0, index).reduce((acc, [_, d]) => {
                        return acc + getPercentage(d.count, transactionStats.total);
                      }, 0);
                      
                      return (
                        <path
                          key={type}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={getTransactionColor(data.color)}
                          strokeWidth="3"
                          strokeDasharray={`${percentage}, 100`}
                          strokeDashoffset={`-${offset}`}
                        />
                      );
                    })}
                  </svg>
                </div>
                
              </div>
            </div>
            
            {transactionStats.loading ? (
              <div className="flex items-center justify-center h-64">
                <p>Chargement des données...</p>
              </div>
            ) : transactionStats.error ? (
              <div className="flex items-center justify-center h-64 text-red-500">
                <p>{transactionStats.error}</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {Object.entries(transactionStats.byType).map(([type, data]) => {
                  if (data.count === 0) return null;
                  const percentage = getPercentage(data.count, transactionStats.total);
                  const colorName = data.color.split('-')[1];
                  const colorClass = `bg-${colorName}-50`;
                  const textColorClass = `text-${colorName}-700`;
                  const textLightColorClass = `text-${colorName}-600`;
                  
                  return (
                    <div key={type} className={`flex items-center justify-between p-2 sm:p-3 ${colorClass} rounded-lg`}>
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className={`w-3 h-3 ${data.color} rounded-full flex-shrink-0`}></div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">
                          {getTransactionTypeLabel(type)}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm sm:text-base font-bold ${textColorClass}`}>
                          {data.count.toLocaleString('fr-FR')}
                        </p>
                        <p className={`text-xs ${textLightColorClass}`}>
                          {percentage}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Espace pour d'autres composants si nécessaire */}
        </div>

        {/* Transactions Récentes */}
        <div className="w-full bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 border-b border-gray-200">
            <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Transactions Récentes</h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Activité en temps réel • 
                  {recentTransactions.loading ? '...' : `${recentTransactions.total} transactions`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => fetchRecentTransactions()}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Rafraîchir"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </button>
                
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-6">
            {recentTransactions.loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : recentTransactions.error ? (
              <div className="text-center py-4 text-red-500">
                {recentTransactions.error}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          scope="col" 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('transactionType')}
                        >
                          <div className="flex items-center">
                            Type
                            {recentTransactions.sortBy === 'transactionType' && (
                              <span className="ml-1">
                                {recentTransactions.sortOrder === 'ASC' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Comptes
                        </th>
                        <th 
                          scope="col" 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('amount')}
                        >
                          <div className="flex items-center">
                            Montant
                            {recentTransactions.sortBy === 'amount' && (
                              <span className="ml-1">
                                {recentTransactions.sortOrder === 'ASC' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center">
                            Statut
                            {recentTransactions.sortBy === 'status' && (
                              <span className="ml-1">
                                {recentTransactions.sortOrder === 'ASC' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('createdAt')}
                        >
                          <div className="flex items-center">
                            Date
                            {recentTransactions.sortBy === 'createdAt' && (
                              <span className="ml-1">
                                {recentTransactions.sortOrder === 'ASC' ? '↑' : '↓'}
                              </span>
                            )}
                          </div>
                        </th>
                        <th scope="col" className="relative px-4 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {console.log('[RENDER] État actuel de recentTransactions:', recentTransactions)}
                      {console.log('[RENDER] Données des transactions:', recentTransactions.data)}
                      {recentTransactions.data.length > 0 ? (
                        recentTransactions.data.map((transaction) => (
                          <tr key={transaction.transactionId} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                  transaction.transactionType === 'DEPOT' ? 'bg-green-500' : 
                                  transaction.transactionType === 'RETRAIT' ? 'bg-red-500' : 
                                  transaction.transactionType === 'TRANSFERT' ? 'bg-blue-500' : 'bg-gray-500'
                                }`}></div>
                                <div className="text-sm font-medium text-gray-900">
                                  {getTransactionTypeLabel(transaction.transactionType)}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {transaction.idAccountSender} → {transaction.idAccountReceiver}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className={`text-sm font-medium ${
                                transaction.transactionType === 'DEPOT' ? 'text-green-600' : 
                                transaction.transactionType === 'RETRAIT' ? 'text-red-600' : 
                                transaction.transactionType === 'TRANSFERT' ? 'text-blue-600' : 'text-gray-600'
                              }`}>
                                {transaction.transactionType === 'RETRAIT' ? '-' : ''}
                                {formatCurrency(parseFloat(transaction.amount))}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.status === 'SUCCESS' || transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {transaction.status === 'SUCCESS' ? 'TERMINÉ' : transaction.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(transaction.createdAt).toLocaleString('fr-FR')}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                onClick={() => console.log('Détails de la transaction:', transaction.transactionId)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                Détails
                              </button>
                              {transaction.status === 'PENDING' && (
                                <button 
                                  onClick={() => console.log('Annuler la transaction:', transaction.transactionId)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Annuler
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500">
                            Aucune transaction trouvée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {recentTransactions.total > recentTransactions.pageSize && (
                  <div className="flex items-center justify-between mt-4 px-2">
                    <div className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">
                        {Math.min((recentTransactions.page * recentTransactions.pageSize) + 1, recentTransactions.total)}
                      </span> à <span className="font-medium">
                        {Math.min((recentTransactions.page + 1) * recentTransactions.pageSize, recentTransactions.total)}
                      </span> sur <span className="font-medium">{recentTransactions.total}</span> transactions
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(Math.max(0, recentTransactions.page - 1))}
                        disabled={recentTransactions.page === 0}
                        className={`px-3 py-1 rounded-md text-sm ${
                          recentTransactions.page === 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        Précédent
                      </button>
                      <button
                        onClick={() => handlePageChange(recentTransactions.page + 1)}
                        disabled={(recentTransactions.page + 1) * recentTransactions.pageSize >= recentTransactions.total}
                        className={`px-3 py-1 rounded-md text-sm ${
                          (recentTransactions.page + 1) * recentTransactions.pageSize >= recentTransactions.total
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;