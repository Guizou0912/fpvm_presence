import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const AddMemberModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    photo: '',
    synod: '',
    localChurch: '',
    group: '',
    address: '',
    dateOfBirth: '',
    gender: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const synodOptions = [
    { value: 'antananarivo', label: 'Antananarivo' },
    { value: 'fianarantsoa', label: 'Fianarantsoa' },
    { value: 'mahajanga', label: 'Mahajanga' },
    { value: 'toamasina', label: 'Toamasina' },
    { value: 'antsiranana', label: 'Antsiranana' },
    { value: 'toliara', label: 'Toliara' }
  ];

  const groupOptions = [
    { value: 'mpiandry', label: 'Mpiandry' },
    { value: 'mpampianatra', label: 'Mpampianatra' },
    { value: 'mpiomana_d1', label: 'Mpiomana D1' },
    { value: 'mpiomana_d2', label: 'Mpiomana D2' }
  ];

  const localChurchOptions = [
    { value: 'analakely', label: 'Analakely' },
    { value: 'isotry', label: 'Isotry' },
    { value: 'andohalo', label: 'Andohalo' },
    { value: 'faravohitra', label: 'Faravohitra' },
    { value: 'ambohipo', label: 'Ambohipo' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData?.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    if (!formData?.synod) newErrors.synod = 'Synod is required';
    if (!formData?.localChurch) newErrors.localChurch = 'Local church is required';
    if (!formData?.group) newErrors.group = 'Group is required';
    
    if (formData?.email && !/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const memberData = {
        ...formData,
        id: `member_${Date.now()}`,
        memberId: `FPVM${Date.now()?.toString()?.slice(-6)}`,
        registrationDate: new Date()?.toISOString(),
        qrCode: null,
        totalVisits: 0,
        lastAttendance: null,
        photo: formData?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData?.firstName}${formData?.lastName}`
      };
      
      await onSave(memberData);
      onClose();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        photo: '',
        synod: '',
        localChurch: '',
        group: '',
        address: '',
        dateOfBirth: '',
        gender: ''
      });
    } catch (error) {
      console.error('Error saving member:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <Icon name="UserPlus" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">Add New Member</h2>
              <p className="text-sm text-muted-foreground">Create a new church member profile</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photo Preview */}
          {formData?.photo && (
            <div className="flex justify-center">
              <Image
                src={formData?.photo}
                alt="Member photo preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              required
              value={formData?.firstName}
              onChange={(e) => handleInputChange('firstName', e?.target?.value)}
              error={errors?.firstName}
              placeholder="Enter first name"
            />
            
            <Input
              label="Last Name"
              type="text"
              required
              value={formData?.lastName}
              onChange={(e) => handleInputChange('lastName', e?.target?.value)}
              error={errors?.lastName}
              placeholder="Enter last name"
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              placeholder="member@example.com"
            />
            
            <Input
              label="Phone Number"
              type="tel"
              value={formData?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              error={errors?.phone}
              placeholder="+261 XX XXX XXXX"
            />
          </div>

          {/* Church Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Synod"
              required
              options={synodOptions}
              value={formData?.synod}
              onChange={(value) => handleInputChange('synod', value)}
              error={errors?.synod}
              placeholder="Select synod"
            />
            
            <Select
              label="Local Church"
              required
              options={localChurchOptions}
              value={formData?.localChurch}
              onChange={(value) => handleInputChange('localChurch', value)}
              error={errors?.localChurch}
              placeholder="Select local church"
            />
          </div>

          <Select
            label="Group"
            required
            options={groupOptions}
            value={formData?.group}
            onChange={(value) => handleInputChange('group', value)}
            error={errors?.group}
            placeholder="Select member group"
          />

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date of Birth"
              type="date"
              value={formData?.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
              error={errors?.dateOfBirth}
            />
            
            <Select
              label="Gender"
              options={genderOptions}
              value={formData?.gender}
              onChange={(value) => handleInputChange('gender', value)}
              error={errors?.gender}
              placeholder="Select gender"
            />
          </div>

          {/* Additional Information */}
          <Input
            label="Photo URL"
            type="url"
            value={formData?.photo}
            onChange={(e) => handleInputChange('photo', e?.target?.value)}
            error={errors?.photo}
            placeholder="https://example.com/photo.jpg"
            description="Optional: Provide a URL for the member's photo"
          />

          <Input
            label="Address"
            type="text"
            value={formData?.address}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            error={errors?.address}
            placeholder="Enter full address"
          />

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="UserPlus"
              iconPosition="left"
            >
              Add Member
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;