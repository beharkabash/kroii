'use client';

/**
 * Admin Users Management Page
 * User management system for controlling admin access and permissions
 */

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Edit3,
  Trash2,
  Shield,
  ShieldCheck,
  Eye,
  Calendar,
  Clock,
  AlertCircle,
  UserPlus,
  Key,
  Activity,
  RefreshCw
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  emailVerified?: string;
  image?: string;
}


const roleColors = {
  SUPER_ADMIN: 'bg-red-100 text-red-800 border-red-200',
  ADMIN: 'bg-blue-100 text-blue-800 border-blue-200',
  VIEWER: 'bg-gray-100 text-gray-800 border-gray-200',
};

const roleLabels = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  VIEWER: 'Katselija',
};

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ADMIN',
  });

  // Check if current user has permission to manage users
  const canManageUsers = session?.user?.role === 'SUPER_ADMIN';

  const filterUsers = useCallback(() => {
    let filtered = users;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (selectedRole !== 'ALL') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, selectedRole]);

  useEffect(() => {
    if (session?.user?.role) {
      fetchUsers();
    }
  }, [session]);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, selectedRole, filterUsers]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      setError('Virhe ladattaessa käyttäjiä');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivities = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/activities`);
      if (!response.ok) throw new Error('Failed to fetch activities');

      const data = await response.json();
      console.log('User activities:', data.activities); // Log for debugging instead
    } catch (err) {
      console.error('Error fetching user activities:', err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newUser.password !== newUser.confirmPassword) {
      alert('Salasanat eivät täsmää');
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
      }

      await fetchUsers();
      setShowCreateModal(false);
      setNewUser({ name: '', email: '', password: '', confirmPassword: '', role: 'ADMIN' });
    } catch (err) {
      alert(`Virhe luodessa käyttäjää: ${err instanceof Error ? err.message : 'Tuntematon virhe'}`);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedUser.name,
          email: selectedUser.email,
          role: selectedUser.role,
        }),
      });

      if (!response.ok) throw new Error('Failed to update user');

      await fetchUsers();
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
      alert('Virhe päivittäessä käyttäjää');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUserId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      await fetchUsers();
      setShowDeleteModal(false);
      setSelectedUserId(null);
    } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
      alert('Virhe poistaessa käyttäjää');
    }
  };

  const handleResetPassword = async (userId: string) => {
    if (!confirm('Haluatko varmasti nollata käyttäjän salasanan?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to reset password');

      const data = await response.json();
      alert(`Uusi salasana: ${data.temporaryPassword}\nKäyttäjä saa sähköpostin uudesta salasanasta.`);
    } catch (_) { // eslint-disable-line @typescript-eslint/no-unused-vars
      alert('Virhe nollatessa salasanaa');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!session || session.user.role === 'VIEWER') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Ei käyttöoikeutta</h2>
          <p className="text-slate-600">Sinulla ei ole oikeutta käyttäjähallintaan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                  <Users className="mr-3 h-8 w-8 text-purple-600" />
                  Käyttäjähallinta
                </h1>
                <p className="mt-2 text-slate-600">
                  Hallitse järjestelmän käyttäjiä ja käyttöoikeuksia
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={fetchUsers}
                  className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Päivitä
                </button>

                {canManageUsers && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Lisää käyttäjä
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Hae käyttäjiä..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Role Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="ALL">Kaikki roolit</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="VIEWER">Katselija</option>
                </select>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Yhteensä: {filteredUsers.length} käyttäjää</span>
                <span>Aktiivisia: {filteredUsers.filter(u => u.lastLoginAt).length}</span>
              </div>
            </div>
          </div>

          {/* Users List */}
          {loading ? (
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Ladataan käyttäjiä...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Käyttäjä
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Rooli
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Viimeksi kirjautunut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Luotu
                      </th>
                      {canManageUsers && (
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Toiminnot
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredUsers.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">{user.name}</div>
                              <div className="text-sm text-slate-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleColors[user.role]}`}>
                            {user.role === 'SUPER_ADMIN' && <ShieldCheck className="h-3 w-3 mr-1" />}
                            {user.role === 'ADMIN' && <Shield className="h-3 w-3 mr-1" />}
                            {user.role === 'VIEWER' && <Eye className="h-3 w-3 mr-1" />}
                            {roleLabels[user.role]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {user.lastLoginAt ? (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-green-500 mr-2" />
                              {formatDate(user.lastLoginAt)}
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <AlertCircle className="h-4 w-4 text-slate-400 mr-2" />
                              <span className="text-slate-500">Ei kirjautunut</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                        {canManageUsers && (
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  fetchUserActivities(user.id);
                                }}
                                className="text-slate-400 hover:text-purple-600 transition"
                                title="Näytä aktiviteetit"
                              >
                                <Activity className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowEditModal(true);
                                }}
                                className="text-slate-400 hover:text-blue-600 transition"
                                title="Muokkaa"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleResetPassword(user.id)}
                                className="text-slate-400 hover:text-yellow-600 transition"
                                title="Nollaa salasana"
                              >
                                <Key className="h-4 w-4" />
                              </button>
                              {user.id !== session?.user?.id && (
                                <button
                                  onClick={() => {
                                    setSelectedUserId(user.id);
                                    setShowDeleteModal(true);
                                  }}
                                  className="text-slate-400 hover:text-red-600 transition"
                                  title="Poista"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Ei käyttäjiä</h3>
                  <p className="text-slate-600">Hakuehdoilla ei löytynyt käyttäjiä.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-medium text-slate-900 mb-4">Lisää uusi käyttäjä</h3>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nimi</label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sähköposti</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salasana</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vahvista salasana</label>
                  <input
                    type="password"
                    required
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rooli</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="VIEWER">Katselija</option>
                    {session?.user?.role === 'SUPER_ADMIN' && (
                      <option value="SUPER_ADMIN">Super Admin</option>
                    )}
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                  >
                    Peruuta
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Luo käyttäjä
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-medium text-slate-900 mb-4">Muokkaa käyttäjää</h3>

              <form onSubmit={handleUpdateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nimi</label>
                  <input
                    type="text"
                    required
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sähköposti</label>
                  <input
                    type="email"
                    required
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rooli</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as 'SUPER_ADMIN' | 'ADMIN' | 'VIEWER' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="VIEWER">Katselija</option>
                    {session?.user?.role === 'SUPER_ADMIN' && (
                      <option value="SUPER_ADMIN">Super Admin</option>
                    )}
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedUser(null);
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                  >
                    Peruuta
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Tallenna
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-lg font-medium text-slate-900">Poista käyttäjä</h3>
              </div>

              <p className="text-slate-600 mb-6">
                Oletko varma, että haluat poistaa tämän käyttäjän? Tätä toimintoa ei voi peruuttaa.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUserId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  Peruuta
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Poista
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}