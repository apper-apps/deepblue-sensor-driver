import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/services/api/userService";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

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
    },
    goals: [],
    diary: []
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
        },
        goals: user.goals || [],
        diary: user.diary || []
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
    { id: 'privacy', label: 'Privacy', icon: 'Lock' },
    { id: 'goals', label: 'Goals', icon: 'Target' },
    { id: 'diary', label: 'Diary', icon: 'BookOpen' }
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
  const GoalsTab = () => {
    const addGoal = () => {
      const newGoal = {
        id: Date.now(),
        goal: '',
        description: '',
        tag: '',
        targetDate: '',
        estimatedBudget: ''
      };
      setProfileData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal]
      }));
    };

    const updateGoal = (id, field, value) => {
      setProfileData(prev => ({
        ...prev,
        goals: prev.goals.map(goal => 
          goal.id === id ? { ...goal, [field]: value } : goal
        )
      }));
    };

    const removeGoal = (id) => {
      setProfileData(prev => ({
        ...prev,
        goals: prev.goals.filter(goal => goal.id !== id)
      }));
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Dive Goals & Bucket List</h3>
          <Button onClick={addGoal} size="sm">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Goal
          </Button>
        </div>

        {profileData.goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="Target" size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No goals added yet. Start by adding your first dive goal!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {profileData.goals.map((goal) => (
              <Card key={goal.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-900">Goal #{profileData.goals.indexOf(goal) + 1}</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removeGoal(goal.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <FormField
                    label="Goal"
                    value={goal.goal}
                    onChange={(e) => updateGoal(goal.id, 'goal', e.target.value)}
                    placeholder="e.g., Visit the Great Blue Hole, Achieve 50m depth"
                    required
                  />

                  <FormField
                    label="Description"
                    value={goal.description}
                    onChange={(e) => updateGoal(goal.id, 'description', e.target.value)}
                    placeholder="Describe your goal in detail..."
                    rows={3}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      label="Tag"
                      type="select"
                      value={goal.tag}
                      onChange={(e) => updateGoal(goal.id, 'tag', e.target.value)}
                    >
                      <option value="">Select category</option>
                      <option value="training">Training</option>
                      <option value="travel">Travel</option>
                      <option value="education">Education</option>
                      <option value="others">Others</option>
                    </FormField>

                    <FormField
                      label="Target Date"
                      type="date"
                      value={goal.targetDate}
                      onChange={(e) => updateGoal(goal.id, 'targetDate', e.target.value)}
                    />

                    <FormField
                      label="Estimated Budget"
                      value={goal.estimatedBudget}
                      onChange={(e) => updateGoal(goal.id, 'estimatedBudget', e.target.value)}
                      placeholder="$0"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const DiaryTab = () => {
    const addDiaryEntry = () => {
      const newEntry = {
        id: Date.now(),
        title: '',
        body: '',
        tags: '',
        date: new Date().toISOString().split('T')[0]
      };
      setProfileData(prev => ({
        ...prev,
        diary: [...prev.diary, newEntry]
      }));
    };

    const updateDiaryEntry = (id, field, value) => {
      setProfileData(prev => ({
        ...prev,
        diary: prev.diary.map(entry => 
          entry.id === id ? { ...entry, [field]: value } : entry
        )
      }));
    };

    const removeDiaryEntry = (id) => {
      setProfileData(prev => ({
        ...prev,
        diary: prev.diary.filter(entry => entry.id !== id)
      }));
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Dive Diary & Notes</h3>
          <Button onClick={addDiaryEntry} size="sm">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Entry
          </Button>
        </div>

        {profileData.diary.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="BookOpen" size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No diary entries yet. Start documenting your diving journey!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {profileData.diary.map((entry) => (
              <Card key={entry.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">Entry #{profileData.diary.indexOf(entry) + 1}</h4>
                    <span className="text-sm text-gray-500">{entry.date}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removeDiaryEntry(entry.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <FormField
                    label="Title"
                    value={entry.title}
                    onChange={(e) => updateDiaryEntry(entry.id, 'title', e.target.value)}
                    placeholder="Entry title..."
                    required
                  />

                  <FormField
                    label="Body"
                    value={entry.body}
                    onChange={(e) => updateDiaryEntry(entry.id, 'body', e.target.value)}
                    placeholder="Write your thoughts, realizations, training plans..."
                    rows={6}
                  />

                  <FormField
                    label="Tags"
                    value={entry.tags}
                    onChange={(e) => updateDiaryEntry(entry.id, 'tags', e.target.value)}
                    placeholder="training, technique, mental-prep, equipment (comma separated)"
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
};

return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold font-display transition-colors ${
            document.body.classList.contains('theme-dark') 
              ? 'text-gray-100' 
              : document.body.classList.contains('theme-dive')
              ? 'text-blue-100'
              : 'text-gray-900'
          }`}>Profile Settings</h1>
          <p className={`transition-colors ${
            document.body.classList.contains('theme-dark') 
              ? 'text-gray-300' 
              : document.body.classList.contains('theme-dive')
              ? 'text-blue-200'
              : 'text-gray-600'
          }`}>Manage your personal information and preferences</p>
        </div>
        {!user?.profileComplete && (
          <div className={`border rounded-lg p-3 transition-colors ${
            document.body.classList.contains('theme-dark') 
              ? 'bg-amber-900/50 border-amber-700' 
              : document.body.classList.contains('theme-dive')
              ? 'bg-amber-900/50 border-amber-600'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center">
              <ApperIcon name="AlertCircle" size={16} className="text-amber-600 mr-2" />
              <span className={`text-sm ${
                document.body.classList.contains('theme-dark') 
                  ? 'text-amber-300' 
                  : document.body.classList.contains('theme-dive')
                  ? 'text-amber-200'
                  : 'text-amber-800'
              }`}>Profile incomplete</span>
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
                    ? document.body.classList.contains('theme-dark')
                      ? 'bg-gray-700 text-blue-300 border border-gray-600'
                      : document.body.classList.contains('theme-dive')
                      ? 'bg-ocean-mid text-blue-100 border border-ocean-surface'
                      : 'bg-primary-50 text-primary-700 border border-primary-200'
                    : document.body.classList.contains('theme-dark')
                      ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700'
                      : document.body.classList.contains('theme-dive')
                      ? 'text-blue-200 hover:text-blue-100 hover:bg-ocean-mid/50'
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
{/* Tab Content */}
        <div className="flex-1">
          <Card className={`p-6 transition-colors ${
            document.body.classList.contains('theme-dark') 
              ? 'bg-gray-800 border-gray-700' 
              : document.body.classList.contains('theme-dive')
              ? 'bg-ocean-deep border-ocean-mid'
              : 'bg-white border-gray-200'
          }`}>
            {activeTab === 'personal' && <PersonalInfoTab />}
            {activeTab === 'emergency' && <EmergencyContactTab />}
            {activeTab === 'safety' && <SafetyInfoTab />}
            {activeTab === 'privacy' && <PrivacyTab />}
            {activeTab === 'goals' && <GoalsTab />}
            {activeTab === 'diary' && <DiaryTab />}

            <div className={`mt-6 pt-6 border-t transition-colors ${
              document.body.classList.contains('theme-dark') 
                ? 'border-gray-700' 
                : document.body.classList.contains('theme-dive')
                ? 'border-ocean-mid'
                : 'border-gray-200'
            }`}>
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