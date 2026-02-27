import { useState, useEffect } from 'react';
import { TemplateConfig } from '@/types';

export interface RendererProps {
  config: TemplateConfig;
  data: Record<string, any>;
  isPreview?: boolean;
}

const GenericRenderer = ({ config, data, isPreview = false }: RendererProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const storageKey = `invite-opened-${data.slug || 'preview'}`;

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || (!isPreview && localStorage.getItem(storageKey))) {
      setIsOpened(true);
    }
  }, [storageKey, isPreview]);

  const handleOpen = () => {
    setIsOpened(true);
    if (!isPreview) {
      localStorage.setItem(storageKey, 'true');
    }
  };

  const getTitle = () => {
    if (config.category === 'wedding') return `${data.brideName || ''} & ${data.groomName || ''}`;
    if (config.category === 'engagement') return `${data.partnerOneName || ''} & ${data.partnerTwoName || ''}`;
    if (config.category === 'birthday') return data.celebrantName ? `${data.celebrantName}'s Birthday` : 'Birthday Celebration';
    if (config.category === 'baby-shower') return data.parentNames || 'Baby Shower';
    if (config.category === 'corporate') return data.eventName || 'Corporate Event';
    if (config.category === 'anniversary') return data.coupleNames || 'Anniversary';
    return 'You\'re Invited';
  };

  const getDate = () => data.weddingDate || data.engagementDate || data.eventDate || data.anniversaryDate || '';
  const getTime = () => data.weddingTime || data.engagementTime || data.eventTime || data.anniversaryTime || '';
  const getStory = () => data.loveStory || data.ourStory || data.ourJourney || data.welcomeMessage || data.description || '';

  if (!isOpened) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/10 via-background to-accent/20 p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--gold)/0.08),transparent_70%)]" />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6 font-body">You're Invited</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-3 leading-tight">{getTitle()}</h1>
          {getDate() && <p className="text-lg text-muted-foreground mb-2 font-body">{getDate()}</p>}
          {getTime() && <p className="text-sm text-muted-foreground/70 mb-10 font-body">{getTime()}</p>}
          <button
            onClick={handleOpen}
            className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-body font-medium text-sm tracking-wide hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Open Invitation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      {config.supportedSections.includes('hero') && (
        <section className="py-24 px-6 text-center bg-gradient-to-b from-primary/5 via-background to-background">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-6 font-body">Together with their families</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-4 leading-tight">{getTitle()}</h1>
          <p className="text-lg text-muted-foreground font-body">
            invite you to celebrate their {config.category.replace('-', ' ')}
          </p>
          {getDate() && (
            <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent/50 border border-border">
              <span className="text-sm font-medium text-foreground font-body">{getDate()}</span>
              {getTime() && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gold" />
                  <span className="text-sm text-muted-foreground font-body">{getTime()}</span>
                </>
              )}
            </div>
          )}
        </section>
      )}

      {/* Story */}
      {config.supportedSections.includes('story') && getStory() && (
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold mb-8">Our Story</h2>
            <div className="w-16 h-px bg-gold mx-auto mb-8" />
            <p className="text-muted-foreground leading-relaxed text-lg font-body">{getStory()}</p>
          </div>
        </section>
      )}

      {/* Schedule */}
      {config.supportedSections.includes('schedule') && data.schedule?.length > 0 && (
        <section className="py-20 px-6 bg-accent/30">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-center mb-4">Event Schedule</h2>
            <div className="w-16 h-px bg-gold mx-auto mb-12" />
            <div className="space-y-8">
              {data.schedule.map((item: { time: string; title: string; description?: string }, i: number) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-24 shrink-0 text-sm font-medium text-gold font-body pt-1">{item.time}</div>
                  <div className="border-l-2 border-gold/30 pl-6">
                    <h3 className="font-display font-semibold text-lg">{item.title}</h3>
                    {item.description && <p className="text-sm text-muted-foreground mt-1 font-body">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Venue */}
      {config.supportedSections.includes('venue') && (data.venueName || data.venueAddress) && (
        <section className="py-20 px-6 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Venue</h2>
          <div className="w-16 h-px bg-gold mx-auto mb-8" />
          {data.venueName && <p className="text-xl font-display font-medium">{data.venueName}</p>}
          {data.venueAddress && <p className="text-muted-foreground mt-2 font-body">{data.venueAddress}</p>}
          <div className="mt-8 max-w-2xl mx-auto h-56 bg-muted rounded-xl flex items-center justify-center text-muted-foreground font-body border border-border">
            Map placeholder
          </div>
        </section>
      )}

      {/* Gallery */}
      {config.supportedSections.includes('gallery') && (
        <section className="py-20 px-6 bg-accent/30">
          <h2 className="font-display text-3xl font-bold text-center mb-4">Gallery</h2>
          <div className="w-16 h-px bg-gold mx-auto mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-sm font-body border border-border">
                Photo {i}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP */}
      {config.supportedSections.includes('rsvp') && (
        <section className="py-20 px-6">
          <div className="max-w-md mx-auto text-center">
            <h2 className="font-display text-3xl font-bold mb-4">RSVP</h2>
            <div className="w-16 h-px bg-gold mx-auto mb-6" />
            <p className="text-muted-foreground mb-8 font-body">We'd love to hear from you</p>
            <div className="space-y-4 text-left">
              <input placeholder="Your Name" className="w-full px-4 py-3 border border-border rounded-xl bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <select className="w-full px-4 py-3 border border-border rounded-xl bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option>Will you attend?</option>
                <option value="yes">Yes, I'll be there!</option>
                <option value="no">Sorry, can't make it</option>
                <option value="maybe">Maybe</option>
              </select>
              <input type="number" placeholder="Number of guests" min="1" max="10" className="w-full px-4 py-3 border border-border rounded-xl bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <textarea placeholder="Leave a message..." rows={3} className="w-full px-4 py-3 border border-border rounded-xl bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              <button className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-body font-medium text-sm hover:bg-primary/90 transition-colors">
                Send RSVP
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 text-center border-t border-border">
        <p className="text-muted-foreground text-xs font-body tracking-wide">Made with love on <span className="text-gold font-medium">Shyara</span></p>
      </footer>
    </div>
  );
};

export default GenericRenderer;
