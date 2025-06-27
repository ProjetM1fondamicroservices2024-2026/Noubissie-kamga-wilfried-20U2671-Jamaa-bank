// src/pages/Dashboard2.js
import React from 'react';
import { useEffect, useState } from 'react';
import { 
  Banknote, 
  Users, 
  UserPlus, 
  Download, 
  MoreVertical, 
  Activity, 
  Shield, 
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { mockPlatformStats, mockBanks, mockPendingRequests } from '../../utils/mockData';


import { userApi, banksApi } from '../../services/api';

export const fetchPlatformStats = async () => {
  try {
    const banksQuery = {
      query: `
        query {
          banks {
            id
            name
            createdAt
            isActive
          }
        }
      `
    };

    const customersQuery = {
      query: `
        query {
          getAllCustomers {
            id
            firstName
            lastName
            isVerified
          }
        }
      `
    };

    const [banksRes, customersRes] = await Promise.all([
      banksApi.post('', banksQuery),
      userApi.post('', customersQuery)
    ]);

    const banks = banksRes.data.data.banks;
    const customers = customersRes.data.data.getAllCustomers;

    // Compter les demandes en attente
    const pendingCustomers = customers.filter(c => !c.isVerified);

    return {
      banks,
      customers,
      pendingCount: pendingCustomers.length
    };
  } catch (error) {
    console.error("Erreur chargement statistiques plateforme :", error);
    return {
      banks: [],
      customers: [],
      pendingCount: 0
    };
  }
};


const Dashboard2 = () => {
  const platformName = "Jamaa Platform";


  
  const [banks, setBanks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  const [showBankModal, setShowBankModal] = useState(false);


  useEffect(() => {
    const loadStats = async () => {
      const { banks, customers, pendingCount } = await fetchPlatformStats();
      setBanks(banks);
      setCustomers(customers);
      setPendingCount(pendingCount);
    };

    loadStats();
  }, []);

 const mockPlatformStats = [
  {
    title: 'Banques',
    value: banks.length,
    icon: 'Banknote',
    color: 'bg-blue-600',
    change: '+2.5%',
    changeType: 'positive'
  },
  {
    title: 'Utilisateurs',
    value: customers.length,
    icon: 'Users',
    color: 'bg-green-600',
    change: '+1.2%',
    changeType: 'positive'
  },
  {
    title: 'Demandes en attente',
    value: pendingCount,
    icon: 'UserPlus',
    color: 'bg-yellow-600',
    change: '+0.8%',
    changeType: 'positive'
  }
];

  
  const iconComponents = {
    Banknote,
    Users,
    UserPlus
  };

  

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* Header Section */}
        <div className="w-full">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-xs sm:text-sm lg:text-lg">{platformName.charAt(0)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-900 truncate">
                  {platformName}
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 truncate">Tableau de bord super administrateur</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:flex-shrink-0">
              <div className="bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Plateforme opérationnelle</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {mockPlatformStats.map((stat, index) => {
            const Icon = iconComponents[stat.icon];
            const isPositive = stat.changeType === 'positive';
            
            return (
              <div key={index} className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 ${stat.color} opacity-5 rounded-full -translate-y-6 translate-x-6`}></div>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-3 sm:mb-4 lg:mb-6">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${stat.color} rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 truncate">{stat.title}</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {isPositive ? (
                        <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                          <ArrowUpRight className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span className="text-xs font-bold text-emerald-600">{stat.change}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                          <span className="text-xs font-bold text-yellow-600">{stat.change}</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-500 font-medium hidden sm:inline">vs mois dernier</span>
                      <span className="text-xs text-gray-500 font-medium sm:hidden">vs mois</span>
                    </div>
                    
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: isPositive ? '75%' : '45%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
          
          
          


          {/* Activités Récentes */}
          <div className="xl:col-span-8">
            <div className="w-full bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8 border-b border-gray-200">
                <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Activités Récentes</h2>
                    <p className="text-sm sm:text-base text-gray-600">Mises à jour de la plateforme • {mockBanks.length + mockPendingRequests.length} activités</p>
                  </div>
                  
                </div>
              </div>
              
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="space-y-1 sm:space-y-2">
                  {[
                    ...banks.slice(0, 3).map(bank => ({
                      id: bank.id,
                      title: bank.name,
                      type: 'Nouvelle banque ajoutée',
                      time: new Date(bank.createdAt).toLocaleTimeString('fr-FR'),
                      status: bank.status,
                      initials: bank.name.charAt(0)
                    })),
                    {...customers.slice(0, 2).map(c => ({
                    id: c.id,
                    title: `${c.firstName} ${c.lastName}`,
                    type: 'Nouveau client inscrit',
                    time: new Date().toLocaleTimeString('fr-FR'),
                    status: 'En attente',
                    initials: c.firstName.charAt(0)
                    }))}

                  ].map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 sm:p-4 lg:p-6 hover:bg-gray-50 rounded-lg lg:rounded-xl transition-all duration-200 group cursor-pointer">
                      <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 min-w-0 flex-1">
                        <div className="relative flex-shrink-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                            <span className="text-white font-bold text-xs sm:text-sm lg:text-base">{activity.initials}</span>
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <Activity size={8} className="text-white sm:hidden" />
                            <Activity size={10} className="hidden sm:inline text-white" />
                          </div>
                        </div>
                        
                        <div className="space-y-1 min-w-0 flex-1">
                          <p className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg truncate">{activity.title}</p>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-gray-600 font-semibold text-xs sm:text-sm truncate">{activity.type}</span>
                            <div className="w-1 h-1 bg-gray-300 rounded-full flex-shrink-0"></div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Clock size={10} className="text-gray-400 sm:hidden" />
                              <Clock size={12} className="hidden sm:inline text-gray-400" />
                              <span className="text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">{activity.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
                        <div className="text-right">
                          <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold ${
                            activity.status === 'active' || activity.status === 'En attente'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activity.status}
                          </div>
                        </div>
                        
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
                          <MoreVertical size={14} className="text-gray-400 sm:hidden" />
                          <MoreVertical size={16} className="hidden sm:inline text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="w-full bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">Système Sécurisé</p>
                <p className="text-xs sm:text-sm text-gray-600">Protection SSL 256 bits • Surveillance 24/7</p>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard2;