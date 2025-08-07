import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import LoginHeader from './components/LoginHeader';
import LanguageSelector from './components/LanguageSelector';
import ThemeToggle from './components/ThemeToggle';
import CredentialsInfo from './components/CredentialsInfo';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('fpvm-language') || 'fr';
    setCurrentLanguage(savedLanguage);

    // Load saved theme preference
    const savedTheme = localStorage.getItem('fpvm-theme') || 'light';
    setCurrentTheme(savedTheme);

    // Check if user is already logged in
    const savedUser = localStorage.getItem('fpvm-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      redirectToRoleDashboard(userData?.role);
    }
  }, []);

  const redirectToRoleDashboard = (role) => {
    const roleRoutes = {
      admin: '/member-management-dashboard',
      controller: '/attendance-reports',
      user: '/qr-code-scanner'
    };

    navigate(roleRoutes?.[role] || '/member-management-dashboard');
  };

  const handleLogin = async (role, email) => {
    setIsLoading(true);

    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store user data
      const userData = {
        role,
        email,
        name: role === 'admin' ? 'Administrateur FPVM' : 
              role === 'controller'? 'Contrôleur FPVM' : 'Utilisateur FPVM',
        loginTime: new Date()?.toISOString()
      };

      localStorage.setItem('fpvm-user', JSON.stringify(userData));
      
      // Redirect based on role
      redirectToRoleDashboard(role);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('fpvm-language', languageCode);
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('fpvm-theme', theme);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <LanguageSelector 
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
        <ThemeToggle 
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
        />
      </div>
      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 elevation-moderate">
          <LoginHeader />
          
          <LoginForm 
            onLogin={handleLogin}
            isLoading={isLoading}
          />

          <CredentialsInfo />
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          © {new Date()?.getFullYear()} FPVM Presence - Système de gestion de présence
        </div>
      </div>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300">
          <div className="bg-card rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            <span className="text-card-foreground">Connexion en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;