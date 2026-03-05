import {
  Shield,
  Zap,
  Users,
  Building2,
  Bell,
  ClipboardList,
} from 'lucide-react';

export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
];

export const TRUST_ITEMS = [
  { icon: Shield, label: 'Secure by default' },
  { icon: Zap, label: 'Real-time sync' },
  { icon: Users, label: 'Role-based access' },
  { icon: Building2, label: 'Multi-property' },
  { icon: Bell, label: 'Smart alerts' },
  { icon: ClipboardList, label: '6-stage workflow' },
];

export const NOTIFICATIONS = [
  { text: 'Ticket TK-2847 assigned to you', time: '2m ago', icon: '🔧' },
  { text: 'TK-2841 marked as completed', time: '15m ago', icon: '✅' },
  { text: 'New ticket from Apt 3A', time: '5m ago', icon: '🆕' },
  { text: 'TK-2846 status: In Progress', time: '8m ago', icon: '⚡' },
  { text: 'Maintenance scheduled — Bldg B', time: '22m ago', icon: '📅' },
];

export const WORKFLOW_STAGES = ['Open', 'Assigned', 'In Progress', 'Completed', 'Approved', 'Closed'];

export const PRICING_TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For small teams getting started',
    features: [
      'Up to 2 properties',
      'Up to 10 users',
      'Basic notifications',
      'Community support',
    ],
    cta: 'Get Started',
    href: '/login',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing property managers',
    features: [
      'Unlimited properties',
      'Unlimited users',
      'Priority support',
      'Advanced analytics',
    ],
    cta: 'Start Free Trial',
    href: '/login',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large-scale operations',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    href: '#',
    highlighted: false,
  },
];
