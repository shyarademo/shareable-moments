import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TemplateConfig } from '@/types';

const Checkout = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, setPendingTemplateSlug } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [template, setTemplate] = useState<TemplateConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && slug) {
      setPendingTemplateSlug(slug);
      navigate('/login');
      return;
    }
    if (slug) {
      api.getTemplate(slug).then(setTemplate).finally(() => setLoading(false));
    }
  }, [slug, isAuthenticated, navigate, setPendingTemplateSlug]);

  const handleCheckout = async () => {
    if (!template) return;
    setProcessing(true);
    try {
      const result = await api.checkout(template.slug);
      toast({ title: template.isPremium ? 'Payment successful!' : 'Template confirmed!', description: 'You can now fill in your event details.' });
      navigate(`/create/${result.inviteId}`);
    } catch {
      toast({ title: 'Something went wrong', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container flex items-center h-16">
          <Link to="/" className="font-display text-xl font-bold">Shyara</Link>
        </div>
      </nav>

      <div className="container max-w-2xl py-12 px-4">
        <h1 className="font-display text-3xl font-bold text-center mb-10">
          {template.isPremium ? 'Complete Your Purchase' : 'Confirm Your Template'}
        </h1>

        {/* Template summary */}
        <div className="flex items-center gap-6 p-6 rounded-xl border border-border bg-card mb-8">
          <div className="w-24 h-32 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground font-body shrink-0">
            Preview
          </div>
          <div className="flex-1">
            <h2 className="font-display font-semibold text-lg">{template.name}</h2>
            <p className="text-sm text-muted-foreground font-body capitalize mb-2">{template.category.replace('-', ' ')}</p>
            <p className="text-2xl font-display font-bold text-gold">
              {template.isPremium ? `₹${template.price}` : 'Free'}
            </p>
          </div>
        </div>

        {/* What's included */}
        <div className="p-6 rounded-xl border border-border bg-card mb-8">
          <h3 className="font-display font-semibold mb-4">What's Included</h3>
          <ul className="space-y-2 font-body text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Personalized invite link</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> RSVP management dashboard</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Beautiful opening animation</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Mobile-optimized design</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Unlimited sharing</li>
          </ul>
        </div>

        {/* Payment form (premium only) */}
        {template.isPremium && (
          <div className="p-6 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-display font-semibold mb-4">Payment Details</h3>
            <div className="space-y-4">
              <div>
                <Label className="font-body text-sm">Card Number</Label>
                <Input placeholder="4242 4242 4242 4242" className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-sm">Expiry</Label>
                  <Input placeholder="MM/YY" className="mt-1.5" />
                </div>
                <div>
                  <Label className="font-body text-sm">CVV</Label>
                  <Input placeholder="123" className="mt-1.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        <Button onClick={handleCheckout} disabled={processing} className="w-full h-12 font-body text-base">
          {processing ? 'Processing...' : template.isPremium ? `Pay ₹${template.price}` : 'Confirm & Continue'}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
