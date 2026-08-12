import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import MigrationNotice, { MIGRATION_NOTICE_END } from '.';

afterEach(cleanup);

describe('MigrationNotice', () => {
  it('stops displaying after the old domain expires', () => {
    render(<MigrationNotice now={MIGRATION_NOTICE_END} />);

    expect(screen.queryByRole('status', { name: 'Site migration' })).toBeNull();
  });
});
