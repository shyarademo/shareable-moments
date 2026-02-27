import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const MobileNav = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/templates', label: 'Browse Templates' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/i/demo-invite', label: 'Live Demo' },
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 text-foreground" aria-label="Menu">
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-0">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-display text-lg font-bold">Shyara</span>
          <SheetClose asChild>
            <button className="p-1 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </SheetClose>
        </div>
        <nav className="flex flex-col p-4 gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="px-3 py-3 rounded-lg text-sm font-body text-foreground hover:bg-accent transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-4">
            <Button asChild className="w-full" onClick={() => setOpen(false)}>
              <Link to="/templates">Get Started</Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
