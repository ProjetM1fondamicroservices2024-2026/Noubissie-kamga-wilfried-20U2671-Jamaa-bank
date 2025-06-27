import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CreateUserModal from './CreateUserModal';
import { userApi, banksApi } from '../../services/api';
import {
  Plus,
  Search,
  Eye,
  User,
  Users,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const UsersList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filteris_verified, setFilteris_verified] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // États pour la gestion des données API
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [banks, setBanks] = useState([]);

  // Fonction pour récupérer les utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const query = {
        query: `
          query {
            getAllCustomers {
              id,
              email,
              lastName,
              firstName,
              phone,
              isVerified
            }
          }
        `
      };

      const response = await userApi.post('', query);
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      // Transformation des données pour correspondre au format attendu
      const customers = response.data.data.getAllCustomers.map(customer => ({
        id: parseInt(customer.id),
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        is_verified: customer.isVerified ? 'active' : 'pending'
      }));

      setUsers(customers);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      setError(err.message || 'Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const query = {
        query: `
          query GetAllBanks {
            banks {
              id
            }
          }
        `
      };
  
      const response = await banksApi.post('', query);
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
  
      // Transformation des données
      const banks = response.data.data.banks.map(bank => ({
        id: parseInt(bank.id),
      }));
  
      setBanks(banks);
    } catch (err) {
      console.error('Erreur lors de la récupération des banques:', err);
      setError(err.message || 'Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  };
  

  // Effet pour charger les données au montage du composant
  useEffect(() => {
    fetchUsers();
    fetchBanks();
  }, []);

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesis_verified = filteris_verified === 'all' || user.is_verified === filteris_verified;
    
    return matchesSearch && matchesRole && matchesis_verified;
  });

  // Statistiques
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.is_verified === 'active').length;
  const pendingUsers = users.filter(u => u.is_verified === 'pending').length;
  const clientUsers = banks.length;

  const handleUserCreated = (newUser) => {
    // Recharger les données après création d'un utilisateur
    fetchUsers();
    setSuccessMessage('Utilisateur créé avec succès ! Le compte est en attente de validation.');
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const getis_verifiedIcon = (is_verified) => {
    switch (is_verified) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getis_verifiedText = (is_verified) => {
    switch (is_verified) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      default: return is_verified;
    }
  };

  const getis_verifiedColor = (is_verified) => {
    switch (is_verified) {
      case 'active': return 'text-green-700 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  // Fonction pour relancer le chargement
  const handleRetry = () => {
    fetchUsers();
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pl-32 pr-20">
      <div className="w-full h-full py-8">
        
        {/* En-tête */}
        <div className="w-full">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-900">
                Gestion des Utilisateurs
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                Liste complète des utilisateurs du système
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Nouvel Utilisateur</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Messages d'état */}
        <div className="space-y-4">
          {/* Message de succès */}
          {showSuccessMessage && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3 text-green-800">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{successMessage}</span>
              </div>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-red-800">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">Erreur: {error}</span>
                </div>
                <button
                  onClick={handleRetry}
                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-sm font-medium transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filtres et tableau */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6">
            {/* Barre de recherche et filtres */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <select
                  className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filteris_verified}
                  onChange={(e) => setFilteris_verified(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="pending">En attente</option>
                </select>
              </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Utilisateurs totaux</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : totalUsers.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Utilisateurs actifs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : activeUsers.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">En attente</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : pendingUsers.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Banques clientes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : clientUsers.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barre d'actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={filteris_verified}
                  onChange={(e) => setFilteris_verified(e.target.value)}
                  className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  disabled={loading}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="pending">En attente</option>
                </select>
                
                <button
                  onClick={handleRetry}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Actualiser les données"
                >
                  <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Actualiser</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Chargement des utilisateurs...</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Utilisateur</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Statut</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      
                      {/* Utilisateur */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-700 font-bold text-lg">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500">{user.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Statut */}
                      <td className="py-4 px-6">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getis_verifiedColor(user.is_verified)}`}>
                          {getis_verifiedIcon(user.is_verified)}
                          <span>{getis_verifiedText(user.is_verified)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/users/${user.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Message si aucun résultat */}
          {!loading && filteredUsers.length === 0 && !error && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterRole !== 'all' || filteris_verified !== 'all'
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Commencez par créer votre premier utilisateur.'
                }
              </p>
              {(!searchTerm && filterRole === 'all' && filteris_verified === 'all') && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Créer le premier utilisateur
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredUsers.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Affichage de {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} sur {totalUsers}
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de création */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
};

export default UsersList;