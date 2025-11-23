import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { User } from '@/types';
import { mediaService } from '@/services/api';
import './UserForm.css';

interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: Partial<User>) => Promise<void>;
  isAdmin?: boolean;
  loading?: boolean;
  title?: string;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  isAdmin = false,
  loading = false,
  title = 'Edit Profile',
}) => {
  // ... existing state ...
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    username: '',
    email: '',
    biografia: '',
    urlImagemPerfil: '',
    bannerUrl: '',
    userType: 'USER',
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));

      // Split name into first and last name for the form
      if (initialData.name) {
        const names = initialData.name.split(' ');
        setFirstName(names[0]);
        setLastName(names.slice(1).join(' '));
      }
    }
  }, [initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameChange = (type: 'first' | 'last', value: string) => {
    if (type === 'first') {
      setFirstName(value);
      setFormData((prev) => ({ ...prev, name: `${value} ${lastName}`.trim() }));
    } else {
      setLastName(value);
      setFormData((prev) => ({ ...prev, name: `${firstName} ${value}`.trim() }));
    }
  };

  const handleFileUpload = async (file: File, type: 'banner' | 'profile') => {
    if (type === 'banner') {
      setUploadingBanner(true);
    } else {
      setUploadingProfile(true);
    }

    try {
      const response = await mediaService.uploadFile(file);
      const data = response.data;

      if (data.success) {
        const fullUrl = `http://localhost:8080${data.url}`;
        if (type === 'banner') {
          setFormData((prev) => ({ ...prev, bannerUrl: fullUrl }));
        } else {
          setFormData((prev) => ({ ...prev, urlImagemPerfil: fullUrl }));
        }
      } else {
        alert(`Erro ao fazer upload: ${data.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      if (type === 'banner') {
        setUploadingBanner(false);
      } else {
        setUploadingProfile(false);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const submitData = { ...formData };

    // Fields to never send in updates
    // @ts-ignore
    const { id, token, ...rest } = submitData;

    // Build finalData with only changed/necessary fields
    const finalData: any = {};

    // Always include the name if it changed
    if (rest.name && rest.name !== initialData?.name) {
      finalData.name = rest.name;
    }

    // Always include username if changed (and not empty)
    if (rest.username && rest.username !== initialData?.username) {
      finalData.username = rest.username;
    }

    // Include biografia if changed
    if (rest.biografia !== initialData?.biografia) {
      finalData.biografia = rest.biografia || ''; // Send empty string if cleared
    }

    // Include urlImagemPerfil if changed
    if (rest.urlImagemPerfil !== initialData?.urlImagemPerfil) {
      finalData.urlImagemPerfil = rest.urlImagemPerfil || '';
    }

    // Include bannerUrl if changed
    if (rest.bannerUrl !== initialData?.bannerUrl) {
      finalData.bannerUrl = rest.bannerUrl || '';
    }

    // Include userType if changed and user is admin
    if (isAdmin && rest.userType && rest.userType !== initialData?.userType) {
      finalData.userType = rest.userType;
    }

    // Only include email if admin is editing AND it changed
    if (isAdmin && rest.email && rest.email !== initialData?.email) {
      finalData.email = rest.email;
    }

    // Add password only if it was changed and not empty
    if (password && password.trim() !== '') {
      // @ts-ignore - password is not in User type but handled by backend
      finalData.password = password;
      // @ts-ignore
      if (oldPassword && oldPassword.trim() !== '') {
        finalData.oldPassword = oldPassword;
      }
    }

    await onSubmit(finalData);
  };

  return (
    <form className="user-form-container" onSubmit={handleSubmit}>
      {/* Optional Header if needed, or just use it for accessibility */}
      <h2 className="sr-only">{title}</h2>
      <div className="user-form-grid">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => handleNameChange('first', e.target.value)}
            placeholder="Your First Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => handleNameChange('last', e.target.value)}
            placeholder="Your Last Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">User Name</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username || ''}
            onChange={handleChange}
            placeholder="Your User Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="Your Email"
            disabled={!isAdmin} // Users typically can't change email easily
          />
        </div>

        <div className="form-group">
          <label htmlFor="oldPassword">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Old Password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
          />
        </div>

        {isAdmin && (
          <div className="form-group full-width">
            <label htmlFor="userType">User Role</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="USER">User</option>
              <option value="JOURNALIST">Journalist</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        )}
      </div>

      <div className="banner-section">
        <h3>Add Banner</h3>
        <div className="banner-upload-area">
          {formData.bannerUrl ? (
            <img src={formData.bannerUrl} alt="Banner Preview" className="banner-preview" />
          ) : null}
          <div className="upload-placeholder">
            <i className="fas fa-image upload-icon" />
            {uploadingBanner ? (
              <span>Uploading...</span>
            ) : (
              <>
                <span>Drop Image Here, Paste Or</span>
                <input
                  type="url"
                  className="url-input"
                  name="bannerUrl"
                  value={formData.bannerUrl || ''}
                  onChange={handleChange}
                  placeholder="Enter Banner URL or paste image link"
                  style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
                <div style={{ margin: '10px 0', fontWeight: 'bold' }}>OR</div>
                <input
                  type="file"
                  id="bannerFileInput"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'banner');
                  }}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="bannerFileInput"
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '10px',
                  }}
                >
                  <i className="fas fa-upload" /> Upload from Computer
                </label>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="explanation-image-grid">
        <div className="explanation-section">
          <h3>Explanation</h3>
          <div className="editor-toolbar">
            <button type="button" className="toolbar-btn">
              <i className="fas fa-image" /> Image
            </button>
            <button type="button" className="toolbar-btn">
              <i className="fas fa-pen" /> Color
            </button>
            <button type="button" className="toolbar-btn">
              <i className="fas fa-code" /> Text
            </button>
            <button type="button" className="toolbar-btn">
              <i className="fas fa-align-left" /> Align
            </button>
            <button type="button" className="toolbar-btn">
              <i className="fas fa-link" /> Link
            </button>
          </div>
          <textarea
            className="bio-textarea form-group"
            name="biografia"
            value={formData.biografia || ''}
            onChange={handleChange}
            placeholder="Type your biography here..."
          />
        </div>

        <div className="image-section">
          <h3>Add Image</h3>
          <div className="image-upload-card">
            {formData.urlImagemPerfil ? (
              <img
                src={formData.urlImagemPerfil}
                alt="Profile Preview"
                className="image-preview"
              />
            ) : null}
            <div className="upload-placeholder">
              <i className="fas fa-image upload-icon" />
              {uploadingProfile ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <span>Drop Image Here, Paste Or</span>
                  <input
                    type="url"
                    className="url-input"
                    name="urlImagemPerfil"
                    value={formData.urlImagemPerfil || ''}
                    onChange={handleChange}
                    placeholder="Enter Image URL or paste image link"
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginTop: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  />
                  <div style={{ margin: '10px 0', fontWeight: 'bold' }}>OR</div>
                  <input
                    type="file"
                    id="profileFileInput"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'profile');
                    }}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="profileFileInput"
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginTop: '10px',
                    }}
                  >
                    <i className="fas fa-upload" /> Upload from Computer
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="save-btn" disabled={loading}>
          <i className="fas fa-save" />
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
