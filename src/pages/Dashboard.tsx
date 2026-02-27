import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Invite } from '@/types';

const Dashboard = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    api.getInvites().then(setInvites).finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  const totalRsvps = invites.reduce((sum, i) => sum + i.rsvpCount, 0);
  const activeInvites = invites.filter(i => i.status === 'published').length;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="font-display text-xl font-bold">Shyara</Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm font-body font-medium text-foreground">Dashboard</Link>
            <Link to="/templates" className="text-sm font-body text-muted-foreground hover:text-foreground">Browse</Link>
            <Link to="/account" className="text-sm font-body text-muted-foreground hover:text-foreground">Account</Link>
            <button onClick={logout} className="text-sm font-body text-muted-foreground hover:text-foreground">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container py-10 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Welcome, {user?.name?.split(' ')[0] || 'there'}</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">Manage your invitations</p>
          </div>
          <Button asChild><Link to="/templates">+ Create New Invite</Link></Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Invites', value: invites.length },
            { label: 'Total RSVPs', value: totalRsvps },
            { label: 'Active Invites', value: activeInvites },
          ].map(s => (
            <div key={s.label} className="p-6 rounded-xl border border-border bg-card text-center">
              <p className="text-3xl font-display font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground font-body mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Invites */}
        {loading ? (
          <div className="text-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
        ) : invites.length === 0 ? (
          <div className="text-center py-20 rounded-xl border border-border bg-card">
            <h3 className="font-display text-xl font-semibold mb-2">No invites yet</h3>
            <p className="text-muted-foreground font-body mb-6">Create your first beautiful invitation</p>
            <Button asChild><Link to="/templates">Browse Templates</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invites.map(inv => (
              <div key={inv.id} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="h-32 bg-muted flex items-center justify-center text-muted-foreground text-sm font-body">
                  {inv.templateSlug}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-semibold">{inv.slug || 'Untitled'}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-body font-medium ${
                      inv.status === 'published' ? 'bg-green-100 text-green-700' :
                      inv.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body mb-4">
                    {inv.rsvpCount} RSVPs · {inv.templateCategory.replace('-', ' ')}
                  </p>
                  {inv.status === 'published' && inv.slug && (
                    <p className="text-xs text-gold font-body mb-4 truncate">
                      invite.shyara.co.in/i/{inv.slug}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link to={`/dashboard/invites/${inv.id}/edit`}>Edit</Link>
                    </Button>
                    {inv.status === 'published' && (
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link to={`/dashboard/invites/${inv.id}/rsvps`}>RSVPs</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
