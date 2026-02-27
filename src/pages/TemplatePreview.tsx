import { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/services/api';
import { TemplateConfig } from '@/types';
import { getTemplateRenderer } from '@/templates/registry';

const TemplatePreview = () => {
  const { slug } = useParams<{ slug: string }>();
  const [config, setConfig] = useState<TemplateConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('desktop');

  useEffect(() => {
    if (!slug) return;
    api.getTemplate(slug).then(setConfig).finally(() => setLoading(false));
  }, [slug]);

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="container flex items-center justify-between h-14 px-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
        <div className="flex justify-center py-8 px-4">
          <Skeleton className="w-full max-w-[1024px] aspect-[3/4] rounded-xl" />
        </div>
      </div>
    );
  }

  const TemplateRenderer = getTemplateRenderer(config.category, config.slug);

  return (
    <div className="min-h-screen bg-muted">
      {/* Floating top bar */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <Link to="/templates" className="text-sm text-muted-foreground hover:text-foreground font-body">
              ← Back to Gallery
            </Link>
            <span className="hidden md:inline text-sm font-body font-medium">{config.name}</span>
            <span className="hidden md:inline px-2 py-0.5 rounded-full text-[10px] font-body bg-secondary capitalize">
              {config.category.replace('-', ' ')}
            </span>
            {config.isPremium && (
              <span className="hidden md:inline px-2 py-0.5 rounded-full text-[10px] font-body bg-gold/90 text-gold-foreground">
                ₹{config.price}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 bg-secondary rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-3 py-1.5 rounded-md text-xs font-body transition-colors ${viewMode === 'mobile' ? 'bg-card shadow-sm' : ''}`}
              >
                📱 Mobile
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-3 py-1.5 rounded-md text-xs font-body transition-colors ${viewMode === 'desktop' ? 'bg-card shadow-sm' : ''}`}
              >
                💻 Desktop
              </button>
            </div>
            <Button asChild size="sm">
              <Link to={`/checkout/${config.slug}`}>Use This Template</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Preview frame */}
      <div className="flex justify-center py-8 px-4">
        <div
          className={`bg-background rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
            viewMode === 'mobile' ? 'w-full max-w-[390px]' : 'w-full max-w-[1024px]'
          }`}
        >
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <TemplateRenderer config={config} data={config.dummyData} isPreview />
          </Suspense>
        </div>
      </div>

      {/* What's Included */}
      <div className="container py-12 px-4 max-w-3xl">
        <h2 className="font-display text-2xl font-bold text-center mb-8">What's Included</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {config.supportedSections.map(section => (
            <div key={section} className="px-4 py-3 rounded-xl bg-card border border-border text-center">
              <span className="text-sm font-body capitalize font-medium">{section}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild size="lg" className="font-body">
            <Link to={`/checkout/${config.slug}`}>Use This Template →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
