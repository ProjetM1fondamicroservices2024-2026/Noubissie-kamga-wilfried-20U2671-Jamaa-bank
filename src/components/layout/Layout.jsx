import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar fixe */}
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Conteneur principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden ml-64">
        {/* Header fixe */}
        <Header />
        
        {/* Contenu principal */}
        <main className="flex-1 pt-16 overflow-auto">
          <div className="w-full h-full px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;