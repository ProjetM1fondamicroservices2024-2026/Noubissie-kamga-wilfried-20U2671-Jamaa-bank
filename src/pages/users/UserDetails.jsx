import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../../services/api';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  User,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Activity,
  Settings,
  MoreVertical,
  Eye,
  EyeOff,
  FileText,
  Image,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCNIModal, setShowCNIModal] = useState(false);
  const [selectedCNIImage, setSelectedCNIImage] = useState(null);

  // Fonction pour récupérer les détails de l'utilisateur
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const query = {
        query: `
          query {
            getCustomerById(id: ${id}) {
              id,
              firstName,
              lastName,
              isVerified,
              cniNumber,
              cniRecto,
              cniVerso,
              phone,
              email
            }
          }
        `
      };

      const response = await userApi.post('', query);
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      const customer = response.data.data.getCustomerById;
      
      if (!customer) {
        throw new Error('Utilisateur non trouvé');
      }

      // Transformation des données
      const transformedUser = {
        id: parseInt(customer.id),
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        isVerified: customer.isVerified,
        cniNumber: customer.cniNumber,
        cniRecto: customer.cniRecto,
        cniVerso: customer.cniVerso,
        status: customer.isVerified ? 'active' : 'pending'
      };

      setUser(transformedUser);
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', err);
      setError(err.message || 'Erreur lors de la récupération des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/users');
  };

  const handleRetry = () => {
    fetchUser();
  };
  const handleValidateAccount = async () => {
    setActionLoading(true);
    try {
      const mutation = {
        query: `
          mutation {
            updateStatus(id: ${id}, isVerified: true) {
              id,
              isVerified
            }
          }
        `
      };
      
      const response = await userApi.post('', mutation);
      
      // Vérifier les erreurs GraphQL
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      console.log('✅ Compte validé:', response.data.data.updateStatus);
      
      // Recharger les données après validation
      await fetchUser();
      
    } catch (err) {
      console.error('❌ Erreur lors de la validation:', err);
      setError(err.message || 'Erreur lors de la validation du compte');
    } finally {
      setActionLoading(false);
    }
  };

  const openCNIModal = (imageUrl, type) => {
    setSelectedCNIImage({ url: imageUrl, type });
    setShowCNIModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'suspended':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Compte vérifié';
      case 'pending': return 'En attente de vérification';
      case 'suspended': return 'Suspendu';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'suspended': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
              <div className="h-8 bg-gray-300 rounded w-48"></div>
            </div>
            <div className="bg-white rounded-xl p-8">
              <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-64 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-gray-300 rounded"></div>
                  <div className="h-48 bg-gray-300 rounded"></div>
                </div>
                <div className="h-96 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Réessayer
              </button>
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la liste
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Utilisateur non trouvé</h2>
            <p className="text-gray-600 mb-6">L'utilisateur que vous recherchez n'existe pas.</p>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header avec navigation */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 p-2 hover:bg-white rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour à la liste</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600 mt-1">Détails de l'utilisateur • ID: {user.id}</p>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Informations personnelles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(user.status)}`}>
                  {getStatusIcon(user.status)}
                  <span>{getStatusText(user.status)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Prénom</label>
                    <p className="text-gray-900 font-medium mt-1">{user.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nom</label>
                    <p className="text-gray-900 font-medium mt-1">{user.lastName}</p>
                  </div>
                  {user.cniNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Numéro CNI</label>
                      <p className="text-gray-900 font-medium mt-1">{user.cniNumber}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Téléphone</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{user.phone}</p>
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
                    {user.cniRecto && (
                      <span className="inline-flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Fourni
                      </span>
                    )}
                  </div>
                  
                  {user.cniRecto ? (
                    <div className="relative">
                      <img
                        src={user.cniRecto}
                        alt="CNI Recto"
                        className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openCNIModal(user.cniRecto, 'Recto')}
                        onError={(e) => {
                          console.error('Erreur de chargement CNI Recto:', e);
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-10 rounded-lg transition-all cursor-pointer">
                        <Eye className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
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
                    {user.cniVerso && (
                      <span className="inline-flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Fourni
                      </span>
                    )}
                  </div>
                  
                  {user.cniVerso ? (
                    <div className="relative">
                      <img
                        src={user.cniVerso}
                        alt="CNI Verso"
                        className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openCNIModal(user.cniVerso, 'Verso')}
                        onError={(e) => {
                          console.error('Erreur de chargement CNI Verso:', e);
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-10 rounded-lg transition-all cursor-pointer">
                        <Eye className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                      </div>
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
                  <span className="text-green-700 font-bold text-4xl">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {user.firstName} {user.lastName}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">ID Utilisateur</span>
                    <span className="font-medium text-gray-900">#{user.id}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Statut</span>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {getStatusIcon(user.status)}
                      <span>{user.isVerified ? 'Vérifié' : 'Non vérifié'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Documents</span>
                    <span className="font-medium text-gray-900">
                      {[user.cniRecto, user.cniVerso].filter(Boolean).length}/2
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions administrateur */}
            {user.status === 'pending' && (
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
                    onClick={handleValidateAccount}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {actionLoading ? 'Validation...' : 'Valider le compte'}
                  </button>
                  <button
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Rejeter la demande
                  </button>
                </div>
              </div>
            )}

            {/* Résumé des documents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">État des documents</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CNI Recto</span>
                  {user.cniRecto ? (
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Fourni
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-red-600">
                      <XCircle className="w-4 h-4" />
                      Manquant
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CNI Verso</span>
                  {user.cniVerso ? (
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Fourni
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-red-600">
                      <XCircle className="w-4 h-4" />
                      Manquant
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Numéro CNI</span>
                  {user.cniNumber ? (
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Fourni
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-red-600">
                      <XCircle className="w-4 h-4" />
                      Manquant
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour afficher les images CNI */}
      {showCNIModal && selectedCNIImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                CNI - {selectedCNIImage.type}
              </h3>
              <button
                onClick={() => setShowCNIModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedCNIImage.url}
                alt={`CNI ${selectedCNIImage.type}`}
                className="max-w-full max-h-[70vh] object-contain mx-auto"
                onError={(e) => {
                  console.error('Erreur de chargement image modal:', e);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;