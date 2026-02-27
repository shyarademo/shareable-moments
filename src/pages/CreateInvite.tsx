import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Invite, TemplateConfig } from '@/types';
import { getTemplateBySlug } from '@/templates/registry';

const CreateInvite = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  const [invite, setInvite] = useState<Invite | null>(null);
  const [config, setConfig] = useState<TemplateConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!inviteId) return;
    api.getInvite(inviteId).then(inv => {
      setInvite(inv);
      setConfig(getTemplateBySlug(inv.templateSlug) || null);
    }).finally(() => setLoading(false));
  }, [inviteId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="font-display text-xl font-bold">Shyara</Link>
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground font-body">Dashboard</Link>
        </div>
      </nav>

      <div className="container py-12 px-4">
        <h1 className="font-display text-3xl font-bold text-center mb-2">Fill Your Event Details</h1>
        <p className="text-center text-muted-foreground font-body mb-10">
          Template: <span className="font-medium text-foreground">{config?.name || 'Unknown'}</span>
        </p>

        <div className="max-w-4xl mx-auto p-8 rounded-xl border border-border bg-card text-center">
          <p className="text-muted-foreground font-body">
            The config-driven event details form will be built in Phase 4.
          </p>
          <p className="text-sm text-muted-foreground font-body mt-2">
            This form will dynamically render {config?.fields.length || 0} fields based on the template config.
          </p>
          <p className="text-xs text-muted-foreground font-body mt-4">
            Invite ID: {invite?.id} | Template: {invite?.templateSlug}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateInvite;
