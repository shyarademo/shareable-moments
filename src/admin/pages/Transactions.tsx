import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import DataTable, { Column, DataTableFilter } from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { adminApi } from '../services/api';
import { AdminTransaction } from '../types';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, hasPermission } = useAdminAuth();
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundTarget, setRefundTarget] = useState<AdminTransaction | null>(null);
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [refundAmount, setRefundAmount] = useState(0);
  const [keepActive, setKeepActive] = useState<'keep' | 'unpublish'>('keep');

  useEffect(() => { adminApi.getTransactions().then(t => { setTransactions(t); setLoading(false); }); }, []);

  const successTxns = transactions.filter(t => t.status === 'success');
  const totalRevenue = successTxns.reduce((s, t) => s + t.amount, 0);
  const totalRefunds = transactions.filter(t => t.status === 'refunded').reduce((s, t) => s + (t.refundAmount || 0), 0);

  const handleRefund = async () => {
    if (!refundTarget || !user) return;
    const amount = refundType === 'full' ? refundTarget.amount : refundAmount;
    try {
      await adminApi.refundTransaction(refundTarget.id, { amount, keepInviteActive: keepActive === 'keep', adminEmail: user.email });
      setTransactions(prev => prev.map(t => t.id === refundTarget.id ? { ...t, status: 'refunded' as const, refundAmount: amount } : t));
      setRefundTarget(null);
      toast({ title: `Refund of ₹${amount} issued` });
    } catch { toast({ title: 'Refund failed', variant: 'destructive' }); }
  };

  const columns: Column<AdminTransaction>[] = [
    { key: 'id', label: 'ID', render: r => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
    { key: 'customerName', label: 'Customer', sortable: true, render: r => <button className="text-primary hover:underline" onClick={e => { e.stopPropagation(); navigate(`/admin/customers/${r.customerId}`); }}>{r.customerName}</button> },
    { key: 'templateName', label: 'Template', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, render: r => `₹${r.amount}` },
    { key: 'date', label: 'Date', sortable: true, render: r => format(new Date(r.date), 'dd MMM yyyy') },
    { key: 'status', label: 'Status', sortable: true, render: r => <StatusBadge status={r.status} /> },
    { key: 'actions', label: '', hideable: false, render: r => (
      r.status === 'success' && hasPermission('refund') ? (
        <Button size="sm" variant="outline" className="text-xs h-7" onClick={e => { e.stopPropagation(); setRefundTarget(r); setRefundType('full'); setRefundAmount(r.amount); setKeepActive('keep'); }}>Refund</Button>
      ) : null
    )},
  ];

  const filters: DataTableFilter[] = [
    { key: 'status', label: 'Status', options: [{ label: 'Success', value: 'success' }, { label: 'Failed', value: 'failed' }, { label: 'Refunded', value: 'refunded' }] },
  ];

  return (
    <AdminLayout breadcrumbs={[{ label: 'Transactions' }]}>
      <h2 className="text-lg font-semibold text-foreground mb-4">All Transactions</h2>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="border border-border rounded-md p-3 bg-card">
          <p className="text-xs text-muted-foreground">Total Revenue</p>
          <p className="text-xl font-bold text-emerald-600">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="border border-border rounded-md p-3 bg-card">
          <p className="text-xs text-muted-foreground">Total Refunds</p>
          <p className="text-xl font-bold text-orange-500">₹{totalRefunds.toLocaleString()}</p>
        </div>
        <div className="border border-border rounded-md p-3 bg-card">
          <p className="text-xs text-muted-foreground">Net Revenue</p>
          <p className="text-xl font-bold text-foreground">₹{(totalRevenue - totalRefunds).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/transactions/failed')}>View Failed Payments</Button>
      </div>

      <DataTable tableId="transactions" columns={columns} data={transactions} loading={loading} searchPlaceholder="Search by customer, ID..." filters={filters} getRowId={r => r.id} bulkActions={[{ label: 'Export CSV', onClick: () => toast({ title: 'CSV exported' }) }]} emptyMessage="No transactions found" />

      {/* Refund Modal */}
      <ConfirmModal open={!!refundTarget} onOpenChange={() => setRefundTarget(null)} title="Issue Refund" description={`Refunding ${refundTarget?.customerName} for ${refundTarget?.templateName}`} confirmLabel={`Refund ₹${refundType === 'full' ? refundTarget?.amount : refundAmount}`} destructive onConfirm={handleRefund}>
        <div className="space-y-4 py-3">
          <div>
            <Label className="text-sm font-medium mb-2 block">Refund Amount</Label>
            <RadioGroup value={refundType} onValueChange={v => setRefundType(v as 'full' | 'partial')} className="flex gap-4">
              <div className="flex items-center gap-2"><RadioGroupItem value="full" /><Label>Full (₹{refundTarget?.amount})</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="partial" /><Label>Partial</Label></div>
            </RadioGroup>
            {refundType === 'partial' && <Input type="number" value={refundAmount} onChange={e => setRefundAmount(Number(e.target.value))} max={refundTarget?.amount} className="mt-2 w-32" />}
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">After Refund</Label>
            <RadioGroup value={keepActive} onValueChange={v => setKeepActive(v as 'keep' | 'unpublish')} className="flex gap-4">
              <div className="flex items-center gap-2"><RadioGroupItem value="keep" /><Label>Keep invite active</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem value="unpublish" /><Label>Unpublish invite</Label></div>
            </RadioGroup>
          </div>
        </div>
      </ConfirmModal>
    </AdminLayout>
  );
};

export default Transactions;
