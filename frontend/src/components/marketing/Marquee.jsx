import React from 'react';

/**
 * Scrolling contact strip.
 * The duplicated half needed for a seamless loop is generated here rather than
 * copy-pasted in the markup, so editing an item no longer means editing it
 * twice. It is hidden from assistive technology because the same details are
 * listed in the page body.
 */
export default function Marquee({ items }) {
  return (
    <div className="bw-marquee" aria-hidden="true">
      <div className="bw-marquee__track">
        {[...items, ...items].map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <span className="bw-marquee__item" key={`${item.label}-${index}`}>
            <span aria-hidden="true">{item.icon}</span>
            <strong>{item.label}:</strong> {item.value}
          </span>
        ))}
      </div>
    </div>
  );
}
