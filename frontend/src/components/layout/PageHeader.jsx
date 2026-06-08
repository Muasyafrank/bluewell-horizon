import React from 'react';

const PageHeader = ({ title, subtitle }) => (
  <section className="page-header-section">
    <div className="container text-center">
      <h1 className="page-header-title">{title}</h1>
      {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
    </div>
  </section>
);

export default PageHeader;