import { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 bg-secondary rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-3 py-1.5 rounded-md text-xs font-body transition-colors ${viewMode === 'mobile' ? 'bg-card shadow-sm' : ''}`}
              >
                Mobile
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`px-3 py-1.5 rounded-md text-xs font-body transition-colors ${viewMode === 'desktop' ? 'bg-card shadow-sm' : ''}`}
              >
                Desktop
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
      <div className="container py-12 px-4">
        <h2 className="font-display text-2xl font-bold text-center mb-8">What's Included</h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {config.supportedSections.map(section => (
            <span key={section} className="px-4 py-2 rounded-full bg-card border border-border text-sm font-body capitalize">
              {section}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
