import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Image from '../common/Image';
import { resolveIcon } from '../../utils/icons';

/**
 * Service detail dialog. Uses the shared Modal, so it now closes on Escape,
 * traps focus and restores focus to the card that opened it.
 */
export default function ServiceModal({ service, open, onClose }) {
  if (!service) return null;

  const features = Array.isArray(service.features) ? service.features : [];
  const applications = Array.isArray(service.applications) ? service.applications : [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={service.title}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button to="/quote">Request a quote</Button>
        </>
      }
    >
      {service.image ? (
        <Image
          src={service.image}
          alt=""
          className="w-100 rounded-3 mb-4"
          style={{ height: '240px', objectFit: 'cover' }}
        />
      ) : null}

      <p className="bw-prose">{service.description}</p>

      {features.length > 0 ? (
        <section className="mt-4">
          <h3 className="h6 mb-3">What it includes</h3>
          <ul className="list-unstyled mb-0">
            {features.map((feature) => (
              <li className="d-flex align-items-start gap-2 mb-2" key={feature}>
                <FaCheckCircle className="mt-1 flex-shrink-0" style={{ color: 'var(--bw-teal)' }} aria-hidden="true" />
                <span style={{ color: 'var(--bw-text-soft)' }}>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {applications.length > 0 ? (
        <section className="mt-4">
          <h3 className="h6 mb-3">Typical applications</h3>
          <div className="d-flex flex-wrap gap-2">
            {applications.map((application) => {
              const Icon = resolveIcon(application.icon);
              return (
                <Badge key={application.name} icon={<Icon />}>
                  {application.name}
                </Badge>
              );
            })}
          </div>
        </section>
      ) : null}

      {service.benefits ? (
        <section
          className="mt-4 p-4 rounded-3"
          style={{ backgroundColor: 'var(--bw-surface)', borderLeft: '4px solid var(--bw-teal)' }}
        >
          <h3 className="h6 mb-2">Why clients choose it</h3>
          <p className="mb-0 small" style={{ color: 'var(--bw-text-soft)' }}>
            {service.benefits}
          </p>
        </section>
      ) : null}
    </Modal>
  );
}
