import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import DataTable, { Column, DataTableFilter } from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { adminApi } from '../services/api';
import { AdminCustomer } from '../types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { adminApi.getCustomers().then(c => { setCustomers(c); setLoading(false); }); }, []);

  const columns: Column<AdminCustomer>[] = [
    { key: 'name', label: 'Name', sortable: true, render: r => <span className="font-medium text-foreground">{r.name}</span> },
    { key: 'email', label: 'Email', sortable: true, render: r => <span className="text-muted-foreground">{r.email}</span> },
    { key: 'joinDate', label: 'Joined', sortable: true, render: r => format(new Date(r.joinDate), 'dd MMM yyyy') },
    { key: 'totalInvites', label: 'Invites', sortable: true },
    { key: 'totalSpent', label: 'Spent', sortable: true, render: r => `₹${r.totalSpent}` },
    { key: 'status', label: 'Status', sortable: true, render: r => <StatusBadge status={r.status} /> },
    { key: 'lastActive', label: 'Last Active', sortable: true, render: r => format(new Date(r.lastActive), 'dd MMM') },
  ];

  const filters: DataTableFilter[] = [
    { key: 'status', label: 'Status', options: [{ label: 'Active', value: 'active' }, { label: 'Suspended', value: 'suspended' }] },
    { key: 'plan', label: 'Plan', options: [{ label: 'Free', value: 'free' }, { label: 'Premium', value: 'premium' }] },
  ];

  return (
    <AdminLayout breadcrumbs={[{ label: 'Customers' }]}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">All Customers</h2>
        <Button size="sm" onClick={() => navigate('/admin/customers/new')}><Plus className="h-4 w-4 mr-1" /> Add Customer</Button>
      </div>
      <DataTable
        tableId="customers"
        columns={columns}
        data={customers}
        loading={loading}
        searchPlaceholder="Search by name or email..."
        filters={filters}
        getRowId={r => r.id}
        onRowClick={r => navigate(`/admin/customers/${r.id}`)}
        bulkActions={[
          { label: 'Export CSV', onClick: () => toast({ title: 'CSV exported' }) },
          { label: 'Suspend', onClick: () => toast({ title: 'Bulk suspend not implemented in demo' }), destructive: true },
        ]}
        emptyMessage="No customers found"
      />
    </AdminLayout>
  );
};

export default Customers;
