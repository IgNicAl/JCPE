import React, { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import Button from '@/components/atoms/Button';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'PESQUISAR',
  onSearch,
  className = '',
  ...props
}) => {
  const [query, setQuery] = useState<string>('');

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onSearch) {
        onSearch(query);
      }
    },
    [query, onSearch]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.searchBar} ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className={styles.searchInput}
        {...props}
      />
      <Button type="submit" className={styles.searchButton}>
        <i className="fas fa-search" />
      </Button>
    </form>
  );
};

export default SearchBar;

