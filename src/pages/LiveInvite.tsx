import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { PublicInviteData } from '@/types';
import { getTemplateBySlug, getTemplateRenderer } from '@/templates/registry';

const LiveInvite = () => {
  const { slug } = useParams<{ slug: string }>();
  const [inviteData, setInviteData] = useState<PublicInviteData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.getPublicInvite(slug)
      .then(setInviteData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground font-body">Loading your invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Invitation Not Found</h1>
          <p className="text-muted-foreground font-body mb-6">This invitation may have expired or doesn't exist.</p>
          <a href="/" className="text-primary hover:underline font-body text-sm">Visit Shyara</a>
        </div>
      </div>
    );
  }

  const config = getTemplateBySlug(inviteData.templateSlug);
  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground font-body">Template not found</p>
      </div>
    );
  }

  const TemplateRenderer = getTemplateRenderer(config.category, config.slug);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TemplateRenderer config={config} data={{ ...inviteData.data, slug }} />
    </Suspense>
  );
};

export default LiveInvite;
