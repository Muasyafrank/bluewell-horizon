import React from 'react';

/**
 * Standard section introduction: optional eyebrow, heading, optional lead.
 * Every page previously hand-rolled this block with its own div/hr/span markup
 * and spacing, so no two sections lined up quite the same.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  as: Heading = 'h2',
  className = '',
  id,
}) {
  const classes = [
    'bw-section-heading',
    align === 'center' ? 'bw-section-heading--center' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {eyebrow ? <p className="bw-eyebrow">{eyebrow}</p> : null}
      <Heading className="mb-3" id={id}>
        {title}
      </Heading>
      {lead ? <p className="bw-lead mb-0">{lead}</p> : null}
    </div>
  );
}
