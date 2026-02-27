import { Invite, Rsvp, User, PublicInviteData, EventCategory } from '@/types';
import { allTemplates, getTemplateBySlug } from '@/templates/registry';

// --- Helpers ---
const delay = (ms: number = 400) => new Promise(resolve => setTimeout(resolve, ms + Math.random() * 200));

// --- Mock Data Store (in-memory, resets on refresh) ---
const mockUser: User = {
  id: 'user-1',
  name: 'Priya Sharma',
  email: 'priya@example.com',
  phone: '+91 98765 43210',
};

let mockInvites: Invite[] = [
  {
    id: 'inv-1',
    userId: 'user-1',
    templateSlug: 'royal-gold',
    templateCategory: 'wedding',
    slug: 'sarah-and-aryan-2026',
    status: 'published',
    data: getTemplateBySlug('royal-gold')!.dummyData,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-01T14:30:00Z',
    rsvpCount: 8,
    isPurchased: true,
  },
  {
    id: 'inv-2',
    userId: 'user-1',
    templateSlug: 'confetti-burst',
    templateCategory: 'birthday',
    slug: 'rahul-turns-30',
    status: 'draft',
    data: getTemplateBySlug('confetti-burst')!.dummyData,
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-02-10T08:00:00Z',
    rsvpCount: 0,
    isPurchased: true,
  },
  {
    id: 'inv-3',
    userId: 'user-1',
    templateSlug: 'midnight-bloom',
    templateCategory: 'engagement',
    slug: 'neha-and-vikram',
    status: 'published',
    data: getTemplateBySlug('midnight-bloom')!.dummyData,
    createdAt: '2026-01-20T12:00:00Z',
    updatedAt: '2026-02-15T09:00:00Z',
    rsvpCount: 5,
    isPurchased: true,
  },
];

// Demo invite for /i/demo-invite
const demoInvite: Invite = {
  id: 'inv-demo',
  userId: 'system',
  templateSlug: 'royal-gold',
  templateCategory: 'wedding',
  slug: 'demo-invite',
  status: 'published',
  data: getTemplateBySlug('royal-gold')!.dummyData,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  rsvpCount: 12,
  isPurchased: true,
};

// Taken-down demo invite
const takenDownInvite: Invite = {
  id: 'inv-taken-down',
  userId: 'system',
  templateSlug: 'royal-gold',
  templateCategory: 'wedding',
  slug: 'taken-down-demo',
  status: 'taken-down',
  data: getTemplateBySlug('royal-gold')!.dummyData,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-02-20T00:00:00Z',
  rsvpCount: 5,
  isPurchased: true,
};

const mockRsvps: Rsvp[] = [
  { id: 'rsvp-1', inviteId: 'inv-1', name: 'Ananya Patel', response: 'yes', guestCount: 2, message: 'Can\'t wait! So happy for you both! ❤️', submittedAt: '2026-02-05T10:00:00Z' },
  { id: 'rsvp-2', inviteId: 'inv-1', name: 'Rohit Mehra', response: 'yes', guestCount: 4, message: 'Bringing the whole family! Congratulations!', submittedAt: '2026-02-06T14:30:00Z' },
  { id: 'rsvp-3', inviteId: 'inv-1', name: 'Kavita Singh', response: 'maybe', guestCount: 1, message: 'Will confirm by next week — hoping to make it!', submittedAt: '2026-02-07T09:15:00Z' },
  { id: 'rsvp-4', inviteId: 'inv-1', name: 'Deepak Joshi', response: 'yes', guestCount: 2, message: 'Wouldn\'t miss it for the world!', submittedAt: '2026-02-08T16:00:00Z' },
  { id: 'rsvp-5', inviteId: 'inv-1', name: 'Sunita Reddy', response: 'no', guestCount: 0, message: 'So sorry — will be traveling. Sending all my love!', submittedAt: '2026-02-09T11:00:00Z' },
  { id: 'rsvp-6', inviteId: 'inv-1', name: 'Manish Gupta', response: 'yes', guestCount: 3, message: 'Looking forward to a beautiful celebration!', submittedAt: '2026-02-10T08:45:00Z' },
  { id: 'rsvp-7', inviteId: 'inv-1', name: 'Pooja Nair', response: 'yes', guestCount: 1, message: 'So excited! Need help with anything?', submittedAt: '2026-02-11T13:20:00Z' },
  { id: 'rsvp-8', inviteId: 'inv-1', name: 'Arjun Kapoor', response: 'maybe', guestCount: 2, message: 'Checking my schedule — will update soon!', submittedAt: '2026-02-12T17:30:00Z' },
  { id: 'rsvp-9', inviteId: 'inv-3', name: 'Riya Das', response: 'yes', guestCount: 1, message: 'Congratulations on the engagement! 💍', submittedAt: '2026-02-16T10:00:00Z' },
  { id: 'rsvp-10', inviteId: 'inv-3', name: 'Sameer Khan', response: 'yes', guestCount: 2, message: 'We\'ll be there! So happy for you!', submittedAt: '2026-02-17T14:00:00Z' },
];

let nextInviteId = 4;

// --- API Service Layer ---
export const api = {
  // ── Templates ──────────────────────────────────────────
  getTemplates: async (params?: { category?: EventCategory; sort?: string }) => {
    await delay();
    let templates = [...allTemplates];
    if (params?.category) {
      templates = templates.filter(t => t.category === params.category);
    }
    if (params?.sort === 'price') {
      templates.sort((a, b) => a.price - b.price);
    } else if (params?.sort === 'popular') {
      templates.sort((a, b) => b.tags.length - a.tags.length); // mock popularity
    }
    return templates;
  },

  getTemplate: async (slug: string) => {
    await delay(300);
    const template = getTemplateBySlug(slug);
    if (!template) throw new Error('Template not found');
    return template;
  },

  // ── Invites ────────────────────────────────────────────
  getInvites: async () => {
    await delay();
    return mockInvites.filter(i => i.userId === 'user-1');
  },

  getInvite: async (inviteId: string) => {
    await delay(300);
    const invite = mockInvites.find(i => i.id === inviteId);
    if (!invite) throw new Error('Invite not found');
    return invite;
  },

  createInvite: async (data: {
    templateSlug: string;
    templateCategory: EventCategory;
    slug: string;
    eventData: Record<string, any>;
  }): Promise<Invite> => {
    await delay(600);
    const newInvite: Invite = {
      id: `inv-${nextInviteId++}`,
      userId: 'user-1',
      templateSlug: data.templateSlug,
      templateCategory: data.templateCategory,
      slug: data.slug,
      status: 'published',
      data: data.eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rsvpCount: 0,
      isPurchased: true,
    };
    mockInvites.push(newInvite);
    return newInvite;
  },

  updateInvite: async (inviteId: string, data: Partial<Pick<Invite, 'data' | 'status' | 'slug'>>) => {
    await delay(500);
    const idx = mockInvites.findIndex(i => i.id === inviteId);
    if (idx === -1) throw new Error('Invite not found');
    mockInvites[idx] = {
      ...mockInvites[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockInvites[idx];
  },

  deleteInvite: async (inviteId: string) => {
    await delay(400);
    mockInvites = mockInvites.filter(i => i.id !== inviteId);
    return { success: true };
  },

  getPublicInvite: async (slug: string): Promise<PublicInviteData> => {
    await delay(300);
    // Check taken-down invite first
    if (slug === 'taken-down-demo') {
      return {
        templateSlug: takenDownInvite.templateSlug,
        templateCategory: takenDownInvite.templateCategory,
        data: takenDownInvite.data,
        inviteId: takenDownInvite.id,
        status: 'taken-down',
      };
    }
    const invite = slug === 'demo-invite'
      ? demoInvite
      : mockInvites.find(i => i.slug === slug && i.status === 'published');
    if (!invite) throw new Error('Invite not found');
    return {
      templateSlug: invite.templateSlug,
      templateCategory: invite.templateCategory,
      data: invite.data,
      inviteId: invite.id,
      status: invite.status,
    };
  },

  checkSlugAvailability: async (slug: string) => {
    await delay(300);
    const exists = mockInvites.some(i => i.slug === slug) || slug === 'demo-invite';
    return { available: !exists, suggestion: exists ? `${slug}-${Date.now() % 1000}` : slug };
  },

  // ── RSVPs ──────────────────────────────────────────────
  getRsvps: async (inviteId: string) => {
    await delay();
    return mockRsvps.filter(r => r.inviteId === inviteId);
  },

  submitRsvp: async (inviteId: string, data: { name: string; response: 'yes' | 'no' | 'maybe'; guestCount: number; message: string }) => {
    await delay(500);
    const newRsvp: Rsvp = {
      id: `rsvp-${Date.now()}`,
      inviteId,
      ...data,
      submittedAt: new Date().toISOString(),
    };
    mockRsvps.push(newRsvp);
    // Update RSVP count on invite
    const invite = mockInvites.find(i => i.id === inviteId);
    if (invite) invite.rsvpCount++;
    return newRsvp;
  },

  // ── Auth ───────────────────────────────────────────────
  login: async (_email: string, _password: string) => {
    await delay(600);
    return { user: mockUser, token: 'mock-jwt-token-xyz' };
  },

  register: async (name: string, email: string, _password: string) => {
    await delay(800);
    return { user: { ...mockUser, name, email }, token: 'mock-jwt-token-xyz' };
  },

  googleAuth: async () => {
    await delay(700);
    return { user: mockUser, token: 'mock-jwt-token-google' };
  },

  getMe: async () => {
    await delay(200);
    return mockUser;
  },

  updateProfile: async (data: Partial<User>) => {
    await delay(500);
    Object.assign(mockUser, data);
    return mockUser;
  },

  // ── Payments ───────────────────────────────────────────
  checkout: async (templateSlug: string) => {
    await delay(1000);
    const template = getTemplateBySlug(templateSlug);
    if (!template) throw new Error('Template not found');
    // Create invite instance on successful payment
    const newInvite: Invite = {
      id: `inv-${nextInviteId++}`,
      userId: 'user-1',
      templateSlug: template.slug,
      templateCategory: template.category,
      slug: '',
      status: 'draft',
      data: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rsvpCount: 0,
      isPurchased: true,
    };
    mockInvites.push(newInvite);
    return { success: true, inviteId: newInvite.id };
  },
};
