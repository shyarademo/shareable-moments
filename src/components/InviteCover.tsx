import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InviteCoverProps {
  title: string;
  subtitle?: string;
  date?: string;
  time?: string;
  slug: string;
  isPreview?: boolean;
  /** Theme variant for different template styles */
  theme?: 'gold' | 'dark-floral' | 'confetti' | 'default';
  onOpen: () => void;
}

const themeStyles = {
  gold: {
    bg: 'bg-gradient-to-b from-[hsl(38,40%,12%)] via-[hsl(38,30%,8%)] to-[hsl(38,20%,5%)]',
    text: 'text-[hsl(38,65%,75%)]',
    heading: 'text-[hsl(38,65%,70%)]',
    accent: 'text-[hsl(38,65%,55%)]',
    btn: 'bg-[hsl(38,65%,50%)] text-[hsl(38,80%,5%)] hover:bg-[hsl(38,65%,45%)]',
    ornament: 'text-[hsl(38,50%,35%)]',
  },
  'dark-floral': {
    bg: 'bg-gradient-to-b from-[hsl(280,25%,8%)] via-[hsl(310,20%,10%)] to-[hsl(340,15%,6%)]',
    text: 'text-[hsl(330,30%,80%)]',
    heading: 'text-[hsl(330,40%,85%)]',
    accent: 'text-[hsl(330,50%,70%)]',
    btn: 'bg-[hsl(330,40%,50%)] text-[hsl(330,20%,95%)] hover:bg-[hsl(330,40%,45%)]',
    ornament: 'text-[hsl(280,20%,30%)]',
  },
  confetti: {
    bg: 'bg-gradient-to-b from-[hsl(45,90%,55%)] via-[hsl(30,85%,55%)] to-[hsl(350,80%,55%)]',
    text: 'text-[hsl(0,0%,100%)]',
    heading: 'text-[hsl(0,0%,100%)]',
    accent: 'text-[hsl(0,0%,100%)]/80',
    btn: 'bg-[hsl(0,0%,100%)] text-[hsl(350,80%,40%)] hover:bg-[hsl(0,0%,95%)]',
    ornament: 'text-[hsl(0,0%,100%)]/30',
  },
  default: {
    bg: 'bg-gradient-to-b from-primary/10 via-background to-accent/20',
    text: 'text-muted-foreground',
    heading: 'text-foreground',
    accent: 'text-gold',
    btn: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ornament: 'text-muted-foreground/20',
  },
};

const InviteCover = ({ title, subtitle, date, time, slug, isPreview, theme = 'default', onOpen }: InviteCoverProps) => {
  const [show, setShow] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const storageKey = `invite-opened-${slug}`;
  const s = themeStyles[theme];

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || (!isPreview && localStorage.getItem(storageKey))) {
      setShow(false);
      onOpen();
      return;
    }
    const timer = setTimeout(() => setShowSkip(true), 2500);
    return () => clearTimeout(timer);
  }, [storageKey, isPreview, onOpen]);

  const handleOpen = () => {
    setShow(false);
    if (!isPreview) localStorage.setItem(storageKey, 'true');
    onOpen();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-8 text-center ${s.bg}`}
        >
          {/* Decorative ornaments */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className={`text-6xl mb-2 ${s.ornament}`}
          >
            ✦
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className={`text-xs uppercase tracking-[0.4em] ${s.text} mb-6 font-body`}
          >
            {subtitle || "You're Invited"}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            className={`font-display text-4xl md:text-6xl lg:text-7xl font-bold ${s.heading} mb-3 leading-tight`}
          >
            {title}
          </motion.h1>

          {date && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className={`text-lg ${s.text} mb-1 font-body`}
            >
              {date}
            </motion.p>
          )}
          {time && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className={`text-sm ${s.accent} mb-10 font-body`}
            >
              {time}
            </motion.p>
          )}

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpen}
            className={`px-10 py-4 rounded-full font-body font-medium text-sm tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl ${s.btn}`}
          >
            Open Invitation
          </motion.button>

          {/* Skip intro */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleOpen}
                className={`absolute bottom-8 text-xs ${s.text} font-body hover:underline`}
              >
                Skip Intro →
              </motion.button>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className={`text-6xl mt-2 ${s.ornament}`}
          >
            ✦
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InviteCover;
