import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const demoAccounts = [
    { email: 'admin@deepblue.com', password: 'admin123', role: 'Admin' },
    { email: 'marco.instructor@deepblue.com', password: 'instructor123', role: 'Instructor' },
    { email: 'alex.student@example.com', password: 'student123', role: 'Student' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loginWithDemo = (demoAccount) => {
    setFormData({
      email: demoAccount.email,
      password: demoAccount.password
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-depth-gradient rounded-full flex items-center justify-center">
            <ApperIcon name="Waves" size={32} className="text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold font-display text-gray-900">
            Welcome to DeepBlue Log
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your freediving portal
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              required
            />

            <FormField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter your password"
              required
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <ApperIcon name="LogIn" size={16} className="mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
            Demo Accounts
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Try different user roles with these demo accounts:
          </p>
          <div className="space-y-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => loginWithDemo(account)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{account.role}</p>
                    <p className="text-xs text-gray-500">{account.email}</p>
                  </div>
                  <ApperIcon name="ArrowRight" size={16} className="text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;