import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/atoms/Button';
import Icon from '@/components/atoms/Icon';
import styles from './SearchBar.module.css';

/**
 * Componente SearchBar para busca
 */
function SearchBar({
  placeholder = 'PESQUISAR',
  onSearch,
  className = '',
  ...props
}) {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  }, [query, onSearch]);

  return (
    <form onSubmit={handleSubmit} className={`${styles.searchBar} ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
        {...props}
      />
      <Button type="submit" className={styles.searchButton}>
        <Icon name="fa-search" />
      </Button>
    </form>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func,
  className: PropTypes.string,
};

export default SearchBar;
