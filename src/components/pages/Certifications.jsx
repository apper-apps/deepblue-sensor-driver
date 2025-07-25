import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/services/api/userService";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const Certifications = () => {
  const { user } = useAuth();
  const [certifications, setCertifications] = useState([]);
const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [licensePhoto, setLicensePhoto] = useState(null);
  const [newCert, setNewCert] = useState({
    organization: '',
    level: '',
    issueDate: '',
    expiryDate: '',
    certificateNumber: ''
  });
  useEffect(() => {
    if (user?.certifications) {
      setCertifications(user.certifications);
      setLoading(false);
    }
  }, [user]);

const handleAddCertification = async () => {
    if (!newCert.organization || !newCert.level || !newCert.issueDate || !newCert.certificateNumber) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const addedCert = await UserService.addCertification(user.Id, {
        ...newCert,
        verified: false
});
      setCertifications(prev => [...prev, addedCert]);
      setNewCert({
        organization: '',
        level: '',
        issueDate: '',
        expiryDate: '',
        certificateNumber: ''
      });
      setLicensePhoto(null);
      setShowAddForm(false);
      toast.success('Certification added successfully');
    } catch (error) {
      toast.error('Failed to add certification');
    }
  };

  const handleRemoveCertification = async (certId) => {
    if (!confirm('Are you sure you want to remove this certification?')) {
      return;
    }

    try {
      await UserService.removeCertification(user.Id, certId);
      setCertifications(prev => prev.filter(cert => cert.Id !== certId));
      toast.success('Certification removed');
    } catch (error) {
      toast.error('Failed to remove certification');
    }
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry <= threeMonthsFromNow;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const getOrganizationColor = (org) => {
    switch (org.toLowerCase()) {
      case 'aida': return 'bg-blue-100 text-blue-800';
      case 'padi': return 'bg-green-100 text-green-800';
      case 'ssi': return 'bg-purple-100 text-purple-800';
      case 'cmas': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};

  const handleLicensePhotoUpload = (e) => {
    if (!e?.target?.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLicensePhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Certifications</h1>
          <p className="text-gray-600">Manage your freediving certifications and credentials</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Certification
        </Button>
      </div>

      {/* Expiry Alerts */}
      {certifications.some(cert => isExpiringSoon(cert.expiryDate) || isExpired(cert.expiryDate)) && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start">
            <ApperIcon name="AlertTriangle" size={20} className="text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Certification Alerts</h3>
              <div className="mt-2 text-sm text-amber-700">
                {certifications.filter(cert => isExpired(cert.expiryDate)).length > 0 && (
                  <p>⚠️ {certifications.filter(cert => isExpired(cert.expiryDate)).length} certification(s) have expired</p>
                )}
                {certifications.filter(cert => isExpiringSoon(cert.expiryDate) && !isExpired(cert.expiryDate)).length > 0 && (
                  <p>🔔 {certifications.filter(cert => isExpiringSoon(cert.expiryDate) && !isExpired(cert.expiryDate)).length} certification(s) expiring within 3 months</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Add Certification Form */}
      {showAddForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold font-display text-gray-900">Add New Certification</h2>
            <Button variant="ghost" onClick={() => setShowAddForm(false)}>
              <ApperIcon name="X" size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<FormField
              label="Organization"
              type="select"
              value={newCert.organization}
              onChange={(e) => setNewCert(prev => ({ ...prev, organization: e.target.value }))}
            >
              <option value="">Select organization</option>
              <option value="AIDA">AIDA</option>
              <option value="Apnea Total">Apnea Total</option>
              <option value="CMAS">CMAS</option>
              <option value="Molchanovs">Molchanovs</option>
              <option value="PADI">PADI</option>
              <option value="Raid Freediving">Raid Freediving</option>
              <option value="SSI">SSI</option>
            </FormField>

<FormField
              label="Certification Level"
              value={newCert.level}
              onChange={(e) => setNewCert(prev => ({ ...prev, level: e.target.value }))}
              placeholder="e.g. Wave 1, AIDA 1, PADI Freediver, etc."
              required
            />

            <FormField
              label="Issue Date"
              type="date"
              value={newCert.issueDate}
              onChange={(e) => setNewCert(prev => ({ ...prev, issueDate: e.target.value }))}
              required
            />

            <FormField
              label="Expiry Date"
              type="date"
              value={newCert.expiryDate}
              onChange={(e) => setNewCert(prev => ({ ...prev, expiryDate: e.target.value }))}
            />

<FormField
              label="Certification Number"
              value={newCert.certificateNumber}
              onChange={(e) => setNewCert(prev => ({ ...prev, certificateNumber: e.target.value }))}
              className="md:col-span-2"
              required
            />

            <FormField
              label="License Picture"
              type="file"
              accept="image/*"
              onChange={handleLicensePhotoUpload}
              className="md:col-span-2"
            />
            
            {licensePhoto && (
              <div className="md:col-span-2">
                <img 
                  src={licensePhoto} 
                  alt="License preview" 
                  className="w-48 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

<div className="mt-6 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCertification}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Certification
            </Button>
          </div>
        </Card>
      )}

      {/* Certifications List */}
      {certifications.length === 0 ? (
        <Empty message="No certifications added yet" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert) => (
            <Card key={cert.Id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 text-sm font-medium rounded-full ${getOrganizationColor(cert.organization)}`}>
                    {cert.organization}
                  </div>
                  {cert.verified ? (
                    <div className="flex items-center text-green-600">
                      <ApperIcon name="CheckCircle" size={16} className="mr-1" />
                      <span className="text-xs">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <ApperIcon name="Clock" size={16} className="mr-1" />
                      <span className="text-xs">Pending</span>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCertification(cert.Id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{cert.level}</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <ApperIcon name="Calendar" size={14} className="mr-2" />
                  Issued: {format(new Date(cert.issueDate), 'MMM d, yyyy')}
                </div>
                
                {cert.expiryDate && (
                  <div className={`flex items-center ${
                    isExpired(cert.expiryDate) ? 'text-red-600' : 
                    isExpiringSoon(cert.expiryDate) ? 'text-amber-600' : 'text-gray-600'
                  }`}>
                    <ApperIcon 
                      name={isExpired(cert.expiryDate) ? "AlertCircle" : "Clock"} 
                      size={14} 
                      className="mr-2" 
                    />
                    Expires: {format(new Date(cert.expiryDate), 'MMM d, yyyy')}
                    {isExpired(cert.expiryDate) && (
                      <span className="ml-2 text-xs font-medium">EXPIRED</span>
                    )}
                    {isExpiringSoon(cert.expiryDate) && !isExpired(cert.expiryDate) && (
                      <span className="ml-2 text-xs font-medium">EXPIRES SOON</span>
                    )}
                  </div>
                )}
                
                {cert.certificateNumber && (
                  <div className="flex items-center">
                    <ApperIcon name="Hash" size={14} className="mr-2" />
                    {cert.certificateNumber}
                  </div>
)}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <ApperIcon name="Upload" size={16} className="mr-2" />
                    Upload Certificate
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <ApperIcon name="Camera" size={16} className="mr-2" />
                    Add License Picture
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certifications;