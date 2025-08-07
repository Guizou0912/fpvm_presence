import React, { useState, useEffect } from 'react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Icon from 'components/AppIcon';

const AddGroupModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  churches,
  synodes,
  editData = null 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    churchId: '',
    type: 'general',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData?.name || '',
        churchId: editData?.churchId || '',
        type: editData?.type || 'general',
        description: editData?.description || ''
      });
    } else {
      setFormData({
        name: '',
        churchId: '',
        type: 'general',
        description: ''
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  const groupTypes = [
    { value: 'leadership', label: 'Mpiandry (Direction)', icon: 'Crown' },
    { value: 'education', label: 'Mpampianatra (Enseignement)', icon: 'GraduationCap' },
    { value: 'worship', label: 'Mpiomana (Adoration)', icon: 'Music' },
    { value: 'general', label: 'Groupe général', icon: 'Users' }
  ];

  const predefinedNames = {
    worship: ['Mpiomana D1', 'Mpiomana D2', 'Mpiomana D3'],
    leadership: ['Mpiandry', 'Conseil'],
    education: ['Mpampianatra', 'École du dimanche', 'Formation'],
    general: ['Jeunesse', 'Femmes', 'Hommes', 'Anciens']
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Le nom du groupe est requis';
    } else if (formData?.name?.trim()?.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData?.churchId) {
      newErrors.churchId = 'Veuillez sélectionner une église';
    }

    if (!formData?.type) {
      newErrors.type = 'Veuillez sélectionner un type de groupe';
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
      console.error('Error saving group:', error);
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

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      name: '' // Reset name when type changes
    }));
    
    if (errors?.type) {
      setErrors(prev => ({ ...prev, type: null }));
    }
  };

  const handlePresetName = (name) => {
    handleInputChange('name', name);
  };

  const getSynodeById = (synodeId) => {
    return synodes?.find(synode => synode?.id === synodeId);
  };

  const getChurchWithSynode = (churchId) => {
    const church = churches?.find(c => c?.id === churchId);
    if (church) {
      const synode = getSynodeById(church?.synodeId);
      return { church, synode };
    }
    return null;
  };

  const selectedChurchWithSynode = formData?.churchId 
    ? getChurchWithSynode(formData?.churchId) 
    : null;

  const getTypeIcon = (type) => {
    return groupTypes?.find(gt => gt?.value === type)?.icon || 'Users';
  };

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
            {editData ? 'Modifier le groupe' : 'Créer un nouveau groupe'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Church Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Église <span className="text-destructive">*</span>
            </label>
            <select
              value={formData?.churchId}
              onChange={(e) => handleInputChange('churchId', e?.target?.value)}
              className={`
                w-full px-3 py-2 border rounded-lg bg-background text-foreground text-sm
                focus:outline-none focus:ring-2 focus:ring-ring
                ${errors?.churchId ? 'border-destructive' : 'border-border'}
              `}
            >
              <option value="">Sélectionnez une église</option>
              {churches?.map((church) => {
                const synode = getSynodeById(church?.synodeId);
                return (
                  <option key={church?.id} value={church?.id}>
                    {church?.name} ({synode?.name})
                  </option>
                );
              })}
            </select>
            {errors?.churchId && (
              <p className="text-sm text-destructive">{errors?.churchId}</p>
            )}
          </div>

          {/* Group Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Type de groupe <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {groupTypes?.map((type) => (
                <button
                  key={type?.value}
                  type="button"
                  onClick={() => handleTypeChange(type?.value)}
                  className={`
                    p-3 rounded-lg border-2 transition-all text-left
                    ${formData?.type === type?.value
                      ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground hover:bg-muted/50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={type?.icon} 
                      size={18} 
                      className={formData?.type === type?.value ? 'text-primary' : 'text-muted-foreground'} 
                    />
                    <span className={`text-sm font-medium ${
                      formData?.type === type?.value ? 'text-primary' : 'text-foreground'
                    }`}>
                      {type?.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {errors?.type && (
              <p className="text-sm text-destructive">{errors?.type}</p>
            )}
          </div>

          {/* Preset Names */}
          {formData?.type && predefinedNames?.[formData?.type] && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Noms suggérés:
              </label>
              <div className="flex flex-wrap gap-2">
                {predefinedNames?.[formData?.type]?.map((presetName) => (
                  <button
                    key={presetName}
                    type="button"
                    onClick={() => handlePresetName(presetName)}
                    className="px-3 py-1 text-sm border border-border rounded-full hover:bg-muted transition-colors"
                  >
                    {presetName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Group Name */}
          <Input
            label="Nom du groupe"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={errors?.name}
            required
            placeholder="Ex: Mpiandry"
          />

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description (optionnelle)
            </label>
            <textarea
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              className="w-full min-h-[80px] px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Description du groupe..."
              rows={3}
            />
          </div>

          {/* Preview */}
          {formData?.name && selectedChurchWithSynode && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-2">Aperçu:</p>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-background rounded">
                  <Icon 
                    name={getTypeIcon(formData?.type)} 
                    size={20} 
                    className="text-muted-foreground" 
                  />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {formData?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedChurchWithSynode?.church?.name}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedChurchWithSynode?.synode?.colorCode }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {selectedChurchWithSynode?.synode?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      • {groupTypes?.find(gt => gt?.value === formData?.type)?.label}
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
              {editData ? 'Sauvegarder' : 'Créer le groupe'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroupModal;