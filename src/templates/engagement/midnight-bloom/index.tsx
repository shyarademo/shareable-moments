import { useState } from 'react';
import { motion } from 'framer-motion';
import { TemplateConfig } from '@/types';
import InviteCover from '@/components/InviteCover';
import InviteRsvpForm from '@/components/InviteRsvpForm';

interface Props {
  config: TemplateConfig;
  data: Record<string, any>;
  isPreview?: boolean;
  inviteId?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' as const },
  }),
};

const MidnightBloom = ({ config, data, isPreview = false, inviteId }: Props) => {
  const [isOpened, setIsOpened] = useState(false);

  const title = `${data.partnerOneName || 'Partner'} & ${data.partnerTwoName || 'Partner'}`;
  const date = data.engagementDate || '';
  const time = data.engagementTime || '';

  const c = {
    bg: 'hsl(280,20%,6%)',
    bgAlt: 'hsl(310,18%,9%)',
    heading: 'hsl(330,40%,85%)',
    body: 'hsl(330,15%,55%)',
    accent: 'hsl(330,50%,65%)',
    border: 'hsl(280,15%,18%)',
    muted: 'hsl(280,10%,30%)',
  };

  return (
    <>
      <InviteCover
        title={title}
        subtitle="You're Invited to Celebrate"
        date={date}
        time={time}
        slug={data.slug || 'preview'}
        isPreview={isPreview}
        theme="dark-floral"
        onOpen={() => setIsOpened(true)}
      />

      {isOpened && (
        <div className="min-h-screen" style={{ background: c.bg }}>
          {/* Hero */}
          {config.supportedSections.includes('hero') && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-32 px-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-10 left-[15%] w-4 h-4 rounded-full" style={{ background: c.accent }} />
                <div className="absolute top-20 right-[20%] w-3 h-3 rounded-full" style={{ background: 'hsl(280,30%,50%)' }} />
                <div className="absolute bottom-16 left-[30%] w-5 h-5 rounded-full" style={{ background: 'hsl(340,40%,50%)' }} />
                <div className="absolute bottom-10 right-[35%] w-3 h-3 rounded-full" style={{ background: c.accent }} />
              </div>

              <motion.p custom={0} variants={fadeUp} className="text-xs uppercase tracking-[0.5em] font-body mb-8" style={{ color: c.accent }}>
                ✿ An Engagement Celebration ✿
              </motion.p>
              <motion.h1 custom={1} variants={fadeUp} className="font-display text-5xl md:text-7xl font-bold mb-3 leading-tight" style={{ color: c.heading }}>
                {data.partnerOneName || 'Partner'}
              </motion.h1>
              <motion.p custom={2} variants={fadeUp} className="font-display text-3xl italic mb-3" style={{ color: c.muted }}>&</motion.p>
              <motion.h1 custom={3} variants={fadeUp} className="font-display text-5xl md:text-7xl font-bold mb-8 leading-tight" style={{ color: c.heading }}>
                {data.partnerTwoName || 'Partner'}
              </motion.h1>
              <motion.p custom={4} variants={fadeUp} className="text-lg font-body" style={{ color: c.body }}>are getting engaged!</motion.p>
              {date && (
                <motion.div custom={5} variants={fadeUp} className="mt-8 inline-flex items-center gap-4 px-8 py-4 rounded-full border" style={{ borderColor: c.border, background: c.bgAlt }}>
                  <span className="font-display text-lg font-medium" style={{ color: c.accent }}>{date}</span>
                  {time && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.accent }} />
                      <span className="font-body text-sm" style={{ color: c.body }}>{time}</span>
                    </>
                  )}
                </motion.div>
              )}
            </motion.section>
          )}

          {/* Story */}
          {config.supportedSections.includes('story') && data.ourStory && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-24 px-6" style={{ background: c.bgAlt }}>
              <div className="max-w-2xl mx-auto text-center">
                <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl font-bold mb-8" style={{ color: c.heading }}>Our Story</motion.h2>
                <motion.div custom={1} variants={fadeUp} className="flex justify-center mb-10">
                  <div className="h-px w-20" style={{ background: c.accent }} />
                </motion.div>
                <motion.p custom={2} variants={fadeUp} className="leading-relaxed text-lg font-body italic" style={{ color: c.body }}>"{data.ourStory}"</motion.p>
              </div>
            </motion.section>
          )}

          {/* Schedule */}
          {config.supportedSections.includes('schedule') && data.schedule?.length > 0 && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-24 px-6">
              <div className="max-w-2xl mx-auto">
                <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl font-bold text-center mb-14" style={{ color: c.heading }}>Evening Schedule</motion.h2>
                <div className="space-y-8">
                  {data.schedule.map((item: { time: string; title: string; description?: string }, i: number) => (
                    <motion.div key={i} custom={i + 1} variants={fadeUp} className="flex gap-6 items-start">
                      <div className="w-24 shrink-0 text-sm font-medium font-body pt-1" style={{ color: c.accent }}>{item.time}</div>
                      <div className="pl-6" style={{ borderLeft: `2px solid ${c.border}` }}>
                        <h3 className="font-display font-semibold text-lg" style={{ color: c.heading }}>{item.title}</h3>
                        {item.description && <p className="text-sm font-body mt-1" style={{ color: c.body }}>{item.description}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Venue */}
          {config.supportedSections.includes('venue') && (data.venueName || data.venueAddress) && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-24 px-6 text-center" style={{ background: c.bgAlt }}>
              <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl font-bold mb-10" style={{ color: c.heading }}>Venue</motion.h2>
              {data.venueName && <motion.p custom={1} variants={fadeUp} className="font-display text-2xl font-medium mb-2" style={{ color: c.heading }}>{data.venueName}</motion.p>}
              {data.venueAddress && <motion.p custom={2} variants={fadeUp} className="font-body" style={{ color: c.body }}>{data.venueAddress}</motion.p>}
            </motion.section>
          )}

          {/* Gallery */}
          {config.supportedSections.includes('gallery') && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-24 px-6">
              <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl font-bold text-center mb-14" style={{ color: c.heading }}>Moments</motion.h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <motion.div key={i} custom={i} variants={fadeUp} className="aspect-square rounded-xl flex items-center justify-center text-sm font-body border" style={{ background: c.bgAlt, borderColor: c.border, color: c.muted }}>
                    Photo {i}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* RSVP */}
          {config.supportedSections.includes('rsvp') && inviteId && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-24 px-6" style={{ background: c.bgAlt }}>
              <div className="max-w-md mx-auto text-center">
                <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl font-bold mb-4" style={{ color: c.heading }}>RSVP</motion.h2>
                <motion.p custom={1} variants={fadeUp} className="font-body mb-8" style={{ color: c.body }}>We'd love to celebrate this moment with you</motion.p>
                <motion.div custom={2} variants={fadeUp}>
                  <InviteRsvpForm inviteId={inviteId} />
                </motion.div>
              </div>
            </motion.section>
          )}

          <footer className="py-16 text-center" style={{ borderTop: `1px solid ${c.border}` }}>
            <p className="font-display text-lg mb-1" style={{ color: c.accent }}>{data.partnerOneName} & {data.partnerTwoName}</p>
            <p className="text-xs font-body tracking-wide" style={{ color: c.muted }}>Made with love on <span style={{ color: c.accent }}>Shyara</span></p>
          </footer>
        </div>
      )}
    </>
  );
};

export default MidnightBloom;
