import { useEffect, useState } from 'react';
import './styles.css';
import { MIGRATION_NOTICE_END } from './migrationNotice';

const MAX_TIMEOUT = 2_147_483_647;

export default function MigrationNotice({ now }) {
  const [mountedAt] = useState(() => {
    // A one-time timestamp is required to schedule the notice's expiry.
    return Date.now();
  });
  const effectiveNow = now ?? mountedAt;
  const [isVisible, setIsVisible] = useState(() => effectiveNow < MIGRATION_NOTICE_END);
  const [scheduleVersion, setScheduleVersion] = useState(0);

  useEffect(() => {
    if (now != null || !isVisible) return undefined;

    const remaining = MIGRATION_NOTICE_END - Date.now();
    const timer = window.setTimeout(
      () =>
        remaining <= MAX_TIMEOUT
          ? setIsVisible(false)
          : setScheduleVersion((version) => version + 1),
      Math.max(0, Math.min(remaining, MAX_TIMEOUT))
    );
    return () => window.clearTimeout(timer);
  }, [isVisible, now, scheduleVersion]);

  if (!isVisible) return null;

  return (
    <aside className="MigrationNotice" role="status" aria-label="Site migration">
      <span>FriendsVsFriends.help has moved. Update your bookmark to </span>
      <a href="https://fvf.x3c.ca/">fvf.x3c.ca</a>
      <span>.</span>
    </aside>
  );
}
