export interface News {
  id: string;
  title: { ar: string; en: string };
  content: { ar: string; en: string };
  featured_image: string;
  published_at: string;
  created_at: string;
}

export interface Violation {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

export interface Project {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  status: 'ongoing' | 'completed' | 'planned';
  fundingGoal: number;
  currentFunding: number;
  featured_image: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'staff' | 'journalist';
  name: string;
}

export interface Event {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  date: string;
  location: string;
}
