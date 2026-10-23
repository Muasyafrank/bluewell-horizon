import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import { authApi } from '../../api';

jest.mock('../../api', () => ({ authApi: { resetPassword: jest.fn() } }));
jest.mock('../../utils/toast', () => ({ toastSuccess: jest.fn(), toastError: jest.fn() }));
jest.mock('../../components/common', () => ({ SEO: () => null }));

const renderAt = (url) => render(<MemoryRouter initialEntries={[url]}><ResetPassword /></MemoryRouter>);
const fill = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

describe('ResetPassword', () => {
  beforeEach(() => jest.clearAllMocks());

  it('asks for a new link when the token is missing', () => {
    renderAt('/reset-password');
    expect(screen.getByText(/incomplete/i)).toBeTruthy();
    expect(screen.queryByLabelText(/new password/i)).toBeNull();
  });

  it('refuses short or mismatched passwords without calling the server', () => {
    renderAt('/reset-password?token=abc');
    fill(/^new password/i, 'short');
    fill(/confirm/i, 'short');
    fireEvent.click(screen.getByRole('button', { name: /update password/i }));
    expect(screen.getByText(/at least 8/i)).toBeTruthy();
    fill(/^new password/i, 'long-enough-1');
    fill(/confirm/i, 'different-pass');
    fireEvent.click(screen.getByRole('button', { name: /update password/i }));
    expect(screen.getByText(/do not match/i)).toBeTruthy();
    expect(authApi.resetPassword).not.toHaveBeenCalled();
  });

  it('sends the token and the new password', async () => {
    authApi.resetPassword.mockResolvedValue({});
    renderAt('/reset-password?token=abc');
    fill(/^new password/i, 'long-enough-1');
    fill(/confirm/i, 'long-enough-1');
    fireEvent.click(screen.getByRole('button', { name: /update password/i }));
    await waitFor(() => expect(authApi.resetPassword).toHaveBeenCalledWith('abc', 'long-enough-1'));
  });
});
