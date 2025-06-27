import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Calendar, Download, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, CheckCircle, Clock, XCircle, User, CreditCard, BarChart3, Eye } from 'lucide-react';
import { mockApi } from '../../utils/mockApi';

const TransactionHistory = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAccount, setUserAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('last30days');

  // Charger les données au montage du composant
  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger l'utilisateur (ou le premier si pas d'ID spécifié)
        const users = await mockApi.getUsers();
        const user = userId ? users.find(u => u.id === userId) : users[0];
        setSelectedUser(user);

        if (user) {
          // Charger le compte principal de l'utilisateur
          const accounts = await mockApi.getAccounts();
          const account = accounts.find(acc => user.accounts.includes(acc.id));
          setUserAccount(account);

          // Charger l'historique des transactions
          const historyData = await mockApi.getTransactionHistory(user.id);
          // Simuler les soldes après chaque transaction
          const transactionsWithBalance = historyData.map((transaction, index) => ({
            ...transaction,
            balance: 5450.00 - (index * 250), // Simulation simple des soldes
            date: transaction.createdAt
          }));
          setTransactions(transactionsWithBalance);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour formater le montant
  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Fonction pour obtenir l'icône du type de transaction
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'transfer':
        return <ArrowRightLeft className="w-4 h-4" />;
      default:
        return <ArrowRightLeft className="w-4 h-4" />;
    }
  };

  // Fonction pour obtenir le badge du type de transaction
  const getTransactionTypeBadge = (type) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1";
    
    switch (type) {
      case 'deposit':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            {getTransactionIcon(type)}
            Dépôt
          </span>
        );
      case 'withdrawal':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            {getTransactionIcon(type)}
            Retrait
          </span>
        );
      case 'transfer':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            {getTransactionIcon(type)}
            Transfert
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            {getTransactionIcon(type)}
            Autre
          </span>
        );
    }
  };

  // Fonction pour obtenir le badge du statut
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1";
    
    switch (status) {
      case 'completed':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle className="w-3 h-3" />
            OK
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <Clock className="w-3 h-3" />
            Attente
          </span>
        );
      case 'failed':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <XCircle className="w-3 h-3" />
            Échec
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <Clock className="w-3 h-3" />
            Inconnu
          </span>
        );
    }
  };

  // Filtrage des transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calcul des statistiques
  const stats = {
    totalTransactions: filteredTransactions.length,
    totalDeposits: filteredTransactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: filteredTransactions.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    totalTransfers: filteredTransactions.filter(t => t.type === 'transfer' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    completedCount: filteredTransactions.filter(t => t.status === 'completed').length,
    pendingCount: filteredTransactions.filter(t => t.status === 'pending').length,
    failedCount: filteredTransactions.filter(t => t.status === 'failed').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Chargement de l'historique...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Utilisateur non trouvé</h1>
              <p className="text-gray-600 mb-4">L'utilisateur demandé n'existe pas.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Historique des transactions</h1>
          <p className="text-gray-600">Consultez l'historique complet des transactions</p>
        </div>

        {/* Informations du compte */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h2>
                <p className="text-green-100">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">{userAccount?.name} - {userAccount?.number}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-100 mb-1">Solde actuel</div>
              <div className="text-2xl font-bold">{formatAmount(userAccount?.balance || 0, 'EUR')}</div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dépôts totaux</p>
                <p className="text-2xl font-bold text-green-600">{formatAmount(stats.totalDeposits, 'EUR')}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Retraits totaux</p>
                <p className="text-2xl font-bold text-green-600">{formatAmount(stats.totalWithdrawals, 'EUR')}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transferts totaux</p>
                <p className="text-2xl font-bold text-green-600">{formatAmount(stats.totalTransfers, 'EUR')}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowRightLeft className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par ID ou description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="last7days">7 derniers jours</option>
                <option value="last30days">30 derniers jours</option>
                <option value="last3months">3 derniers mois</option>
                <option value="last6months">6 derniers mois</option>
                <option value="last12months">12 derniers mois</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Tous les types</option>
                <option value="deposit">Dépôts</option>
                <option value="withdrawal">Retraits</option>
                <option value="transfer">Transferts</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="completed">Terminées</option>
                <option value="pending">En attente</option>
                <option value="failed">Échouées</option>
              </select>

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>

          {/* Statistiques de filtrage */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{stats.completedCount}</div>
              <div className="text-sm text-gray-600">Terminées</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{stats.pendingCount}</div>
              <div className="text-sm text-gray-600">En attente</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.failedCount}</div>
              <div className="text-sm text-gray-600">Échouées</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{stats.totalTransactions}</div>
              <div className="text-sm text-gray-600">Total affiché</div>
            </div>
          </div>
        </div>

        {/* Historique des transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Historique chronologique
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getTransactionTypeBadge(transaction.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{transaction.id}</h4>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{transaction.description}</p>
                      <div className="text-xs text-gray-500">{formatDate(transaction.date)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      transaction.type === 'deposit' ? 'text-green-600' : 
                      transaction.type === 'withdrawal' ? 'text-green-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                      {formatAmount(transaction.amount, transaction.currency)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Solde: {formatAmount(transaction.balance, transaction.currency)}
                    </div>
                    <button 
                      onClick={() => navigate(`/transactions/${transaction.id}`)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors mt-1"
                    >
                      <Eye className="w-3 h-3" />
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">Aucune transaction trouvée</div>
              <div className="text-gray-400">Essayez de modifier vos critères de recherche</div>
            </div>
          )}
        </div>

        {/* Pagination et actions */}
        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à{' '}
              <span className="font-medium">{filteredTransactions.length}</span> sur{' '}
              <span className="font-medium">{filteredTransactions.length}</span> transactions
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Précédent
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <ArrowDownLeft className="w-4 h-4" />
              Nouveau dépôt
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ArrowRightLeft className="w-4 h-4" />
              Nouveau transfert
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              Rapport mensuel
            </button>
          </div>
        </div>

        {/* Résumé mensuel */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé du mois en cours</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ArrowDownLeft className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">Entrées</span>
                </div>
                <span className="text-green-600 font-bold">+{formatAmount(stats.totalDeposits, 'EUR')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">Sorties</span>
                </div>
                <span className="text-green-600 font-bold">-{formatAmount(stats.totalWithdrawals, 'EUR')}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium">Transferts</span>
                </div>
                <span className="text-green-600 font-bold">{formatAmount(stats.totalTransfers, 'EUR')}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Variation nette</span>
                  <span className={`font-bold ${
                    (stats.totalDeposits - stats.totalWithdrawals) >= 0 ? 'text-green-600' : 'text-green-600'
                  }`}>
                    {(stats.totalDeposits - stats.totalWithdrawals) >= 0 ? '+' : ''}
                    {formatAmount(stats.totalDeposits - stats.totalWithdrawals, 'XAF')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
            <div className="space-y-3">
              {filteredTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'deposit' ? 'bg-green-100 text-green-600' :
                      transaction.type === 'withdrawal' ? 'bg-green-100 text-green-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-900">{transaction.description}</div>
                      <div className="text-xs text-gray-500">{formatDate(transaction.date)}</div>
                    </div>
                  </div>
                  <div className={`font-semibold text-sm ${
                    transaction.type === 'deposit' ? 'text-green-600' :
                    transaction.type === 'withdrawal' ? 'text-green-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                    {formatAmount(transaction.amount, transaction.currency)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;