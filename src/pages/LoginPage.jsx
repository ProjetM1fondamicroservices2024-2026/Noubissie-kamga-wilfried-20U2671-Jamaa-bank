import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { User, Lock } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await authService.login(username, password);
      if (result.success) {
        // Optionnel : afficher un message de succès avec le nom de la banque
        console.log(`Connexion réussie pour la banque: ${result.bankName}`);
        if (result.bankName === 'Jamaa Bank') {
          navigate('/super-admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-200 via-green-300 to-green-400 relative">
      <div className="absolute inset-0 opacity-10 bg-[url('/login-bg.svg')] bg-no-repeat bg-center bg-cover pointer-events-none" />
      <div className="z-10 w-full max-w-xl mx-auto">
        <div className="bg-white/90 shadow-2xl rounded-3xl px-16 py-14 flex flex-col items-center animate-fade-in">
          <img src="/logo.jpg" alt="Logo Jamaa Bank" className="w-40 h-40 mb-8 rounded-full shadow-2xl border-4 border-green-200 bg-white" />
          <h1 className="text-4xl font-extrabold text-green-900 mb-2 tracking-tight">Bienvenue !</h1>
          <p className="text-gray-600 text-lg mb-4">Connectez-vous à votre espace Jamaa Bank</p>

          <form onSubmit={handleSubmit} className="w-full space-y-7">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400">
                <User size={20} />
              </span>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white transition-all"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400">
                <Lock size={20} />
              </span>
              <input
                type="password"
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white transition-all"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center font-semibold bg-red-50 border border-red-200 rounded-lg py-2">{error}</div>}
            <button
              type="submit"
              className="w-full py-4 text-xl bg-gradient-to-r from-green-600 to-green-400 text-white font-bold rounded-xl shadow-lg hover:from-green-700 hover:to-green-500 transition-all tracking-wide disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
            <div className="flex justify-end">
              <button type="button" className="text-green-700 text-sm hover:underline focus:outline-none" tabIndex={-1} disabled>
                Mot de passe oublié ?
              </button>
            </div>
          </form>
        </div>
        <div className="text-center text-green-900 text-sm mt-10 drop-shadow-sm opacity-80">
          Jamaa Bank {new Date().getFullYear()}<br />
          <span className="text-green-800">Plateforme d'administration sécurisée</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 