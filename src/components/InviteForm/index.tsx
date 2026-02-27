import { useState, useCallback, useMemo, useRef, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TemplateConfig, Invite } from '@/types';
import { api } from '@/services/api';
import { getTemplateRenderer } from '@/templates/registry';
import { useToast } from '@/hooks/use-toast';
import FieldRenderer from './FieldRenderer';
import SlugPicker from './SlugPicker';

interface InviteFormProps {
  config: TemplateConfig;
  invite: Invite;
  isEditing?: boolean;
}

const sectionLabels: Record<string, string> = {
  basic: 'Basic Information',
  venue: 'Venue Details',
  story: 'Your Story',
  schedule: 'Event Schedule',
  gallery: 'Photos & Gallery',
  rsvp: 'RSVP Settings',
  settings: 'Additional Settings',
};

const sectionOrder = ['basic', 'venue', 'story', 'schedule', 'gallery', 'rsvp', 'settings'];

const InviteForm = ({ config, invite, isEditing = false }: InviteFormProps) => {
  const [formData, setFormData] = useState<Record<string, any>>(invite.data || {});
  const [slug, setSlug] = useState(invite.slug || '');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debounced preview data
  const [previewData, setPreviewData] = useState<Record<string, any>>(formData);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setPreviewData({ ...formData });
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [formData]);

  const handleFieldChange = useCallback((key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  // Group fields by section
  const fieldsBySection = useMemo(() => {
    const groups: Record<string, typeof config.fields> = {};
    config.fields.forEach(field => {
      const section = field.section || 'basic';
      if (!groups[section]) groups[section] = [];
      groups[section].push(field);
    });
    return groups;
  }, [config.fields]);

  // Slug suggestion
  const slugSuggestion = useMemo(() => {
    const parts: string[] = [];
    if (formData.brideName && formData.groomName) {
      parts.push(formData.brideName, 'and', formData.groomName);
    } else if (formData.partnerOneName && formData.partnerTwoName) {
      parts.push(formData.partnerOneName, 'and', formData.partnerTwoName);
    } else if (formData.celebrantName) {
      parts.push(formData.celebrantName, 'birthday');
    } else if (formData.eventName) {
      parts.push(formData.eventName);
    } else if (formData.coupleNames) {
      parts.push(formData.coupleNames, 'anniversary');
    }
    return parts.join('-').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || '';
  }, [formData]);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await api.updateInvite(invite.id, { data: formData, slug });
      toast({ title: 'Draft saved!', description: 'Your progress has been saved.' });
    } catch {
      toast({ title: 'Failed to save', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    // Validate required fields
    const missing = config.fields.filter(f => f.required && !formData[f.key]);
    if (missing.length > 0) {
      toast({
        title: 'Missing required fields',
        description: missing.map(f => f.label).join(', '),
        variant: 'destructive',
      });
      return;
    }
    if (!slug) {
      toast({ title: 'Please set a URL slug', variant: 'destructive' });
      return;
    }

    setPublishing(true);
    try {
      if (isEditing) {
        await api.updateInvite(invite.id, { data: formData, status: 'published', slug });
        toast({ title: 'Invite updated!', description: 'Changes are now live.' });
        navigate('/dashboard');
      } else {
        const result = await api.createInvite({
          templateSlug: config.slug,
          templateCategory: config.category,
          slug,
          eventData: formData,
        });
        navigate(`/publish-success/${result.id}`);
      }
    } catch {
      toast({ title: 'Failed to publish', variant: 'destructive' });
    } finally {
      setPublishing(false);
    }
  };

  const TemplateRenderer = useMemo(
    () => getTemplateRenderer(config.category, config.slug),
    [config.category, config.slug]
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Form Panel */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
          {/* Section groups */}
          {sectionOrder.map(section => {
            const fields = fieldsBySection[section];
            if (!fields || fields.length === 0) return null;
            return (
              <div key={section} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-semibold mb-5">{sectionLabels[section] || section}</h3>
                <div className="space-y-5">
                  {fields.map(field => (
                    <FieldRenderer
                      key={field.key}
                      field={field}
                      value={formData[field.key]}
                      onChange={handleFieldChange}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Slug Picker */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold mb-5">Shareable Link</h3>
            <SlugPicker value={slug} onChange={setSlug} suggestion={slugSuggestion} />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pb-8">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={saving}
              className="flex-1 font-body"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex-1 font-body lg:hidden"
            >
              {showPreview ? 'Hide Preview' : 'Preview Invite'}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={publishing}
              className="flex-1 font-body"
            >
              {publishing ? 'Publishing...' : isEditing ? 'Update & Publish' : 'Publish Invite'}
            </Button>
          </div>
        </div>
      </div>

      {/* Live Preview Panel — Desktop: always visible; Mobile: toggle */}
      <div
        className={`
          lg:w-[420px] lg:border-l lg:border-border lg:block
          ${showPreview ? 'fixed inset-0 z-50 bg-background lg:relative lg:inset-auto lg:z-auto' : 'hidden lg:block'}
        `}
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <span className="text-sm font-body font-medium">Live Preview</span>
            <button
              onClick={() => setShowPreview(false)}
              className="text-xs text-muted-foreground hover:text-foreground font-body lg:hidden"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-muted">
            <div className="transform scale-[0.55] origin-top w-[182%] -ml-[41%]">
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              }>
                <TemplateRenderer config={config} data={previewData} isPreview />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteForm;
