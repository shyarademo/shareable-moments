import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import DataTable, { Column, DataTableFilter } from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { adminApi } from '../services/api';
import { AdminInvite } from '../types';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ExternalLink, Ban, RefreshCw } from 'lucide-react';

const Invites: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAdminAuth();
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminApi.getInvites().then(i => { setInvites(i); setLoading(false); }); }, []);

  const handleTakedown = async (inv: AdminInvite) => {
    try {
      await adminApi.takedownInvite(inv.id, user?.email || '');
      setInvites(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'taken-down' as const } : i));
      toast({ title: 'Invite taken down' });
    } catch { toast({ title: 'Failed', variant: 'destructive' }); }
  };

  const handleRepublish = async (inv: AdminInvite) => {
    try {
      await adminApi.republishInvite(inv.id, user?.email || '');
      setInvites(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'published' as const } : i));
      toast({ title: 'Invite re-published' });
    } catch { toast({ title: 'Failed', variant: 'destructive' }); }
  };

  const columns: Column<AdminInvite>[] = [
    { key: 'eventName', label: 'Event', sortable: true, render: r => <span className="font-medium text-foreground">{r.eventName}</span> },
    { key: 'customerName', label: 'Customer', sortable: true, render: r => <button onClick={e => { e.stopPropagation(); navigate(`/admin/customers/${r.customerId}`); }} className="text-primary hover:underline text-sm">{r.customerName}</button> },
    { key: 'templateName', label: 'Template', sortable: true },
    { key: 'templateCategory', label: 'Category', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: r => <StatusBadge status={r.status} /> },
    { key: 'slug', label: 'Slug', render: r => <span className="font-mono text-xs text-muted-foreground">/{r.slug}</span> },
    { key: 'rsvpCount', label: 'RSVPs', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true, render: r => format(new Date(r.createdAt), 'dd MMM yyyy') },
    { key: 'actions', label: '', hideable: false, render: r => (
      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
        {r.slug && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => window.open(`/i/${r.slug}`, '_blank')}><ExternalLink className="h-3.5 w-3.5" /></Button>}
        {r.status === 'published' && <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleTakedown(r)}><Ban className="h-3.5 w-3.5" /></Button>}
        {r.status === 'taken-down' && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRepublish(r)}><RefreshCw className="h-3.5 w-3.5" /></Button>}
      </div>
    )},
  ];

  const filters: DataTableFilter[] = [
    { key: 'status', label: 'Status', options: [{ label: 'Published', value: 'published' }, { label: 'Draft', value: 'draft' }, { label: 'Expired', value: 'expired' }, { label: 'Taken Down', value: 'taken-down' }] },
    { key: 'templateCategory', label: 'Category', options: [{ label: 'Wedding', value: 'wedding' }, { label: 'Birthday', value: 'birthday' }, { label: 'Engagement', value: 'engagement' }, { label: 'Corporate', value: 'corporate' }, { label: 'Baby Shower', value: 'baby-shower' }, { label: 'Anniversary', value: 'anniversary' }] },
  ];

  return (
    <AdminLayout breadcrumbs={[{ label: 'Invites' }]}>
      <h2 className="text-lg font-semibold text-foreground mb-4">All Invites</h2>
      <DataTable tableId="invites" columns={columns} data={invites} loading={loading} searchPlaceholder="Search by event, customer, slug..." filters={filters} getRowId={r => r.id} onRowClick={r => navigate(`/admin/invites/${r.id}`)} bulkActions={[{ label: 'Export CSV', onClick: () => toast({ title: 'CSV exported' }) }]} emptyMessage="No invites found" />
    </AdminLayout>
  );
};

export default Invites;
