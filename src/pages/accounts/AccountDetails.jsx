import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CreditCard, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { mockAccountService } from '../../utils/mockData';

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

const AccountDetails = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      setLoading(true);
      try {
        const data = await mockAccountService.getAccountById(id);
        console.log('Détails du compte:', data);
        setAccount(data);
      } catch (error) {
        console.error('Erreur lors du chargement du compte:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [id]);

  const formatBalance = (balance) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(balance || 0);
  };

  const formatAccountNumber = (accountNumber) => {
    return accountNumber ? accountNumber.replace(/(.{4})/g, '$1 ').trim() : '';
  };

  const formatCardNumber = (cardNumber) => {
    return cardNumber ? `•••• •••• •••• ${cardNumber.slice(-4)}` : '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Compte non trouvé</h2>
            <p className="mt-2 text-gray-600">Le compte demandé n'existe pas.</p>
            <Link to="/accounts" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la liste des comptes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/accounts" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste des comptes
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Détails du compte</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations du compte</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Numéro de compte</label>
                  <p className="text-sm text-gray-900 font-mono">{formatAccountNumber(account.accountNumber)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type de compte</label>
                  <p className="text-sm text-gray-900">{account.accountType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <p className="text-sm text-gray-900"><StatusBadge status={account.status} /></p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Solde</label>
                  <p className="text-sm text-gray-900 font-bold">{formatBalance(account.balance)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Créé le</label>
                  <p className="text-sm text-gray-900">{new Date(account.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations du client</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom</label>
                  <p className="text-sm text-gray-900">{account.owner.firstName} {account.owner.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{account.owner.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Téléphone</label>
                  <p className="text-sm text-gray-900">{account.owner.phone}</p>
                </div>
              </div>
            </div>
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Carte bancaire</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{account.card.cardType} {formatCardNumber(account.card.cardNumber)}</p>
                    <p className="text-sm text-gray-500">Titulaire : {account.card.holderName}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <p className="text-sm text-gray-900"><CardStatusBadge status={account.card.status} /></p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date d'expiration</label>
                  <p className="text-sm text-gray-900">{account.card.expiryDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-sm text-gray-900">{account.card.isVirtual ? 'Virtuelle' : 'Physique'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Dernière utilisation</label>
                  <p className="text-sm text-gray-900">{account.card.lastUsedAt ? new Date(account.card.lastUsedAt).toLocaleDateString('fr-FR') : 'Jamais'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;