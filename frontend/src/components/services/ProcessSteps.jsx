import React from 'react';

/**
 * How a project runs, start to finish.
 * The numbering is meaningful here — these steps happen in order — so the list
 * is marked up as an ordered list rather than styled divs.
 */
export default function ProcessSteps({ steps }) {
  return (
    <ol className="row g-4 justify-content-center list-unstyled mb-0">
      {steps.map((step) => (
        <li className="col-md-4" key={step.id ?? step.stepNumber}>
          <div className="text-center px-3">
            <span className="bw-feature-icon mx-auto" aria-hidden="true">
              {step.stepNumber}
            </span>
            <h3 className="bw-card__title">{step.title}</h3>
            <p className="bw-card__text">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
