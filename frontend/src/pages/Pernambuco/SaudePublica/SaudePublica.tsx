import React from 'react';
import CategoryPage from '../../CategoryPage/CategoryPage';

const SaudePublica: React.FC = () => {
  return (
    <CategoryPage
      categorySlug="pernambuco"
      subcategorySlug="saude"
      categoryTitle="Pernambuco"
      subcategoryTitle="Saúde Pública"
    />
  );
};

export default SaudePublica;
