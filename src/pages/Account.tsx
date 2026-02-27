import { Link } from 'react-router-dom';

const Account = () => (
  <div className="min-h-screen bg-background">
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-display text-xl font-bold">Shyara</Link>
        <Link to="/dashboard" className="text-sm text-muted-foreground font-body hover:text-foreground">← Dashboard</Link>
      </div>
    </nav>
    <div className="container py-12 px-4 text-center">
      <h1 className="font-display text-3xl font-bold mb-4">Account Settings</h1>
      <p className="text-muted-foreground font-body">Profile editing coming in Phase 5.</p>
    </div>
  </div>
);

export default Account;
