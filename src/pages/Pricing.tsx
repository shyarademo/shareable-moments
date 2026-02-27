import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const faqs = [
  { q: 'Can I try before I pay?', a: 'Absolutely! You can browse and fully preview any template without creating an account. Only pay when you\'re ready to personalize.' },
  { q: 'Can I edit my invite after publishing?', a: 'Yes! You can update your event details anytime. The changes go live at the same URL — no need to reshare.' },
  { q: 'How do guests RSVP?', a: 'Your invite includes a built-in RSVP form. Guests can respond with a single tap, and you\'ll see all responses in your dashboard.' },
  { q: 'What if I need multiple invites?', a: 'No problem! You can create as many invites as you need — a wedding invite, an engagement invite, a birthday invite — all from the same account.' },
  { q: 'Do guests need to download an app?', a: 'Not at all! Your invitation is a simple web link. No downloads, no signups — just tap and view.' },
  { q: 'Can I share on WhatsApp?', a: 'Yes! Copy your shareable link and paste it anywhere — WhatsApp, Instagram, email, SMS, or any messaging app.' },
];

const Pricing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-16 px-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-center mb-2">Simple, Transparent Pricing</h1>
        <p className="text-center text-muted-foreground font-body mb-14">No hidden fees. No subscriptions. Pay per template.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className="p-8 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
            <h2 className="font-display text-xl font-bold mb-1">Free</h2>
            <p className="text-3xl font-display font-bold text-foreground mb-1">₹0</p>
            <p className="text-xs text-muted-foreground font-body mb-6">Forever free</p>
            <ul className="space-y-3 font-body text-sm text-muted-foreground mb-8">
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> Access to free templates</li>
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> Personalized invite link</li>
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> Basic RSVP tracking</li>
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> Mobile-optimized</li>
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> Unlimited sharing</li>
              <li className="flex items-center gap-2 opacity-40">✗ Premium templates</li>
              <li className="flex items-center gap-2 opacity-40">✗ Opening animations</li>
              <li className="flex items-center gap-2 opacity-40">✗ Background music</li>
            </ul>
            <Button asChild variant="outline" className="w-full font-body"><Link to="/templates">Get Started Free</Link></Button>
          </div>

          {/* Premium */}
          <div className="p-8 rounded-xl border-2 border-gold bg-card relative hover:shadow-lg transition-shadow">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-gold-foreground text-xs font-body font-medium rounded-full">Most Popular</span>
            <h2 className="font-display text-xl font-bold mb-1">Premium</h2>
            <p className="text-3xl font-display font-bold text-foreground mb-1">₹199 – ₹599</p>
            <p className="text-xs text-muted-foreground font-body mb-6">One-time payment per template</p>
            <ul className="space-y-3 font-body text-sm text-muted-foreground mb-8">
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> Everything in Free</li>
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> Premium designer templates</li>
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> Stunning opening animations</li>
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> Photo gallery section</li>
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> Love story / event story</li>
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> Background music</li>
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> Priority support</li>
              <li className="flex items-center gap-2"><span className="text-gold">✓</span> CSV export of RSVPs</li>
            </ul>
            <Button asChild className="w-full font-body"><Link to="/templates">Browse Premium Templates</Link></Button>
          </div>
        </div>

        {/* Comparison table */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="font-display text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-6 py-3 text-sm font-body font-medium text-muted-foreground">Feature</th>
                  <th className="text-center px-6 py-3 text-sm font-body font-medium text-muted-foreground">Free</th>
                  <th className="text-center px-6 py-3 text-sm font-body font-medium text-gold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Personalized invite link', true, true],
                  ['RSVP tracking', true, true],
                  ['Mobile-optimized', true, true],
                  ['Unlimited sharing', true, true],
                  ['Opening animations', false, true],
                  ['Photo gallery', false, true],
                  ['Love story section', false, true],
                  ['Background music', false, true],
                  ['Custom event schedule', true, true],
                  ['CSV export', false, true],
                ].map(([feature, free, premium], i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-6 py-3 text-sm font-body">{feature as string}</td>
                    <td className="px-6 py-3 text-center text-sm">{free ? <span className="text-gold">✓</span> : <span className="text-muted-foreground">—</span>}</td>
                    <td className="px-6 py-3 text-center text-sm">{premium ? <span className="text-gold">✓</span> : <span className="text-muted-foreground">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-20">
          <h2 className="font-display text-2xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-border">
              <button
                className="w-full text-left py-5 flex items-center justify-between group"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <h3 className="font-display font-semibold pr-4">{faq.q}</h3>
                <span className="text-muted-foreground text-lg shrink-0 transition-transform" style={{ transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
              </button>
              {openFaq === i && (
                <p className="text-sm text-muted-foreground font-body leading-relaxed pb-5 animate-fade-in">{faq.a}</p>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <h3 className="font-display text-2xl font-bold mb-3">Ready to get started?</h3>
          <p className="text-muted-foreground font-body mb-6">Create your first invitation in minutes.</p>
          <Button asChild size="lg" className="font-body"><Link to="/templates">Browse Templates</Link></Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
