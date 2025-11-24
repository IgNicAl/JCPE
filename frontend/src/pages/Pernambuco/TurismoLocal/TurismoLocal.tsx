import React from 'react';
import CategoryPage from '../../CategoryPage/CategoryPage';

const TurismoLocal: React.FC = () => {
  return (
    <CategoryPage
      categorySlug="pernambuco"
      subcategorySlug="turismo"
      categoryTitle="Pernambuco"
      subcategoryTitle="Turismo Local"
    />
  );
};

export default TurismoLocal;
