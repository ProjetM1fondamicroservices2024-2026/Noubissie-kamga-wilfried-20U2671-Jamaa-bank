import React, { useState } from 'react';
import { Building2, Plus, Edit, Eye, EyeOff, MoreVertical, Search, Filter, Download, Upload, Power, PowerOff, Calendar, Euro, TrendingUp, Shield, Clock, Save, X, Check, AlertCircle, Ban as Bank, CreditCard, ArrowUpDown, Settings } from 'lucide-react';
import { useEffect } from 'react';
import { banksApi } from '../../services/api'; 

const fetchBanks = async () => {
  const query = `
    query {
      banks {
        id
        name
        slogan
        logoUrl
        createdAt
        updatedAt
        minimumBalance
        withdrawFees
        internalTransferFees
        externalTransferFees
        isActive
      }
    }
  `;

  const response = await banksApi.post('', {
    query,
  });

  return response.data.data.banks;
};



const BankService = () => {
  const [banks, setBanks] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    slogan: '',
    logoUrl: '',
    minimumBalance: 0,
    withdrawFees: 0,
    internalTransferFees: 0,
    externalTransferFees: 0,
    isActive: true
  });

  

useEffect(() => {
  const loadBanks = async () => {
    try {
      const data = await fetchBanks();
      setBanks(data);
    } catch (error) {
      console.error("Erreur lors du chargement des banques :", error);
    }
  };

  loadBanks();
}, []);


  const handleAddBank = () => {
    setEditingBank(null);
    setFormData({
      name: '',
      slogan: '',
      logoUrl: '',
      minimumBalance: 0,
      withdrawFees: 0,
      internalTransferFees: 0,
      externalTransferFees: 0,
      isActive: true
    });
    setShowModal(true);
  };

  const handleEditBank = (bank) => {
    setEditingBank(bank);
    setFormData(bank);
    setShowModal(true);
  };

  const handleViewDetails = (bank) => {
    setSelectedBank(bank);
    setShowDetailsModal(true);
  };



const handleSaveBank = async () => {
  const bankInput = {
    name: formData.name,
    slogan: formData.slogan || null,
    minimumBalance: parseFloat(formData.minimumBalance),
    withdrawFees: parseFloat(formData.withdrawFees),
    internalTransferFees: parseFloat(formData.internalTransferFees),
    externalTransferFees: parseFloat(formData.externalTransferFees),
    isActive: formData.isActive,
  };

  const mutation = editingBank
    ? `
      mutation UpdateBank($id: ID!, $bank: BankInput!) {
        updateBank(id: $id, bank: $bank) {
          id
          name
          slogan
          minimumBalance
          withdrawFees
          internalTransferFees
          externalTransferFees
          isActive
          updatedAt
        }
      }
    `
    : `
      mutation CreateBank($bank: BankInput!) {
        createBank(bank: $bank) {
          id
          name
          slogan
          minimumBalance
          withdrawFees
          internalTransferFees
          externalTransferFees
          isActive
          createdAt
        }
      }
    `;

  const variables = editingBank
    ? { id: editingBank.id, bank: bankInput }
    : { bank: bankInput };

  try {
    // Utilisation de banksApi (axios) configuré dans ton fichier api.js
    const response = await banksApi.post('', {
      query: mutation,
      variables,
    });

    const result = response.data;

    if (result.errors) {
      console.error('Erreur GraphQL:', result.errors);
      alert('Erreur lors de la sauvegarde de la banque : ' + result.errors[0].message);
      return;
    }

    // Récupère la banque créée ou mise à jour
    const savedBank = editingBank ? result.data.updateBank : result.data.createBank;

    if (editingBank) {
      setBanks(banks.map(bank => (bank.id === editingBank.id ? savedBank : bank)));
    } else {
      setBanks([...banks, savedBank]);
    }

    setShowModal(false);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la banque :', error);
    alert('Erreur lors de la sauvegarde de la banque : ' + error.message);
  }
};


 

  const filteredBanks = banks.filter(bank => {
    const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bank.slogan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && bank.isActive) ||
                         (filterActive === 'inactive' && !bank.isActive);
    return matchesSearch && matchesFilter;
  });

  const activeBanks = banks.filter(bank => bank.isActive).length;
  const totalRevenue = banks.reduce((sum, bank) => sum + bank.withdrawFees + bank.externalTransferFees, 0);
  const avgMinBalance = banks.reduce((sum, bank) => sum + bank.minimumBalance, 0) / banks.length;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* Header Section */}
        <div className="w-full">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Building2 className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-900 truncate">
                  Services Bancaires
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 truncate">Gestion des établissements bancaires</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:flex-shrink-0">
              <button 
                onClick={handleAddBank}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-3 sm:px-4 lg:px-6 py-2 lg:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-lg text-xs sm:text-sm lg:text-base flex items-center justify-center gap-2"
              >
                <Plus size={14} className="sm:hidden" />
                <Plus size={16} className="hidden sm:inline lg:hidden" />
                <Plus size={18} className="hidden lg:inline" />
                <span>Ajouter Banque</span>
              </button>
              
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-blue-500 opacity-5 rounded-full -translate-y-6 translate-x-6"></div>
            <div className="relative">
              <div className="flex items-start justify-between mb-3 sm:mb-4 lg:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 truncate">Total Banques</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{banks.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-green-500 opacity-5 rounded-full -translate-y-6 translate-x-6"></div>
            <div className="relative">
              <div className="flex items-start justify-between mb-3 sm:mb-4 lg:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 truncate">Banques Actives</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{activeBanks}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-purple-500 opacity-5 rounded-full -translate-y-6 translate-x-6"></div>
            <div className="relative">
              <div className="flex items-start justify-between mb-3 sm:mb-4 lg:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  XAF
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 truncate">Solde Min. Moyen</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">XAF{avgMinBalance.toFixed(0)}</p>
                </div>
              </div>
            </div>
          </div>

          
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une banque..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setFilterActive('all')}
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 text-xs sm:text-sm ${
                    filterActive === 'all' 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilterActive('active')}
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 text-xs sm:text-sm ${
                    filterActive === 'active' 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Actives
                </button>
                <button
                  onClick={() => setFilterActive('inactive')}
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 text-xs sm:text-sm ${
                    filterActive === 'inactive' 
                      ? 'bg-red-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Inactives
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Banks List */}
        <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Liste des Banques</h2>
                <p className="text-sm sm:text-base text-gray-600">{filteredBanks.length} banques trouvées</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="space-y-2 sm:space-y-3">
              {filteredBanks.map((bank) => (
                <div key={bank.id} className="flex items-center justify-between p-4 sm:p-6 hover:bg-gray-50 rounded-lg lg:rounded-xl transition-all duration-200 group cursor-pointer border border-gray-100">
                  <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 min-w-0 flex-1">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <span className="text-white font-bold text-sm sm:text-base lg:text-lg">{bank.name.charAt(0)}</span>
                      </div>
                      <div className={`absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 ${bank.isActive ? 'bg-emerald-500' : 'bg-red-500'} rounded-full shadow-lg`}></div>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg truncate">{bank.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold ${
                          bank.isActive 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {bank.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm truncate">{bank.slogan}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <span>Min: XAF{bank.minimumBalance}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ArrowUpDown size={10} className="sm:hidden" />
                          <ArrowUpDown size={12} className="hidden sm:inline" />
                          <span>Retrait: XAF{bank.withdrawFees}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={10} className="sm:hidden" />
                          <Calendar size={12} className="hidden sm:inline" />
                          <span>Créée: {new Date(bank.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    
                    
                    <button
                      onClick={() => handleEditBank(bank)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all duration-200"
                      title="Modifier"
                    >
                      <Edit size={16} className="sm:hidden" />
                      <Edit size={18} className="hidden sm:inline" />
                    </button>
                    
                    <button
                      onClick={() => handleViewDetails(bank)}
                      className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg transition-all duration-200"
                      title="Voir les détails"
                    >
                      <Eye size={16} className="sm:hidden" />
                      <Eye size={18} className="hidden sm:inline" />
                    </button>
                    
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl lg:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
            {editingBank ? 'Modifier la Banque' : 'Ajouter une Banque'}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Nom de la Banque</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ex: Banque Centrale du Maroc"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Slogan</label>
            <input
              type="text"
              value={formData.slogan || ''}
              onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ex: Votre partenaire financier de confiance"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Solde Minimum (FCFA)</label>
            <input
              type="number"
              value={formData.minimumBalance || 0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setFormData({ ...formData, minimumBalance: isNaN(val) ? 0 : val });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="1000"
              step="1"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Frais de Retrait (FCFA)</label>
            <input
              type="number"
              value={formData.withdrawFees || 0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setFormData({ ...formData, withdrawFees: isNaN(val) ? 0 : Number(val.toFixed(2)) });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="2.50"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Frais Transfert Interne (FCFA)</label>
            <input
              type="number"
              value={formData.internalTransferFees || 0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setFormData({ ...formData, internalTransferFees: isNaN(val) ? 0 : Number(val.toFixed(2)) });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Frais Transfert Externe (FCFA)</label>
            <input
              type="number"
              value={formData.externalTransferFees || 0}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setFormData({ ...formData, externalTransferFees: isNaN(val) ? 0 : Number(val.toFixed(2)) });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="5.00"
              step="0.01"
              min="0"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-bold text-gray-700">Banque Active</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowModal(false)}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all duration-200"
          >
            Annuler
          </button>
          <button
            onClick={handleSaveBank}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {editingBank ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  </div>
)}


        {/* Details Modal */}
        {showDetailsModal && selectedBank && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl lg:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                    Détails de la Banque
                  </h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nom de la Banque</label>
                    <p className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900">{selectedBank.name}</p>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Slogan</label>
                    <p className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900">{selectedBank.slogan}</p>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">URL du Logo</label>
                    <p className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 truncate">{selectedBank.logoUrl || 'Aucun'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Solde Minimum (FCFA)</label>
                    <p className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900">{selectedBank.minimumBalance}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Frais de Retrait (FCFA)</label>
                    <p className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900">{selectedBank.withdrawFees.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Frais Transfert Interne (FCFA)</label>
                    <p className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900">{selectedBank.internalTransferFees.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Frais Transfert Externe (FCFA)</label>
                    <p className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900">{selectedBank.externalTransferFees.toFixed(2)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date de Création</label>
                    <p className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900">{new Date(selectedBank.createdAt).toLocaleString('fr-FR')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Dernière Mise à Jour</label>
                    <p className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900">{new Date(selectedBank.updatedAt).toLocaleString('fr-FR')}</p>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Statut</label>
                    <p className={`w-full px-4 py-3 rounded-xl text-gray-900 ${selectedBank.isActive ? 'bg-emerald-100' : 'bg-red-100'}`}>
                      {selectedBank.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all duration-200"
                  >
                    Fermer
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

export default BankService;