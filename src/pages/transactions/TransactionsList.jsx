import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Eye, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, CheckCircle, Clock, XCircle } from 'lucide-react';
import { transactionService } from '../../services/transactionService';
import { accountService } from '../../services/accountService';
import { banksService } from '../../services/banksService';
import { bankAccountService } from '../../services/bankAccountService';

const TransactionsList = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accountNumbersById, setAccountNumbersById] = useState({});
  const [banks, setBanks] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState('all');

  // Charger les transactions au montage du composant
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await transactionService.getAllTransactions();
        setTransactions(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des transactions:', error);
        setError('Erreur lors du chargement des transactions. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Récupérer les numéros de compte pour chaque id unique (initiateur/receveur)
  useEffect(() => {
    const fetchAccountNumbers = async () => {
      const ids = [
        ...new Set(transactions.flatMap(t => [t.idAccountSender, t.idAccountReceiver]))
      ].filter(Boolean);
      const entries = await Promise.all(
        ids.map(async id => {
          try {
            if (isBankAccount(id)) {
              const bankAccount = await bankAccountService.getBankAccountById(id);
              return [id, bankAccount?.accountNumber || id];
            } else {
              const account = await accountService.getAccountById(id);
              return [id, account?.accountNumber || id];
            }
          } catch {
            return [id, id];
          }
        })
      );
      setAccountNumbersById(Object.fromEntries(entries));
    };
    if (transactions.length > 0) {
      fetchAccountNumbers();
    }
  }, [transactions]);

  // Charger la liste des banques dynamiquement
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const data = await banksService.getAllBanks();
        setBanks(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des banques:', error);
      }
    };
    fetchBanks();
  }, []);

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
      case 'DEPOT':
        return <ArrowDownLeft className="w-4 h-4" />;
      case 'RETRAIT':
        return <ArrowUpRight className="w-4 h-4" />;
      case 'TRANSFERT':
      case 'VIREMENT':
        return <ArrowRightLeft className="w-4 h-4" />;
      case 'RECHARGE':
        return <ArrowUpRight className="w-4 h-4" />;
      default:
        return <ArrowRightLeft className="w-4 h-4" />;
    }
  };

  // Fonction pour obtenir le badge du type de transaction
  const getTransactionTypeBadge = (type) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1";
    
    switch (type) {
      case 'DEPOT':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            {getTransactionIcon(type)}
            Dépôt
          </span>
        );
      case 'RETRAIT':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            {getTransactionIcon(type)}
            Retrait
          </span>
        );
      case 'TRANSFERT':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            {getTransactionIcon(type)}
            Transfert
          </span>
        );
      case 'VIREMENT':
        return (
          <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
            {getTransactionIcon(type)}
            Virement
          </span>
        );
      case 'RECHARGE':
        return (
          <span className={`${baseClasses} bg-orange-100 text-orange-800`}>
            {getTransactionIcon(type)}
            Recharge
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
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
      case 'SUCCESS':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle className="w-3 h-3" />
            Terminée
          </span>
        );
      case 'FAILED':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <XCircle className="w-3 h-3" />
            Échouée
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            <Clock className="w-3 h-3" />
            Inconnu
          </span>
        );
    }
  };

  // Fonction utilitaire pour savoir si un id correspond à un compte bancaire
  const isBankAccount = (id) => id && id.startsWith('bank_acc_');
  // Tout ce qui n'est pas un compte bancaire est considéré comme un compte jaama
  const isJaamaAccount = (id) => id && !isBankAccount(id);

  // Filtrage des transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.transactionType === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    let matchesBank = true;
    if (selectedBankId === 'jaama') {
      // On veut uniquement les transferts internes (entre comptes jaama)
      matchesBank = (
        transaction.transactionType === 'TRANSFERT' &&
        isJaamaAccount(transaction.idAccountSender) &&
        isJaamaAccount(transaction.idAccountReceiver)
      );
    } else if (selectedBankId !== 'all') {
      matchesBank = transaction.bankId === selectedBankId;
    }

    return matchesSearch && matchesType && matchesStatus && matchesBank;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Chargement des transactions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement</h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">Transactions</h1>
          <p className="text-gray-600">Gérez et consultez toutes les transactions du système</p>
        </div>

        {/* Barre d'outils */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par ID transaction..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Tous les types</option>
                <option value="DEPOT">Dépôts</option>
                <option value="RETRAIT">Retraits</option>
                <option value="TRANSFERT">Transferts</option>
                <option value="VIREMENT">Virements</option>
                <option value="RECHARGE">Recharges</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="SUCCESS">Terminées</option>
                <option value="FAILED">Échouées</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedBankId}
                onChange={e => setSelectedBankId(e.target.value)}
              >
                <option value="all">Toutes les banques</option>
                <option value="jaama">Jaama-Account</option>
                {banks.map(bank => (
                  <option key={bank.id} value={bank.id}>{bank.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{filteredTransactions.length}</div>
              <div className="text-sm text-gray-600">Total transactions</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">
                {filteredTransactions.filter(t => t.status === 'SUCCESS').length}
              </div>
              <div className="text-sm text-gray-600">Terminées</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">
                {filteredTransactions.filter(t => t.status === 'FAILED').length}
              </div>
              <div className="text-sm text-gray-600">Échouées</div>
            </div>
          </div>
        </div>

        {/* Tableau des transactions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Transaction
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Initiateur
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receveur
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.transactionId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.transactionId}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {transaction.transactionType} - {transaction.amount}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getTransactionTypeBadge(transaction.transactionType)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {accountNumbersById[transaction.idAccountSender] || transaction.idAccountSender}
                      </div>
                      <div className="text-sm text-gray-500">
                        Compte émetteur
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {accountNumbersById[transaction.idAccountReceiver] || transaction.idAccountReceiver}
                      </div>
                      <div className="text-sm text-gray-500">
                        Compte destinataire
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`text-sm font-semibold ${
                        transaction.transactionType === 'DEPOT' ? 'text-green-600' : 
                        transaction.transactionType === 'RETRAIT' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {transaction.transactionType === 'DEPOT' ? '+' : transaction.transactionType === 'RETRAIT' ? '-' : ''}
                        {formatAmount(parseFloat(transaction.amount), 'XAF')}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button 
                        onClick={() => navigate(`/transactions/${transaction.transactionId}`)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">Aucune transaction trouvée</div>
              <div className="text-gray-400">Essayez de modifier vos critères de recherche</div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between mt-4">
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
      </div>
    </div>
  );
};

export default TransactionsList;