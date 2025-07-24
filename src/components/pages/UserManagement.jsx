import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { UserService } from '@/services/api/userService';
import { format } from 'date-fns';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    role: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const userData = await UserService.getAll();
      setUsers(userData);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await UserService.updateRole(userId, newRole);
      setUsers(prev => prev.map(user => 
        user.Id === userId ? { ...user, role: newRole } : user
      ));
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleStatusToggle = async (userId) => {
    try {
      const updatedUser = await UserService.toggleActiveStatus(userId);
      setUsers(prev => prev.map(user => 
        user.Id === userId ? updatedUser : user
      ));
      toast.success(`User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter.role && user.role !== filter.role) return false;
    if (filter.status === 'active' && !user.isActive) return false;
    if (filter.status === 'inactive' && user.isActive) return false;
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'instructor': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadUsers} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            label="Search Users"
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search by name or email..."
          />
          
          <FormField
            label="Role"
            type="select"
            value={filter.role}
            onChange={(e) => setFilter(prev => ({ ...prev, role: e.target.value }))}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
          </FormField>
          
          <FormField
            label="Status"
            type="select"
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </FormField>
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setFilter({ role: '', status: '', search: '' })}
              className="w-full"
            >
              <ApperIcon name="X" size={16} className="mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <Empty message="No users match your filters" />
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.Id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center space-x-4">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={20} className="text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      {!user.isActive && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}</span>
                      {user.location && <span>📍 {user.location}</span>}
                      <span>{user.profileComplete ? '✅ Complete' : '⚠️ Incomplete'} Profile</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.Id, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                    <option value="admin">Admin</option>
                  </select>
                  
                  <Button
                    variant={user.isActive ? "outline" : "solid"}
                    size="sm"
                    onClick={() => handleStatusToggle(user.Id)}
                    className={user.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}
                  >
                    {user.isActive ? (
                      <>
                        <ApperIcon name="UserX" size={16} className="mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <ApperIcon name="UserCheck" size={16} className="mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {user.certifications?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Award" size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {user.certifications.length} certification{user.certifications.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;