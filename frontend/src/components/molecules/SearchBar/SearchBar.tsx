import React, { useState, useCallback, FormEvent, ChangeEvent } from 'react';
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

