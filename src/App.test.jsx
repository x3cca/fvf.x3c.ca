import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import App from './App';

afterEach(() => {
  cleanup();
  window.history.replaceState({}, '', '/');
});

describe('App deck interactions', () => {
  it('adds a card and writes the deck to browser history', async () => {
    const user = userEvent.setup();
    render(<App />);

    const card = screen.getByRole('button', { name: 'Add Big Head to deck' });
    expect(card).toHaveAttribute('aria-pressed', 'false');

    await user.click(card);

    expect(window.location.search).toBe('?deck=1');
    expect(
      screen.getAllByRole('button', { name: 'Remove Big Head from deck' })
    ).toHaveLength(2);
  });

  it('announces the new domain and shares its canonical URL', () => {
    window.history.replaceState({}, '', '/?deck=1');
    render(<App />);

    expect(screen.getByRole('status', { name: 'Site migration' })).toHaveTextContent(
      'FriendsVsFriends.help has moved'
    );
    expect(screen.getByRole('link', { name: 'fvf.x3c.ca' })).toHaveAttribute(
      'href',
      'https://fvf.x3c.ca/'
    );
    expect(screen.getByDisplayValue('https://fvf.x3c.ca/?deck=1')).toBeInTheDocument();
  });

  it('canonicalizes malformed deck URLs without losing valid cards', async () => {
    window.history.replaceState({}, '', '/?deck=9999.1.1.nope');
    render(<App />);

    await waitFor(() => expect(window.location.search).toBe('?deck=1'));
    expect(
      screen.getAllByRole('button', { name: 'Remove Big Head from deck' })
    ).toHaveLength(2);
  });

  it('keeps menus and the modal mounted for entry and exit animations', async () => {
    const user = userEvent.setup();
    render(<App />);

    const loadMenu = document.querySelector('.LoadMenu');
    const modal = document.querySelector('.modal');

    expect(loadMenu).toHaveAttribute('aria-hidden', 'true');
    expect(loadMenu).not.toHaveClass('open');
    expect(modal).toHaveAttribute('aria-hidden', 'true');
    expect(modal).not.toHaveClass('open');

    await user.click(screen.getByRole('button', { name: 'Load' }));
    expect(loadMenu).toHaveAttribute('aria-hidden', 'false');
    expect(loadMenu).toHaveClass('open');
    expect(screen.getByText('your name')).toHaveClass('playerNameHint');
    expect(loadMenu).toHaveTextContent(
      'Located in: /Users/your name/AppData/LocalLow/Brainwash Gang/Friends vs Friends/player.log'
    );

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(modal).toHaveAttribute('aria-hidden', 'false');
    expect(modal).toHaveClass('open');

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(modal).toHaveAttribute('aria-hidden', 'true');
    expect(modal).not.toHaveClass('open');
  });
});
