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
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: 'easeOut' as const },
  }),
};

const RoyalGold = ({ config, data, isPreview = false, inviteId }: Props) => {
  const [isOpened, setIsOpened] = useState(false);

  const title = `${data.brideName || 'Bride'} & ${data.groomName || 'Groom'}`;
  const date = data.weddingDate || '';
  const time = data.weddingTime || '';

  return (
    <>
      <InviteCover
        title={title}
        subtitle="Together with their families"
        date={date}
        time={time}
        slug={data.slug || 'preview'}
        isPreview={isPreview}
        theme="gold"
        onOpen={() => setIsOpened(true)}
      />

      {isOpened && (
        <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, hsl(38,30%,6%) 0%, hsl(38,20%,4%) 100%)' }}>
          {/* Hero */}
          {config.supportedSections.includes('hero') && (
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="py-28 px-6 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20" style={{ background: 'linear-gradient(180deg, transparent, hsl(38,65%,50%))' }} />

              <motion.p custom={0} variants={fadeUp} className="text-xs uppercase tracking-[0.5em] font-body mb-8" style={{ color: 'hsl(38,50%,55%)' }}>
                Together with their families
              </motion.p>
              <motion.h1 custom={1} variants={fadeUp} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-4 leading-tight" style={{ color: 'hsl(38,60%,70%)' }}>
                {data.brideName || 'Bride'}
              </motion.h1>
              <motion.p custom={2} variants={fadeUp} className="font-display text-3xl md:text-4xl italic mb-4" style={{ color: 'hsl(38,40%,45%)' }}>
                &
              </motion.p>
              <motion.h1 custom={3} variants={fadeUp} className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight" style={{ color: 'hsl(38,60%,70%)' }}>
                {data.groomName || 'Groom'}
              </motion.h1>
              <motion.p custom={4} variants={fadeUp} className="text-lg font-body mb-1" style={{ color: 'hsl(38,30%,60%)' }}>
                request the pleasure of your company
              </motion.p>
              {date && (
                <motion.div custom={5} variants={fadeUp} className="mt-8 inline-flex items-center gap-4 px-8 py-4 rounded-full border" style={{ borderColor: 'hsl(38,40%,25%)', background: 'hsl(38,30%,8%)' }}>
                  <span className="font-display text-lg font-medium" style={{ color: 'hsl(38,65%,65%)' }}>{date}</span>
                  {time && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(38,65%,50%)' }} />
                      <span className="font-body text-sm" style={{ color: 'hsl(38,30%,55%)' }}>{time}</span>
                    </>
                  )}
                </motion.div>
              )}

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20" style={{ background: 'linear-gradient(180deg, hsl(38,65%,50%), transparent)' }} />
            </motion.section>
          )}

          {/* Story */}
          {config.supportedSections.includes('story') && data.loveStory && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="py-24 px-6">
              <div className="max-w-2xl mx-auto text-center">
                <motion.div custom={0} variants={fadeUp} className="flex items-center justify-center gap-4 mb-10">
                  <div className="h-px w-16" style={{ background: 'hsl(38,40%,30%)' }} />
                  <span className="text-xl" style={{ color: 'hsl(38,65%,50%)' }}>♥</span>
                  <div className="h-px w-16" style={{ background: 'hsl(38,40%,30%)' }} />
                </motion.div>
                <motion.h2 custom={1} variants={fadeUp} className="font-display text-3xl font-bold mb-8" style={{ color: 'hsl(38,60%,70%)' }}>Our Love Story</motion.h2>
                <motion.p custom={2} variants={fadeUp} className="leading-relaxed text-lg font-body" style={{ color: 'hsl(38,20%,55%)' }}>{data.loveStory}</motion.p>
              </div>
            </motion.section>
          )}

          {/* Schedule */}
          {config.supportedSections.includes('schedule') && data.schedule?.length > 0 && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="py-24 px-6" style={{ background: 'hsl(38,25%,8%)' }}>
              <div className="max-w-2xl mx-auto">
                <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl font-bold text-center mb-4" style={{ color: 'hsl(38,60%,70%)' }}>Wedding Schedule</motion.h2>
                <motion.div custom={1} variants={fadeUp} className="flex justify-center mb-14">
                  <div className="h-px w-20" style={{ background: 'hsl(38,65%,50%)' }} />
                </motion.div>
                <div className="space-y-10">
                  {data.schedule.map((item: { time: string; title: string; description?: string }, i: number) => (
                    <motion.div key={i} custom={i + 2} variants={fadeUp} className="flex gap-8 items-start">
                      <div className="w-28 shrink-0 text-right">
                        <span className="font-display font-semibold text-lg" style={{ color: 'hsl(38,65%,55%)' }}>{item.time}</span>
                      </div>
                      <div className="relative pl-8" style={{ borderLeft: '2px solid hsl(38,40%,25%)' }}>
                        <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full" style={{ background: 'hsl(38,65%,50%)' }} />
                        <h3 className="font-display font-semibold text-xl mb-1" style={{ color: 'hsl(38,45%,75%)' }}>{item.title}</h3>
                        {item.description && <p className="text-sm font-body" style={{ color: 'hsl(38,15%,50%)' }}>{item.description}</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Venue */}
          {config.supportedSections.includes('venue') && (data.venueName || data.venueAddress) && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="py-24 px-6 text-center">
              <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl font-bold mb-4" style={{ color: 'hsl(38,60%,70%)' }}>The Venue</motion.h2>
              <motion.div custom={1} variants={fadeUp} className="flex justify-center mb-10">
                <div className="h-px w-20" style={{ background: 'hsl(38,65%,50%)' }} />
              </motion.div>
              {data.venueName && <motion.p custom={2} variants={fadeUp} className="font-display text-2xl font-medium mb-2" style={{ color: 'hsl(38,50%,75%)' }}>{data.venueName}</motion.p>}
              {data.venueAddress && <motion.p custom={3} variants={fadeUp} className="font-body mb-8" style={{ color: 'hsl(38,15%,50%)' }}>{data.venueAddress}</motion.p>}
              <motion.div custom={4} variants={fadeUp} className="max-w-2xl mx-auto h-64 rounded-2xl flex items-center justify-center font-body border" style={{ background: 'hsl(38,25%,8%)', borderColor: 'hsl(38,30%,20%)', color: 'hsl(38,15%,40%)' }}>
                Map placeholder
              </motion.div>
            </motion.section>
          )}

          {/* Gallery */}
          {config.supportedSections.includes('gallery') && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="py-24 px-6" style={{ background: 'hsl(38,25%,8%)' }}>
              <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl font-bold text-center mb-4" style={{ color: 'hsl(38,60%,70%)' }}>Our Gallery</motion.h2>
              <motion.div custom={1} variants={fadeUp} className="flex justify-center mb-14">
                <div className="h-px w-20" style={{ background: 'hsl(38,65%,50%)' }} />
              </motion.div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <motion.div key={i} custom={i + 1} variants={fadeUp} className="aspect-square rounded-xl flex items-center justify-center text-sm font-body border" style={{ background: 'hsl(38,20%,12%)', borderColor: 'hsl(38,25%,18%)', color: 'hsl(38,15%,35%)' }}>
                    Photo {i}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* RSVP */}
          {config.supportedSections.includes('rsvp') && inviteId && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="py-24 px-6">
              <div className="max-w-md mx-auto text-center">
                <motion.h2 custom={0} variants={fadeUp} className="font-display text-3xl font-bold mb-4" style={{ color: 'hsl(38,60%,70%)' }}>RSVP</motion.h2>
                <motion.div custom={1} variants={fadeUp} className="flex justify-center mb-6">
                  <div className="h-px w-20" style={{ background: 'hsl(38,65%,50%)' }} />
                </motion.div>
                <motion.p custom={2} variants={fadeUp} className="font-body mb-8" style={{ color: 'hsl(38,15%,50%)' }}>Kindly let us know if you'll grace us with your presence</motion.p>
                <motion.div custom={3} variants={fadeUp}>
                  <InviteRsvpForm inviteId={inviteId} />
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* Footer */}
          <footer className="py-16 text-center border-t" style={{ borderColor: 'hsl(38,25%,15%)' }}>
            <p className="font-display text-lg mb-1" style={{ color: 'hsl(38,40%,50%)' }}>{data.brideName} & {data.groomName}</p>
            <p className="text-xs font-body tracking-wide" style={{ color: 'hsl(38,15%,35%)' }}>Made with love on <span style={{ color: 'hsl(38,65%,50%)' }}>Shyara</span></p>
          </footer>
        </div>
      )}
    </>
  );
};

export default RoyalGold;
