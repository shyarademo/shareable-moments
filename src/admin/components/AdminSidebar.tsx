import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import {
  LayoutDashboard, Users, FileText, Palette, CreditCard, FolderTree,
  Tag, Megaphone, Settings, LogOut, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusBadge from './StatusBadge';

interface NavItem { label: string; to: string; icon: React.ElementType; permission?: string }
interface NavSection { title: string; items: NavItem[] }

const sections: NavSection[] = [
  { title: '', items: [
    { label: 'Overview', to: '/admin', icon: LayoutDashboard },
  ]},
  { title: 'Management', items: [
    { label: 'Customers', to: '/admin/customers', icon: Users },
    { label: 'Invites', to: '/admin/invites', icon: FileText },
    { label: 'Templates', to: '/admin/templates', icon: Palette, permission: 'manage_templates' },
  ]},
  { title: 'Finance', items: [
    { label: 'Transactions', to: '/admin/transactions', icon: CreditCard },
  ]},
  { title: 'Configuration', items: [
    { label: 'Categories', to: '/admin/categories', icon: FolderTree, permission: 'manage_categories' },
    { label: 'Promo Codes', to: '/admin/promo-codes', icon: Tag, permission: 'manage_promo_codes' },
    { label: 'Announcements', to: '/admin/announcements', icon: Megaphone },
    { label: 'Settings', to: '/admin/settings', icon: Settings, permission: 'manage_settings' },
  ]},
];

const AdminSidebar: React.FC = () => {
  const { user, logout, hasPermission } = useAdminAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-60 min-h-screen flex flex-col border-r border-border" style={{ background: 'hsl(220 20% 10%)' }}>
      {/* Logo */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'hsl(220 15% 18%)' }}>
        <h1 className="text-base font-bold font-body" style={{ color: 'hsl(0 0% 95%)' }}>Shyara Admin</h1>
        <p className="text-xs mt-0.5" style={{ color: 'hsl(220 10% 55%)' }}>Internal Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
        {sections.map((section, si) => {
          const visibleItems = section.items.filter(item =>
            !item.permission || hasPermission(item.permission as any)
          );
          if (visibleItems.length === 0) return null;
          return (
            <div key={si}>
              {section.title && (
                <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'hsl(220 10% 45%)' }}>
                  {section.title}
                </p>
              )}
              {visibleItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-0.5',
                    isActive(item.to)
                      ? 'text-white'
                      : 'hover:text-white'
                  )}
                  style={isActive(item.to) ? { background: 'hsl(220 15% 18%)', color: 'white' } : { color: 'hsl(220 10% 60%)' }}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t" style={{ borderColor: 'hsl(220 15% 18%)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'hsl(220 15% 20%)', color: 'hsl(0 0% 80%)' }}>
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: 'hsl(0 0% 90%)' }}>{user?.name}</p>
            <StatusBadge status={user?.role || 'admin'} className="mt-0.5" />
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-xs font-medium transition-colors hover:bg-white/5" style={{ color: 'hsl(220 10% 55%)' }}>
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
