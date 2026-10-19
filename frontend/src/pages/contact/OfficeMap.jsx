import React from 'react';
import { FaDirections } from 'react-icons/fa';
import { Button } from '../../components/ui';
import { CONTACT_DETAILS } from '../../data/company';

/** Embedded map with a directions button. */
export default function OfficeMap() {
  return (
    <>
      <div className="bw-map">
        <iframe
          src={CONTACT_DETAILS.mapsEmbed}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Map showing the Bluewell Horizon office in Harambee Estate, Nairobi"
        />
      </div>
      <div className="mt-3">
        <Button
          href={CONTACT_DETAILS.mapsDirections}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          icon={<FaDirections aria-hidden="true" />}
        >
          Get directions
        </Button>
      </div>
    </>
  );
}
