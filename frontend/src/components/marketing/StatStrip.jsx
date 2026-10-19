import React from 'react';

/** White strip of headline numbers, meant for PageHero's `overlap` slot. */
export default function StatStrip({ stats }) {
  return (
    <dl className="bw-stat-strip">
      {stats.map((stat) => (
        <div className="bw-stat-strip__item" key={stat.label}>
          <dt className="bw-stat-strip__label">{stat.label}</dt>
          <dd className="bw-stat-strip__value">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
