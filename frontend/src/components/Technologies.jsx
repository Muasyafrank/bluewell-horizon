import React from 'react';
import { technologies } from '../data/data';

const Technologies = () => (
  <section id="technologies" className="section-dark section-dark-alt">
    <div className="container">
      <div className="row mb-5">
        <div className="col-lg-8">
          <div className="section-label">Technologies</div>
          <h2 className="section-title">Powered by advanced<br />water treatment tech</h2>
          <p className="section-subtitle">
            We utilize cutting-edge technologies to deliver efficient, reliable, and sustainable purification solutions.
          </p>
        </div>
      </div>

      <div className="d-flex flex-wrap">
        {technologies.map((tech, index) => (
          <span key={index} className="tech-badge-dark">{tech}</span>
        ))}
      </div>
    </div>
  </section>
);

export default Technologies;