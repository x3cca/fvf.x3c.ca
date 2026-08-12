import './styles.css';

export const MIGRATION_NOTICE_END = Date.parse('2026-10-23T00:00:00-07:00');

export default function MigrationNotice({ now = Date.now() }) {
  if (now >= MIGRATION_NOTICE_END) return null;

  return (
    <aside className="MigrationNotice" role="status" aria-label="Site migration">
      <span>FriendsVsFriends.help has moved. Update your bookmark to </span>
      <a href="https://fvf.x3c.ca/">fvf.x3c.ca</a>
      <span>.</span>
    </aside>
  );
}
