import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import DataTable, { Column } from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { adminApi } from '../services/api';
import { AdminTransaction } from '../types';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Unlock } from 'lucide-react';

const FailedPayments: React.FC = () => {
  const { toast } = useToast();
  const { user, hasPermission } = useAdminAuth();
  const [txns, setTxns] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlockTarget, setUnlockTarget] = useState<AdminTransaction | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => { adminApi.getTransactions().then(all => { setTxns(all.filter(t => t.status === 'failed')); setLoading(false); }); }, []);

  const handleUnlock = async () => {
    if (!unlockTarget || !user || !reason.trim()) return;
    try {
      await adminApi.unlockTemplate(unlockTarget.customerId, unlockTarget.templateSlug, reason, user.email);
      toast({ title: `Template "${unlockTarget.templateName}" unlocked for ${unlockTarget.customerName}` });
      setUnlockTarget(null);
      setReason('');
    } catch { toast({ title: 'Failed', variant: 'destructive' }); }
  };

  const columns: Column<AdminTransaction>[] = [
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'templateName', label: 'Template', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, render: r => `₹${r.amount}` },
    { key: 'date', label: 'Date', sortable: true, render: r => format(new Date(r.date), 'dd MMM yyyy, HH:mm') },
    { key: 'failureReason', label: 'Reason', render: r => <span className="text-destructive text-xs">{r.failureReason}</span> },
    { key: 'actions', label: '', hideable: false, render: r => hasPermission('manual_unlock') ? (
      <Button size="sm" variant="outline" className="text-xs h-7" onClick={e => { e.stopPropagation(); setUnlockTarget(r); setReason(''); }}>
        <Unlock className="h-3 w-3 mr-1" /> Unlock
      </Button>
    ) : null },
  ];

  return (
    <AdminLayout breadcrumbs={[{ label: 'Transactions', to: '/admin/transactions' }, { label: 'Failed Payments' }]}>
      <h2 className="text-lg font-semibold text-foreground mb-4">Failed Payments</h2>
      <DataTable tableId="failed-payments" columns={columns} data={txns} loading={loading} searchPlaceholder="Search by customer..." getRowId={r => r.id} emptyMessage="No failed payments" />

      <ConfirmModal open={!!unlockTarget} onOpenChange={() => setUnlockTarget(null)} title="Manually Unlock Template" description={`Unlock "${unlockTarget?.templateName}" for ${unlockTarget?.customerName} without payment?`} confirmLabel="Unlock Template" onConfirm={handleUnlock}>
        <div className="py-3 space-y-2">
          <Label>Reason (required)</Label>
          <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g., Payment failed but customer confirmed via UPI screenshot" className="min-h-[80px]" />
        </div>
      </ConfirmModal>
    </AdminLayout>
  );
};

export default FailedPayments;
