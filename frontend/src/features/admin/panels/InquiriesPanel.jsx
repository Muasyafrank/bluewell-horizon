import React, { useState } from 'react';
import { FaCalendar, FaEnvelope, FaEye, FaPhone, FaTrash } from 'react-icons/fa';
import { adminApi } from '../../../api';
import { Badge, Button, Modal } from '../../../components/ui';
import { formatDateTime } from '../../../utils/format';
import { toastError, toastSuccess } from '../../../utils/toast';

export default function InquiriesPanel({ contacts, token, onChanged }) {
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleView = async (contact) => {
    setViewing(contact);
    if (contact.isRead) return;
    try {
      await adminApi.markContactRead(contact.id, { token });
      onChanged();
    } catch {
      // Marking as read is a courtesy, not critical — the message is already open.
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteContact(deleting.id, { token });
      toastSuccess('Inquiry deleted');
      setDeleting(null);
      onChanged();
    } catch (error) {
      toastError(error.message);
    }
  };

  return (
    <>
      <h2 className="h5 mb-3">Manage inquiries</h2>

      {contacts.length === 0 ? (
        <p className="text-muted text-center py-5 mb-0">No inquiries received yet.</p>
      ) : (
        <div className="bw-table__scroll">
          <table className="bw-table">
            <thead>
              <tr>
                <th scope="col">Status</th>
                <th scope="col">Name</th>
                <th scope="col">Contact</th>
                <th scope="col">Service</th>
                <th scope="col">Date</th>
                <th scope="col" style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} data-unread={!contact.isRead}>
                  <td>
                    {contact.isRead ? <Badge tone="neutral">Read</Badge> : <Badge tone="danger">New</Badge>}
                  </td>
                  <td className="fw-semibold">{contact.name}</td>
                  <td>
                    <span className="d-block small">{contact.email}</span>
                    <span className="d-block text-muted small">{contact.phone}</span>
                  </td>
                  <td><Badge tone="neutral">{contact.service}</Badge></td>
                  <td className="small">{formatDateTime(contact.createdAt)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button type="button" className="bw-icon-btn" aria-label="View inquiry" onClick={() => handleView(contact)}>
                        <FaEye />
                      </button>
                      <button
                        type="button"
                        className="bw-icon-btn bw-icon-btn--danger"
                        aria-label="Delete inquiry"
                        onClick={() => setDeleting(contact)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Inquiry details">
        {viewing ? (
          <>
            <div className="mb-3">
              <small className="text-muted d-block">From</small>
              <p className="fw-semibold mb-1">{viewing.name}</p>
              <p className="small mb-0 d-flex align-items-center gap-1"><FaEnvelope aria-hidden="true" />{viewing.email}</p>
              <p className="small mb-0 d-flex align-items-center gap-1"><FaPhone aria-hidden="true" />{viewing.phone}</p>
            </div>
            <div className="mb-3">
              <small className="text-muted d-block mb-1">Service</small>
              <Badge>{viewing.service}</Badge>
            </div>
            <div className="mb-3">
              <small className="text-muted d-block mb-1">Message</small>
              <div className="bw-card bw-card--tint mb-0">{viewing.message}</div>
            </div>
            <p className="small text-muted d-flex align-items-center gap-1 mb-0">
              <FaCalendar aria-hidden="true" /> {formatDateTime(viewing.createdAt)}
            </p>
          </>
        ) : null}
        <div className="bw-modal__footer px-0 pb-0 pt-4">
          {viewing ? (
            <Button href={`mailto:${viewing.email}`}>Reply by email</Button>
          ) : null}
          <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this inquiry?"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="mb-0">This permanently removes the message from {deleting?.name}.</p>
      </Modal>
    </>
  );
}
