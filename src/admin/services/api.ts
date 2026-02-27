import {
  AdminCustomer, AdminInvite, AdminTransaction, AdminTemplate,
  AdminCategory, AdminPromoCode, AdminAnnouncement, AdminSettings,
  ActivityLogEntry, InternalNote, DashboardStats, GlobalSearchResult,
  FeatureFlag,
} from '../types';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms + Math.random() * 200));

// ─── Mock Data ───────────────────────────────────────────────────

let mockCustomers: AdminCustomer[] = [
  { id: 'cust-1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43210', joinDate: '2025-11-15T10:00:00Z', totalInvites: 3, totalSpent: 1497, status: 'active', lastActive: '2026-02-27T08:30:00Z', plan: 'premium' },
  { id: 'cust-2', name: 'Rahul Mehta', email: 'rahul@example.com', phone: '+91 99887 76543', joinDate: '2025-12-01T14:00:00Z', totalInvites: 1, totalSpent: 499, status: 'active', lastActive: '2026-02-26T16:00:00Z', plan: 'premium' },
  { id: 'cust-3', name: 'Ananya Patel', email: 'ananya@example.com', phone: '+91 98123 45678', joinDate: '2026-01-05T09:00:00Z', totalInvites: 2, totalSpent: 998, status: 'active', lastActive: '2026-02-25T12:00:00Z', plan: 'premium' },
  { id: 'cust-4', name: 'Vikram Reddy', email: 'vikram@example.com', phone: '+91 91234 56789', joinDate: '2026-01-10T11:00:00Z', totalInvites: 0, totalSpent: 0, status: 'active', lastActive: '2026-02-20T09:00:00Z', plan: 'free' },
  { id: 'cust-5', name: 'Neha Gupta', email: 'neha@example.com', phone: '+91 99001 12233', joinDate: '2026-01-15T08:00:00Z', totalInvites: 1, totalSpent: 499, status: 'suspended', lastActive: '2026-02-10T14:00:00Z', plan: 'premium' },
  { id: 'cust-6', name: 'Arjun Singh', email: 'arjun@example.com', phone: '+91 98765 11111', joinDate: '2026-01-20T10:00:00Z', totalInvites: 1, totalSpent: 499, status: 'active', lastActive: '2026-02-27T07:00:00Z', plan: 'premium' },
  { id: 'cust-7', name: 'Kavita Nair', email: 'kavita@example.com', phone: '+91 99876 54321', joinDate: '2026-01-22T12:00:00Z', totalInvites: 0, totalSpent: 0, status: 'active', lastActive: '2026-02-24T10:00:00Z', plan: 'free' },
  { id: 'cust-8', name: 'Deepak Joshi', email: 'deepak@example.com', phone: '+91 91111 22222', joinDate: '2026-01-25T15:00:00Z', totalInvites: 2, totalSpent: 998, status: 'active', lastActive: '2026-02-26T18:00:00Z', plan: 'premium' },
  { id: 'cust-9', name: 'Sunita Reddy', email: 'sunita@example.com', phone: '+91 98888 77777', joinDate: '2026-02-01T09:00:00Z', totalInvites: 1, totalSpent: 299, status: 'active', lastActive: '2026-02-27T06:00:00Z', plan: 'premium' },
  { id: 'cust-10', name: 'Manish Kumar', email: 'manish@example.com', phone: '+91 97777 66666', joinDate: '2026-02-03T10:00:00Z', totalInvites: 0, totalSpent: 0, status: 'active', lastActive: '2026-02-22T11:00:00Z', plan: 'free' },
  { id: 'cust-11', name: 'Pooja Das', email: 'pooja@example.com', phone: '+91 96666 55555', joinDate: '2026-02-05T08:00:00Z', totalInvites: 1, totalSpent: 499, status: 'active', lastActive: '2026-02-27T09:00:00Z', plan: 'premium' },
  { id: 'cust-12', name: 'Riya Kapoor', email: 'riya@example.com', phone: '+91 95555 44444', joinDate: '2026-02-07T14:00:00Z', totalInvites: 0, totalSpent: 0, status: 'active', lastActive: '2026-02-23T16:00:00Z', plan: 'free' },
  { id: 'cust-13', name: 'Sameer Khan', email: 'sameer@example.com', phone: '+91 94444 33333', joinDate: '2026-02-10T11:00:00Z', totalInvites: 1, totalSpent: 699, status: 'active', lastActive: '2026-02-26T13:00:00Z', plan: 'premium' },
  { id: 'cust-14', name: 'Meera Iyer', email: 'meera@example.com', phone: '+91 93333 22222', joinDate: '2026-02-12T09:00:00Z', totalInvites: 2, totalSpent: 998, status: 'active', lastActive: '2026-02-27T10:00:00Z', plan: 'premium' },
  { id: 'cust-15', name: 'Rohan Verma', email: 'rohan@example.com', phone: '+91 92222 11111', joinDate: '2026-02-14T10:00:00Z', totalInvites: 0, totalSpent: 0, status: 'active', lastActive: '2026-02-21T08:00:00Z', plan: 'free' },
  { id: 'cust-16', name: 'Shreya Bose', email: 'shreya@example.com', phone: '+91 91111 00000', joinDate: '2026-02-16T12:00:00Z', totalInvites: 1, totalSpent: 499, status: 'active', lastActive: '2026-02-27T11:00:00Z', plan: 'premium' },
  { id: 'cust-17', name: 'Aditya Rao', email: 'aditya@example.com', phone: '+91 90000 99999', joinDate: '2026-02-18T08:00:00Z', totalInvites: 0, totalSpent: 0, status: 'active', lastActive: '2026-02-25T14:00:00Z', plan: 'free' },
  { id: 'cust-18', name: 'Divya Menon', email: 'divya@example.com', phone: '+91 89999 88888', joinDate: '2026-02-20T15:00:00Z', totalInvites: 1, totalSpent: 499, status: 'active', lastActive: '2026-02-27T07:30:00Z', plan: 'premium' },
  { id: 'cust-19', name: 'Karan Malhotra', email: 'karan@example.com', phone: '+91 88888 77777', joinDate: '2026-02-22T10:00:00Z', totalInvites: 0, totalSpent: 0, status: 'active', lastActive: '2026-02-26T09:00:00Z', plan: 'free' },
  { id: 'cust-20', name: 'Nisha Agarwal', email: 'nisha@example.com', phone: '+91 87777 66666', joinDate: '2026-02-24T09:00:00Z', totalInvites: 1, totalSpent: 299, status: 'active', lastActive: '2026-02-27T12:00:00Z', plan: 'premium' },
  { id: 'cust-21', name: 'Siddharth Chopra', email: 'sid@example.com', phone: '+91 86666 55555', joinDate: '2026-02-26T08:00:00Z', totalInvites: 0, totalSpent: 0, status: 'active', lastActive: '2026-02-27T08:00:00Z', plan: 'free' },
  { id: 'cust-22', name: 'Tanvi Shah', email: 'tanvi@example.com', phone: '+91 85555 44444', joinDate: '2026-02-27T06:00:00Z', totalInvites: 0, totalSpent: 0, status: 'active', lastActive: '2026-02-27T06:00:00Z', plan: 'free' },
];

let mockInvites: AdminInvite[] = [
  { id: 'ainv-1', customerId: 'cust-1', customerName: 'Priya Sharma', customerEmail: 'priya@example.com', templateSlug: 'royal-gold', templateName: 'Royal Gold', templateCategory: 'wedding', eventName: 'Sarah & Aryan Wedding', slug: 'sarah-and-aryan-2026', status: 'published', eventDate: '2026-04-15', rsvpCount: 8, viewCount: 142, createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-02-01T14:30:00Z' },
  { id: 'ainv-2', customerId: 'cust-1', customerName: 'Priya Sharma', customerEmail: 'priya@example.com', templateSlug: 'confetti-burst', templateName: 'Confetti Burst', templateCategory: 'birthday', eventName: 'Rahul Turns 30', slug: 'rahul-turns-30', status: 'draft', eventDate: '2026-05-20', rsvpCount: 0, viewCount: 5, createdAt: '2026-02-10T08:00:00Z', updatedAt: '2026-02-10T08:00:00Z' },
  { id: 'ainv-3', customerId: 'cust-1', customerName: 'Priya Sharma', customerEmail: 'priya@example.com', templateSlug: 'midnight-bloom', templateName: 'Midnight Bloom', templateCategory: 'engagement', eventName: 'Neha & Vikram Engagement', slug: 'neha-and-vikram', status: 'published', eventDate: '2026-03-20', rsvpCount: 5, viewCount: 89, createdAt: '2026-01-20T12:00:00Z', updatedAt: '2026-02-15T09:00:00Z' },
  { id: 'ainv-4', customerId: 'cust-2', customerName: 'Rahul Mehta', customerEmail: 'rahul@example.com', templateSlug: 'neon-glow', templateName: 'Neon Glow', templateCategory: 'birthday', eventName: 'DJ Night Birthday Bash', slug: 'dj-night-bash', status: 'published', eventDate: '2026-03-10', rsvpCount: 12, viewCount: 234, createdAt: '2026-01-25T14:00:00Z', updatedAt: '2026-02-20T10:00:00Z' },
  { id: 'ainv-5', customerId: 'cust-3', customerName: 'Ananya Patel', customerEmail: 'ananya@example.com', templateSlug: 'floral-garden', templateName: 'Floral Garden', templateCategory: 'wedding', eventName: 'Ananya & Dev Wedding', slug: 'ananya-dev-wedding', status: 'published', eventDate: '2026-06-01', rsvpCount: 15, viewCount: 310, createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-02-25T12:00:00Z' },
  { id: 'ainv-6', customerId: 'cust-3', customerName: 'Ananya Patel', customerEmail: 'ananya@example.com', templateSlug: 'little-star', templateName: 'Little Star', templateCategory: 'baby-shower', eventName: 'Baby Patel Shower', slug: 'baby-patel-shower', status: 'draft', eventDate: '2026-07-10', rsvpCount: 0, viewCount: 2, createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-02-15T10:00:00Z' },
  { id: 'ainv-7', customerId: 'cust-6', customerName: 'Arjun Singh', customerEmail: 'arjun@example.com', templateSlug: 'executive-edge', templateName: 'Executive Edge', templateCategory: 'corporate', eventName: 'Tech Summit 2026', slug: 'tech-summit-2026', status: 'published', eventDate: '2026-04-01', rsvpCount: 45, viewCount: 520, createdAt: '2026-02-05T10:00:00Z', updatedAt: '2026-02-26T08:00:00Z' },
  { id: 'ainv-8', customerId: 'cust-8', customerName: 'Deepak Joshi', customerEmail: 'deepak@example.com', templateSlug: 'celestial-dreams', templateName: 'Celestial Dreams', templateCategory: 'wedding', eventName: 'Deepak & Meera Wedding', slug: 'deepak-meera-forever', status: 'published', eventDate: '2026-05-15', rsvpCount: 22, viewCount: 198, createdAt: '2026-02-08T15:00:00Z', updatedAt: '2026-02-24T18:00:00Z' },
  { id: 'ainv-9', customerId: 'cust-8', customerName: 'Deepak Joshi', customerEmail: 'deepak@example.com', templateSlug: 'golden-ring', templateName: 'Golden Ring', templateCategory: 'engagement', eventName: 'Surprise Proposal Party', slug: 'surprise-proposal', status: 'taken-down', eventDate: '2026-03-01', rsvpCount: 3, viewCount: 45, createdAt: '2026-01-28T11:00:00Z', updatedAt: '2026-02-20T14:00:00Z' },
  { id: 'ainv-10', customerId: 'cust-9', customerName: 'Sunita Reddy', customerEmail: 'sunita@example.com', templateSlug: 'sweet-arrival', templateName: 'Sweet Arrival', templateCategory: 'baby-shower', eventName: 'Baby Reddy Celebration', slug: 'baby-reddy', status: 'published', eventDate: '2026-04-20', rsvpCount: 7, viewCount: 67, createdAt: '2026-02-12T09:00:00Z', updatedAt: '2026-02-26T11:00:00Z' },
  { id: 'ainv-11', customerId: 'cust-11', customerName: 'Pooja Das', customerEmail: 'pooja@example.com', templateSlug: 'rose-garden', templateName: 'Rose Garden', templateCategory: 'engagement', eventName: 'Pooja & Raj Ring Ceremony', slug: 'pooja-raj-engaged', status: 'published', eventDate: '2026-03-25', rsvpCount: 18, viewCount: 156, createdAt: '2026-02-10T08:00:00Z', updatedAt: '2026-02-25T09:00:00Z' },
  { id: 'ainv-12', customerId: 'cust-13', customerName: 'Sameer Khan', customerEmail: 'sameer@example.com', templateSlug: 'modern-summit', templateName: 'Modern Summit', templateCategory: 'corporate', eventName: 'Startup Meetup Q1', slug: 'startup-meetup-q1', status: 'expired', eventDate: '2026-02-15', rsvpCount: 30, viewCount: 412, createdAt: '2026-01-20T11:00:00Z', updatedAt: '2026-02-16T00:00:00Z' },
  { id: 'ainv-13', customerId: 'cust-14', customerName: 'Meera Iyer', customerEmail: 'meera@example.com', templateSlug: 'rustic-charm', templateName: 'Rustic Charm', templateCategory: 'wedding', eventName: 'Meera & Arun Garden Wedding', slug: 'meera-arun-garden', status: 'published', eventDate: '2026-05-25', rsvpCount: 10, viewCount: 88, createdAt: '2026-02-14T09:00:00Z', updatedAt: '2026-02-26T10:00:00Z' },
  { id: 'ainv-14', customerId: 'cust-14', customerName: 'Meera Iyer', customerEmail: 'meera@example.com', templateSlug: 'timeless-love', templateName: 'Timeless Love', templateCategory: 'anniversary', eventName: 'Parents 25th Anniversary', slug: 'parents-silver-jubilee', status: 'published', eventDate: '2026-04-10', rsvpCount: 14, viewCount: 95, createdAt: '2026-02-16T12:00:00Z', updatedAt: '2026-02-27T08:00:00Z' },
  { id: 'ainv-15', customerId: 'cust-16', customerName: 'Shreya Bose', customerEmail: 'shreya@example.com', templateSlug: 'eternal-vows', templateName: 'Eternal Vows', templateCategory: 'wedding', eventName: 'Shreya & Nikhil Wedding', slug: 'shreya-nikhil-2026', status: 'draft', eventDate: '2026-08-01', rsvpCount: 0, viewCount: 12, createdAt: '2026-02-20T12:00:00Z', updatedAt: '2026-02-22T15:00:00Z' },
  { id: 'ainv-16', customerId: 'cust-18', customerName: 'Divya Menon', customerEmail: 'divya@example.com', templateSlug: 'confetti-burst', templateName: 'Confetti Burst', templateCategory: 'birthday', eventName: 'Divya\'s 28th Birthday', slug: 'divya-28th', status: 'published', eventDate: '2026-03-15', rsvpCount: 9, viewCount: 76, createdAt: '2026-02-22T15:00:00Z', updatedAt: '2026-02-26T09:00:00Z' },
  { id: 'ainv-17', customerId: 'cust-20', customerName: 'Nisha Agarwal', customerEmail: 'nisha@example.com', templateSlug: 'little-star', templateName: 'Little Star', templateCategory: 'baby-shower', eventName: 'Nisha Baby Shower', slug: 'nisha-baby-shower', status: 'published', eventDate: '2026-04-05', rsvpCount: 6, viewCount: 43, createdAt: '2026-02-24T09:00:00Z', updatedAt: '2026-02-27T07:00:00Z' },
  { id: 'ainv-18', customerId: 'cust-4', customerName: 'Vikram Reddy', customerEmail: 'vikram@example.com', templateSlug: 'royal-gold', templateName: 'Royal Gold', templateCategory: 'wedding', eventName: 'Vikram & Priya Reception', slug: 'vikram-priya-reception', status: 'draft', eventDate: '2026-06-20', rsvpCount: 0, viewCount: 3, createdAt: '2026-02-25T08:00:00Z', updatedAt: '2026-02-25T08:00:00Z' },
  { id: 'ainv-19', customerId: 'cust-7', customerName: 'Kavita Nair', customerEmail: 'kavita@example.com', templateSlug: 'floral-garden', templateName: 'Floral Garden', templateCategory: 'wedding', eventName: 'Kavita & Suresh Wedding', slug: 'kavita-suresh', status: 'published', eventDate: '2026-07-15', rsvpCount: 20, viewCount: 180, createdAt: '2026-02-18T10:00:00Z', updatedAt: '2026-02-27T09:00:00Z' },
  { id: 'ainv-20', customerId: 'cust-10', customerName: 'Manish Kumar', customerEmail: 'manish@example.com', templateSlug: 'neon-glow', templateName: 'Neon Glow', templateCategory: 'birthday', eventName: 'Manish 25th Birthday', slug: 'manish-25th', status: 'published', eventDate: '2026-04-12', rsvpCount: 11, viewCount: 98, createdAt: '2026-02-20T11:00:00Z', updatedAt: '2026-02-26T14:00:00Z' },
  { id: 'ainv-21', customerId: 'cust-12', customerName: 'Riya Kapoor', customerEmail: 'riya@example.com', templateSlug: 'midnight-bloom', templateName: 'Midnight Bloom', templateCategory: 'engagement', eventName: 'Riya & Amit Engagement', slug: 'riya-amit-engaged', status: 'published', eventDate: '2026-05-05', rsvpCount: 16, viewCount: 145, createdAt: '2026-02-15T13:00:00Z', updatedAt: '2026-02-27T08:00:00Z' },
  { id: 'ainv-22', customerId: 'cust-15', customerName: 'Rohan Verma', customerEmail: 'rohan@example.com', templateSlug: 'executive-edge', templateName: 'Executive Edge', templateCategory: 'corporate', eventName: 'Annual Board Meeting', slug: 'annual-board-2026', status: 'draft', eventDate: '2026-06-01', rsvpCount: 0, viewCount: 8, createdAt: '2026-02-22T09:00:00Z', updatedAt: '2026-02-22T09:00:00Z' },
  { id: 'ainv-23', customerId: 'cust-17', customerName: 'Aditya Rao', customerEmail: 'aditya@example.com', templateSlug: 'celestial-dreams', templateName: 'Celestial Dreams', templateCategory: 'wedding', eventName: 'Aditya & Sonal Wedding', slug: 'aditya-sonal-forever', status: 'published', eventDate: '2026-08-20', rsvpCount: 5, viewCount: 55, createdAt: '2026-02-23T10:00:00Z', updatedAt: '2026-02-27T06:00:00Z' },
  { id: 'ainv-24', customerId: 'cust-19', customerName: 'Karan Malhotra', customerEmail: 'karan@example.com', templateSlug: 'rustic-charm', templateName: 'Rustic Charm', templateCategory: 'wedding', eventName: 'Karan & Sneha Garden Wedding', slug: 'karan-sneha-garden', status: 'published', eventDate: '2026-09-10', rsvpCount: 8, viewCount: 72, createdAt: '2026-02-24T14:00:00Z', updatedAt: '2026-02-27T10:00:00Z' },
  { id: 'ainv-25', customerId: 'cust-21', customerName: 'Siddharth Chopra', customerEmail: 'sid@example.com', templateSlug: 'confetti-burst', templateName: 'Confetti Burst', templateCategory: 'birthday', eventName: 'Sid Birthday Bash', slug: 'sid-birthday-bash', status: 'draft', eventDate: '2026-05-30', rsvpCount: 0, viewCount: 1, createdAt: '2026-02-26T08:00:00Z', updatedAt: '2026-02-26T08:00:00Z' },
  { id: 'ainv-26', customerId: 'cust-22', customerName: 'Tanvi Shah', customerEmail: 'tanvi@example.com', templateSlug: 'golden-ring', templateName: 'Golden Ring', templateCategory: 'engagement', eventName: 'Tanvi & Harsh Ring Ceremony', slug: 'tanvi-harsh-ring', status: 'draft', eventDate: '2026-06-15', rsvpCount: 0, viewCount: 0, createdAt: '2026-02-27T06:00:00Z', updatedAt: '2026-02-27T06:00:00Z' },
  { id: 'ainv-27', customerId: 'cust-2', customerName: 'Rahul Mehta', customerEmail: 'rahul@example.com', templateSlug: 'modern-summit', templateName: 'Modern Summit', templateCategory: 'corporate', eventName: 'Product Launch 2026', slug: 'product-launch-2026', status: 'published', eventDate: '2026-04-25', rsvpCount: 35, viewCount: 290, createdAt: '2026-02-12T11:00:00Z', updatedAt: '2026-02-27T07:00:00Z' },
  { id: 'ainv-28', customerId: 'cust-5', customerName: 'Neha Gupta', customerEmail: 'neha@example.com', templateSlug: 'sweet-arrival', templateName: 'Sweet Arrival', templateCategory: 'baby-shower', eventName: 'Neha Baby Shower', slug: 'neha-baby-celebration', status: 'taken-down', eventDate: '2026-03-28', rsvpCount: 4, viewCount: 38, createdAt: '2026-01-30T10:00:00Z', updatedAt: '2026-02-10T14:00:00Z' },
  { id: 'ainv-29', customerId: 'cust-9', customerName: 'Sunita Reddy', customerEmail: 'sunita@example.com', templateSlug: 'timeless-love', templateName: 'Timeless Love', templateCategory: 'anniversary', eventName: 'Reddy 30th Anniversary', slug: 'reddy-30th-anniversary', status: 'published', eventDate: '2026-05-10', rsvpCount: 12, viewCount: 110, createdAt: '2026-02-18T09:00:00Z', updatedAt: '2026-02-27T11:00:00Z' },
  { id: 'ainv-30', customerId: 'cust-11', customerName: 'Pooja Das', customerEmail: 'pooja@example.com', templateSlug: 'eternal-vows', templateName: 'Eternal Vows', templateCategory: 'wedding', eventName: 'Pooja & Aryan Wedding', slug: 'pooja-aryan-vows', status: 'published', eventDate: '2026-07-20', rsvpCount: 19, viewCount: 165, createdAt: '2026-02-19T08:00:00Z', updatedAt: '2026-02-27T09:00:00Z' },
  { id: 'ainv-31', customerId: 'cust-16', customerName: 'Shreya Bose', customerEmail: 'shreya@example.com', templateSlug: 'little-star', templateName: 'Little Star', templateCategory: 'baby-shower', eventName: 'Shreya Baby Shower', slug: 'shreya-baby-star', status: 'published', eventDate: '2026-06-08', rsvpCount: 7, viewCount: 52, createdAt: '2026-02-25T12:00:00Z', updatedAt: '2026-02-27T08:00:00Z' },
  { id: 'ainv-32', customerId: 'cust-13', customerName: 'Sameer Khan', customerEmail: 'sameer@example.com', templateSlug: 'neon-glow', templateName: 'Neon Glow', templateCategory: 'birthday', eventName: 'Sameer Farewell Party', slug: 'sameer-farewell', status: 'expired', eventDate: '2026-02-20', rsvpCount: 22, viewCount: 195, createdAt: '2026-02-05T10:00:00Z', updatedAt: '2026-02-21T00:00:00Z' },
];

let mockTransactions: AdminTransaction[] = [
  { id: 'txn-001', customerId: 'cust-1', customerName: 'Priya Sharma', templateSlug: 'royal-gold', templateName: 'Royal Gold', amount: 499, currency: 'INR', date: '2026-01-15T10:30:00Z', status: 'success' },
  { id: 'txn-002', customerId: 'cust-1', customerName: 'Priya Sharma', templateSlug: 'confetti-burst', templateName: 'Confetti Burst', amount: 499, currency: 'INR', date: '2026-02-10T08:15:00Z', status: 'success' },
  { id: 'txn-003', customerId: 'cust-1', customerName: 'Priya Sharma', templateSlug: 'midnight-bloom', templateName: 'Midnight Bloom', amount: 499, currency: 'INR', date: '2026-01-20T12:30:00Z', status: 'success' },
  { id: 'txn-004', customerId: 'cust-2', customerName: 'Rahul Mehta', templateSlug: 'neon-glow', templateName: 'Neon Glow', amount: 499, currency: 'INR', date: '2026-01-25T14:15:00Z', status: 'success' },
  { id: 'txn-005', customerId: 'cust-3', customerName: 'Ananya Patel', templateSlug: 'floral-garden', templateName: 'Floral Garden', amount: 499, currency: 'INR', date: '2026-02-01T09:30:00Z', status: 'success' },
  { id: 'txn-006', customerId: 'cust-3', customerName: 'Ananya Patel', templateSlug: 'little-star', templateName: 'Little Star', amount: 499, currency: 'INR', date: '2026-02-15T10:15:00Z', status: 'success' },
  { id: 'txn-007', customerId: 'cust-5', customerName: 'Neha Gupta', templateSlug: 'rose-garden', templateName: 'Rose Garden', amount: 499, currency: 'INR', date: '2026-01-18T11:00:00Z', status: 'refunded', refundAmount: 499 },
  { id: 'txn-008', customerId: 'cust-6', customerName: 'Arjun Singh', templateSlug: 'executive-edge', templateName: 'Executive Edge', amount: 499, currency: 'INR', date: '2026-02-05T10:30:00Z', status: 'success' },
  { id: 'txn-009', customerId: 'cust-8', customerName: 'Deepak Joshi', templateSlug: 'celestial-dreams', templateName: 'Celestial Dreams', amount: 499, currency: 'INR', date: '2026-02-08T15:30:00Z', status: 'success' },
  { id: 'txn-010', customerId: 'cust-8', customerName: 'Deepak Joshi', templateSlug: 'golden-ring', templateName: 'Golden Ring', amount: 499, currency: 'INR', date: '2026-01-28T11:30:00Z', status: 'success' },
  { id: 'txn-011', customerId: 'cust-9', customerName: 'Sunita Reddy', templateSlug: 'sweet-arrival', templateName: 'Sweet Arrival', amount: 299, currency: 'INR', date: '2026-02-12T09:15:00Z', status: 'success' },
  { id: 'txn-012', customerId: 'cust-11', customerName: 'Pooja Das', templateSlug: 'rose-garden', templateName: 'Rose Garden', amount: 499, currency: 'INR', date: '2026-02-10T08:30:00Z', status: 'success' },
  { id: 'txn-013', customerId: 'cust-13', customerName: 'Sameer Khan', templateSlug: 'modern-summit', templateName: 'Modern Summit', amount: 699, currency: 'INR', date: '2026-01-20T11:30:00Z', status: 'success' },
  { id: 'txn-014', customerId: 'cust-14', customerName: 'Meera Iyer', templateSlug: 'rustic-charm', templateName: 'Rustic Charm', amount: 499, currency: 'INR', date: '2026-02-14T09:30:00Z', status: 'success' },
  { id: 'txn-015', customerId: 'cust-14', customerName: 'Meera Iyer', templateSlug: 'timeless-love', templateName: 'Timeless Love', amount: 499, currency: 'INR', date: '2026-02-16T12:30:00Z', status: 'success' },
  { id: 'txn-016', customerId: 'cust-16', customerName: 'Shreya Bose', templateSlug: 'eternal-vows', templateName: 'Eternal Vows', amount: 499, currency: 'INR', date: '2026-02-20T12:15:00Z', status: 'success' },
  { id: 'txn-017', customerId: 'cust-18', customerName: 'Divya Menon', templateSlug: 'confetti-burst', templateName: 'Confetti Burst', amount: 499, currency: 'INR', date: '2026-02-22T15:30:00Z', status: 'success' },
  { id: 'txn-018', customerId: 'cust-20', customerName: 'Nisha Agarwal', templateSlug: 'little-star', templateName: 'Little Star', amount: 299, currency: 'INR', date: '2026-02-24T09:15:00Z', status: 'success' },
  // Failed transactions
  { id: 'txn-019', customerId: 'cust-4', customerName: 'Vikram Reddy', templateSlug: 'royal-gold', templateName: 'Royal Gold', amount: 499, currency: 'INR', date: '2026-02-18T14:00:00Z', status: 'failed', failureReason: 'Card declined' },
  { id: 'txn-020', customerId: 'cust-7', customerName: 'Kavita Nair', templateSlug: 'floral-garden', templateName: 'Floral Garden', amount: 499, currency: 'INR', date: '2026-02-20T16:00:00Z', status: 'failed', failureReason: 'Session expired' },
  { id: 'txn-021', customerId: 'cust-10', customerName: 'Manish Kumar', templateSlug: 'neon-glow', templateName: 'Neon Glow', amount: 499, currency: 'INR', date: '2026-02-22T10:00:00Z', status: 'failed', failureReason: 'Insufficient funds' },
  { id: 'txn-022', customerId: 'cust-12', customerName: 'Riya Kapoor', templateSlug: 'midnight-bloom', templateName: 'Midnight Bloom', amount: 499, currency: 'INR', date: '2026-02-25T11:00:00Z', status: 'failed', failureReason: 'Card declined' },
  { id: 'txn-023', customerId: 'cust-15', customerName: 'Rohan Verma', templateSlug: 'executive-edge', templateName: 'Executive Edge', amount: 499, currency: 'INR', date: '2026-02-26T09:00:00Z', status: 'failed', failureReason: 'Payment gateway timeout' },
  { id: 'txn-024', customerId: 'cust-17', customerName: 'Aditya Rao', templateSlug: 'celestial-dreams', templateName: 'Celestial Dreams', amount: 499, currency: 'INR', date: '2026-02-27T08:00:00Z', status: 'failed', failureReason: 'Card declined' },
  { id: 'txn-025', customerId: 'cust-19', customerName: 'Karan Malhotra', templateSlug: 'rustic-charm', templateName: 'Rustic Charm', amount: 499, currency: 'INR', date: '2026-02-27T10:00:00Z', status: 'failed', failureReason: 'Session expired' },
  // Additional transactions to reach 50+
  { id: 'txn-026', customerId: 'cust-7', customerName: 'Kavita Nair', templateSlug: 'floral-garden', templateName: 'Floral Garden', amount: 499, currency: 'INR', date: '2026-02-18T10:30:00Z', status: 'success' },
  { id: 'txn-027', customerId: 'cust-10', customerName: 'Manish Kumar', templateSlug: 'neon-glow', templateName: 'Neon Glow', amount: 499, currency: 'INR', date: '2026-02-20T11:30:00Z', status: 'success' },
  { id: 'txn-028', customerId: 'cust-12', customerName: 'Riya Kapoor', templateSlug: 'midnight-bloom', templateName: 'Midnight Bloom', amount: 499, currency: 'INR', date: '2026-02-15T13:30:00Z', status: 'success' },
  { id: 'txn-029', customerId: 'cust-15', customerName: 'Rohan Verma', templateSlug: 'executive-edge', templateName: 'Executive Edge', amount: 699, currency: 'INR', date: '2026-02-22T09:30:00Z', status: 'success' },
  { id: 'txn-030', customerId: 'cust-17', customerName: 'Aditya Rao', templateSlug: 'celestial-dreams', templateName: 'Celestial Dreams', amount: 499, currency: 'INR', date: '2026-02-23T10:30:00Z', status: 'success' },
  { id: 'txn-031', customerId: 'cust-19', customerName: 'Karan Malhotra', templateSlug: 'rustic-charm', templateName: 'Rustic Charm', amount: 499, currency: 'INR', date: '2026-02-24T14:30:00Z', status: 'success' },
  { id: 'txn-032', customerId: 'cust-21', customerName: 'Siddharth Chopra', templateSlug: 'confetti-burst', templateName: 'Confetti Burst', amount: 499, currency: 'INR', date: '2026-02-26T08:30:00Z', status: 'success' },
  { id: 'txn-033', customerId: 'cust-2', customerName: 'Rahul Mehta', templateSlug: 'modern-summit', templateName: 'Modern Summit', amount: 699, currency: 'INR', date: '2026-02-12T11:30:00Z', status: 'success' },
  { id: 'txn-034', customerId: 'cust-9', customerName: 'Sunita Reddy', templateSlug: 'timeless-love', templateName: 'Timeless Love', amount: 499, currency: 'INR', date: '2026-02-18T09:30:00Z', status: 'success' },
  { id: 'txn-035', customerId: 'cust-11', customerName: 'Pooja Das', templateSlug: 'eternal-vows', templateName: 'Eternal Vows', amount: 499, currency: 'INR', date: '2026-02-19T08:30:00Z', status: 'success' },
  { id: 'txn-036', customerId: 'cust-16', customerName: 'Shreya Bose', templateSlug: 'little-star', templateName: 'Little Star', amount: 299, currency: 'INR', date: '2026-02-25T12:30:00Z', status: 'success' },
  { id: 'txn-037', customerId: 'cust-13', customerName: 'Sameer Khan', templateSlug: 'neon-glow', templateName: 'Neon Glow', amount: 499, currency: 'INR', date: '2026-02-05T10:30:00Z', status: 'success' },
  { id: 'txn-038', customerId: 'cust-1', customerName: 'Priya Sharma', templateSlug: 'eternal-vows', templateName: 'Eternal Vows', amount: 499, currency: 'INR', date: '2026-02-26T10:00:00Z', status: 'success' },
  { id: 'txn-039', customerId: 'cust-3', customerName: 'Ananya Patel', templateSlug: 'rose-garden', templateName: 'Rose Garden', amount: 499, currency: 'INR', date: '2026-02-20T14:00:00Z', status: 'success' },
  { id: 'txn-040', customerId: 'cust-6', customerName: 'Arjun Singh', templateSlug: 'modern-summit', templateName: 'Modern Summit', amount: 699, currency: 'INR', date: '2026-02-14T10:00:00Z', status: 'success' },
  { id: 'txn-041', customerId: 'cust-14', customerName: 'Meera Iyer', templateSlug: 'floral-garden', templateName: 'Floral Garden', amount: 499, currency: 'INR', date: '2026-02-22T14:00:00Z', status: 'success' },
  { id: 'txn-042', customerId: 'cust-8', customerName: 'Deepak Joshi', templateSlug: 'confetti-burst', templateName: 'Confetti Burst', amount: 499, currency: 'INR', date: '2026-02-23T09:00:00Z', status: 'success' },
  { id: 'txn-043', customerId: 'cust-20', customerName: 'Nisha Agarwal', templateSlug: 'sweet-arrival', templateName: 'Sweet Arrival', amount: 299, currency: 'INR', date: '2026-02-25T10:00:00Z', status: 'success' },
  { id: 'txn-044', customerId: 'cust-22', customerName: 'Tanvi Shah', templateSlug: 'golden-ring', templateName: 'Golden Ring', amount: 499, currency: 'INR', date: '2026-02-27T06:30:00Z', status: 'success' },
  { id: 'txn-045', customerId: 'cust-5', customerName: 'Neha Gupta', templateSlug: 'sweet-arrival', templateName: 'Sweet Arrival', amount: 299, currency: 'INR', date: '2026-01-30T10:30:00Z', status: 'refunded', refundAmount: 299 },
  { id: 'txn-046', customerId: 'cust-4', customerName: 'Vikram Reddy', templateSlug: 'royal-gold', templateName: 'Royal Gold', amount: 499, currency: 'INR', date: '2026-02-25T08:30:00Z', status: 'success' },
  { id: 'txn-047', customerId: 'cust-18', customerName: 'Divya Menon', templateSlug: 'timeless-love', templateName: 'Timeless Love', amount: 499, currency: 'INR', date: '2026-02-26T15:00:00Z', status: 'success' },
  { id: 'txn-048', customerId: 'cust-2', customerName: 'Rahul Mehta', templateSlug: 'little-star', templateName: 'Little Star', amount: 299, currency: 'INR', date: '2026-02-24T10:00:00Z', status: 'success' },
  { id: 'txn-049', customerId: 'cust-7', customerName: 'Kavita Nair', templateSlug: 'celestial-dreams', templateName: 'Celestial Dreams', amount: 499, currency: 'INR', date: '2026-02-26T12:00:00Z', status: 'failed', failureReason: 'Card expired' },
  { id: 'txn-050', customerId: 'cust-10', customerName: 'Manish Kumar', templateSlug: 'royal-gold', templateName: 'Royal Gold', amount: 499, currency: 'INR', date: '2026-02-27T09:00:00Z', status: 'failed', failureReason: 'Bank declined' },
  { id: 'txn-051', customerId: 'cust-12', customerName: 'Riya Kapoor', templateSlug: 'confetti-burst', templateName: 'Confetti Burst', amount: 499, currency: 'INR', date: '2026-02-27T11:00:00Z', status: 'success' },
  { id: 'txn-052', customerId: 'cust-3', customerName: 'Ananya Patel', templateSlug: 'executive-edge', templateName: 'Executive Edge', amount: 699, currency: 'INR', date: '2026-02-27T12:00:00Z', status: 'success' },
];

let mockTemplates: AdminTemplate[] = [
  { slug: 'royal-gold', name: 'Royal Gold', category: 'wedding', tags: ['premium', 'elegant', 'gold'], price: 499, isFree: false, isVisible: true, isFeatured: true, purchaseCount: 24, previewCount: 580, activeInviteCount: 1, thumbnail: '/placeholder.svg', dateAdded: '2025-10-01', supportedSections: ['hero', 'story', 'schedule', 'gallery', 'venue', 'rsvp'] },
  { slug: 'floral-garden', name: 'Floral Garden', category: 'wedding', tags: ['floral', 'pastel', 'romantic'], price: 499, isFree: false, isVisible: true, isFeatured: true, purchaseCount: 18, previewCount: 420, activeInviteCount: 1, thumbnail: '/placeholder.svg', dateAdded: '2025-10-15', supportedSections: ['hero', 'story', 'schedule', 'gallery', 'venue', 'rsvp'] },
  { slug: 'celestial-dreams', name: 'Celestial Dreams', category: 'wedding', tags: ['starry', 'navy', 'elegant'], price: 499, isFree: false, isVisible: true, isFeatured: false, purchaseCount: 12, previewCount: 310, activeInviteCount: 1, thumbnail: '/placeholder.svg', dateAdded: '2025-11-01', supportedSections: ['hero', 'story', 'schedule', 'gallery', 'venue', 'rsvp'] },
  { slug: 'eternal-vows', name: 'Eternal Vows', category: 'wedding', tags: ['classic', 'ivory', 'timeless'], price: 499, isFree: false, isVisible: true, isFeatured: false, purchaseCount: 8, previewCount: 195, activeInviteCount: 1, thumbnail: '/placeholder.svg', dateAdded: '2025-11-15', supportedSections: ['hero', 'story', 'schedule', 'venue', 'rsvp'] },
  { slug: 'rustic-charm', name: 'Rustic Charm', category: 'wedding', tags: ['rustic', 'warm', 'country'], price: 499, isFree: false, isVisible: true, isFeatured: false, purchaseCount: 6, previewCount: 150, activeInviteCount: 1, thumbnail: '/placeholder.svg', dateAdded: '2025-12-01', supportedSections: ['hero', 'story', 'schedule', 'venue', 'rsvp'] },
  { slug: 'confetti-burst', name: 'Confetti Burst', category: 'birthday', tags: ['fun', 'colorful', 'party'], price: 499, isFree: false, isVisible: true, isFeatured: true, purchaseCount: 15, previewCount: 380, activeInviteCount: 2, thumbnail: '/placeholder.svg', dateAdded: '2025-10-20', supportedSections: ['hero', 'schedule', 'gallery', 'venue', 'rsvp'] },
  { slug: 'neon-glow', name: 'Neon Glow', category: 'birthday', tags: ['neon', 'dark', 'party'], price: 499, isFree: false, isVisible: true, isFeatured: false, purchaseCount: 10, previewCount: 290, activeInviteCount: 1, thumbnail: '/placeholder.svg', dateAdded: '2025-11-10', supportedSections: ['hero', 'schedule', 'gallery', 'venue', 'rsvp'] },
  { slug: 'midnight-bloom', name: 'Midnight Bloom', category: 'engagement', tags: ['dark', 'floral', 'romantic'], price: 499, isFree: false, isVisible: true, isFeatured: false, purchaseCount: 9, previewCount: 220, activeInviteCount: 1, thumbnail: '/placeholder.svg', dateAdded: '2025-11-20', supportedSections: ['hero', 'story', 'schedule', 'venue', 'rsvp'] },
  { slug: 'golden-ring', name: 'Golden Ring', category: 'engagement', tags: ['gold', 'elegant', 'ring'], price: 499, isFree: false, isVisible: true, isFeatured: false, purchaseCount: 7, previewCount: 180, activeInviteCount: 1, thumbnail: '/placeholder.svg', dateAdded: '2025-12-05', supportedSections: ['hero', 'story', 'schedule', 'venue', 'rsvp'] },
  { slug: 'rose-garden', name: 'Rose Garden', category: 'engagement', tags: ['rose', 'pink', 'garden'], price: 499, isFree: false, isVisible: true, isFeatured: false, purchaseCount: 5, previewCount: 140, activeInviteCount: 1, thumbnail: '/placeholder.svg', dateAdded: '2025-12-15', supportedSections: ['hero', 'story', 'schedule', 'venue', 'rsvp'] },
  { slug: 'executive-edge', name: 'Executive Edge', category: 'corporate', tags: ['professional', 'dark', 'modern'], price: 699, isFree: false, isVisible: true, isFeatured: true, purchaseCount: 11, previewCount: 260, activeInviteCount: 1, thumbnail: '/placeholder.svg', dateAdded: '2026-01-01', supportedSections: ['hero', 'schedule', 'gallery', 'venue', 'rsvp'] },
  { slug: 'modern-summit', name: 'Modern Summit', category: 'corporate', tags: ['clean', 'light', 'corporate'], price: 699, isFree: false, isVisible: true, isFeatured: false, purchaseCount: 4, previewCount: 110, activeInviteCount: 1, thumbnail: '/placeholder.svg', dateAdded: '2026-01-10', supportedSections: ['hero', 'schedule', 'venue', 'rsvp'] },
  { slug: 'little-star', name: 'Little Star', category: 'baby-shower', tags: ['cute', 'stars', 'blue'], price: 299, isFree: false, isVisible: true, isFeatured: false, purchaseCount: 8, previewCount: 190, activeInviteCount: 2, thumbnail: '/placeholder.svg', dateAdded: '2026-01-15', supportedSections: ['hero', 'schedule', 'gallery', 'venue', 'rsvp'] },
  { slug: 'sweet-arrival', name: 'Sweet Arrival', category: 'baby-shower', tags: ['pastel', 'pink', 'sweet'], price: 299, isFree: false, isVisible: true, isFeatured: false, purchaseCount: 3, previewCount: 95, activeInviteCount: 1, thumbnail: '/placeholder.svg', dateAdded: '2026-01-20', supportedSections: ['hero', 'schedule', 'gallery', 'venue', 'rsvp'] },
  { slug: 'timeless-love', name: 'Timeless Love', category: 'anniversary', tags: ['warm', 'classic', 'golden'], price: 499, isFree: false, isVisible: true, isFeatured: false, purchaseCount: 5, previewCount: 120, activeInviteCount: 1, thumbnail: '/placeholder.svg', dateAdded: '2026-01-25', supportedSections: ['hero', 'story', 'schedule', 'gallery', 'venue', 'rsvp'] },
];

let mockCategories: AdminCategory[] = [
  { id: 'cat-1', name: 'Wedding', slug: 'wedding', emoji: '💒', templateCount: 5, displayOrder: 1, isVisible: true },
  { id: 'cat-2', name: 'Birthday', slug: 'birthday', emoji: '🎂', templateCount: 2, displayOrder: 2, isVisible: true },
  { id: 'cat-3', name: 'Engagement', slug: 'engagement', emoji: '💍', templateCount: 3, displayOrder: 3, isVisible: true },
  { id: 'cat-4', name: 'Corporate', slug: 'corporate', emoji: '🏢', templateCount: 2, displayOrder: 4, isVisible: true },
  { id: 'cat-5', name: 'Baby Shower', slug: 'baby-shower', emoji: '👶', templateCount: 2, displayOrder: 5, isVisible: true },
  { id: 'cat-6', name: 'Anniversary', slug: 'anniversary', emoji: '❤️', templateCount: 1, displayOrder: 6, isVisible: true },
];

let mockPromoCodes: AdminPromoCode[] = [
  { id: 'promo-1', code: 'WELCOME20', discountType: 'percentage', discountValue: 20, appliesTo: 'all', usageCount: 34, usageLimit: 100, expiryDate: '2026-06-30', status: 'active', usageDetails: [{ customerName: 'Priya Sharma', customerEmail: 'priya@example.com', templateName: 'Royal Gold', date: '2026-01-15' }, { customerName: 'Rahul Mehta', customerEmail: 'rahul@example.com', templateName: 'Neon Glow', date: '2026-01-25' }] },
  { id: 'promo-2', code: 'FLAT100', discountType: 'flat', discountValue: 100, appliesTo: 'all', usageCount: 12, usageLimit: 50, expiryDate: '2026-04-30', status: 'active', usageDetails: [{ customerName: 'Ananya Patel', customerEmail: 'ananya@example.com', templateName: 'Floral Garden', date: '2026-02-01' }] },
  { id: 'promo-3', code: 'WEDDING10', discountType: 'percentage', discountValue: 10, appliesTo: 'category', appliesToValue: 'wedding', usageCount: 8, usageLimit: 30, expiryDate: '2026-05-31', status: 'active', usageDetails: [] },
  { id: 'promo-4', code: 'NEWYEAR25', discountType: 'percentage', discountValue: 25, appliesTo: 'all', usageCount: 45, usageLimit: 50, expiryDate: '2026-01-31', status: 'expired', usageDetails: [] },
  { id: 'promo-5', code: 'TESTCODE', discountType: 'flat', discountValue: 50, appliesTo: 'template', appliesToValue: 'royal-gold', usageCount: 0, usageLimit: 5, expiryDate: '2026-12-31', status: 'disabled', usageDetails: [] },
];

let mockAnnouncements: AdminAnnouncement[] = [
  { id: 'ann-1', subject: 'New Wedding Templates Available!', body: 'We are excited to announce 3 new wedding templates: Celestial Dreams, Eternal Vows, and Rustic Charm. Check them out in our gallery and create your perfect wedding invitation today!\n\nAll new templates come with a special launch discount of 20% off — use code WEDDING10 at checkout.', recipientTarget: 'all', dateSent: '2026-02-01T10:00:00Z', recipientCount: 18 },
  { id: 'ann-2', subject: 'Welcome to Shyara! 🎉', body: 'Thank you for joining Shyara! We\'re thrilled to have you. Browse our template gallery to find the perfect design for your next event.\n\nNeed help? Reply to this email or visit our support page.', recipientTarget: 'new_30d', dateSent: '2026-02-15T09:00:00Z', recipientCount: 8 },
  { id: 'ann-3', subject: 'Reminder: Share Your Invite Link', body: 'Hi there! We noticed you have an active invite that\'s ready to share. Don\'t forget to send your invite link to your guests so they can RSVP.\n\nYou can find your shareable link in your dashboard under "My Invites."', recipientTarget: 'active_invites', dateSent: '2026-02-20T14:00:00Z', recipientCount: 12 },
];

let mockActivityLog: ActivityLogEntry[] = [
  // Customer actions
  { id: 'act-1', customerId: 'cust-1', action: 'Registered account', timestamp: '2025-11-15T10:00:00Z', isAdminAction: false },
  { id: 'act-2', customerId: 'cust-1', action: 'Purchased template Royal Gold', timestamp: '2026-01-15T10:30:00Z', isAdminAction: false },
  { id: 'act-3', customerId: 'cust-1', action: 'Created invite "Sarah & Aryan Wedding"', timestamp: '2026-01-15T11:00:00Z', isAdminAction: false },
  { id: 'act-4', customerId: 'cust-1', action: 'Published invite sarah-and-aryan-2026', timestamp: '2026-01-16T14:00:00Z', isAdminAction: false },
  { id: 'act-5', customerId: 'cust-1', action: 'RSVP received from Ananya Patel (Attending, 2 guests)', timestamp: '2026-02-05T10:00:00Z', isAdminAction: false },
  { id: 'act-6', customerId: 'cust-1', action: 'Logged in', timestamp: '2026-02-27T08:30:00Z', isAdminAction: false },
  // Admin actions
  { id: 'act-7', customerId: 'cust-5', action: 'Account suspended', timestamp: '2026-02-10T14:30:00Z', isAdminAction: true, adminEmail: 'admin@shyara.co.in', details: 'Suspended due to payment dispute' },
  { id: 'act-8', customerId: 'cust-8', action: 'Invite "Surprise Proposal Party" taken down', timestamp: '2026-02-20T14:00:00Z', isAdminAction: true, adminEmail: 'admin@shyara.co.in', details: 'Customer requested takedown — event cancelled' },
  { id: 'act-9', customerId: 'cust-5', action: 'Refund of ₹499 issued for Rose Garden', timestamp: '2026-02-11T09:00:00Z', isAdminAction: true, adminEmail: 'admin@shyara.co.in', details: 'Full refund — customer complaint resolved' },
  // More customer actions
  { id: 'act-10', customerId: 'cust-2', action: 'Registered account', timestamp: '2025-12-01T14:00:00Z', isAdminAction: false },
  { id: 'act-11', customerId: 'cust-2', action: 'Purchased template Neon Glow', timestamp: '2026-01-25T14:15:00Z', isAdminAction: false },
  { id: 'act-12', customerId: 'cust-3', action: 'Registered account', timestamp: '2026-01-05T09:00:00Z', isAdminAction: false },
  { id: 'act-13', customerId: 'cust-6', action: 'Registered account', timestamp: '2026-01-20T10:00:00Z', isAdminAction: false },
  { id: 'act-14', customerId: 'cust-8', action: 'Registered account', timestamp: '2026-01-25T15:00:00Z', isAdminAction: false },
  { id: 'act-15', customerId: 'cust-9', action: 'Registered account', timestamp: '2026-02-01T09:00:00Z', isAdminAction: false },
];

let mockNotes: InternalNote[] = [
  { id: 'note-1', entityId: 'cust-5', entityType: 'customer', content: 'Customer disputed payment for Rose Garden template. Issued full refund and suspended account pending investigation.', authorEmail: 'admin@shyara.co.in', createdAt: '2026-02-10T14:35:00Z' },
  { id: 'note-2', entityId: 'cust-1', entityType: 'customer', content: 'VIP customer — created 3 invites, all performing well. Consider offering free upgrade.', authorEmail: 'support@shyara.co.in', createdAt: '2026-02-20T10:00:00Z' },
  { id: 'note-3', entityId: 'ainv-9', entityType: 'invite', content: 'Taken down per customer request — event was cancelled. Customer was understanding.', authorEmail: 'admin@shyara.co.in', createdAt: '2026-02-20T14:05:00Z' },
];

let mockSettings: AdminSettings = {
  currency: 'INR',
  defaultPremiumPrice: 499,
  maxFileSizes: { coverImage: 5, galleryPhoto: 3, introAnimation: 10 },
  maintenanceMode: false,
  rsvpDeadlineDays: 7,
  featureFlags: [
    { id: 'ff-1', label: 'Google Login', description: 'Allow customers to sign in with Google', enabled: true },
    { id: 'ff-2', label: 'Promo Codes', description: 'Enable promotional discount codes at checkout', enabled: true },
    { id: 'ff-3', label: 'Public Template Preview', description: 'Allow non-logged-in users to preview templates', enabled: true },
    { id: 'ff-4', label: 'RSVP Notifications', description: 'Send email notifications when new RSVPs are received', enabled: false },
    { id: 'ff-5', label: 'Multi-language Invites', description: 'Allow invites to be created in multiple languages', enabled: false },
  ],
};

let nextId = 100;
const genId = (prefix: string) => `${prefix}-${nextId++}`;

// ─── Admin API Service ───────────────────────────────────────────

export const adminApi = {
  // ── Auth ──
  login: async (email: string, password: string) => {
    await delay(600);
    if (email === 'admin@shyara.co.in' && password === 'admin123') {
      return { id: 'admin-1', name: 'Admin User', email, role: 'admin' as const };
    }
    if (email === 'support@shyara.co.in' && password === 'support123') {
      return { id: 'support-1', name: 'Support Agent', email, role: 'support' as const };
    }
    throw new Error('Invalid credentials');
  },

  // ── Dashboard Stats ──
  getOverview: async (): Promise<DashboardStats> => {
    await delay(500);
    return {
      totalUsers: mockCustomers.length,
      totalUsersChange: 12.5,
      activeInvites: mockInvites.filter(i => i.status === 'published').length,
      activeInvitesChange: 8.3,
      todayRevenue: 1497,
      todayRevenueChange: -5.2,
      newSignupsToday: 2,
      newSignupsTodayChange: 33.3,
      totalTemplates: mockTemplates.length,
      totalTemplatesChange: 0,
      totalRsvps: mockInvites.reduce((s, i) => s + i.rsvpCount, 0),
      totalRsvpsChange: 15.4,
    };
  },

  getRevenueChart: async (period: '7d' | '30d' | '90d') => {
    await delay(400);
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().slice(0, 10),
      revenue: Math.floor(Math.random() * 3000) + 500,
    }));
  },

  getRecentSignups: async () => {
    await delay(300);
    return [...mockCustomers].sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()).slice(0, 10);
  },

  getRecentTransactions: async () => {
    await delay(300);
    return [...mockTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  },

  getTopTemplates: async () => {
    await delay(300);
    return [...mockTemplates].sort((a, b) => b.purchaseCount - a.purchaseCount).slice(0, 5);
  },

  getPlatformAlerts: async () => {
    await delay(200);
    const failedCount = mockTransactions.filter(t => t.status === 'failed' && new Date(t.date) > new Date(Date.now() - 86400000)).length;
    const takenDown = mockInvites.filter(i => i.status === 'taken-down').length;
    return { failedPayments24h: failedCount, takenDownInvites: takenDown, suspendedAccounts: mockCustomers.filter(c => c.status === 'suspended').length };
  },

  // ── Customers ──
  getCustomers: async () => {
    await delay(500);
    return [...mockCustomers];
  },

  getCustomer: async (id: string) => {
    await delay(300);
    const c = mockCustomers.find(c => c.id === id);
    if (!c) throw new Error('Customer not found');
    return c;
  },

  createCustomer: async (data: { name: string; email: string; phone: string; plan: 'free' | 'premium' }) => {
    await delay(600);
    const c: AdminCustomer = { id: genId('cust'), ...data, joinDate: new Date().toISOString(), totalInvites: 0, totalSpent: 0, status: 'active', lastActive: new Date().toISOString() };
    mockCustomers.push(c);
    return c;
  },

  updateCustomer: async (id: string, data: Partial<AdminCustomer>) => {
    await delay(500);
    const idx = mockCustomers.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Customer not found');
    mockCustomers[idx] = { ...mockCustomers[idx], ...data };
    return mockCustomers[idx];
  },

  deleteCustomer: async (id: string) => {
    await delay(500);
    mockCustomers = mockCustomers.filter(c => c.id !== id);
    return { success: true };
  },

  suspendCustomer: async (id: string) => {
    await delay(400);
    const c = mockCustomers.find(c => c.id === id);
    if (!c) throw new Error('Customer not found');
    c.status = 'suspended';
    mockActivityLog.push({ id: genId('act'), customerId: id, action: 'Account suspended', timestamp: new Date().toISOString(), isAdminAction: true, adminEmail: 'admin@shyara.co.in' });
    return c;
  },

  unsuspendCustomer: async (id: string) => {
    await delay(400);
    const c = mockCustomers.find(c => c.id === id);
    if (!c) throw new Error('Customer not found');
    c.status = 'active';
    mockActivityLog.push({ id: genId('act'), customerId: id, action: 'Account reactivated', timestamp: new Date().toISOString(), isAdminAction: true, adminEmail: 'admin@shyara.co.in' });
    return c;
  },

  unlockTemplate: async (customerId: string, templateSlug: string, reason: string, adminEmail: string) => {
    await delay(500);
    const template = mockTemplates.find(t => t.slug === templateSlug);
    const tName = template?.name || templateSlug;
    mockActivityLog.push({ id: genId('act'), customerId, action: `Template "${tName}" manually unlocked`, timestamp: new Date().toISOString(), isAdminAction: true, adminEmail, details: `Reason: ${reason}` });
    return { success: true };
  },

  getActivityLog: async (customerId: string) => {
    await delay(300);
    return mockActivityLog.filter(a => a.customerId === customerId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  // ── Internal Notes ──
  getNotes: async (entityId: string, entityType: 'customer' | 'invite') => {
    await delay(300);
    return mockNotes.filter(n => n.entityId === entityId && n.entityType === entityType).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addNote: async (data: { entityId: string; entityType: 'customer' | 'invite'; content: string; authorEmail: string }) => {
    await delay(400);
    const note: InternalNote = { id: genId('note'), ...data, createdAt: new Date().toISOString() };
    mockNotes.push(note);
    return note;
  },

  // ── Invites ──
  getInvites: async () => {
    await delay(500);
    return [...mockInvites];
  },

  getInvite: async (id: string) => {
    await delay(300);
    const inv = mockInvites.find(i => i.id === id);
    if (!inv) throw new Error('Invite not found');
    return inv;
  },

  updateInviteSlug: async (id: string, newSlug: string) => {
    await delay(400);
    const inv = mockInvites.find(i => i.id === id);
    if (!inv) throw new Error('Invite not found');
    const exists = mockInvites.some(i => i.slug === newSlug && i.id !== id);
    if (exists) throw new Error('Slug already taken');
    inv.slug = newSlug;
    inv.updatedAt = new Date().toISOString();
    return inv;
  },

  takedownInvite: async (id: string, adminEmail: string) => {
    await delay(400);
    const inv = mockInvites.find(i => i.id === id);
    if (!inv) throw new Error('Invite not found');
    inv.status = 'taken-down';
    inv.updatedAt = new Date().toISOString();
    mockActivityLog.push({ id: genId('act'), customerId: inv.customerId, action: `Invite "${inv.eventName}" taken down`, timestamp: new Date().toISOString(), isAdminAction: true, adminEmail });
    return inv;
  },

  republishInvite: async (id: string, adminEmail: string) => {
    await delay(400);
    const inv = mockInvites.find(i => i.id === id);
    if (!inv) throw new Error('Invite not found');
    inv.status = 'published';
    inv.updatedAt = new Date().toISOString();
    mockActivityLog.push({ id: genId('act'), customerId: inv.customerId, action: `Invite "${inv.eventName}" re-published`, timestamp: new Date().toISOString(), isAdminAction: true, adminEmail });
    return inv;
  },

  checkSlugAvailability: async (slug: string, excludeId?: string) => {
    await delay(200);
    const exists = mockInvites.some(i => i.slug === slug && i.id !== excludeId);
    return { available: !exists };
  },

  getInviteRsvps: async (inviteId: string) => {
    await delay(300);
    const inv = mockInvites.find(i => i.id === inviteId);
    if (!inv) return [];
    const count = inv.rsvpCount;
    const names = ['Aarav Patel', 'Ishaan Gupta', 'Myra Singh', 'Vihaan Kumar', 'Anaya Sharma', 'Reyansh Reddy', 'Diya Nair', 'Kabir Mehta', 'Sara Iyer', 'Arjun Das'];
    return Array.from({ length: count }, (_, i) => ({
      id: `rsvp-${inviteId}-${i}`,
      name: names[i % names.length],
      response: (['yes', 'yes', 'yes', 'maybe', 'no'] as const)[i % 5],
      guestCount: (i % 3) + 1,
      message: i % 3 === 0 ? 'Looking forward to it!' : i % 3 === 1 ? 'Will try to make it' : '',
      submittedAt: new Date(Date.now() - i * 86400000).toISOString(),
    }));
  },

  // ── Templates ──
  getTemplates: async () => {
    await delay(500);
    return [...mockTemplates];
  },

  getTemplate: async (slug: string) => {
    await delay(300);
    const t = mockTemplates.find(t => t.slug === slug);
    if (!t) throw new Error('Template not found');
    return t;
  },

  createTemplate: async (data: Omit<AdminTemplate, 'purchaseCount' | 'previewCount' | 'activeInviteCount' | 'dateAdded'>) => {
    await delay(600);
    const t: AdminTemplate = { ...data, purchaseCount: 0, previewCount: 0, activeInviteCount: 0, dateAdded: new Date().toISOString().slice(0, 10) };
    mockTemplates.push(t);
    // Update category count
    const cat = mockCategories.find(c => c.slug === t.category);
    if (cat) cat.templateCount++;
    return t;
  },

  updateTemplate: async (slug: string, data: Partial<AdminTemplate>) => {
    await delay(500);
    const idx = mockTemplates.findIndex(t => t.slug === slug);
    if (idx === -1) throw new Error('Template not found');
    mockTemplates[idx] = { ...mockTemplates[idx], ...data };
    return mockTemplates[idx];
  },

  deleteTemplate: async (slug: string) => {
    await delay(400);
    const t = mockTemplates.find(t => t.slug === slug);
    if (!t) throw new Error('Template not found');
    if (t.purchaseCount > 0 || t.activeInviteCount > 0) {
      throw new Error(`Cannot delete: purchased ${t.purchaseCount} times with ${t.activeInviteCount} active invites`);
    }
    mockTemplates = mockTemplates.filter(t => t.slug !== slug);
    const cat = mockCategories.find(c => c.slug === t.category);
    if (cat) cat.templateCount = Math.max(0, cat.templateCount - 1);
    return { success: true };
  },

  // ── Transactions ──
  getTransactions: async () => {
    await delay(500);
    return [...mockTransactions];
  },

  refundTransaction: async (id: string, data: { amount: number; keepInviteActive: boolean; adminEmail: string }) => {
    await delay(600);
    const txn = mockTransactions.find(t => t.id === id);
    if (!txn) throw new Error('Transaction not found');
    txn.status = 'refunded';
    txn.refundAmount = data.amount;
    mockActivityLog.push({ id: genId('act'), customerId: txn.customerId, action: `Refund of ₹${data.amount} issued for ${txn.templateName}`, timestamp: new Date().toISOString(), isAdminAction: true, adminEmail: data.adminEmail, details: data.keepInviteActive ? 'Invite kept active after refund' : 'Invite unpublished after refund' });
    if (!data.keepInviteActive) {
      const inv = mockInvites.find(i => i.customerId === txn.customerId && i.templateSlug === txn.templateSlug);
      if (inv) { inv.status = 'taken-down'; inv.updatedAt = new Date().toISOString(); }
    }
    return txn;
  },

  // ── Categories ──
  getCategories: async () => {
    await delay(300);
    return [...mockCategories].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  createCategory: async (data: { name: string; slug: string; emoji: string }) => {
    await delay(400);
    const cat: AdminCategory = { id: genId('cat'), ...data, templateCount: 0, displayOrder: mockCategories.length + 1, isVisible: true };
    mockCategories.push(cat);
    return cat;
  },

  updateCategory: async (id: string, data: Partial<AdminCategory>) => {
    await delay(400);
    const idx = mockCategories.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Category not found');
    mockCategories[idx] = { ...mockCategories[idx], ...data };
    return mockCategories[idx];
  },

  deleteCategory: async (id: string) => {
    await delay(400);
    const cat = mockCategories.find(c => c.id === id);
    if (!cat) throw new Error('Category not found');
    if (cat.templateCount > 0) throw new Error(`Cannot delete: ${cat.templateCount} templates assigned`);
    mockCategories = mockCategories.filter(c => c.id !== id);
    return { success: true };
  },

  reorderCategories: async (orderedIds: string[]) => {
    await delay(300);
    orderedIds.forEach((id, i) => {
      const cat = mockCategories.find(c => c.id === id);
      if (cat) cat.displayOrder = i + 1;
    });
    return mockCategories.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  // ── Promo Codes ──
  getPromoCodes: async () => {
    await delay(400);
    return [...mockPromoCodes];
  },

  createPromoCode: async (data: Omit<AdminPromoCode, 'id' | 'usageCount' | 'status' | 'usageDetails'>) => {
    await delay(500);
    const code: AdminPromoCode = { id: genId('promo'), ...data, usageCount: 0, status: 'active', usageDetails: [] };
    mockPromoCodes.push(code);
    return code;
  },

  updatePromoCode: async (id: string, data: Partial<AdminPromoCode>) => {
    await delay(400);
    const idx = mockPromoCodes.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Promo code not found');
    mockPromoCodes[idx] = { ...mockPromoCodes[idx], ...data };
    return mockPromoCodes[idx];
  },

  deletePromoCode: async (id: string) => {
    await delay(400);
    mockPromoCodes = mockPromoCodes.filter(p => p.id !== id);
    return { success: true };
  },

  // ── Announcements ──
  getAnnouncements: async () => {
    await delay(400);
    return [...mockAnnouncements].sort((a, b) => new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime());
  },

  sendAnnouncement: async (data: { subject: string; body: string; recipientTarget: AdminAnnouncement['recipientTarget']; recipientEmail?: string }) => {
    await delay(800);
    let recipientCount = 0;
    if (data.recipientTarget === 'all') recipientCount = mockCustomers.length;
    else if (data.recipientTarget === 'new_30d') recipientCount = 8;
    else if (data.recipientTarget === 'active_invites') recipientCount = mockCustomers.filter(c => c.totalInvites > 0).length;
    else recipientCount = 1;
    const ann: AdminAnnouncement = { id: genId('ann'), ...data, dateSent: new Date().toISOString(), recipientCount };
    mockAnnouncements.push(ann);
    return ann;
  },

  // ── Settings ──
  getSettings: async () => {
    await delay(300);
    return { ...mockSettings, featureFlags: [...mockSettings.featureFlags] };
  },

  updateSettings: async (data: Partial<AdminSettings>) => {
    await delay(500);
    mockSettings = { ...mockSettings, ...data };
    return mockSettings;
  },

  // ── Global Search ──
  globalSearch: async (query: string): Promise<GlobalSearchResult> => {
    await delay(300);
    const q = query.toLowerCase();
    return {
      customers: mockCustomers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).slice(0, 5).map(c => ({ id: c.id, name: c.name, email: c.email })),
      invites: mockInvites.filter(i => i.slug.toLowerCase().includes(q) || i.eventName.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q)).slice(0, 5).map(i => ({ id: i.id, slug: i.slug, eventName: i.eventName, customerName: i.customerName })),
      transactions: mockTransactions.filter(t => t.id.toLowerCase().includes(q) || t.customerName.toLowerCase().includes(q)).slice(0, 5).map(t => ({ id: t.id, customerName: t.customerName, amount: t.amount, status: t.status })),
    };
  },
};
