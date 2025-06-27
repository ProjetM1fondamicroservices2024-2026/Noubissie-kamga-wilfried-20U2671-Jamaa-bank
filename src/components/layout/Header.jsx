import React from 'react';
import { Bell, User, Settings } from 'lucide-react';
import { mockBankData } from '../../utils/mockData';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const bankName = mockBankData.name;
  const firstLetter = bankName.charAt(0).toUpperCase();
  const adminData = mockBankData.admin;

  return (
    <header className="bg-white shadow-sm border-b border-green-200 fixed top-0 right-0 left-64 z-30 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Espace flexible */}
        <div className="flex-1"></div>
        
        <div className="flex items-center space-x-6">

          {/* Séparateur visuel */}
          <div className="h-6 w-px bg-gray-300"></div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">

            {/* Profil utilisateur */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{adminData.name}</p>
                <p className="text-xs text-gray-500">{adminData.role}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-medium text-sm">{adminData.avatar}</span>
              </div>
            </div>
            {/* Bouton de déconnexion */}
            <button
              onClick={() => {
                authService.logout();
                navigate('/login');
              }}
              className="ml-6 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;