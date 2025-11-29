import React, { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Procure alguma coisa...',
  onSearch,
  className = '',
  ...props
}) => {
  const [query, setQuery] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedQuery = query.trim();
      
      if (!trimmedQuery) {
        return; // Não fazer nada se a busca estiver vazia
      }

      if (onSearch) {
        onSearch(trimmedQuery);
      } else {
        // Navegação padrão para página de busca com query parameter
        navigate(`/busca?q=${encodeURIComponent(trimmedQuery)}`);
      }
      
      // Limpar o input após a busca
      setQuery('');
    },
    [query, onSearch, navigate]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.searchBar} ${className}`}>
      {/* <div className={styles.iconLeft}>
        <i className="fas fa-search" />
      </div> */}
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className={styles.searchInput}
        {...props}
      />
      <button type="submit" className={styles.searchButton}>
        <i className="fas fa-search" />
      </button>
    </form>
  );
};

export default SearchBar;

