import { render, screen } from '@testing-library/react';
import App from './App';

// The previous test asserted text ("learn react") that has never existed in
// this app, so it either failed or was skipped; either way it verified
// nothing. This smoke test renders the real home route instead.
test('renders the home page navigation', async () => {
  render(<App />);
  const nav = await screen.findByRole('navigation', { name: /main/i });
  expect(nav).toBeInTheDocument();
});
