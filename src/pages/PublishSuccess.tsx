import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PublishSuccess = () => {
  const { inviteId } = useParams<{ inviteId: string }>();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🎉</span>
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">Your invitation is live!</h1>
        <p className="text-muted-foreground font-body mb-8">Share this link with your guests</p>

        <div className="p-4 rounded-xl bg-card border border-border mb-6">
          <p className="text-sm font-body text-gold font-medium break-all">
            invite.shyara.co.in/i/demo-invite
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button className="w-full font-body" onClick={() => navigator.clipboard.writeText('https://invite.shyara.co.in/i/demo-invite')}>
            Copy Link
          </Button>
          <Button variant="outline" className="w-full font-body">
            Share via WhatsApp
          </Button>
          <Button asChild variant="ghost" className="w-full font-body">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublishSuccess;
