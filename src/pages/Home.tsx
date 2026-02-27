import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="font-display text-xl font-bold text-foreground">
            Shyara
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-body">
            <Link to="/templates" className="text-muted-foreground hover:text-foreground transition-colors">Browse Templates</Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link>
            <Button asChild size="sm">
              <Link to="/templates">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-24 md:py-36 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--gold)/0.06),transparent_60%)]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-6 font-body animate-fade-in">Premium Digital Invitations</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 animate-fade-in">
            Invitations as beautiful as your celebrations
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto mb-10 animate-fade-in">
            Create stunning, personalized digital invitations for weddings, engagements, birthdays, and more. Share a beautiful link — guests RSVP in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button asChild size="lg" className="text-base px-8">
              <Link to="/templates">Browse Templates</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8">
              <Link to="/i/demo-invite">See a Live Example</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-accent/30">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
          <div className="w-16 h-px bg-gold mx-auto mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-5xl mx-auto">
            {[
              { step: '1', title: 'Browse Templates', desc: 'Explore our curated collection of stunning designs' },
              { step: '2', title: 'Register & Pay', desc: 'Create your account and unlock your chosen template' },
              { step: '3', title: 'Fill Your Details', desc: 'Add your event info, photos, and personal touches' },
              { step: '4', title: 'Get Your Link', desc: 'Receive a unique, beautiful shareable URL' },
              { step: '5', title: 'Share with Guests', desc: 'Send via WhatsApp, email, or any platform' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">For Every Occasion</h2>
          <div className="w-16 h-px bg-gold mx-auto mb-12" />
          <div className="flex flex-wrap justify-center gap-3">
            {['Wedding', 'Engagement', 'Birthday', 'Baby Shower', 'Corporate', 'Anniversary'].map(cat => (
              <Link
                key={cat}
                to={`/templates?category=${cat.toLowerCase().replace(' ', '-')}`}
                className="px-6 py-3 rounded-full border border-border bg-card hover:bg-accent hover:border-gold/30 transition-all duration-200 text-sm font-body font-medium text-foreground"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Shyara */}
      <section className="py-20 px-6 bg-accent/30">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">Why Shyara</h2>
          <div className="w-16 h-px bg-gold mx-auto mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { title: 'Stunning Designs', desc: 'Premium templates with beautiful opening animations that leave guests in awe' },
              { title: 'Mobile-First', desc: 'Every invitation looks perfect on any device — especially mobile' },
              { title: 'RSVP Dashboard', desc: 'Track who\'s coming with a real-time guest response dashboard' },
              { title: 'Instant Sharing', desc: 'One beautiful link — share via WhatsApp, Instagram, email, or text' },
              { title: 'Personalized Experience', desc: 'Your names, dates, photos, and story — woven into every pixel' },
              { title: 'Free & Premium', desc: 'Start with free templates or unlock premium designs for your special day' },
            ].map(item => (
              <div key={item.title} className="text-center p-6">
                <h3 className="font-display font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="container">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">Loved by Thousands</h2>
          <div className="w-16 h-px bg-gold mx-auto mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Ananya & Rohan', quote: 'Our guests couldn\'t stop talking about how beautiful our invitation was. It set the tone for the entire wedding!', event: 'Wedding' },
              { name: 'Kavita Mehta', quote: 'So easy to use! I had our engagement invite ready in 10 minutes. The RSVP tracking was a lifesaver.', event: 'Engagement' },
              { name: 'Deepak Joshi', quote: 'Used Shyara for my daughter\'s birthday. The template was gorgeous and sharing via WhatsApp was seamless.', event: 'Birthday' },
            ].map(t => (
              <div key={t.name} className="p-6 bg-card rounded-xl border border-border">
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

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 px-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-display text-lg font-bold">Shyara</div>
          <div className="flex gap-6 text-sm font-body text-muted-foreground">
            <Link to="/templates" className="hover:text-foreground transition-colors">Templates</Link>
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
          </div>
          <p className="text-xs text-muted-foreground font-body">© 2026 Shyara. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
