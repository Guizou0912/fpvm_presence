import React, { useState, useEffect } from 'react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';

import Icon from 'components/AppIcon';

const AddChurchModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  synodes, 
  editData = null 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    synodeId: '',
    address: '',
    phone: '',
    email: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData?.name || '',
        synodeId: editData?.synodeId || '',
        address: editData?.address || '',
        phone: editData?.phone || '',
        email: editData?.email || '',
        description: editData?.description || ''
      });
    } else {
      setFormData({
        name: '',
        synodeId: '',
        address: '',
        phone: '',
        email: '',
        description: ''
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Le nom de l\'église est requis';
    } else if (formData?.name?.trim()?.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData?.synodeId) {
      newErrors.synodeId = 'Veuillez sélectionner un synode';
    }

    if (!formData?.address?.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }

    if (formData?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (formData?.phone && !/^[\d\s\-\+\(\)]+$/?.test(formData?.phone)) {
      newErrors.phone = 'Format de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit?.(formData);
      onClose();
    } catch (error) {
      console.error('Error saving church:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const synodeOptions = synodes?.map(synode => ({
    value: synode?.id,
    label: synode?.name,
    color: synode?.colorCode
  })) || [];

  const selectedSynode = synodes?.find(s => s?.id === formData?.synodeId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {editData ? 'Modifier l\'église' : 'Créer une nouvelle église'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Nom de l'église"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={errors?.name}
            required
            placeholder="Ex: Église Centrale Antananarivo"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Synode <span className="text-destructive">*</span>
            </label>
            <select
              value={formData?.synodeId}
              onChange={(e) => handleInputChange('synodeId', e?.target?.value)}
              className={`
                w-full px-3 py-2 border rounded-lg bg-background text-foreground text-sm
                focus:outline-none focus:ring-2 focus:ring-ring
                ${errors?.synodeId ? 'border-destructive' : 'border-border'}
              `}
            >
              <option value="">Sélectionnez un synode</option>
              {synodeOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
            {errors?.synodeId && (
              <p className="text-sm text-destructive">{errors?.synodeId}</p>
            )}
            
            {selectedSynode && (
              <div className="flex items-center space-x-2 mt-2 p-2 bg-muted/50 rounded">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedSynode?.colorCode }}
                />
                <span className="text-sm text-muted-foreground">
                  Cette église héritera de la couleur du synode {selectedSynode?.name}
                </span>
              </div>
            )}
          </div>

          <Input
            label="Adresse"
            value={formData?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            error={errors?.address}
            required
            placeholder="Ex: Antananarivo, Madagascar"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Téléphone"
              value={formData?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              error={errors?.phone}
              placeholder="Ex: +261 20 22 123 45"
            />

            <Input
              label="Email"
              type="email"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              placeholder="Ex: contact@eglise.mg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description (optionnelle)
            </label>
            <textarea
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              className="w-full min-h-[80px] px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Description de l'église..."
              rows={3}
            />
          </div>

          {/* Preview */}
          {formData?.name && selectedSynode && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Aperçu:</p>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background rounded">
                  <Icon name="Church" size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {formData?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formData?.address}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedSynode?.colorCode }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {selectedSynode?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              loading={loading}
              iconName={editData ? "Save" : "Plus"}
            >
              {editData ? 'Sauvegarder' : 'Créer l\'église'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChurchModal;