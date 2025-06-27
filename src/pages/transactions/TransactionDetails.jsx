import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, CheckCircle, Clock, XCircle, Download, RefreshCw, AlertTriangle, User, CreditCard, FileText, Hash, MapPin } from 'lucide-react';
import { transactionService } from '../../services/transactionService';

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger la transaction au montage du composant
  useEffect(() => {
    const loadTransaction = async () => {
      try {
        const data = await transactionService.getTransaction(id);
        setTransaction(data);
      } catch (error) {
        console.error('Erreur lors du chargement de la transaction:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTransaction();
    }
  }, [id]);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
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
        return <ArrowDownLeft className="w-6 h-6" />;
      case 'RETRAIT':
        return <ArrowUpRight className="w-6 h-6" />;
      case 'TRANSFERT':
      case 'VIREMENT':
        return <ArrowRightLeft className="w-6 h-6" />;
      case 'RECHARGE':
        return <ArrowUpRight className="w-6 h-6" />;
      default:
        return <ArrowRightLeft className="w-6 h-6" />;
    }
  };

  // Fonction pour obtenir le badge du type de transaction
  const getTransactionTypeBadge = (type) => {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full flex items-center gap-2";
    
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
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full flex items-center gap-2";
    
    switch (status) {
      case 'SUCCESS':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <CheckCircle className="w-4 h-4" />
            Terminée
          </span>
        );
      case 'FAILED':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <XCircle className="w-4 h-4" />
            Échouée
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            <Clock className="w-4 h-4" />
            Inconnu
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Chargement de la transaction...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Transaction non trouvée</h1>
              <p className="text-gray-600 mb-4">La transaction demandée n'existe pas ou a été supprimée.</p>
              <button 
                onClick={() => navigate('/transactions')}
                className="text-blue-600 hover:text-blue-800"
              >
                Retour aux transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec navigation */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/transactions')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux transactions
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Détails de la transaction</h1>
              <p className="text-gray-600">Transaction #{transaction.transactionId}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Télécharger
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations principales */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {getTransactionTypeBadge(transaction.transactionType)}
                    {getStatusBadge(transaction.status)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {formatAmount(parseFloat(transaction.amount), 'XAF')}
                  </h2>
                  <p className="text-gray-600">{transaction.transactionType} - {transaction.amount}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Date</div>
                  <div className="font-medium">{formatDate(transaction.createdAt)}</div>
                </div>
              </div>

              {/* Détails du transfert */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Compte source
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">ID</div>
                    <div className="font-medium text-gray-900">{transaction.idAccountSender}</div>
                    <div className="text-sm text-gray-600">Nom</div>
                    <div className="font-medium text-gray-900">
                      Compte émetteur
                    </div>
                    <div className="text-sm text-gray-600">Numéro</div>
                    <div className="font-mono text-sm text-gray-900">
                      {transaction.idAccountSender}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Compte destination
                  </h3>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">ID</div>
                    <div className="font-medium text-gray-900">{transaction.idAccountReceiver}</div>
                    <div className="text-sm text-gray-600">Nom</div>
                    <div className="font-medium text-gray-900">
                      Compte destinataire
                    </div>
                    <div className="text-sm text-gray-600">Numéro</div>
                    <div className="font-mono text-sm text-gray-900">
                      {transaction.idAccountReceiver}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations détaillées</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Référence</div>
                    <div className="font-medium text-gray-900">{transaction.transactionId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Type</div>
                    <div className="font-medium text-gray-900">{transaction.transactionType}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Créée le</div>
                    <div className="font-medium text-gray-900">{formatDate(transaction.createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Date événement</div>
                    <div className="font-medium text-gray-900">{formatDate(transaction.dateEvent)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Journal d'audit */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de transaction</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">Transaction créée</h4>
                      <span className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Transaction {transaction.transactionType} de {transaction.amount} FCFA
                    </p>
                    <p className="text-xs text-gray-500">
                      De: {transaction.idAccountSender} → Vers: {transaction.idAccountReceiver}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">Transaction traitée</h4>
                      <span className="text-sm text-gray-500">{formatDate(transaction.dateEvent)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Statut: {transaction.status === 'SUCCESS' ? 'Succès' : 'Échec'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Traitement terminé
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Informations utilisateur */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Comptes impliqués
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Compte émetteur</div>
                  <div className="font-medium text-gray-900">
                    {transaction.idAccountSender}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Compte destinataire</div>
                  <div className="font-medium text-gray-900">
                    {transaction.idAccountReceiver}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Type de transaction</div>
                  <div className="font-medium text-gray-900">{transaction.transactionType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Statut</div>
                  <div className="font-medium text-gray-900">{transaction.status}</div>
                </div>
              </div>
            </div>

            {/* Informations techniques */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations techniques</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">ID Transaction</div>
                  <div className="font-medium text-gray-900">{transaction.transactionId}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Type</div>
                  <div className="font-medium text-gray-900">{transaction.transactionType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Montant</div>
                  <div className="font-medium text-gray-900">{transaction.amount} FCFA</div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Statut</div>
                    <div className="font-medium text-gray-900">{transaction.status}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags et notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Type de compte émetteur</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      APPLICATION
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">Type de compte destinataire</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      APPLICATION
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">Description</div>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {transaction.transactionType} de {transaction.amount} FCFA
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Télécharger le reçu
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Relancer la transaction
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                  <AlertTriangle className="w-4 h-4" />
                  Signaler un problème
                </button>
              </div>
            </div>

            {/* Métadonnées */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Métadonnées</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Créée le:</span>
                  <span className="font-medium text-gray-900">{formatDate(transaction.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date événement:</span>
                  <span className="font-medium text-gray-900">{formatDate(transaction.dateEvent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut:</span>
                  <span className="font-medium text-gray-900">{transaction.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant:</span>
                  <span className="font-medium text-gray-900">{transaction.amount} FCFA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;