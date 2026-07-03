/**
 * Types for Violations Monitoring Center
 */

export interface ViolationRecord {
  id: number;
  victimName: string;
  type: ViolationType;
  description: string;
  date: string;
  governorate: string;
  status: 'pending' | 'approved' | 'rejected';
  lat: number;
  lng: number;
  media?: string[];
  createdAt: string;
}

export type ViolationType = 
  | 'journalist_attack' 
  | 'civilian_harm' 
  | 'property_damage'
  | 'freedom_restriction'
  | 'detention'
  | 'discrimination'
  | 'other';

export interface ViolationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  thisMonth: number;
  trend: number; // percentage change
}

export interface ViolationTrend {
  date: string;
  count: number;
  type: string;
}

export interface ViolationByGovernorate {
  governorate: string;
  count: number;
  percentage: number;
}

export interface ViolationByType {
  type: string;
  count: number;
  color: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'trend' | 'anomaly' | 'prediction' | 'pattern';
  createdAt: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  read: boolean;
}
