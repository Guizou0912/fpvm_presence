import React, { useState, useEffect } from 'react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';


const AddSynodeModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editData = null 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    colorCode: '#3B82F6',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData?.name || '',
        colorCode: editData?.colorCode || '#3B82F6',
        description: editData?.description || ''
      });
    } else {
      setFormData({
        name: '',
        colorCode: '#3B82F6',
        description: ''
      });
    }
    setErrors({});
  }, [editData, isOpen]);

  const predefinedColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#F97316', '#84CC16',
    '#EC4899', '#6B7280', '#14B8A6', '#F43F5E'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Le nom du synode est requis';
    } else if (formData?.name?.trim()?.length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData?.colorCode) {
      newErrors.colorCode = 'Veuillez sélectionner une couleur';
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
      console.error('Error saving synode:', error);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {editData ? 'Modifier le synode' : 'Créer un nouveau synode'}
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
            label="Nom du synode"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={errors?.name}
            required
            placeholder="Ex: Synode Central"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Couleur du synode <span className="text-destructive">*</span>
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData?.colorCode}
                onChange={(e) => handleInputChange('colorCode', e?.target?.value)}
                className="w-12 h-12 border border-border rounded cursor-pointer"
              />
              <div className="flex-1">
                <Input
                  value={formData?.colorCode}
                  onChange={(e) => handleInputChange('colorCode', e?.target?.value)}
                  error={errors?.colorCode}
                  placeholder="#3B82F6"
                />
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-xs text-muted-foreground mb-2">Couleurs suggérées:</p>
              <div className="flex flex-wrap gap-2">
                {predefinedColors?.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleInputChange('colorCode', color)}
                    className={`
                      w-8 h-8 rounded border-2 transition-transform
                      ${formData?.colorCode === color 
                        ? 'border-foreground scale-110' 
                        : 'border-border hover:scale-105'
                      }
                    `}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description (optionnelle)
            </label>
            <textarea
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              className="w-full min-h-[80px] px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Description du synode..."
              rows={3}
            />
          </div>

          {/* Preview */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">Aperçu:</p>
            <div className="flex items-center space-x-3">
              <div 
                className="w-5 h-5 rounded-full border border-border"
                style={{ backgroundColor: formData?.colorCode }}
              />
              <div>
                <div className="font-medium text-foreground">
                  {formData?.name || 'Nom du synode'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Cette couleur sera appliquée aux badges et QR codes
                </div>
              </div>
            </div>
          </div>

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
              {editData ? 'Sauvegarder' : 'Créer le synode'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSynodeModal;