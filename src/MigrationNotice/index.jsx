import './styles.css';

export default function MigrationNotice() {
  return (
    <aside className="MigrationNotice" role="status" aria-label="Site migration">
      <span>FriendsVsFriends.help has moved. Update your bookmark to </span>
      <a href="https://fvf.x3c.ca/">fvf.x3c.ca</a>
      <span>.</span>
    </aside>
  );
}
