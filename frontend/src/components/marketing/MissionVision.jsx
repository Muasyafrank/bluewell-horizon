import React from 'react';
import { FaBullseye, FaEye } from 'react-icons/fa';
import { useReveal } from '../../hooks';
import { MISSION, VISION } from '../../data/company';

function Panel({ tone, icon, content, index }) {
  const ref = useReveal();
  return (
    <article className={`bw-purpose bw-purpose--${tone} bw-reveal`} ref={ref} style={{ '--i': index }}>
      <span className="bw-purpose__watermark" aria-hidden="true">{icon}</span>
      <h2 className="bw-purpose__label">{content.title}</h2>
      <p className="bw-purpose__lead">{content.lead}</p>
      <p className="bw-purpose__body">{content.body}</p>
    </article>
  );
}

/** Mission and vision as two bold, contrasting panels. */
export default function MissionVision() {
  return (
    <section className="bw-section bw-about-purpose">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-6">
            <Panel tone="navy" icon={<FaBullseye />} content={MISSION} index={0} />
          </div>
          <div className="col-lg-6">
            <Panel tone="teal" icon={<FaEye />} content={VISION} index={1} />
          </div>
        </div>
      </div>
    </section>
  );
}
