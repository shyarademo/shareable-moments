import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { TemplateConfig } from '@/types';
import { getTemplateRenderer } from '@/templates/registry';

const TemplatePreview = () => {
  const { slug } = useParams<{ slug: string }>();
  const [config, setConfig] = useState<TemplateConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.getTemplate(slug).then(setConfig).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground font-body">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Template Not Found</h1>
          <p className="text-muted-foreground font-body">This template doesn't exist.</p>
        </div>
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
      <TemplateRenderer config={config} data={config.dummyData} isPreview />
    </Suspense>
  );
};

export default TemplatePreview;
