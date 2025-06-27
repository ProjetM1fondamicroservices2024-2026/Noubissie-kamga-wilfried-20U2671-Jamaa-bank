// src/components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  CreditCard, 
  ArrowUpDown, 
  Settings, 
  BarChart3,
  FileText,
  Shield,
  LogOut,
  UserPlus
} from 'lucide-react';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Récupération des informations de l'utilisateur connecté depuis authService
  const isAdmin = authService.isAdmin();
  const bankName = authService.getBankName();
  const username = authService.getUsername();

  // Fonction pour vérifier si un onglet est actif
  const isActive = (href) => {
    if (href === '/dashboard' || href === '/' || href === '/super-admin/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/super-admin/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  // Configuration des menus selon le type d'utilisateur
  const getMenuItems = () => {
    if (isAdmin) {
      // Menu pour admin : Super Admin Dashboard, Banks, Utilisateurs, Demandes de Compte
      return [
        {
          title: 'Super Admin Dashboard',
          icon: Home,
          href: '/super-admin/dashboard'
        },
        {
          title: 'Banks',
          icon: CreditCard,
          href: '/bank-service'
        },
        {
          title: 'Utilisateurs',
          icon: Users,
          href: '/users'
        },
        {
          title: 'Demandes de Compte',
          icon: UserPlus,
          href: '/accounts/requests'
        }
      ];
    } else {
      // Menu pour banques : Dashboard, Utilisateurs, Comptes, Transactions
      return [
        {
          title: 'Dashboard',
          icon: Home,
          href: '/dashboard'
        },
        {
          title: 'Comptes',
          icon: CreditCard,
          href: '/accounts'
        },
        {
          title: 'Transactions',
          icon: ArrowUpDown,
          href: '/transactions'
        }
      ];
    }
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
      authService.logout();
      navigate('/login');
  };

  if (!authService.isAuthenticated()) {
    return null;
  }
  return (
    <aside className="fixed left-0 top-0 h-full bg-gray-900 text-white z-40 w-72">
      {/* En-tête de la sidebar avec données de la banque */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex flex-col items-center space-y-2">
          <img src="/logo.jpg" alt="Logo Jamaa Bank" className="w-16 h-16 rounded-full shadow-lg border-2 border-green-300 bg-white mb-2" />
          <h1 className="text-xl font-bold">{bankName}</h1>
          <p className="text-sm text-gray-400">Administration</p>
        </div>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
            Principal
          </div>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={index}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-white hover:text-green-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Pied de page avec déconnexion */}
      <div className="p-4 border-t border-gray-700">
        {/* Info utilisateur si super admin */}
        {isAdmin && (
          <div className="mb-3 px-3 py-2 bg-gray-800 rounded-lg">
            <div className="text-xs text-gray-400">Connecté en tant que</div>
            <div className="text-sm font-medium text-white">{username}</div>
            <div className="text-xs text-green-300">Super Administrateur</div>
          </div>
        )}
        
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;