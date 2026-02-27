import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { adminApi } from '../services/api';
import { AdminSettings } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { adminApi.getSettings().then(s => { setSettings(s); setLoading(false); }); }, []);

  const update = (partial: Partial<AdminSettings>) => setSettings(prev => prev ? { ...prev, ...partial } : prev);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await adminApi.updateSettings(settings);
      toast({ title: 'Settings saved' });
    } catch { toast({ title: 'Failed', variant: 'destructive' }); }
    finally { setSaving(false); }
  };

  if (loading) return <AdminLayout breadcrumbs={[{ label: 'Settings' }]} requiredPermission="manage_settings"><Skeleton className="h-96 rounded-lg" /></AdminLayout>;

  return (
    <AdminLayout breadcrumbs={[{ label: 'Settings' }]} requiredPermission="manage_settings">
      <div className="max-w-2xl space-y-8">
        <h2 className="text-lg font-semibold text-foreground">Platform Settings</h2>

        {/* Currency */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Currency</h3>
          <Select value={settings!.currency} onValueChange={v => update({ currency: v as AdminSettings['currency'] })}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">₹ INR (Indian Rupee)</SelectItem>
              <SelectItem value="USD">$ USD (US Dollar)</SelectItem>
              <SelectItem value="SGD">S$ SGD (Singapore Dollar)</SelectItem>
              <SelectItem value="IDR">Rp IDR (Indonesian Rupiah)</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Pricing */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Pricing Defaults</h3>
          <div className="space-y-2 max-w-xs"><Label>Default premium template price</Label><Input type="number" value={settings!.defaultPremiumPrice} onChange={e => update({ defaultPremiumPrice: Number(e.target.value) })} /></div>
        </section>

        {/* File Sizes */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Asset Size Limits (MB)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Cover Image</Label><Input type="number" value={settings!.maxFileSizes.coverImage} onChange={e => update({ maxFileSizes: { ...settings!.maxFileSizes, coverImage: Number(e.target.value) } })} /></div>
            <div className="space-y-2"><Label>Gallery Photo</Label><Input type="number" value={settings!.maxFileSizes.galleryPhoto} onChange={e => update({ maxFileSizes: { ...settings!.maxFileSizes, galleryPhoto: Number(e.target.value) } })} /></div>
            <div className="space-y-2"><Label>Intro Animation</Label><Input type="number" value={settings!.maxFileSizes.introAnimation} onChange={e => update({ maxFileSizes: { ...settings!.maxFileSizes, introAnimation: Number(e.target.value) } })} /></div>
          </div>
        </section>

        {/* RSVP */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">RSVP Settings</h3>
          <div className="space-y-2 max-w-xs"><Label>Default deadline (days before event)</Label><Input type="number" value={settings!.rsvpDeadlineDays} onChange={e => update({ rsvpDeadlineDays: Number(e.target.value) })} /></div>
        </section>

        {/* Maintenance */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Maintenance Mode</h3>
          <div className="flex items-center gap-3">
            <Switch checked={settings!.maintenanceMode} onCheckedChange={v => update({ maintenanceMode: v })} />
            <span className="text-sm text-muted-foreground">{settings!.maintenanceMode ? 'ON — Customer site shows maintenance banner' : 'OFF'}</span>
          </div>
        </section>

        {/* Feature Flags */}
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Feature Flags</h3>
          <div className="space-y-2">
            {settings!.featureFlags.map((ff, i) => (
              <div key={ff.id} className="flex items-center justify-between p-3 border border-border rounded-md bg-card">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{ff.label}</p>
                  <p className="text-xs text-muted-foreground">{ff.description}</p>
                </div>
                <Switch checked={ff.enabled} onCheckedChange={v => {
                  const flags = [...settings!.featureFlags];
                  flags[i] = { ...flags[i], enabled: v };
                  update({ featureFlags: flags });
                }} />
              </div>
            ))}
          </div>
        </section>

        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
      </div>
    </AdminLayout>
  );
};

export default Settings;
