import { useState, useEffect } from 'react';
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
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const confettiColors = ['hsl(45,95%,60%)', 'hsl(350,85%,55%)', 'hsl(200,90%,55%)', 'hsl(140,70%,50%)', 'hsl(280,80%,60%)', 'hsl(30,90%,55%)'];

const ConfettiBurst = ({ config, data, isPreview = false, inviteId }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ x: number; y: number; color: string; size: number; delay: number }>>([]);

  const title = data.celebrantName
    ? `${data.celebrantName}'s ${data.age ? `${data.age}th` : ''} Birthday`
    : 'Birthday Party!';
  const date = data.eventDate || '';
  const time = data.eventTime || '';

  useEffect(() => {
    if (isOpened) {
      const pieces = Array.from({ length: 40 }, (_, i) => ({
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: confettiColors[i % confettiColors.length],
        size: 6 + Math.random() * 8,
        delay: Math.random() * 1.5,
      }));
      setConfetti(pieces);
    }
  }, [isOpened]);

  const c = {
    bg: 'hsl(0,0%,100%)',
    bgAlt: 'hsl(45,100%,97%)',
    heading: 'hsl(350,80%,40%)',
    body: 'hsl(350,20%,35%)',
    accent: 'hsl(45,95%,50%)',
    fun: 'hsl(350,85%,55%)',
    border: 'hsl(45,60%,88%)',
  };

  return (
    <>
      <InviteCover
        title={title}
        subtitle="🎉 You're Invited! 🎉"
        date={date}
        time={time}
        slug={data.slug || 'preview'}
        isPreview={isPreview}
        theme="confetti"
        onOpen={() => setIsOpened(true)}
      />

      {isOpened && (
        <div className="min-h-screen relative overflow-hidden" style={{ background: c.bg }}>
          {/* Confetti */}
          <div className="fixed inset-0 pointer-events-none z-40">
            {confetti.map((piece, i) => (
              <motion.div
                key={i}
                initial={{ x: `${piece.x}vw`, y: `${piece.y}vh`, rotate: 0, opacity: 1 }}
                animate={{ y: '110vh', rotate: 360 + Math.random() * 360, opacity: 0 }}
                transition={{ duration: 3 + Math.random() * 2, delay: piece.delay, ease: 'easeIn' as const }}
                style={{ position: 'absolute', width: piece.size, height: piece.size * 0.6, background: piece.color, borderRadius: 2 }}
              />
            ))}
          </div>

          {/* Hero */}
          {config.supportedSections.includes('hero') && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-28 px-6 text-center" style={{ background: `linear-gradient(180deg, ${c.bgAlt} 0%, ${c.bg} 100%)` }}>
              <motion.div custom={0} variants={fadeUp} className="text-6xl mb-4">🎂</motion.div>
              <motion.p custom={1} variants={fadeUp} className="text-sm uppercase tracking-[0.3em] font-body mb-6 font-semibold" style={{ color: c.fun }}>Let's Celebrate!</motion.p>
              <motion.h1 custom={2} variants={fadeUp} className="font-display text-5xl md:text-7xl font-bold mb-3 leading-tight" style={{ color: c.heading }}>{data.celebrantName || 'Birthday Star'}</motion.h1>
              {data.age && <motion.p custom={3} variants={fadeUp} className="font-display text-6xl md:text-8xl font-bold mb-4" style={{ color: c.accent }}>{data.age}</motion.p>}
              {data.welcomeMessage && <motion.p custom={4} variants={fadeUp} className="text-lg font-body max-w-lg mx-auto" style={{ color: c.body }}>{data.welcomeMessage}</motion.p>}
              {date && (
                <motion.div custom={5} variants={fadeUp} className="mt-8 inline-flex items-center gap-4 px-8 py-4 rounded-full border" style={{ borderColor: c.border, background: c.bg }}>
                  <span className="font-display text-lg font-semibold" style={{ color: c.heading }}>{date}</span>
                  {time && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.fun }} />
                      <span className="font-body text-sm" style={{ color: c.body }}>{time}</span>
                    </>
                  )}
                </motion.div>
              )}
            </motion.section>
          )}

          {/* Schedule */}
          {config.supportedSections.includes('schedule') && data.schedule?.length > 0 && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-24 px-6" style={{ background: c.bgAlt }}>
              <div className="max-w-2xl mx-auto">
                <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl font-bold text-center mb-14" style={{ color: c.heading }}>🎊 Party Schedule</motion.h2>
                <div className="space-y-6">
                  {data.schedule.map((item: { time: string; title: string; description?: string }, i: number) => (
                    <motion.div key={i} custom={i + 1} variants={fadeUp} className="flex gap-5 items-center p-5 rounded-2xl border" style={{ background: c.bg, borderColor: c.border }}>
                      <div className="w-20 shrink-0 text-center">
                        <span className="font-display font-bold text-lg" style={{ color: c.fun }}>{item.time}</span>
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-lg" style={{ color: c.heading }}>{item.title}</h3>
                        {item.description && <p className="text-sm font-body mt-0.5" style={{ color: c.body }}>{item.description}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Venue */}
          {config.supportedSections.includes('venue') && (data.venueName || data.venueAddress) && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-24 px-6 text-center">
              <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl font-bold mb-10" style={{ color: c.heading }}>📍 Where's the Party?</motion.h2>
              {data.venueName && <motion.p custom={1} variants={fadeUp} className="font-display text-2xl font-semibold mb-2" style={{ color: c.heading }}>{data.venueName}</motion.p>}
              {data.venueAddress && <motion.p custom={2} variants={fadeUp} className="font-body" style={{ color: c.body }}>{data.venueAddress}</motion.p>}
            </motion.section>
          )}

          {/* Gallery */}
          {config.supportedSections.includes('gallery') && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-24 px-6" style={{ background: c.bgAlt }}>
              <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl font-bold text-center mb-14" style={{ color: c.heading }}>📸 Memories</motion.h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <motion.div key={i} custom={i} variants={fadeUp} className="aspect-square rounded-2xl flex items-center justify-center text-sm font-body border" style={{ background: c.bg, borderColor: c.border, color: c.body }}>
                    Photo {i}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* RSVP */}
          {config.supportedSections.includes('rsvp') && inviteId && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="py-24 px-6">
              <div className="max-w-md mx-auto text-center">
                <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl font-bold mb-4" style={{ color: c.heading }}>🎈 RSVP</motion.h2>
                <motion.p custom={1} variants={fadeUp} className="font-body mb-8" style={{ color: c.body }}>Can you make it? Let us know!</motion.p>
                <motion.div custom={2} variants={fadeUp}>
                  <InviteRsvpForm inviteId={inviteId} />
                </motion.div>
              </div>
            </motion.section>
          )}

          <footer className="py-16 text-center" style={{ borderTop: `1px solid ${c.border}` }}>
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-xs font-body tracking-wide" style={{ color: c.body }}>Made with love on <span style={{ color: c.fun }}>Shyara</span></p>
          </footer>
        </div>
      )}
    </>
  );
};

export default ConfettiBurst;
