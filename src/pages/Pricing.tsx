import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Pricing = () => (
  <div className="min-h-screen bg-background">
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-display text-xl font-bold">Shyara</Link>
        <div className="flex items-center gap-4">
          <Link to="/templates" className="text-sm text-muted-foreground font-body hover:text-foreground">Templates</Link>
          <Button asChild size="sm"><Link to="/templates">Get Started</Link></Button>
        </div>
      </div>
    </nav>

    <div className="container py-16 px-4">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-2">Simple Pricing</h1>
      <p className="text-center text-muted-foreground font-body mb-14">Choose the plan that fits your celebration</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Free */}
        <div className="p-8 rounded-xl border border-border bg-card">
          <h2 className="font-display text-xl font-bold mb-1">Free</h2>
          <p className="text-3xl font-display font-bold mb-6">₹0</p>
          <ul className="space-y-3 font-body text-sm text-muted-foreground mb-8">
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Access to free templates</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Personalized invite link</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Basic RSVP tracking</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Mobile-optimized</li>
            <li className="flex items-center gap-2 opacity-40">✗ Premium templates</li>
            <li className="flex items-center gap-2 opacity-40">✗ Opening animations</li>
          </ul>
          <Button asChild variant="outline" className="w-full"><Link to="/templates">Get Started Free</Link></Button>
        </div>

        {/* Premium */}
        <div className="p-8 rounded-xl border-2 border-gold bg-card relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-gold-foreground text-xs font-body font-medium rounded-full">Most Popular</span>
          <h2 className="font-display text-xl font-bold mb-1">Premium</h2>
          <p className="text-3xl font-display font-bold mb-1">₹199 – ₹599</p>
          <p className="text-xs text-muted-foreground font-body mb-6">per template</p>
          <ul className="space-y-3 font-body text-sm text-muted-foreground mb-8">
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> All free features</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Premium designer templates</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Stunning opening animations</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Photo gallery section</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Background music</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Priority support</li>
          </ul>
          <Button asChild className="w-full"><Link to="/templates">Go Premium</Link></Button>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mt-20">
        <h2 className="font-display text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        {[
          { q: 'Can I try before I pay?', a: 'Absolutely! You can browse and fully preview any template without creating an account. Only pay when you\'re ready to personalize.' },
          { q: 'Can I edit my invite after publishing?', a: 'Yes! You can update your event details anytime. The changes go live at the same URL — no need to reshare.' },
          { q: 'How do guests RSVP?', a: 'Your invite includes a built-in RSVP form. Guests can respond with a single tap, and you\'ll see all responses in your dashboard.' },
          { q: 'What if I need multiple invites?', a: 'No problem! You can create as many invites as you need — a wedding invite, an engagement invite, a birthday invite — all from the same account.' },
        ].map(faq => (
          <div key={faq.q} className="border-b border-border py-6">
            <h3 className="font-display font-semibold mb-2">{faq.q}</h3>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Pricing;
