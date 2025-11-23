import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '@/services/api';
import { User } from '@/types';
import UserForm from '@/components/organisms/UserForm/UserForm';
import './EditUser.css';

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await userService.getUserById(id);
        setInitialData(response.data as User);
      } catch (error) {
        setError('Erro ao carregar dados do usuário.');
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (data: Partial<User>) => {
    if (!id) return;
    setSaving(true);
    setError('');
    try {
      await userService.updateUser(id, data);
      alert('Usuário atualizado com sucesso!');
      navigate('/painel/usuarios');
    } catch (error) {
      setError('Erro ao atualizar usuário. Tente novamente.');
      console.error('Erro ao atualizar:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="edit-user-container">Carregando...</div>;
  }

  if (error) {
    return <div className="edit-user-container error">{error}</div>;
  }

  if (!initialData) {
    return <div className="edit-user-container">Usuário não encontrado.</div>;
  }

  return (
    <div className="edit-user-page">
      <div className="edit-user-header-wrapper">
        <h1>
          <i className="fas fa-user-edit" /> Editar Usuário
        </h1>
        <p>
          Editando usuário: <strong>{initialData.name}</strong>
        </p>
      </div>

      <UserForm
        initialData={initialData}
        onSubmit={handleSubmit}
        loading={saving}
        isAdmin={true}
        title="Editar Usuário"
      />
    </div>
  );
};

export default EditUser;
