import React from 'react';
import { Image } from '../common';

/** Photo tile with the project's category and title laid over its lower edge. */
export default function ProjectTile({ item }) {
  return (
    <figure className="bw-project">
      <Image src={item.image} alt={item.title} />
      <figcaption className="bw-project__caption">
        {item.category ? <span className="bw-project__category">{item.category}</span> : null}
        <h3 className="bw-project__title">{item.title}</h3>
      </figcaption>
    </figure>
  );
}
