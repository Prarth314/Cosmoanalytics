// ═══════════════════════════════════════════
// COSMOLYTICS - Type Definitions
// ═══════════════════════════════════════════

export interface Asteroid {
  id: string;
  name: string;
  fullName: string;
  discoveryYear: number;
  composition: 'M' | 'C' | 'S';
  compositionLabel: string;
  orbit: {
    semiMajorAxis: number; // AU
    eccentricity: number;
    inclination: number; // degrees
    period: number; // years
  };
  physical: {
    diameter: number; // km
    mass: number; // kg
    albedo: number;
    rotationPeriod: number; // hours
  };
  value: number; // USD estimated
  valueBreakdown: {
    metals: number;
    water: number;
    rareEarth: number;
  };
  accessibility: {
    deltaV: number; // km/s
    nextWindow: string; // date
    transferTime: number; // years
    score: number; // 0-100
  };
  closeApproaches: CloseApproach[];
  miningFeasibility: number; // 0-100
  riskScore: number; // 0-100
}

export interface CloseApproach {
  date: string;
  distance: number; // AU
  velocity: number; // km/s
}

export interface Meteorite {
  id: string;
  name: string;
  classification: string;
  mass: number; // grams
  year: number;
  location: {
    lat: number;
    lng: number;
    country: string;
    region: string;
  };
  fell: boolean;
  composition: string;
  scientificValue: number; // 0-100
  marketValue: number; // USD/gram
}

export interface Exoplanet {
  id: string;
  name: string;
  starName: string;
  starType: 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';
  discoveryYear: number;
  discoveryMethod: string;
  distance: number; // light years
  orbital: {
    period: number; // days
    semiMajorAxis: number; // AU
    eccentricity: number;
  };
  physical: {
    mass: number; // Earth masses
    radius: number; // Earth radii
    temperature: number; // K
    gravity: number; // g
  };
  habitability: {
    score: number; // 0-100
    inHabitableZone: boolean;
    hasAtmosphere: boolean;
    hasWater: boolean;
    tidallyLocked: boolean;
  };
  atmosphere: string[];
}

export interface MissionConfig {
  target: Asteroid | null;
  launchWindow: string;
  spacecraft: SpacecraftType;
  missionProfile: MissionProfile;
}

export interface SpacecraftType {
  id: string;
  name: string;
  size: 'small' | 'medium' | 'large';
  mass: number; // kg
  deltavCapacity: number; // km/s
  baseCost: number; // USD
  payloadCapacity: number; // kg
  instruments: string[];
}

export type MissionProfile = 'flyby' | 'orbital' | 'landing' | 'sample-return';

export interface MissionResult {
  feasibility: number;
  totalDeltaV: number;
  duration: number; // years
  cost: CostBreakdown;
  roi: number;
  timeline: MissionMilestone[];
  successProbability: number;
}

export interface CostBreakdown {
  launch: number;
  spacecraft: number;
  operations: number;
  instruments: number;
  total: number;
}

export interface MissionMilestone {
  name: string;
  date: string;
  description: string;
  type: 'launch' | 'maneuver' | 'arrival' | 'operation' | 'return';
}

export interface Annotation {
  id: number;
  dataPoint: string;
  user: SimUser;
  type: 'insight' | 'question' | 'issue';
  content: string;
  upvotes: number;
  downvotes: number;
  timestamp: Date;
  replies: AnnotationReply[];
}

export interface AnnotationReply {
  id: number;
  user: SimUser;
  content: string;
  timestamp: Date;
}

export interface SimUser {
  name: string;
  initials: string;
  role?: string;
  avatar?: string;
  color?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  chart?: string;
  timestamp: Date;
}

export interface QueryIntent {
  type: 'accessibility' | 'value' | 'temporal' | 'habitability' | 'comparison' | 'search' | 'general' | 'count' | 'surprise';
  sort?: 'asc' | 'desc';
  limit?: number;
  filter?: string;
  page?: string;
  visualize?: string;
  term?: string;
  extract?: string[];
}

export interface DashboardWidget {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultSize: { w: number; h: number };
  type: string;
}

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  widget: DashboardWidget;
}

export interface Activity {
  id: number;
  user: SimUser;
  action: string;
  target: string;
  timestamp: Date;
}

export interface HistoricalEvent {
  year: number;
  event: string;
  category: 'discovery' | 'mission' | 'impact' | 'technology' | 'prediction';
}
