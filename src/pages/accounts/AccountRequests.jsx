// pages/accounts/AccountRequests.jsx - Page de gestion des demandes de compte

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Check, 
  X, 
  Eye, 
  Clock, 
  Mail,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  Search,
  Download,
  Building2,
  CheckCircle,
  User,
  Image,
  Trash2
} from 'lucide-react';
import { userApi, accountApi } from '../../services/api';

const AccountRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [stats, setStats] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

 

  // Charger les utilisateurs non vérifiés au montage
  useEffect(() => {
    const fetchUnverifiedUsers = async () => {
      setLoading(true);
      try {
        const query = {
          query: `
            query {
              getAllCustomers {
                id
                firstName
                lastName
                email
                phone
                isVerified
                cniNumber
                cniRecto
                cniVerso
              }
            }
          `
        };
        const response = await userApi.post('', query);
        if (response.data.errors) throw new Error(response.data.errors[0].message);
        const users = response.data.data.getAllCustomers.filter(u => !u.isVerified);
        setRequests(users);
        setStats({
          total: users.length,
          pending: users.length,
          approved: 0,
          rejected: 0,
        });
      } catch (err) {
        alert(err.message || 'Erreur lors du chargement des utilisateurs');
      } finally {
        setLoading(false);
      }
    };
    fetchUnverifiedUsers();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'En attente' },
      under_review: { color: 'bg-blue-100 text-blue-800', icon: Eye, text: 'En cours d\'examen' },
      approved: { color: 'bg-green-100 text-green-800', icon: Check, text: 'Approuvée' },
      rejected: { color: 'bg-red-100 text-red-800', icon: X, text: 'Rejetée' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon size={12} />
        {config.text}
      </span>
    );
  };



  // Mapping du statut frontend
  const getStatus = (user) => {
    if (user.isVerified === true) return 'verifie';
    if (user.isVerified === false) return 'en attente';
    if (user.isVerified === null) return 'rejete';
    return 'en attente';
  };

  // Nouvelle fonction pour valider uniquement le compte (updateStatus), sans création de compte
  const handleApprove = async (userId) => {
    setActionLoading(true);
    try {
      // 1. Valider l'utilisateur (fonction simple)
      const mutation = {
        query: `
          mutation {
            updateStatus(id: ${userId}, isVerified: true) {
              id,
              isVerified
            }
          }
        `
      };
      const response = await userApi.post('', mutation);
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      // 2. Retirer l'utilisateur de la liste
      setRequests(prev => prev.filter(u => u.id !== userId));
      setStats(prev => ({ ...prev, total: prev.total - 1, pending: prev.pending - 1 }));
      alert('Utilisateur validé !');
    } catch (err) {
      alert(err.message || 'Erreur lors de la validation du compte');
    } finally {
      setActionLoading(false);
    }
  };

  // Fonction pour rejeter (frontend uniquement)
  const handleReject = (userId) => {
    setRequests(prev => prev.map(u => u.id === userId ? { ...u, isVerified: null } : u));
    setStats(prev => ({ ...prev, pending: prev.pending - 1, rejected: prev.rejected + 1 }));
    if (selectedRequest && selectedRequest.id === userId) {
      setSelectedRequest({ ...selectedRequest, isVerified: null });
    }
  };

  const handleDelete = (requestId) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    setStats(getAccountRequestsStats());
    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest(null);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || getStatus(request) === filterStatus;
    const matchesType = filterType === 'all' || request.accountType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Chargement des demandes...</p>
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Demandes de Compte</h1>
              <p className="text-gray-600">Gestion des nouvelles demandes d'ouverture de compte</p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejetées</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected || 0}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Barre d'outils */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="pending">En attente</option>
                <option value="approved">Approuvées</option>
                <option value="rejected">Rejetées</option>
              </select>
           
            </div>
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demandeur
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type de compte
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de soumission
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    {/* Demandeur */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-700 font-bold text-lg">{request.firstName[0]}{request.lastName[0]}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.firstName} {request.lastName}
                          </div>
                          <div className="text-xs text-gray-400">ID: {request.id}</div>
                        </div>
                      </div>
                    </td>
                    {/* Contact */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{request.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-500">{request.phone}</span>
                        </div>
                      </div>
                    </td>
                    {/* Type de compte */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        <Building2 className="w-4 h-4" />
                        Compte Jaama
                      </span>
                    </td>
                    {/* Statut */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${
                        getStatus(request) === 'verifie'
                          ? 'text-green-700 bg-green-50 border-green-200'
                          : getStatus(request) === 'en attente'
                          ? 'text-yellow-700 bg-yellow-50 border-yellow-200'
                          : getStatus(request) === 'rejete'
                          ? 'text-red-700 bg-red-50 border-red-200'
                          : 'text-gray-700 bg-gray-50 border-gray-200'
                      }`}>
                        {getStatus(request) === 'verifie' && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {getStatus(request) === 'en attente' && <Clock className="w-4 h-4 text-yellow-500" />}
                        {getStatus(request) === 'rejete' && <X className="w-4 h-4 text-red-500" />}
                        <span>
                          {getStatus(request) === 'verifie'
                            ? 'Vérifié'
                            : getStatus(request) === 'en attente'
                            ? 'En attente'
                            : getStatus(request) === 'rejete'
                            ? 'Rejeté'
                            : getStatus(request)}
                        </span>
                      </div>
                    </td>
                    {/* Date de soumission */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(request.submittedAt)}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setSelectedRequest(request)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Détails
                        </button>
                        {getStatus(request) === 'en attente' && (
                          <div className="space-y-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              disabled={actionLoading}
                            >
                              <Check className="w-4 h-4" />
                              Approuver le compte
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                              disabled={actionLoading}
                            >
                              <X className="w-4 h-4" />
                              Rejeter la demande
                            </button>
                          </div>
                        )}
                        {getStatus(request) === 'rejete' && (
                          <button
                            onClick={() => handleDelete(request.id)}
                            className="flex items-center gap-1 text-gray-500 hover:text-red-700 text-sm font-medium transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500 text-lg mb-2">Aucune demande trouvée</div>
              <div className="text-gray-400">Essayez de modifier vos critères de recherche</div>
            </div>
          )}
        </div>

        {/* Modal de détails */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Détails de la demande {selectedRequest.id}
                  </h2>
                  <button 
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Colonne principale */}
                  <div className="lg:col-span-2 space-y-8">
                  {/* Informations personnelles */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                          getStatus(selectedRequest) === 'verifie'
                            ? 'text-green-700 bg-green-50 border-green-200'
                            : getStatus(selectedRequest) === 'en attente'
                            ? 'text-yellow-700 bg-yellow-50 border-yellow-200'
                            : getStatus(selectedRequest) === 'rejete'
                            ? 'text-red-700 bg-red-50 border-red-200'
                            : 'text-gray-700 bg-gray-50 border-gray-200'
                        }`}>
                          {getStatus(selectedRequest) === 'verifie' && <CheckCircle className="w-5 h-5 text-green-500" />}
                          {getStatus(selectedRequest) === 'en attente' && <Clock className="w-5 h-5 text-yellow-500" />}
                          {getStatus(selectedRequest) === 'rejete' && <X className="w-5 h-5 text-red-500" />}
                          <span>
                            {getStatus(selectedRequest) === 'verifie'
                              ? 'Vérifié'
                              : getStatus(selectedRequest) === 'en attente'
                              ? 'En attente'
                              : getStatus(selectedRequest) === 'rejete'
                              ? 'Rejeté'
                              : getStatus(selectedRequest)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Prénom</label>
                            <p className="text-gray-900 font-medium mt-1">{selectedRequest.firstName}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Nom</label>
                            <p className="text-gray-900 font-medium mt-1">{selectedRequest.lastName}</p>
                          </div>
                          {selectedRequest.cniNumber && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">Numéro CNI</label>
                              <p className="text-gray-900 font-medium mt-1">{selectedRequest.cniNumber}</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <div className="flex items-center gap-2 mt-1">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <p className="text-gray-900">{selectedRequest.email}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Téléphone</label>
                            <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                              <p className="text-gray-900">{selectedRequest.phone}</p>
                      </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Documents d'identité */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Documents d'identité</h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* CNI Recto */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-900">CNI - Recto</h3>
                            {selectedRequest.cniRecto && (
                              <span className="inline-flex items-center gap-1 text-sm text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                Fourni
                              </span>
                            )}
                          </div>
                          {selectedRequest.cniRecto ? (
                            <div className="relative">
                              <img
                                src={selectedRequest.cniRecto}
                                alt="CNI Recto"
                                className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                          ) : (
                            <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <div className="text-center">
                                <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Non fourni</p>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* CNI Verso */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-gray-900">CNI - Verso</h3>
                            {selectedRequest.cniVerso && (
                              <span className="inline-flex items-center gap-1 text-sm text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                Fourni
                              </span>
                            )}
                          </div>
                          {selectedRequest.cniVerso ? (
                            <div className="relative">
                              <img
                                src={selectedRequest.cniVerso}
                                alt="CNI Verso"
                                className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                          ) : (
                            <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <div className="text-center">
                                <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Non fourni</p>
                            </div>
                          </div>
                      )}
                        </div>
                    </div>
                  </div>
                </div>

                  {/* Colonne latérale */}
                  <div className="space-y-6">
                    {/* Avatar et informations rapides */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-green-700 font-bold text-4xl">{selectedRequest.firstName[0]}{selectedRequest.lastName[0]}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {selectedRequest.firstName} {selectedRequest.lastName}
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">ID Utilisateur</span>
                            <span className="font-medium text-gray-900">#{selectedRequest.id}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Statut</span>
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              getStatus(selectedRequest) === 'verifie'
                                ? 'text-green-700 bg-green-50 border-green-200'
                                : getStatus(selectedRequest) === 'en attente'
                                ? 'text-yellow-700 bg-yellow-50 border-yellow-200'
                                : getStatus(selectedRequest) === 'rejete'
                                ? 'text-red-700 bg-red-50 border-red-200'
                                : 'text-gray-700 bg-gray-50 border-gray-200'
                            }`}>
                              {getStatus(selectedRequest) === 'verifie' && <CheckCircle className="w-4 h-4 text-green-500" />}
                              {getStatus(selectedRequest) === 'en attente' && <Clock className="w-4 h-4 text-yellow-500" />}
                              {getStatus(selectedRequest) === 'rejete' && <X className="w-4 h-4 text-red-500" />}
                              <span>{getStatus(selectedRequest) === 'verifie' ? 'Vérifié' : getStatus(selectedRequest) === 'en attente' ? 'Non vérifié' : 'Refusé'}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Documents</span>
                            <span className="font-medium text-gray-900">
                              {[selectedRequest.cniRecto, selectedRequest.cniVerso].filter(Boolean).length}/2
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions administrateur */}
                {getStatus(selectedRequest) === 'en attente' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Clock className="w-6 h-6 text-yellow-600" />
                          <h3 className="text-lg font-semibold text-yellow-900">Action requise</h3>
                        </div>
                        <p className="text-sm text-yellow-800 mb-4">
                          Ce compte est en attente de validation. Vérifiez les documents d'identité et les informations personnelles avant de valider.
                        </p>
                        <div className="space-y-2">
                    <button 
                            onClick={() => handleApprove(selectedRequest.id)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                            <Check className="w-4 h-4" />
                            Approuver le compte
                    </button>
                    <button 
                            onClick={() => handleReject(selectedRequest.id)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                            <X className="w-4 h-4" />
                            Rejeter la demande
                    </button>
                        </div>
                      </div>
                    )}

                    {getStatus(selectedRequest) === 'rejete' && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-4">
                        <div className="flex items-center gap-3 mb-4">
                          <X className="w-6 h-6 text-red-600" />
                          <h3 className="text-lg font-semibold text-red-900">Demande refusée</h3>
                        </div>
                        <p className="text-sm text-red-800 mb-4">
                          Cette demande a été refusée. Vous pouvez la supprimer définitivement.
                        </p>
                        <button
                          onClick={() => handleDelete(selectedRequest.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer la demande
                        </button>
                      </div>
                    )}

                    {/* Résumé des documents */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">État des documents</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">CNI Recto</span>
                          {selectedRequest.cniRecto ? (
                            <span className="inline-flex items-center gap-1 text-sm text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              Fourni
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sm text-red-600">
                              <X className="w-4 h-4" />
                              Manquant
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">CNI Verso</span>
                          {selectedRequest.cniVerso ? (
                            <span className="inline-flex items-center gap-1 text-sm text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              Fourni
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sm text-red-600">
                              <X className="w-4 h-4" />
                              Manquant
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Numéro CNI</span>
                          {selectedRequest.cniNumber ? (
                            <span className="inline-flex items-center gap-1 text-sm text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              Fourni
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-sm text-red-600">
                              <X className="w-4 h-4" />
                              Manquant
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dans la modale, ajoute le bouton Valider si statut 'rejete' */}
                    {getStatus(selectedRequest) === 'rejete' && (
                      <div className="space-y-2 mt-6">
                        <button
                          onClick={() => handleApprove(selectedRequest.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          disabled={actionLoading}
                        >
                          <Check className="w-4 h-4" />
                          Valider le compte
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountRequests;