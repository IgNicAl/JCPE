import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { userService } from '@/services/api';
import UserForm from '@/components/organisms/UserForm/UserForm';
import { User } from '@/types';
import './EditProfile.css';

const EditProfile: React.FC = () => {
  const { user, login } = useAuth(); // login is used to update the context
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Partial<User>>({});

  useEffect(() => {
    if (user) {
      setInitialData(user);
    }
  }, [user]);

  const handleSubmit = async (data: Partial<User>) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      // Update user in backend using the correct endpoint for self-profile update
      await userService.updateMyProfile(data);

      // Update local context
      // CRITICAL: We must preserve the token and other sensitive data
      // Only update the fields that were actually sent, don't rely on backend response
      const updatedUser = {
        ...user,  // Start with current user (includes token, id, etc)
        ...data   // Merge only the data we sent (which doesn't include token/id)
      };

      login(updatedUser as User); // This updates the AuthContext and localStorage

      alert('Perfil atualizado com sucesso!');
      navigate('/perfil');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Falha ao atualizar perfil. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <UserForm
        initialData={initialData}
        onSubmit={handleSubmit}
        loading={loading}
        isAdmin={false}
        title="Editar Perfil"
      />
    </div>
  );
};

export default EditProfile;
