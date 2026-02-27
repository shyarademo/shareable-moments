import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/services/api';
import { TemplateConfig } from '@/types';
import TemplateThumbnail from '@/components/TemplateThumbnail';
import PhoneMockup from '@/components/PhoneMockup';
import { allTemplates, getTemplatesByCategory } from '@/templates/registry';
import { Eye, Sparkles, Smartphone, BarChart3, Link2, Palette, Gift, ChevronRight, Users, Heart, PartyPopper } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

/* ── Animated counter ── */
const AnimatedCounter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ── Category data with counts ── */
const categoryData = [
  { name: 'Wedding', emoji: '💒', value: 'wedding' as const },
  { name: 'Engagement', emoji: '💍', value: 'engagement' as const },
  { name: 'Birthday', emoji: '🎂', value: 'birthday' as const },
  { name: 'Baby Shower', emoji: '👶', value: 'baby-shower' as const },
  { name: 'Corporate', emoji: '🏢', value: 'corporate' as const },
  { name: 'Anniversary', emoji: '💕', value: 'anniversary' as const },
].map(c => ({ ...c, count: getTemplatesByCategory(c.value).length }));

const Home = () => {
  const [featured, setFeatured] = useState<TemplateConfig[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  // Get Royal Gold config for phone mockup
  const royalGold = allTemplates.find(t => t.slug === 'royal-gold')!;

  useEffect(() => {
    api.getTemplates({ sort: 'popular' })
      .then(t => setFeatured(t.slice(0, 8)))
      .finally(() => setFeaturedLoading(false));
  }, []);

  /* ── Sticky mobile CTA via IntersectionObserver ── */
  useEffect(() => {
    if (!heroRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => setShowSticky(!e.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="font-display text-xl font-bold text-foreground">Shyara</Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-body">
            <Link to="/templates" className="text-muted-foreground hover:text-foreground transition-colors">Browse Templates</Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link>
            <Button asChild size="sm"><Link to="/templates">Get Started</Link></Button>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <Link to="/login" className="text-sm text-muted-foreground font-body">Login</Link>
            <Button asChild size="sm"><Link to="/templates">Get Started</Link></Button>
          </div>
        </div>
      </nav>

      {/* ═══════════════ HERO with Phone Mockup ═══════════════ */}
      <section ref={heroRef} className="relative py-20 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--gold)/0.06),transparent_60%)]" />
        <div className="relative z-10 container flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left copy */}
          <div className="flex-1 text-center lg:text-left max-w-xl">
            <p className="text-xs uppercase tracking-[0.4em] text-gold mb-6 font-body animate-fade-in">Premium Digital Invitations</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in">
              Invitations as beautiful as your celebrations
            </h1>
            <p className="text-lg text-muted-foreground font-body mb-8 animate-fade-in">
              Create stunning, personalized digital invitations for weddings, engagements, birthdays, and more. Share a beautiful link — guests RSVP in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in">
              <Button asChild size="lg" className="text-base px-8">
                <Link to="/templates">Browse Templates</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link to="/i/demo-invite">See a Live Example</Link>
              </Button>
            </div>
            {/* Micro-copy */}
            <p className="text-xs text-muted-foreground font-body mt-4 animate-fade-in">
              Starting Free · No credit card needed
            </p>
          </div>

          {/* Right: Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-shrink-0 hidden md:block"
          >
            <PhoneMockup className="drop-shadow-2xl">
              <TemplateThumbnail config={royalGold} />
            </PhoneMockup>
          </motion.div>
        </div>

        {/* Trust stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative z-10 container mt-16"
        >
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 md:gap-12 py-6 px-8 rounded-2xl bg-card/60 backdrop-blur-sm border border-border">
            <div className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground"><AnimatedCounter target={5000} suffix="+" /></div>
              <p className="text-xs text-muted-foreground font-body mt-1">Invites Created</p>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground"><AnimatedCounter target={50000} suffix="+" /></div>
              <p className="text-xs text-muted-foreground font-body mt-1">Guests RSVPed</p>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-gold">4.9★</div>
              <p className="text-xs text-muted-foreground font-body mt-1">Average Rating</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ HOW IT WORKS — icon-driven ═══════════════ */}
      <section className="py-20 px-6 bg-accent/30">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
          <div className="w-16 h-px bg-gold mx-auto mb-14" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 max-w-5xl mx-auto">
            {[
              { icon: <Eye className="w-6 h-6" />, title: 'Browse Templates', desc: 'Explore our curated collection of stunning designs' },
              { icon: <Users className="w-6 h-6" />, title: 'Register & Pay', desc: 'Create your account and unlock your chosen template' },
              { icon: <Palette className="w-6 h-6" />, title: 'Fill Your Details', desc: 'Add your event info, photos, and personal touches' },
              { icon: <Link2 className="w-6 h-6" />, title: 'Get Your Link', desc: 'Receive a unique, beautiful shareable URL' },
              { icon: <Smartphone className="w-6 h-6" />, title: 'Share with Guests', desc: 'Send via WhatsApp, email, or any platform' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="font-display font-semibold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED TEMPLATES — real thumbnails ═══════════════ */}
      <section className="py-20 px-6">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">Featured Templates</h2>
          <div className="w-16 h-px bg-gold mx-auto mb-12" />
          {featuredLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {featured.map(t => (
                <div
                  key={t.slug}
                  className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <TemplateThumbnail config={t} />
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1.5 z-10">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-body font-medium backdrop-blur-sm ${
                        t.isPremium ? 'bg-gold/90 text-gold-foreground' : 'bg-card/90 border border-border'
                      }`}>
                        {t.isPremium ? `₹${t.price}` : 'Free'}
                      </span>
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 z-10">
                      <Button asChild size="sm" variant="secondary" className="text-xs">
                        <Link to={`/templates/${t.slug}/preview`}>Preview</Link>
                      </Button>
                      <Button asChild size="sm" className="text-xs">
                        <Link to={`/checkout/${t.slug}`}>Use This</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-display font-semibold text-sm">{t.name}</h3>
                    <p className="text-xs text-muted-foreground font-body capitalize">{t.category.replace('-', ' ')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg" className="font-body">
              <Link to="/templates">View All Templates →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════ SEE IT IN ACTION — inline demo ═══════════════ */}
      <section className="py-20 px-6 bg-accent/30 overflow-hidden">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-5xl mx-auto">
            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex-shrink-0"
            >
              <PhoneMockup>
                <TemplateThumbnail config={royalGold} />
              </PhoneMockup>
            </motion.div>

            {/* Copy */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 text-center lg:text-left"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">See It In Action</h2>
              <p className="text-muted-foreground font-body leading-relaxed mb-8">
                Your guests receive a stunning, animated invitation. Here's what they experience:
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: <Sparkles className="w-5 h-5 text-gold" />, text: 'Beautiful cover with "Tap to Open"' },
                  { icon: <Heart className="w-5 h-5 text-primary" />, text: 'Elegant reveal animation unique to each template' },
                  { icon: <Eye className="w-5 h-5 text-primary" />, text: 'Full event details, schedule & venue' },
                  { icon: <BarChart3 className="w-5 h-5 text-primary" />, text: 'RSVP form — guests respond in seconds' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {step.icon}
                    </div>
                    <span className="font-body text-sm text-foreground">{step.text}</span>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="font-body">
                <Link to="/i/demo-invite">
                  Try the Live Demo <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CATEGORIES — rich cards ═══════════════ */}
      <section className="py-20 px-6">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">For Every Occasion</h2>
          <div className="w-16 h-px bg-gold mx-auto mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {categoryData.map(cat => (
              <Link
                key={cat.name}
                to={`/templates?category=${cat.value}`}
                className="group p-5 rounded-xl border border-border bg-card hover:border-gold/30 hover:shadow-md transition-all duration-300 text-center"
              >
                <span className="text-3xl block mb-2">{cat.emoji}</span>
                <h3 className="font-display font-semibold text-sm mb-1">{cat.name}</h3>
                <p className="text-xs text-muted-foreground font-body">{cat.count} template{cat.count !== 1 ? 's' : ''}</p>
                {/* Mini dots */}
                <div className="flex justify-center gap-1.5 mt-3">
                  {getTemplatesByCategory(cat.value).slice(0, 3).map(t => (
                    <div
                      key={t.slug}
                      className="w-3 h-3 rounded-full border border-border overflow-hidden"
                      style={{ background: `hsl(${cat.value === 'wedding' ? '38,65%,50%' : cat.value === 'engagement' ? '330,50%,65%' : cat.value === 'birthday' ? '350,85%,55%' : cat.value === 'baby-shower' ? '210,70%,55%' : cat.value === 'corporate' ? '220,60%,50%' : '20,60%,45%'})` }}
                    />
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHY SHYARA ═══════════════ */}
      <section className="py-20 px-6 bg-accent/30">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">Why Shyara</h2>
          <div className="w-16 h-px bg-gold mx-auto mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: <Sparkles className="w-6 h-6" />, title: 'Stunning Designs', desc: 'Premium templates with beautiful opening animations that leave guests in awe' },
              { icon: <Smartphone className="w-6 h-6" />, title: 'Mobile-First', desc: 'Every invitation looks perfect on any device — especially mobile' },
              { icon: <BarChart3 className="w-6 h-6" />, title: 'RSVP Dashboard', desc: 'Track who\'s coming with a real-time guest response dashboard' },
              { icon: <Link2 className="w-6 h-6" />, title: 'Instant Sharing', desc: 'One beautiful link — share via WhatsApp, Instagram, email, or text' },
              { icon: <Palette className="w-6 h-6" />, title: 'Personalized', desc: 'Your names, dates, photos, and story — woven into every pixel' },
              { icon: <Gift className="w-6 h-6" />, title: 'Free & Premium', desc: 'Start with free templates or unlock premium designs for your special day' },
            ].map(item => (
              <div key={item.title} className="text-center p-6 rounded-xl hover:bg-card transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TRUST COUNTERS ═══════════════ */}
      <section className="py-20 px-6">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-foreground">
                <AnimatedCounter target={5000} suffix="+" />
              </div>
              <p className="text-sm text-muted-foreground font-body mt-2 flex items-center justify-center gap-1.5">
                <PartyPopper className="w-4 h-4 text-gold" /> Invites Created
              </p>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-foreground">
                <AnimatedCounter target={2500} suffix="+" />
              </div>
              <p className="text-sm text-muted-foreground font-body mt-2 flex items-center justify-center gap-1.5">
                <Heart className="w-4 h-4 text-primary" /> Happy Couples
              </p>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-foreground">
                <AnimatedCounter target={50000} suffix="+" />
              </div>
              <p className="text-sm text-muted-foreground font-body mt-2 flex items-center justify-center gap-1.5">
                <Users className="w-4 h-4 text-primary" /> Guest RSVPs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-20 px-6 bg-accent/30">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">Loved by Thousands</h2>
          <div className="w-16 h-px bg-gold mx-auto mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Ananya & Rohan', quote: 'Our guests couldn\'t stop talking about how beautiful our invitation was. It set the tone for the entire wedding!', event: 'Wedding', stars: 5 },
              { name: 'Kavita Mehta', quote: 'So easy to use! I had our engagement invite ready in 10 minutes. The RSVP tracking was a lifesaver.', event: 'Engagement', stars: 5 },
              { name: 'Deepak Joshi', quote: 'Used Shyara for my daughter\'s birthday. The template was gorgeous and sharing via WhatsApp was seamless.', event: 'Birthday', stars: 5 },
            ].map(t => (
              <div key={t.name} className="p-6 bg-card rounded-xl border border-border">
                <div className="text-gold text-sm mb-3">{'★'.repeat(t.stars)}</div>
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="font-display font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-gold font-body">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING TEASER ═══════════════ */}
      <section className="py-16 px-6">
        <div className="container max-w-2xl text-center">
          <div className="p-8 rounded-2xl border border-border bg-card">
            <Gift className="w-8 h-8 text-gold mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold mb-2">Free templates forever.</h3>
            <p className="text-muted-foreground font-body mb-5">Premium designs from just <span className="text-gold font-semibold">₹199</span>.</p>
            <Button asChild variant="outline" className="font-body">
              <Link to="/pricing">View Pricing →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="py-24 px-6 text-center bg-accent/30">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to create something beautiful?</h2>
          <p className="text-muted-foreground font-body mb-8">Join thousands of hosts who've made their celebrations unforgettable with Shyara.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base px-8 font-body">
              <Link to="/templates">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8 font-body">
              <Link to="/i/demo-invite">See Live Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 px-6">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-display text-lg font-bold mb-3">Shyara</div>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                Premium digital invitations for life's most beautiful moments.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm mb-3">Product</h4>
              <div className="space-y-2 text-sm font-body text-muted-foreground">
                <Link to="/templates" className="block hover:text-foreground transition-colors">Templates</Link>
                <Link to="/pricing" className="block hover:text-foreground transition-colors">Pricing</Link>
                <Link to="/i/demo-invite" className="block hover:text-foreground transition-colors">Live Demo</Link>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm mb-3">Categories</h4>
              <div className="space-y-2 text-sm font-body text-muted-foreground">
                <Link to="/templates?category=wedding" className="block hover:text-foreground transition-colors">Wedding</Link>
                <Link to="/templates?category=engagement" className="block hover:text-foreground transition-colors">Engagement</Link>
                <Link to="/templates?category=birthday" className="block hover:text-foreground transition-colors">Birthday</Link>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm mb-3">Account</h4>
              <div className="space-y-2 text-sm font-body text-muted-foreground">
                <Link to="/login" className="block hover:text-foreground transition-colors">Login</Link>
                <Link to="/register" className="block hover:text-foreground transition-colors">Register</Link>
                <Link to="/dashboard" className="block hover:text-foreground transition-colors">Dashboard</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-body">© 2026 Shyara. All rights reserved.</p>
            <p className="text-xs text-muted-foreground font-body">Made in India with ❤️</p>
          </div>
        </div>
      </footer>

      {/* ═══════════════ STICKY MOBILE CTA ═══════════════ */}
      {showSticky && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-card/95 backdrop-blur-sm p-3 animate-fade-in">
          <Button asChild className="w-full font-body">
            <Link to="/templates">Browse Templates</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
