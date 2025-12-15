import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import HeroCTA from './HeroCTA';

describe('HeroCTA Component', () => {
  it('calls onWatchTrailer when trailer button is clicked', async () => {
    const user = userEvent.setup();
    const handleWatchTrailer = vi.fn();
    render(<HeroCTA onWatchTrailer={handleWatchTrailer} />);

    const trailerButton = screen.getByRole('button', { name: /xem trailer/i });
    await user.click(trailerButton);

    expect(handleWatchTrailer).toHaveBeenCalledTimes(1);
  });

  it('calls onBuyTickets when buy button is clicked', async () => {
    const user = userEvent.setup();
    const handleBuyTickets = vi.fn();
    render(<HeroCTA onBuyTickets={handleBuyTickets} />);

    const buyButton = screen.getByRole('button', { name: /mua vé/i });
    await user.click(buyButton);

    expect(handleBuyTickets).toHaveBeenCalledTimes(1);
  });
});
