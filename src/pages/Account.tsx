import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';

const Account = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile({ name, email, phone });
      toast({ title: 'Profile updated!', description: 'Your changes have been saved.' });
    } catch {
      toast({ title: 'Failed to update', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    logout();
    toast({ title: 'Account deleted', description: 'Your account has been removed.' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="font-display text-xl font-bold">Shyara</Link>
          <div className="flex items-center gap-4 text-sm font-body">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
            <button onClick={logout} className="text-muted-foreground hover:text-foreground">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container max-w-xl py-12 px-4 space-y-8">
        <h1 className="font-display text-3xl font-bold">Account Settings</h1>

        {/* Profile */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">Profile</h2>
          <div>
            <Label className="font-body text-sm">Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label className="font-body text-sm">Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label className="font-body text-sm">Phone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="mt-1.5" />
          </div>
          <div>
            <Label className="font-body text-sm">Profile Photo</Label>
            <div className="mt-1.5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-display font-bold text-xl">
                {name.charAt(0) || '?'}
              </div>
              <Button variant="outline" size="sm" className="font-body text-xs">Upload Photo</Button>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="font-body">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Password */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">Change Password</h2>
          <div>
            <Label className="font-body text-sm">Current Password</Label>
            <Input type="password" placeholder="••••••••" className="mt-1.5" />
          </div>
          <div>
            <Label className="font-body text-sm">New Password</Label>
            <Input type="password" placeholder="••••••••" className="mt-1.5" />
          </div>
          <Button variant="outline" className="font-body">Update Password</Button>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">Notifications</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-body font-medium">Email on new RSVP</p>
              <p className="text-xs text-muted-foreground font-body">Get notified when a guest responds</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-body font-medium">Weekly summary</p>
              <p className="text-xs text-muted-foreground font-body">Receive a weekly digest of activity</p>
            </div>
            <Switch />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-xl border border-destructive/30 bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-destructive mb-2">Danger Zone</h2>
          <p className="text-sm text-muted-foreground font-body mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button variant="destructive" size="sm" className="font-body" onClick={() => setShowDeleteConfirm(true)}>
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm px-4">
          <div className="bg-card rounded-xl border border-border p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-display text-lg font-semibold mb-2">Delete Account</h3>
            <p className="text-sm text-muted-foreground font-body mb-6">
              This will permanently delete your account, all invitations, and all RSVP data. Are you absolutely sure?
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 font-body" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1 font-body" onClick={handleDelete}>
                Yes, Delete Everything
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
