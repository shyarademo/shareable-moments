import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Invite } from '@/types';

const statusStyles: Record<string, string> = {
  published: 'bg-accent text-accent-foreground',
  draft: 'bg-secondary text-secondary-foreground',
  expired: 'bg-muted text-muted-foreground',
};

const Dashboard = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    api.getInvites().then(setInvites).finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  const totalRsvps = invites.reduce((sum, i) => sum + i.rsvpCount, 0);
  const activeInvites = invites.filter(i => i.status === 'published').length;

  const handleCopyLink = (slug: string) => {
    navigator.clipboard.writeText(`https://invite.shyara.co.in/i/${slug}`);
    toast({ title: 'Link copied!', description: 'Share it with your guests.' });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteInvite(deleteId);
      setInvites(prev => prev.filter(i => i.id !== deleteId));
      toast({ title: 'Invite deleted' });
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="font-display text-xl font-bold">Shyara</Link>
          <div className="flex items-center gap-4 text-sm font-body">
            <Link to="/dashboard" className="font-medium text-foreground">Dashboard</Link>
            <Link to="/templates" className="text-muted-foreground hover:text-foreground hidden md:inline">Browse</Link>
            <Link to="/account" className="text-muted-foreground hover:text-foreground hidden md:inline">Account</Link>
            <button onClick={logout} className="text-muted-foreground hover:text-foreground">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container py-10 px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Welcome, {user?.name?.split(' ')[0] || 'there'}</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">Manage your invitations</p>
          </div>
          <Button asChild><Link to="/templates">+ Create New Invite</Link></Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
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
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : invites.length === 0 ? (
          <div className="text-center py-20 rounded-xl border border-border bg-card">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="font-display text-xl font-semibold mb-2">No invites yet</h3>
            <p className="text-muted-foreground font-body mb-6">Create your first beautiful invitation</p>
            <Button asChild><Link to="/templates">Browse Templates</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invites.map(inv => (
              <div key={inv.id} className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-36 bg-gradient-to-br from-primary/5 to-accent/30 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground font-body capitalize">{inv.templateSlug.replace('-', ' ')}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-semibold truncate flex-1 mr-2">
                      {inv.slug || 'Untitled Draft'}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-body font-medium capitalize shrink-0 ${statusStyles[inv.status] || statusStyles.expired}`}>
                      {inv.status}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground font-body mb-1">
                    {inv.rsvpCount} RSVPs · {inv.templateCategory.replace('-', ' ')}
                  </p>
                  <p className="text-xs text-muted-foreground font-body mb-4">
                    Updated {new Date(inv.updatedAt).toLocaleDateString()}
                  </p>

                  {inv.status === 'published' && inv.slug && (
                    <button
                      onClick={() => handleCopyLink(inv.slug)}
                      className="w-full text-left text-xs text-gold font-body mb-4 truncate hover:underline cursor-pointer"
                    >
                      📋 invite.shyara.co.in/i/{inv.slug}
                    </button>
                  )}

                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
                      <Link to={
                        inv.status === 'draft'
                          ? `/create/${inv.id}`
                          : `/dashboard/invites/${inv.id}/edit`
                      }>
                        Edit
                      </Link>
                    </Button>
                    {inv.status === 'published' && (
                      <>
                        <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
                          <Link to={`/i/${inv.slug}`} target="_blank">Preview</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
                          <Link to={`/dashboard/invites/${inv.id}/rsvps`}>RSVPs</Link>
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(inv.id)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm px-4">
          <div className="bg-card rounded-xl border border-border p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-display text-lg font-semibold mb-2">Delete Invite</h3>
            <p className="text-sm text-muted-foreground font-body mb-6">
              Are you sure? This will permanently delete this invitation and all its RSVPs. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 font-body" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1 font-body" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
