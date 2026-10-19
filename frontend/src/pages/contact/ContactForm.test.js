import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ContactForm from './ContactForm';
import { enquiriesApi } from '../../api';

jest.mock('../../api', () => ({ enquiriesApi: { submitContact: jest.fn() } }));
jest.mock('../../utils/toast', () => ({ toastSuccess: jest.fn(), toastError: jest.fn() }));

const fill = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

function fillValidForm() {
  fill(/full name/i, 'Jane Doe');
  fill(/email address/i, 'jane@example.com');
  fill(/phone number/i, '0712345678');
  fill(/what do you need/i, 'Water purification');
  fill(/your message/i, 'Brown water in Kiambu.');
}

describe('ContactForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('shows an error for every empty field and sends nothing', () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(enquiriesApi.submitContact).not.toHaveBeenCalled();
    expect(screen.getByText('Tell us your name')).toBeTruthy();
    expect(screen.getByText('Choose what you need help with')).toBeTruthy();
    expect(screen.getByText('Tell us a little about your water')).toBeTruthy();
  });

  it('rejects an invalid email and phone number', () => {
    render(<ContactForm />);
    fillValidForm();
    fill(/email address/i, 'not-an-email');
    fill(/phone number/i, '123');
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(enquiriesApi.submitContact).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/email address/i).getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByLabelText(/phone number/i).getAttribute('aria-invalid')).toBe('true');
  });

  it('submits the form values, then confirms and clears the form', async () => {
    enquiriesApi.submitContact.mockResolvedValue({});
    render(<ContactForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/message received/i)).toBeTruthy();
    expect(enquiriesApi.submitContact).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '0712345678',
      service: 'Water purification',
      message: 'Brown water in Kiambu.',
    });
    expect(screen.getByLabelText(/full name/i).value).toBe('');
  });

  it('keeps what the visitor typed when sending fails', async () => {
    enquiriesApi.submitContact.mockRejectedValue(new Error('Server down'));
    render(<ContactForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(enquiriesApi.submitContact).toHaveBeenCalled());
    expect(screen.queryByText(/message received/i)).toBeNull();
    expect(screen.getByLabelText(/full name/i).value).toBe('Jane Doe');
  });
});
