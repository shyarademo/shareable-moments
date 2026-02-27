import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Route-based code splitting — each page is its own chunk
const Home = lazy(() => import("./pages/Home"));
const Gallery = lazy(() => import("./pages/Gallery"));
const TemplatePreview = lazy(() => import("./pages/TemplatePreview"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CreateInvite = lazy(() => import("./pages/CreateInvite"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EditInvite = lazy(() => import("./pages/EditInvite"));
const RsvpManagement = lazy(() => import("./pages/RsvpManagement"));
const Account = lazy(() => import("./pages/Account"));
const Pricing = lazy(() => import("./pages/Pricing"));
const PublishSuccess = lazy(() => import("./pages/PublishSuccess"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Completely isolated — no shared layout with main site
const LiveInvite = lazy(() => import("./pages/LiveInvite"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-sm text-muted-foreground font-body">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Suspense fallback={<PageLoader />}>
          <BrowserRouter>
            <Routes>
              {/* Public pages */}
              <Route path="/" element={<Home />} />
              <Route path="/templates" element={<Gallery />} />
              <Route path="/templates/:slug/preview" element={<TemplatePreview />} />
              <Route path="/pricing" element={<Pricing />} />

              {/* Auth pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Authenticated pages */}
              <Route path="/checkout/:slug" element={<Checkout />} />
              <Route path="/create/:inviteId" element={<CreateInvite />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/invites/:inviteId/edit" element={<EditInvite />} />
              <Route path="/dashboard/invites/:inviteId/rsvps" element={<RsvpManagement />} />
              <Route path="/account" element={<Account />} />
              <Route path="/publish-success/:inviteId" element={<PublishSuccess />} />

              {/* Live invite — completely isolated, no site chrome */}
              <Route path="/i/:slug" element={<LiveInvite />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
