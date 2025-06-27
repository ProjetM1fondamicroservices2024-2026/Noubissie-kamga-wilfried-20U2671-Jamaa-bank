import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Download, CheckCircle, XCircle, AlertCircle, Plus, ChevronLeft, ChevronRight, CreditCard, ArrowUpDown, X } from 'lucide-react';
import { mockAccountService } from '../../utils/mockData';
import { cardApi } from '../../services/api'; 
 
const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { icon: CheckCircle, text: 'Actif', className: 'bg-green-100 text-green-800 border-green-200' },
    suspended: { icon: XCircle, text: 'Suspendu', className: 'bg-red-100 text-red-800 border-red-200' },
    pending: { icon: AlertCircle, text: 'En attente', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
  };
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon size={12} className="mr-1" />
      {config.text}
    </span>
  );
};

const CardStatusBadge = ({ status }) => {
  const statusConfig = {
    ACTIVE: { icon: CheckCircle, text: 'Active', className: 'bg-green-100 text-green-800 border-green-200' },
    BLOCKED: { icon: XCircle, text: 'Bloquée', className: 'bg-red-100 text-red-800 border-red-200' },
    PENDING_ACTIVATION: { icon: AlertCircle, text: 'En attente', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
  };
  const config = statusConfig[status] || statusConfig.PENDING_ACTIVATION;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon size={12} className="mr-1" />
      {config.text}
    </span>
  );
};

const AccountsList = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [inputAccountNumber, setInputAccountNumber] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [balanceError, setBalanceError] = useState('');
  const [showVerifiedBalance, setShowVerifiedBalance] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccountData, setNewAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    accountType: 'Compte Courant',
    balance: 0,
    cardType: 'VISA',
    isVirtual: false
  });

useEffect(() => {
  fetchAccounts();
}, []);


  const fetchAccounts = async () => {
  setLoading(true);
  try {
    const response = await cardApi.post('', {
      query: `
        query {
          allCards {
            id
            cardNumber
            maskedCardNumber
            holderName
            customerId
            cardType
            status
            expiryDate
            creditLimit
            currentBalance
            isVirtual
            createdAt
            lastUsedAt
            bankName
          }
        }
      `
    });

    const cards = response.data.data.allCards;

    const formatted = cards.map((card) => {
      const [firstName, ...rest] = card.holderName.split(' ');
      const lastName = rest.join(' ');

      return {
        id: card.id,
        userId: card.customerId,
        accountNumber: card.cardNumber,
        balance: card.currentBalance,
        accountType: card.cardType,
        status: card.status.toLowerCase(), // ex: 'ACTIVE' → 'active'
        createdAt: card.createdAt,
        owner: {
          firstName,
          lastName,
          email: '',
          phone: ''
        },
        card: {
          cardNumber: card.cardNumber,
          maskedCardNumber: card.maskedCardNumber,
          holderName: card.holderName,
          cardType: card.cardType,
          status: card.status,
          expiryDate: card.expiryDate,
          isVirtual: card.isVirtual,
          lastUsedAt: card.lastUsedAt
        }
      };
    });

    setAccounts(formatted);
  } catch (error) {
    console.error('Erreur lors de la récupération des comptes:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, itemsPerPage]);

  const filteredAccounts = useMemo(() => {
    if (!accounts) return [];
    return accounts.filter(account => {
      if (!account || !account.owner) return false;
      const matchesSearch =
        account.owner.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.owner.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.owner.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
      const matchesType = typeFilter === 'all' || account.accountType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    }).sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'balance') {
        return order * (a.balance - b.balance);
      } else if (sortBy === 'createdAt') {
        return order * (new Date(a.createdAt) - new Date(b.createdAt));
      }
      return 0;
    });
  }, [accounts, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

  const formatBalance = () => '••••••';

  const formatAccountNumber = (accountNumber) => {
    return accountNumber ? accountNumber.replace(/(.{4})/g, '$1 ').trim() : '';
  };

  const formatCardNumber = (cardNumber) => {
    return cardNumber ? `•••• •••• •••• ${cardNumber.slice(-4)}` : '';
  };

  const totalAccounts = filteredAccounts.length;
  const activeAccounts = filteredAccounts.filter(acc => acc.status === 'active').length;
  const uniqueClients = new Set(filteredAccounts.map(acc => acc.userId)).size;
  const accountTypes = [...new Set(accounts.map(acc => acc.accountType).filter(type => type))];

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleViewBalance = (account) => {
    setSelectedAccount(account);
    setInputAccountNumber('');
    setInputEmail('');
    setBalanceError('');
    setShowVerifiedBalance(false);
    setShowBalanceModal(true);
  };

  const handleVerifyBalance = async () => {
  setBalanceError('');
  setShowVerifiedBalance(false);

  if (!inputAccountNumber) {
    setBalanceError("Veuillez saisir le numéro de la carte.");
    return;
  }

  const query = `
    query CardByNumber($cardNumber: String!) {
      cardByNumber(cardNumber: $cardNumber) {
        cardNumber
        currentBalance
        holderName
        cardType
        status
        expiryDate
      }
    }
  `;

  try {
    const response = await cardApi.post('', {
      query,
      variables: { cardNumber: inputAccountNumber },
    });

    const card = response.data.data.cardByNumber;

    if (card) {
      setSelectedAccount(prev => ({
        ...prev,
        balance: card.currentBalance,
        cardType: card.cardType,
        holderName: card.holderName,
        status: card.status,
        expiryDate: card.expiryDate,
      }));
      setShowVerifiedBalance(true);
    } else {
      setBalanceError("Carte non trouvée.");
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du solde:', error);
    setBalanceError("Une erreur s'est produite.");
  }
};


  const generateAccountNumber = () => {
    const randomDigits = Math.floor(100000000000000000000 + Math.random() * 900000000000000000000).toString();
    return `FR76${randomDigits.slice(0, 20)}`;
  };

  const generateCardNumber = () => {
    const randomDigits = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    return `4532${randomDigits.slice(0, 12)}`;
  };

  const generateExpiryDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 3);
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
  };

  const handleAddAccount = async () => {
    try {
      // 1. Création de la carte
      const createRes = await cardApi.post('', {
        query: `
          mutation CreateCard($input: CardCreateInput!) {
            createCard(input: $input) {
              id
              status
            }
          }
        `,
        variables: {
          input: {
            holderName: `${newAccountData.firstName} ${newAccountData.lastName}`,
            customerId: newAccountData.userId || `user_${accounts.length + 1}`,
            cardType: newAccountData.cardType,
            creditLimit: parseFloat(newAccountData.balance) || 0,
            pin: "1234",
            bankId: newAccountData.bankId || `bank_${accounts.length + 1}`,
            bankName: newAccountData.bankName || 'Banque Jamaa',
          }
        }
      });
      const cardId = createRes.data.data.createCard.id;
      // 2. Activation de la carte
      await cardApi.post('', {
        query: `
          mutation ActivateCard($id: ID!) {
            activateCard(id: $id) {
              id
              status
            }
          }
        `,
        variables: { id: cardId }
      });
      // 3. Rafraîchir la liste
      fetchAccounts();
      setShowAddModal(false);
      setNewAccountData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        accountType: 'Compte Courant',
        balance: 0,
        cardType: 'VISA',
        isVirtual: false
      });
    } catch (error) {
      console.error('Erreur lors de la création/activation de la carte:', error);
      // Affiche une erreur à l'utilisateur si besoin
    }
  };

  // Fonction pour activer une carte bancaire
  const handleActivateCard = async (cardId) => {
    try {
      await cardApi.post('', {
        query: `
          mutation ActivateCard($id: ID!) {
            activateCard(id: $id) {
              id
              status
            }
          }
        `,
        variables: { id: cardId }
      });
      fetchAccounts();
    } catch (error) {
      console.error('Erreur lors de l\'activation de la carte:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-16">
      <div className="max-w-10xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Comptes</h1>
              <p className="mt-2 text-gray-600">Jamaa Bank - Administration des comptes clients</p>
            </div>
            
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4 p-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, ou numéro de compte..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous statuts</option>
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
                <option value="pending">En attente</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tous types</option>
                {accountTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numéro de compte
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solde
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('createdAt')}>
                    Créé le <ArrowUpDown className="inline w-4 h-4 ml-1" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Carte bancaire
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-700 font-bold text-lg">
                            {account.owner.firstName?.charAt(0) || ''}{account.owner.lastName?.charAt(0) || ''}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {account.owner.firstName} {account.owner.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{account.owner.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                      {formatAccountNumber(account.accountNumber)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-900">{account.accountType}</div>
                        <StatusBadge status={account.status} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {formatBalance(account.balance)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(account.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {account.card.cardType} {formatCardNumber(account.card.cardNumber)}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <CardStatusBadge status={account.card.status} />
                            <span className={`text-xs font-medium ${account.card.isVirtual ? 'text-purple-600' : 'text-gray-600'}`}>
                              {account.card.isVirtual ? 'Virtuelle' : 'Physique'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleViewBalance(account)}
                        className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg transition-all duration-200"
                        title="Voir le solde"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/accounts/${account.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Voir solde
                      </Link>
                      {/* Bouton Activer si la carte n'est pas active */}
                      {account.card.status !== 'ACTIVE' && (
                        <button
                          onClick={() => handleActivateCard(account.id)}
                          className="ml-2 p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-all duration-200 text-xs font-semibold"
                          title="Activer la carte"
                        >
                          Activer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 0 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{startIndex + 1}</span> à{' '}
                    <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredAccounts.length)}</span> sur{' '}
                    <span className="font-medium">{filteredAccounts.length}</span> résultats
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                  >
                    <option value={10}>10 par page</option>
                    <option value={25}>25 par page</option>
                    <option value={50}>50 par page</option>
                    <option value={100}>100 par page</option>
                  </select>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
        {filteredAccounts.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Search className="mx-auto w-12 h-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun compte trouvé</h3>
            <p className="mt-1 text-gray-500">
              Essayez de modifier vos critères de recherche ou de filtrage.
            </p>
          </div>
        )}

        {/* Balance Verification Modal */}
        {showBalanceModal && selectedAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl lg:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                    Vérifier le Solde
                  </h2>
                  <button
                    onClick={() => setShowBalanceModal(false)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {!showVerifiedBalance ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Numéro de Compte</label>
                      <input
                        type="text"
                        value={inputAccountNumber}
                        onChange={(e) => setInputAccountNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="FR76 3000 6000 0112 3456 7890 189"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="ndeuna.sinclair@email.com"
                      />
                    </div>
                    {balanceError && (
                      <p className="text-sm text-red-600">{balanceError}</p>
                    )}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setShowBalanceModal(false)}
                        className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all duration-200"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleVerifyBalance}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200"
                      >
                        Vérifier
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Solde du Compte</label>
                      <p className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 text-lg font-bold">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(selectedAccount.balance)}
                      </p>
                    </div>
                    <div className="flex pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setShowBalanceModal(false)}
                        className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all duration-200"
                      >
                        Fermer
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Account Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl lg:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                    Créer un Nouveau Compte
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={newAccountData.firstName}
                      onChange={(e) => setNewAccountData({ ...newAccountData, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Jean"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      value={newAccountData.lastName}
                      onChange={(e) => setNewAccountData({ ...newAccountData, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Dupont"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={newAccountData.email}
                      onChange={(e) => setNewAccountData({ ...newAccountData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="ndeuna.sinclair@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={newAccountData.phone}
                      onChange={(e) => setNewAccountData({ ...newAccountData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Type de Compte</label>
                    <select
                      value={newAccountData.accountType}
                      onChange={(e) => setNewAccountData({ ...newAccountData, accountType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Compte Courant">Compte Courant</option>
                      <option value="Compte Épargne">Compte Épargne</option>
                      <option value="Compte Professionnel">Compte Professionnel</option>
                      <option value="Compte Jeune">Compte Jeune</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Solde Initial (XAF)</label>
                    <input
                      type="number"
                      value={newAccountData.balance}
                      onChange={(e) => setNewAccountData({ ...newAccountData, balance: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Type de Carte</label>
                    <select
                      value={newAccountData.cardType}
                      onChange={(e) => setNewAccountData({ ...newAccountData, cardType: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="VISA">VISA</option>
                      <option value="MASTERCARD">MASTERCARD</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={newAccountData.isVirtual}
                        onChange={(e) => setNewAccountData({ ...newAccountData, isVirtual: e.target.checked })}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-bold text-gray-700">Carte Virtuelle</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddAccount}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200"
                    disabled={!newAccountData.firstName || !newAccountData.lastName || !newAccountData.email}
                  >
                    Créer Compte
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsList;