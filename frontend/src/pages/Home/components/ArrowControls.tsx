import React from 'react';

type ArrowControlsProps = {
  disableLeft?: boolean;
};

const baseButtonClass =
  'relative flex h-10 w-10 items-center justify-center rounded-lg bg-gray text-dark transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-50';

const ArrowControls: React.FC<ArrowControlsProps> = ({ disableLeft = false }) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      className={baseButtonClass}
      aria-label="Anterior"
      disabled={disableLeft}
    >
      <i className="fas fa-chevron-left" />
    </button>
    <button type="button" className={baseButtonClass} aria-label="Próximo">
      <i className="fas fa-chevron-right" />
    </button>
  </div>
);

export default ArrowControls;

