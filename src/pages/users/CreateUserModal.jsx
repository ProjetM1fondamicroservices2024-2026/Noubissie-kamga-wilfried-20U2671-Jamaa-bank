import React, { useState } from 'react';
import {
  X,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

const CreateUserModal = ({ isOpen, onClose, onUserCreated }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    status: 'pending', // Par défaut en attente de validation
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    accountType: 'courant',
    initialBalance: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est obligatoire';
      if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est obligatoire';
      if (!formData.email.trim()) newErrors.email = 'L\'email est obligatoire';
      if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est obligatoire';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = 'Format d\'email invalide';
      }

      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (formData.phone && !phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Format de téléphone invalide';
      }
    }

    if (step === 2) {
      if (!formData.password) newErrors.password = 'Le mot de passe est obligatoire';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirmez le mot de passe';

      if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }

      if (formData.initialBalance && isNaN(Number(formData.initialBalance))) {
        newErrors.initialBalance = 'Le solde doit être un nombre';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);otal
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(2)) return;

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Générer un nouvel utilisateur
      const newUser = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: null,
        accountNumber: formData.role === 'client' ? `FR76${Math.random().toString().slice(2, 20)}` : null,
        balance: formData.role === 'client' ? Number(formData.initialBalance) || 0 : null
      };

      // Appeler la fonction de callback
      onUserCreated(newUser);
      
      // Fermer le modal et réinitialiser
      onClose();
      resetForm();
      
    } catch (error) {
      console.error('Erreur:', error);
      setErrors({ submit: 'Erreur lors de la création de l\'utilisateur' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'client',
      status: 'pending',
      address: '',
      city: '',
      postalCode: '',
      country: 'France',
      accountType: 'courant',
      initialBalance: ''
    });
    setCurrentStep(1);
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Nouvel utilisateur</h2>
              <p className="text-sm text-gray-600 mt-1">
                Étape {currentStep} sur 2 - {currentStep === 1 ? 'Informations personnelles' : 'Sécurité & Compte'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-1">
            <div 
              className="bg-blue-600 h-1 transition-all duration-300"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            ></div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Étape 1: Informations personnelles */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  
                  {/* Informations de base */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.firstName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Jean"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.lastName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Dupont"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="ndeuna.sinclair@email.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="+33 1 23 45 67 89"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Adresse */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Adresse (optionnel)</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="123 Rue de la Paix"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Paris"
                        />
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="75001"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 2: Sécurité et compte */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  
                  {/* Sécurité */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <Lock className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mot de passe *
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.password ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Mot de passe sécurisé"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmer le mot de passe *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Confirmez le mot de passe"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Configuration du compte */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-yellow-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rôle
                        </label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="client">Client</option>
                          <option value="admin">Administrateur</option>
                          <option value="manager">Manager</option>
                        </select>
                      </div>

                      {formData.role === 'client' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type de compte
                          </label>
                          <select
                            name="accountType"
                            value={formData.accountType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            <option value="courant">Compte Courant</option>
                            <option value="epargne">Compte Épargne</option>
                            <option value="professionnel">Compte Professionnel</option>
                          </select>
                        </div>
                      )}

                      {formData.role === 'client' && (
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Solde initial (XAF)
                          </label>
                          <input
                            type="number"
                            name="initialBalance"
                            value={formData.initialBalance}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.initialBalance ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                          {errors.initialBalance && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.initialBalance}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Note importante */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-1">Information importante</h4>
                        <p className="text-sm text-blue-700">
                          Ce compte sera créé avec le statut "En attente" et nécessitera une validation manuelle 
                          par un administrateur avant activation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{errors.submit}</span>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              {currentStep === 1 ? 'Remplissez les informations de base' : 'Configurez l\'accès et le compte'}
            </div>
            
            <div className="flex items-center gap-3">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Précédent
                </button>
              )}
              
              {currentStep === 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 inline mr-2" />
                      Créer l'utilisateur
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;