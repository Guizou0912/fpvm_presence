import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const LoginForm = ({ onLogin, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const mockCredentials = {
    admin: { email: 'admin@fpvm.org', password: 'admin123' },
    controller: { email: 'controller@fpvm.org', password: 'controller123' },
    user: { email: 'user@fpvm.org', password: 'user123' }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'L\'adresse email est requise';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData?.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check credentials
    const userRole = Object.keys(mockCredentials)?.find(role => 
      mockCredentials?.[role]?.email === formData?.email && 
      mockCredentials?.[role]?.password === formData?.password
    );

    if (userRole) {
      onLogin(userRole, formData?.email);
    } else {
      setErrors({
        general: 'Email ou mot de passe incorrect. Utilisez les identifiants fournis.'
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors?.general && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-destructive" />
            <p className="text-sm text-destructive">{errors?.general}</p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <Input
          label="Adresse Email"
          type="email"
          name="email"
          placeholder="votre.email@fpvm.org"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          disabled={isLoading}
        />

        <div className="relative">
          <Input
            label="Mot de Passe"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Entrez votre mot de passe"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>
      </div>
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        className="mt-6"
      >
        Se Connecter
      </Button>
      <div className="text-center">
        <button
          type="button"
          className="text-sm text-primary hover:text-primary/80 transition-colors"
          disabled={isLoading}
        >
          Mot de passe oublié ?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;