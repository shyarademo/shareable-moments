import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { adminApi } from '../services/api';
import { AdminTemplate } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const ALL_SECTIONS = ['hero', 'story', 'schedule', 'gallery', 'venue', 'rsvp'];

const TemplateEdit: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [template, setTemplate] = useState<AdminTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [price, setPrice] = useState(0);
  const [isFree, setIsFree] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [sections, setSections] = useState<string[]>([]);

  useEffect(() => {
    if (!slug) return;
    adminApi.getTemplate(slug).then(t => {
      setTemplate(t); setName(t.name); setCategory(t.category); setTags(t.tags.join(', ')); setPrice(t.price);
      setIsFree(t.isFree); setIsVisible(t.isVisible); setIsFeatured(t.isFeatured); setSections(t.supportedSections);
      setLoading(false);
    }).catch(() => { navigate('/admin/templates'); });
  }, [slug]);

  const handleSave = async () => {
    if (!slug) return;
    setSaving(true);
    try {
      await adminApi.updateTemplate(slug, { name, category, tags: tags.split(',').map(s => s.trim()).filter(Boolean), price: isFree ? 0 : price, isFree, isVisible, isFeatured, supportedSections: sections });
      toast({ title: 'Template updated' });
    } catch { toast({ title: 'Failed to save', variant: 'destructive' }); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <AdminLayout breadcrumbs={[{ label: 'Templates', to: '/admin/templates' }, { label: 'Loading...' }]} requiredPermission="manage_templates">
      <Skeleton className="h-96 rounded-lg" />
    </AdminLayout>
  );

  return (
    <AdminLayout breadcrumbs={[{ label: 'Templates', to: '/admin/templates' }, { label: name }]} requiredPermission="manage_templates">
      <div className="max-w-2xl space-y-6">
        <h2 className="text-lg font-semibold text-foreground">Edit Template</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Slug</Label><Input value={slug} disabled className="bg-muted" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['wedding', 'birthday', 'engagement', 'corporate', 'baby-shower', 'anniversary'].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input value={tags} onChange={e => setTags(e.target.value)} /></div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2"><Switch checked={isFree} onCheckedChange={setIsFree} /><Label>Free template</Label></div>
            <div className="flex items-center gap-2"><Switch checked={isVisible} onCheckedChange={setIsVisible} /><Label>Visible in gallery</Label></div>
            <div className="flex items-center gap-2"><Switch checked={isFeatured} onCheckedChange={setIsFeatured} /><Label>Featured</Label></div>
          </div>

          {!isFree && <div className="space-y-2 max-w-xs"><Label>Price (₹)</Label><Input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} /></div>}

          <div className="space-y-2">
            <Label>Supported Sections</Label>
            <div className="flex flex-wrap gap-3">
              {ALL_SECTIONS.map(s => (
                <label key={s} className="flex items-center gap-1.5 text-sm capitalize cursor-pointer">
                  <Checkbox checked={sections.includes(s)} onCheckedChange={c => setSections(prev => c ? [...prev, s] : prev.filter(x => x !== s))} />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <div className="h-32 w-48 rounded-md border border-border bg-muted flex items-center justify-center text-xs text-muted-foreground">Upload (mocked)</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          <Button variant="outline" onClick={() => navigate('/admin/templates')}>Cancel</Button>
          <Button variant="outline" onClick={() => window.open(`/templates/${slug}/preview`, '_blank')}>View Preview</Button>
        </div>

        {/* Stats */}
        {template && (
          <div className="pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
            <p>Purchases: {template.purchaseCount} · Previews: {template.previewCount} · Active invites: {template.activeInviteCount}</p>
            <p>Added: {template.dateAdded}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TemplateEdit;
