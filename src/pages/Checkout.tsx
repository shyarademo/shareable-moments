import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { TemplateConfig, Invite } from '@/types';
import TemplateThumbnail from '@/components/TemplateThumbnail';
import { ChevronDown, X, Loader2 } from 'lucide-react';

// Promo codes map
const PROMO_CODES: Record<string, { type: 'percent' | 'flat'; value: number; label: string }> = {
  WELCOME10: { type: 'percent', value: 10, label: '10% off' },
  SHYARA20: { type: 'percent', value: 20, label: '20% off' },
  FLAT50: { type: 'flat', value: 50, label: '₹50 off' },
  NEWUSER: { type: 'percent', value: 15, label: '15% off' },
  SAVE100: { type: 'flat', value: 100, label: '₹100 off' },
};

const Checkout = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, setPendingTemplateSlug } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [template, setTemplate] = useState<TemplateConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [existingInvite, setExistingInvite] = useState<Invite | null>(null);

  // Promo state
  const [promoExpanded, setPromoExpanded] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; type: 'percent' | 'flat'; value: number; label: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated && slug) {
      setPendingTemplateSlug(slug);
      navigate('/login');
      return;
    }
    if (!slug) return;

    const init = async () => {
      try {
        const tmpl = await api.getTemplate(slug);
        setTemplate(tmpl);
        const invites = await api.getInvites();
        const existing = invites.find(i => i.templateSlug === slug && i.isPurchased);
        if (existing) setExistingInvite(existing);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [slug, isAuthenticated, navigate, setPendingTemplateSlug]);

  useEffect(() => {
    if (existingInvite && !loading) {
      toast({ title: 'Template already purchased!', description: 'Taking you to your invite editor.' });
      navigate(existingInvite.status === 'draft' ? `/create/${existingInvite.id}` : `/dashboard/invites/${existingInvite.id}/edit`);
    }
  }, [existingInvite, loading, navigate, toast]);

  const getDiscount = (price: number) => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === 'percent') return Math.round(price * appliedPromo.value / 100);
    return Math.min(appliedPromo.value, price);
  };

  const handleApplyPromo = async () => {
    setPromoError('');
    setPromoLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const upper = promoCode.trim().toUpperCase();
    const match = PROMO_CODES[upper];
    if (match) {
      setAppliedPromo({ code: upper, ...match });
      setPromoError('');
    } else {
      setPromoError('Invalid or expired promo code.');
    }
    setPromoLoading(false);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoExpanded(false);
    setPromoError('');
  };

  const handleCheckout = async () => {
    if (!template) return;
    setProcessing(true);
    try {
      const result = await api.checkout(template.slug);
      toast({
        title: template.isPremium ? 'Payment successful!' : 'Template confirmed!',
        description: 'You can now fill in your event details.',
      });
      navigate(`/create/${result.inviteId}`);
    } catch {
      toast({ title: 'Something went wrong', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !template || existingInvite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const discount = getDiscount(template.price);
  const finalPrice = template.price - discount;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="font-display text-xl font-bold">Shyara</Link>
          <Link to="/templates" className="text-sm text-muted-foreground hover:text-foreground font-body">← Templates</Link>
        </div>
      </nav>

      <div className="container max-w-2xl py-12 px-4">
        <h1 className="font-display text-3xl font-bold text-center mb-10">
          {template.isPremium ? 'Complete Your Purchase' : 'Confirm Your Template'}
        </h1>

        {/* Template summary */}
        <div className="flex items-center gap-6 p-6 rounded-xl border border-border bg-card mb-8">
          <div className="w-24 h-32 rounded-lg overflow-hidden shrink-0 border border-border">
            <TemplateThumbnail config={template} />
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
          <ul className="space-y-2.5 font-body text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Personalized invite link</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> RSVP management dashboard</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Beautiful opening animation</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Mobile-optimized design</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Unlimited sharing</li>
            {template.supportedSections.includes('gallery') && (
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> Photo gallery section</li>
            )}
            {template.supportedSections.includes('story') && (
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> Your story / love story section</li>
            )}
          </ul>
        </div>

        {/* Payment form (premium only) */}
        {template.isPremium && (
          <div className="p-6 rounded-xl border border-border bg-card mb-8">
            <h3 className="font-display font-semibold mb-4">Payment Details</h3>
            <p className="text-xs text-muted-foreground font-body mb-4">This is a demo — no real payment will be processed.</p>

            {/* Promo code section */}
            <div className="mb-6">
              {!appliedPromo ? (
                <>
                  <button
                    onClick={() => setPromoExpanded(!promoExpanded)}
                    className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Have a promo code?
                    <ChevronDown className={`w-4 h-4 transition-transform ${promoExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {promoExpanded && (
                    <div className="mt-3 flex gap-2">
                      <Input
                        value={promoCode}
                        onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                        placeholder="Enter promo code"
                        className="flex-1 uppercase"
                      />
                      <Button
                        onClick={handleApplyPromo}
                        disabled={promoLoading || !promoCode.trim()}
                        variant="outline"
                        size="sm"
                        className="font-body px-4 h-10"
                      >
                        {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                      </Button>
                    </div>
                  )}
                  {promoError && (
                    <p className="text-xs text-destructive font-body mt-2">{promoError}</p>
                  )}
                </>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-body font-medium">
                      {appliedPromo.code}
                      <button onClick={handleRemovePromo} className="hover:text-destructive transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </div>
                  <p className="text-xs text-primary font-body mt-2">✓ Promo code applied — {appliedPromo.label}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label className="font-body text-sm">Card Number</Label>
                <Input placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-sm">Expiry</Label>
                  <Input placeholder="MM/YY" defaultValue="12/28" className="mt-1.5" />
                </div>
                <div>
                  <Label className="font-body text-sm">CVV</Label>
                  <Input placeholder="123" defaultValue="123" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label className="font-body text-sm">Cardholder Name</Label>
                <Input placeholder="Your name" defaultValue="Priya Sharma" className="mt-1.5" />
              </div>
            </div>
          </div>
        )}

        {/* Order summary */}
        <div className="p-6 rounded-xl border border-border bg-card mb-8">
          <h3 className="font-display font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between font-body text-sm mb-2">
            <span className="text-muted-foreground">{template.name} template</span>
            <span className={`font-medium ${appliedPromo ? 'line-through text-muted-foreground' : ''}`}>
              {template.isPremium ? `₹${template.price}` : 'Free'}
            </span>
          </div>
          {appliedPromo && template.isPremium && (
            <div className="flex justify-between font-body text-sm mb-2">
              <span className="text-primary">Promo code ({appliedPromo.code})</span>
              <span className="text-primary font-medium">-₹{discount}</span>
            </div>
          )}
          {template.isPremium && (
            <>
              <div className="flex justify-between font-body text-sm mb-2">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">₹0</span>
              </div>
              <div className="border-t border-border my-3" />
              <div className="flex justify-between font-body text-sm font-semibold">
                <span>Total</span>
                <span className="text-gold">₹{finalPrice}</span>
              </div>
            </>
          )}
        </div>

        <Button onClick={handleCheckout} disabled={processing} className="w-full h-12 font-body text-base">
          {processing
            ? 'Processing...'
            : template.isPremium
              ? `Pay ₹${finalPrice}`
              : 'Confirm & Continue'}
        </Button>

        <p className="text-center text-xs text-muted-foreground font-body mt-4">
          Secure payment. Your data is protected.
        </p>
      </div>
    </div>
  );
};

export default Checkout;
