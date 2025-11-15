import React from 'react';

type HomeSectionTitleProps = {
  title: string;
  children?: React.ReactNode;
};

const HomeSectionTitle: React.FC<HomeSectionTitleProps> = ({ title, children }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div className="flex items-center gap-2">
      <span className="h-2 w-1 rounded-full bg-primary" aria-hidden="true" />
      <h2 className="font-roboto text-xl font-medium capitalize text-dark">{title}</h2>
    </div>
    {children ? <div className="flex items-center gap-3">{children}</div> : null}
  </div>
);

export default HomeSectionTitle;

