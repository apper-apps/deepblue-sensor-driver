import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/services/api/userService';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    location: '',
    phone: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    safetyInfo: {
      medicalConditions: '',
      buddyPreferences: '',
      experienceLevel: 'beginner',
      preferredDepths: ''
    },
    preferences: {
      visibility: 'public',
      showContact: false,
      showCertifications: true
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        location: user.location || '',
        phone: user.phone || '',
        emergencyContact: user.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        },
        safetyInfo: user.safetyInfo || {
          medicalConditions: '',
          buddyPreferences: '',
          experienceLevel: 'beginner',
          preferredDepths: ''
        },
        preferences: user.preferences || {
          visibility: 'public',
          showContact: false,
          showCertifications: true
        }
      });
    }
  }, [user]);

  const handleInputChange = (section, field, value) => {
    if (section) {
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      await UserService.updateProfile(user.Id, profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'User' },
    { id: 'emergency', label: 'Emergency Contact', icon: 'Phone' },
    { id: 'safety', label: 'Safety Info', icon: 'Shield' },
    { id: 'privacy', label: 'Privacy', icon: 'Lock' }
  ];

  const PersonalInfoTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          value={profileData.firstName}
          onChange={(e) => handleInputChange(null, 'firstName', e.target.value)}
          required
        />
        <FormField
          label="Last Name"
          value={profileData.lastName}
          onChange={(e) => handleInputChange(null, 'lastName', e.target.value)}
          required
        />
      </div>

      <FormField
        label="Bio"
        value={profileData.bio}
        onChange={(e) => handleInputChange(null, 'bio', e.target.value)}
        placeholder="Tell us about your freediving journey..."
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Location"
          value={profileData.location}
          onChange={(e) => handleInputChange(null, 'location', e.target.value)}
          placeholder="City, Country"
        />
        <FormField
          label="Phone Number"
          value={profileData.phone}
          onChange={(e) => handleInputChange(null, 'phone', e.target.value)}
          placeholder="+1-234-567-8900"
        />
      </div>

      <div className="border-t pt-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Profile Picture</h4>
        <div className="flex items-center space-x-4">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={24} className="text-gray-400" />
            </div>
          )}
          <Button variant="outline" size="sm">
            <ApperIcon name="Upload" size={16} className="mr-2" />
            Upload Photo
          </Button>
        </div>
      </div>
    </div>
  );

  const EmergencyContactTab = () => (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <ApperIcon name="AlertTriangle" size={20} className="text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Important Safety Information</h4>
            <p className="text-sm text-yellow-700 mt-1">
              This contact will be notified in case of diving emergencies. Please ensure the information is current.
            </p>
          </div>
        </div>
      </div>

      <FormField
        label="Emergency Contact Name"
        value={profileData.emergencyContact.name}
        onChange={(e) => handleInputChange('emergencyContact', 'name', e.target.value)}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Emergency Contact Phone"
          value={profileData.emergencyContact.phone}
          onChange={(e) => handleInputChange('emergencyContact', 'phone', e.target.value)}
          required
        />
        <FormField
          label="Relationship"
          type="select"
          value={profileData.emergencyContact.relationship}
          onChange={(e) => handleInputChange('emergencyContact', 'relationship', e.target.value)}
        >
          <option value="">Select relationship</option>
          <option value="spouse">Spouse</option>
          <option value="parent">Parent</option>
          <option value="sibling">Sibling</option>
          <option value="friend">Friend</option>
          <option value="other">Other</option>
        </FormField>
      </div>
    </div>
  );

  const SafetyInfoTab = () => (
    <div className="space-y-4">
      <FormField
        label="Medical Conditions"
        value={profileData.safetyInfo.medicalConditions}
        onChange={(e) => handleInputChange('safetyInfo', 'medicalConditions', e.target.value)}
        placeholder="Any medical conditions that may affect diving (e.g., asthma, heart conditions)"
        rows={3}
      />

      <FormField
        label="Experience Level"
        type="select"
        value={profileData.safetyInfo.experienceLevel}
        onChange={(e) => handleInputChange('safetyInfo', 'experienceLevel', e.target.value)}
      >
        <option value="beginner">Beginner (0-50 dives)</option>
        <option value="intermediate">Intermediate (50-200 dives)</option>
        <option value="advanced">Advanced (200-500 dives)</option>
        <option value="expert">Expert (500+ dives)</option>
      </FormField>

      <FormField
        label="Preferred Depths"
        value={profileData.safetyInfo.preferredDepths}
        onChange={(e) => handleInputChange('safetyInfo', 'preferredDepths', e.target.value)}
        placeholder="e.g., 0-30m, 30-50m, 50m+"
      />

      <FormField
        label="Buddy Preferences"
        value={profileData.safetyInfo.buddyPreferences}
        onChange={(e) => handleInputChange('safetyInfo', 'buddyPreferences', e.target.value)}
        placeholder="Preferred diving buddy types or requirements"
        rows={2}
      />
    </div>
  );

  const PrivacyTab = () => (
    <div className="space-y-4">
      <FormField
        label="Profile Visibility"
        type="select"
        value={profileData.preferences.visibility}
        onChange={(e) => handleInputChange('preferences', 'visibility', e.target.value)}
      >
        <option value="public">Public - Visible to all users</option>
        <option value="members">Members Only - Visible to logged in users</option>
        <option value="private">Private - Only visible to you</option>
      </FormField>

      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={profileData.preferences.showContact}
            onChange={(e) => handleInputChange('preferences', 'showContact', e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">Show contact information to other members</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={profileData.preferences.showCertifications}
            onChange={(e) => handleInputChange('preferences', 'showCertifications', e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">Show certifications and achievements</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        {!user?.profileComplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center">
              <ApperIcon name="AlertCircle" size={16} className="text-amber-600 mr-2" />
              <span className="text-sm text-amber-800">Profile incomplete</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Navigation */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} className="mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          <Card className="p-6">
            {activeTab === 'personal' && <PersonalInfoTab />}
            {activeTab === 'emergency' && <EmergencyContactTab />}
            {activeTab === 'safety' && <SafetyInfoTab />}
            {activeTab === 'privacy' && <PrivacyTab />}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <Button variant="outline">
                  Cancel
                </Button>
                <Button onClick={saveProfile} disabled={loading}>
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;