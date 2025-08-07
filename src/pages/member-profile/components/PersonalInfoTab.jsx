import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const PersonalInfoTab = ({ member, onSave, onDelete, isLoading = false }) => {
  const [formData, setFormData] = useState({
    firstName: member?.firstName || '',
    lastName: member?.lastName || '',
    email: member?.email || '',
    phone: member?.phone || '',
    dateOfBirth: member?.dateOfBirth || '',
    address: member?.address || '',
    group: member?.group || '',
    synod: member?.synod || '',
    localChurch: member?.localChurch || '',
    photo: member?.photo || ''
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(member?.photo || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const groupOptions = [
    { value: 'mpiandry', label: 'Mpiandry' },
    { value: 'mpampianatra', label: 'Mpampianatra' },
    { value: 'mpiomana_d1', label: 'Mpiomana D1' },
    { value: 'mpiomana_d2', label: 'Mpiomana D2' }
  ];

  const synodOptions = [
    { value: 'antananarivo', label: 'Antananarivo', color: '#2563EB' },
    { value: 'fianarantsoa', label: 'Fianarantsoa', color: '#DC2626' },
    { value: 'mahajanga', label: 'Mahajanga', color: '#059669' },
    { value: 'toamasina', label: 'Toamasina', color: '#D97706' },
    { value: 'antsiranana', label: 'Antsiranana', color: '#7C3AED' },
    { value: 'toliara', label: 'Toliara', color: '#DC2626' }
  ];

  const localChurchOptions = [
    { value: 'fpvm_analakely', label: 'FPVM Analakely' },
    { value: 'fpvm_faravohitra', label: 'FPVM Faravohitra' },
    { value: 'fpvm_isotry', label: 'FPVM Isotry' },
    { value: 'fpvm_andohalo', label: 'FPVM Andohalo' },
    { value: 'fpvm_ampefiloha', label: 'FPVM Ampefiloha' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoUpload = (file) => {
    if (file && file?.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e?.target?.result;
        setPhotoPreview(photoUrl);
        setFormData(prev => ({ ...prev, photo: photoUrl }));
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = e?.dataTransfer?.files;
    if (files?.length > 0) {
      handlePhotoUpload(files?.[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.firstName?.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData?.lastName?.trim()) {
      newErrors.lastName = 'Le nom de famille est requis';
    }
    
    if (!formData?.email?.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData?.group) {
      newErrors.group = 'Le groupe est requis';
    }
    
    if (!formData?.synod) {
      newErrors.synod = 'Le synode est requis';
    }
    
    if (!formData?.localChurch) {
      newErrors.localChurch = 'L\'église locale est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.')) {
      onDelete(member?.id);
    }
  };

  const selectedSynod = synodOptions?.find(s => s?.value === formData?.synod);

  return (
    <div className="space-y-6">
      {/* Photo Upload Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Photo du membre</h3>
        
        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Current Photo */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted border-2 border-border">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="Photo du membre"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="User" size={48} className="text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Upload Area */}
          <div className="flex-1">
            <div
              className={`
                border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200
                ${isDragOver 
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Glissez-déposez une photo ici ou cliquez pour sélectionner
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Formats acceptés: JPG, PNG, GIF (max 5MB)
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Button
                variant="outline"
                onClick={() => fileInputRef?.current?.click()}
                iconName="Camera"
                iconPosition="left"
              >
                Choisir une photo
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Personal Information Form */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Informations personnelles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Prénom"
            type="text"
            placeholder="Entrez le prénom"
            value={formData?.firstName}
            onChange={(e) => handleInputChange('firstName', e?.target?.value)}
            error={errors?.firstName}
            required
          />

          <Input
            label="Nom de famille"
            type="text"
            placeholder="Entrez le nom de famille"
            value={formData?.lastName}
            onChange={(e) => handleInputChange('lastName', e?.target?.value)}
            error={errors?.lastName}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="exemple@email.com"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />

          <Input
            label="Téléphone"
            type="tel"
            placeholder="+261 XX XX XXX XX"
            value={formData?.phone}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            error={errors?.phone}
          />

          <Input
            label="Date de naissance"
            type="date"
            value={formData?.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
            error={errors?.dateOfBirth}
          />

          <Input
            label="Adresse"
            type="text"
            placeholder="Adresse complète"
            value={formData?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            error={errors?.address}
          />
        </div>
      </div>
      {/* Church Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-6">Informations ecclésiastiques</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Select
            label="Groupe"
            placeholder="Sélectionnez un groupe"
            options={groupOptions}
            value={formData?.group}
            onChange={(value) => handleInputChange('group', value)}
            error={errors?.group}
            required
          />

          <div>
            <Select
              label="Synode"
              placeholder="Sélectionnez un synode"
              options={synodOptions?.map(s => ({ ...s, label: s?.label }))}
              value={formData?.synod}
              onChange={(value) => handleInputChange('synod', value)}
              error={errors?.synod}
              required
            />
            {selectedSynod && (
              <div className="flex items-center space-x-2 mt-2">
                <div 
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: selectedSynod?.color }}
                />
                <span className="text-sm text-muted-foreground">
                  Couleur du synode: {selectedSynod?.label}
                </span>
              </div>
            )}
          </div>

          <Select
            label="Église locale"
            placeholder="Sélectionnez une église"
            options={localChurchOptions}
            value={formData?.localChurch}
            onChange={(value) => handleInputChange('localChurch', value)}
            error={errors?.localChurch}
            required
          />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-border">
        <Button
          variant="destructive"
          onClick={handleDelete}
          iconName="Trash2"
          iconPosition="left"
          disabled={isLoading}
        >
          Supprimer le membre
        </Button>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => window.history?.back()}
            disabled={isLoading}
          >
            Annuler
          </Button>
          
          <Button
            variant="default"
            onClick={handleSave}
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
          >
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;