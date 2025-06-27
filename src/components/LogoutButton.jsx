import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer les données d'authentification
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    
    // Rediriger vers la page de connexion
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span>Déconnexion</span>
    </button>
  );
};

export default LogoutButton; 