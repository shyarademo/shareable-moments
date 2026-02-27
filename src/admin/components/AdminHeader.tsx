import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';
import { GlobalSearchResult } from '../types';
import { Search, Users, FileText, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const AdminHeader: React.FC<{ breadcrumbs?: { label: string; to?: string }[] }> = ({ breadcrumbs = [] }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!query.trim()) { setResults(null); setOpen(false); return; }
    clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      const r = await adminApi.globalSearch(query);
      setResults(r);
      setOpen(true);
    }, 300);
    return () => clearTimeout(debounce.current);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const jump = (path: string) => { setOpen(false); setQuery(''); navigate(path); };

  const hasResults = results && (results.customers.length + results.invites.length + results.transactions.length) > 0;

  return (
    <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-muted-foreground mx-1">/</span>}
            {b.to ? (
              <button onClick={() => navigate(b.to!)} className="text-muted-foreground hover:text-foreground transition-colors">{b.label}</button>
            ) : (
              <span className="text-foreground font-medium">{b.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Global Search */}
      <div className="relative w-72" ref={ref}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results && setOpen(true)}
          placeholder="Search customers, invites, txns..."
          className="pl-9 h-9 text-sm"
        />
        {open && results && (
          <div className="absolute top-full right-0 mt-1 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            {!hasResults && <p className="p-3 text-xs text-muted-foreground text-center">No results found</p>}
            {results.customers.length > 0 && (
              <div>
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground bg-muted/50 flex items-center gap-1"><Users className="h-3 w-3" /> Customers</p>
                {results.customers.map(c => (
                  <button key={c.id} className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 flex justify-between" onClick={() => jump(`/admin/customers/${c.id}`)}>
                    <span className="font-medium text-foreground">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.email}</span>
                  </button>
                ))}
              </div>
            )}
            {results.invites.length > 0 && (
              <div>
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground bg-muted/50 flex items-center gap-1"><FileText className="h-3 w-3" /> Invites</p>
                {results.invites.map(i => (
                  <button key={i.id} className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 flex justify-between" onClick={() => jump(`/admin/invites/${i.id}`)}>
                    <span className="font-medium text-foreground">{i.eventName}</span>
                    <span className="text-xs text-muted-foreground">/{i.slug}</span>
                  </button>
                ))}
              </div>
            )}
            {results.transactions.length > 0 && (
              <div>
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground bg-muted/50 flex items-center gap-1"><CreditCard className="h-3 w-3" /> Transactions</p>
                {results.transactions.map(t => (
                  <button key={t.id} className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 flex justify-between" onClick={() => jump('/admin/transactions')}>
                    <span className="font-medium text-foreground">{t.customerName}</span>
                    <span className="text-xs text-muted-foreground">{t.id}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
