import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { adminApi } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

const ALL_SECTIONS = ['hero', 'story', 'schedule', 'gallery', 'venue', 'rsvp'];

const AddTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('wedding');
  const [tags, setTags] = useState('');
  const [price, setPrice] = useState(499);
  const [isFree, setIsFree] = useState(false);
  const [sections, setSections] = useState<string[]>(['hero', 'rsvp']);
  const [saving, setSaving] = useState(false);

  const autoSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleNameChange = (v: string) => { setName(v); if (!slug || slug === autoSlug(name)) setSlug(autoSlug(v)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.createTemplate({ slug, name, category, tags: tags.split(',').map(s => s.trim()).filter(Boolean), price: isFree ? 0 : price, isFree, isVisible: true, isFeatured: false, thumbnail: '/placeholder.svg', supportedSections: sections });
      toast({ title: 'Template config created' });
      navigate('/admin/templates');
    } catch { toast({ title: 'Failed', variant: 'destructive' }); }
    finally { setSaving(false); }
  };

  return (
    <AdminLayout breadcrumbs={[{ label: 'Templates', to: '/admin/templates' }, { label: 'Add Template' }]} requiredPermission="manage_templates">
      <div className="max-w-2xl">
        <div className="flex items-start gap-3 p-3 rounded-md bg-amber-50 border border-amber-200 mb-6 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>After saving the config here, the template component files must be added to the codebase by a developer at <code className="bg-amber-100 px-1 rounded text-xs">src/templates/[category]/[slug]/</code>.</p>
        </div>

        <h2 className="text-lg font-semibold text-foreground mb-4">Add New Template</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={e => handleNameChange(e.target.value)} required /></div>
            <div className="space-y-2"><Label>Slug</Label><Input value={slug} onChange={e => setSlug(e.target.value)} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{['wedding', 'birthday', 'engagement', 'corporate', 'baby-shower', 'anniversary'].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Tags</Label><Input value={tags} onChange={e => setTags(e.target.value)} placeholder="elegant, gold, premium" /></div>
          </div>
          <div className="flex items-center gap-6"><div className="flex items-center gap-2"><Switch checked={isFree} onCheckedChange={setIsFree} /><Label>Free template</Label></div></div>
          {!isFree && <div className="space-y-2 max-w-xs"><Label>Price (₹)</Label><Input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} /></div>}
          <div className="space-y-2">
            <Label>Supported Sections</Label>
            <div className="flex flex-wrap gap-3">{ALL_SECTIONS.map(s => (
              <label key={s} className="flex items-center gap-1.5 text-sm capitalize cursor-pointer"><Checkbox checked={sections.includes(s)} onCheckedChange={c => setSections(prev => c ? [...prev, s] : prev.filter(x => x !== s))} />{s}</label>
            ))}</div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create Template Config'}</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/templates')}>Cancel</Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddTemplate;
