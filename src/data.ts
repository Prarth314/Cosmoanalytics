// ═══════════════════════════════════════════
// COSMOLYTICS - Mock Data
// Complete datasets for asteroids, meteorites, exoplanets
// ═══════════════════════════════════════════

import type { Asteroid, Meteorite, Exoplanet, Annotation, HistoricalEvent, SimUser, SpacecraftType } from './types';

// ─── ASTEROID DATA ──────────────────────────
export const asteroids: Asteroid[] = [
  {
    id: 'psyche', name: '16 Psyche', fullName: '16 Psyche (A886 BA)',
    discoveryYear: 1852, composition: 'M', compositionLabel: 'Metallic (Iron-Nickel)',
    orbit: { semiMajorAxis: 2.92, eccentricity: 0.134, inclination: 3.09, period: 4.99 },
    physical: { diameter: 226, mass: 2.72e19, albedo: 0.12, rotationPeriod: 4.196 },
    value: 10000e15, valueBreakdown: { metals: 8500e15, water: 200e15, rareEarth: 1300e15 },
    accessibility: { deltaV: 6.2, nextWindow: '2029-08-15', transferTime: 3.5, score: 42 },
    closeApproaches: [
      { date: '2029-08-15', distance: 1.55, velocity: 8.3 },
      { date: '2035-03-20', distance: 1.42, velocity: 7.9 },
    ],
    miningFeasibility: 65, riskScore: 45,
  },
  {
    id: 'davida', name: '511 Davida', fullName: '511 Davida (A903 KB)',
    discoveryYear: 1903, composition: 'C', compositionLabel: 'Carbonaceous',
    orbit: { semiMajorAxis: 3.16, eccentricity: 0.186, inclination: 15.93, period: 5.62 },
    physical: { diameter: 289, mass: 3.84e19, albedo: 0.054, rotationPeriod: 5.13 },
    value: 26800e12, valueBreakdown: { metals: 10000e12, water: 12000e12, rareEarth: 4800e12 },
    accessibility: { deltaV: 8.1, nextWindow: '2030-11-22', transferTime: 4.1, score: 28 },
    closeApproaches: [
      { date: '2030-11-22', distance: 2.2, velocity: 12.1 },
    ],
    miningFeasibility: 35, riskScore: 62,
  },
  {
    id: 'bennu', name: '101955 Bennu', fullName: '101955 Bennu (1999 RQ36)',
    discoveryYear: 1999, composition: 'C', compositionLabel: 'Carbonaceous',
    orbit: { semiMajorAxis: 1.126, eccentricity: 0.204, inclination: 6.03, period: 1.20 },
    physical: { diameter: 0.49, mass: 7.329e10, albedo: 0.044, rotationPeriod: 4.297 },
    value: 669e6, valueBreakdown: { metals: 200e6, water: 350e6, rareEarth: 119e6 },
    accessibility: { deltaV: 4.3, nextWindow: '2026-09-14', transferTime: 2.1, score: 92 },
    closeApproaches: [
      { date: '2026-09-14', distance: 0.005, velocity: 6.8 },
      { date: '2135-09-25', distance: 0.002, velocity: 5.9 },
    ],
    miningFeasibility: 88, riskScore: 15,
  },
  {
    id: 'ryugu', name: '162173 Ryugu', fullName: '162173 Ryugu (1999 JU3)',
    discoveryYear: 1999, composition: 'C', compositionLabel: 'Carbonaceous',
    orbit: { semiMajorAxis: 1.189, eccentricity: 0.190, inclination: 5.88, period: 1.30 },
    physical: { diameter: 0.896, mass: 4.5e11, albedo: 0.045, rotationPeriod: 7.627 },
    value: 5200e6, valueBreakdown: { metals: 1200e6, water: 3200e6, rareEarth: 800e6 },
    accessibility: { deltaV: 4.6, nextWindow: '2027-05-10', transferTime: 1.8, score: 89 },
    closeApproaches: [
      { date: '2027-05-10', distance: 0.06, velocity: 5.2 },
    ],
    miningFeasibility: 85, riskScore: 18,
  },
  {
    id: 'itokawa', name: '25143 Itokawa', fullName: '25143 Itokawa (1998 SF36)',
    discoveryYear: 1998, composition: 'S', compositionLabel: 'Silicaceous (Stony)',
    orbit: { semiMajorAxis: 1.324, eccentricity: 0.280, inclination: 1.62, period: 1.52 },
    physical: { diameter: 0.35, mass: 3.51e10, albedo: 0.53, rotationPeriod: 12.132 },
    value: 890e6, valueBreakdown: { metals: 600e6, water: 90e6, rareEarth: 200e6 },
    accessibility: { deltaV: 4.8, nextWindow: '2028-01-20', transferTime: 1.5, score: 85 },
    closeApproaches: [
      { date: '2028-01-20', distance: 0.04, velocity: 4.8 },
    ],
    miningFeasibility: 80, riskScore: 20,
  },
  {
    id: 'eros', name: '433 Eros', fullName: '433 Eros (A898 PA)',
    discoveryYear: 1898, composition: 'S', compositionLabel: 'Silicaceous (Stony)',
    orbit: { semiMajorAxis: 1.458, eccentricity: 0.223, inclination: 10.83, period: 1.76 },
    physical: { diameter: 16.84, mass: 6.687e15, albedo: 0.25, rotationPeriod: 5.27 },
    value: 1200e12, valueBreakdown: { metals: 800e12, water: 150e12, rareEarth: 250e12 },
    accessibility: { deltaV: 5.6, nextWindow: '2027-08-12', transferTime: 2.4, score: 72 },
    closeApproaches: [
      { date: '2027-08-12', distance: 0.15, velocity: 8.5 },
      { date: '2056-01-31', distance: 0.17, velocity: 9.2 },
    ],
    miningFeasibility: 70, riskScore: 28,
  },
  {
    id: 'apophis', name: '99942 Apophis', fullName: '99942 Apophis (2004 MN4)',
    discoveryYear: 2004, composition: 'S', compositionLabel: 'Silicaceous (Stony)',
    orbit: { semiMajorAxis: 0.922, eccentricity: 0.191, inclination: 3.33, period: 0.89 },
    physical: { diameter: 0.37, mass: 2.7e10, albedo: 0.23, rotationPeriod: 30.4 },
    value: 4750e6, valueBreakdown: { metals: 3200e6, water: 550e6, rareEarth: 1000e6 },
    accessibility: { deltaV: 4.1, nextWindow: '2029-04-13', transferTime: 0.8, score: 95 },
    closeApproaches: [
      { date: '2029-04-13', distance: 0.00025, velocity: 7.4 },
    ],
    miningFeasibility: 78, riskScore: 35,
  },
  {
    id: '2011_uw158', name: '2011 UW158', fullName: '2011 UW158',
    discoveryYear: 2011, composition: 'M', compositionLabel: 'Metallic (Iron-Nickel)',
    orbit: { semiMajorAxis: 1.62, eccentricity: 0.374, inclination: 4.26, period: 2.06 },
    physical: { diameter: 0.6, mass: 1.0e11, albedo: 0.35, rotationPeriod: 0.610 },
    value: 5400e12, valueBreakdown: { metals: 5000e12, water: 50e12, rareEarth: 350e12 },
    accessibility: { deltaV: 5.2, nextWindow: '2028-07-19', transferTime: 1.9, score: 76 },
    closeApproaches: [
      { date: '2028-07-19', distance: 0.016, velocity: 11.2 },
    ],
    miningFeasibility: 72, riskScore: 32,
  },
  {
    id: 'nereus', name: '4660 Nereus', fullName: '4660 Nereus (1982 DB)',
    discoveryYear: 1982, composition: 'S', compositionLabel: 'Silicaceous (Stony)',
    orbit: { semiMajorAxis: 1.489, eccentricity: 0.360, inclination: 1.43, period: 1.82 },
    physical: { diameter: 0.33, mass: 6.9e10, albedo: 0.55, rotationPeriod: 15.16 },
    value: 4700e6, valueBreakdown: { metals: 3500e6, water: 400e6, rareEarth: 800e6 },
    accessibility: { deltaV: 4.9, nextWindow: '2027-02-14', transferTime: 1.3, score: 82 },
    closeApproaches: [
      { date: '2027-02-14', distance: 0.027, velocity: 6.6 },
      { date: '2031-03-02', distance: 0.032, velocity: 7.1 },
    ],
    miningFeasibility: 82, riskScore: 22,
  },
  {
    id: 'anteros', name: '1943 Anteros', fullName: '1943 Anteros (1973 EC)',
    discoveryYear: 1973, composition: 'M', compositionLabel: 'Metallic (Iron-Nickel)',
    orbit: { semiMajorAxis: 1.430, eccentricity: 0.256, inclination: 8.70, period: 1.71 },
    physical: { diameter: 2.3, mass: 1.5e13, albedo: 0.17, rotationPeriod: 2.87 },
    value: 5600e12, valueBreakdown: { metals: 4200e12, water: 400e12, rareEarth: 1000e12 },
    accessibility: { deltaV: 5.4, nextWindow: '2028-12-05', transferTime: 2.0, score: 68 },
    closeApproaches: [
      { date: '2028-12-05', distance: 0.14, velocity: 9.0 },
    ],
    miningFeasibility: 60, riskScore: 38,
  },
  {
    id: 'didymos', name: '65803 Didymos', fullName: '65803 Didymos (1996 GT)',
    discoveryYear: 1996, composition: 'S', compositionLabel: 'Silicaceous (Stony)',
    orbit: { semiMajorAxis: 1.644, eccentricity: 0.384, inclination: 3.41, period: 2.11 },
    physical: { diameter: 0.78, mass: 5.3e11, albedo: 0.15, rotationPeriod: 2.26 },
    value: 2100e6, valueBreakdown: { metals: 1400e6, water: 300e6, rareEarth: 400e6 },
    accessibility: { deltaV: 5.1, nextWindow: '2026-11-20', transferTime: 1.7, score: 78 },
    closeApproaches: [
      { date: '2026-11-20', distance: 0.07, velocity: 8.9 },
    ],
    miningFeasibility: 75, riskScore: 25,
  },
  {
    id: 'vesta', name: '4 Vesta', fullName: '4 Vesta',
    discoveryYear: 1807, composition: 'S', compositionLabel: 'Silicaceous (Stony)',
    orbit: { semiMajorAxis: 2.362, eccentricity: 0.089, inclination: 7.14, period: 3.63 },
    physical: { diameter: 525, mass: 2.59e20, albedo: 0.42, rotationPeriod: 5.342 },
    value: 15000e12, valueBreakdown: { metals: 9000e12, water: 2000e12, rareEarth: 4000e12 },
    accessibility: { deltaV: 7.8, nextWindow: '2031-06-10', transferTime: 3.8, score: 35 },
    closeApproaches: [
      { date: '2031-06-10', distance: 1.14, velocity: 14.2 },
    ],
    miningFeasibility: 30, riskScore: 55,
  },
  {
    id: 'ceres', name: '1 Ceres', fullName: '1 Ceres',
    discoveryYear: 1801, composition: 'C', compositionLabel: 'Carbonaceous',
    orbit: { semiMajorAxis: 2.768, eccentricity: 0.076, inclination: 10.59, period: 4.60 },
    physical: { diameter: 946, mass: 9.39e20, albedo: 0.09, rotationPeriod: 9.074 },
    value: 72000e12, valueBreakdown: { metals: 20000e12, water: 45000e12, rareEarth: 7000e12 },
    accessibility: { deltaV: 8.5, nextWindow: '2032-04-18', transferTime: 4.2, score: 22 },
    closeApproaches: [
      { date: '2032-04-18', distance: 1.59, velocity: 16.5 },
    ],
    miningFeasibility: 25, riskScore: 60,
  },
  {
    id: 'pallas', name: '2 Pallas', fullName: '2 Pallas',
    discoveryYear: 1802, composition: 'C', compositionLabel: 'Carbonaceous',
    orbit: { semiMajorAxis: 2.772, eccentricity: 0.231, inclination: 34.83, period: 4.62 },
    physical: { diameter: 512, mass: 2.11e20, albedo: 0.101, rotationPeriod: 7.813 },
    value: 41000e12, valueBreakdown: { metals: 15000e12, water: 18000e12, rareEarth: 8000e12 },
    accessibility: { deltaV: 10.2, nextWindow: '2034-09-01', transferTime: 5.1, score: 15 },
    closeApproaches: [
      { date: '2034-09-01', distance: 1.82, velocity: 18.3 },
    ],
    miningFeasibility: 18, riskScore: 72,
  },
  {
    id: '1986_da', name: '6178 (1986 DA)', fullName: '6178 (1986 DA)',
    discoveryYear: 1986, composition: 'M', compositionLabel: 'Metallic (Iron-Nickel)',
    orbit: { semiMajorAxis: 2.81, eccentricity: 0.583, inclination: 4.31, period: 4.71 },
    physical: { diameter: 2.3, mass: 2.0e13, albedo: 0.14, rotationPeriod: 3.41 },
    value: 12000e12, valueBreakdown: { metals: 10500e12, water: 200e12, rareEarth: 1300e12 },
    accessibility: { deltaV: 6.8, nextWindow: '2029-03-22', transferTime: 2.8, score: 52 },
    closeApproaches: [
      { date: '2029-03-22', distance: 0.89, velocity: 13.5 },
    ],
    miningFeasibility: 55, riskScore: 42,
  },
];

// ─── METEORITE DATA ──────────────────────────
export const meteorites: Meteorite[] = [
  { id: 'hoba', name: 'Hoba', classification: 'Iron, IVB', mass: 60000000, year: 1920, location: { lat: -19.59, lng: 17.93, country: 'Namibia', region: 'Otjozondjupa' }, fell: false, composition: 'Iron-Nickel', scientificValue: 95, marketValue: 0.5 },
  { id: 'willamette', name: 'Willamette', classification: 'Iron, IIIAB', mass: 15500000, year: 1902, location: { lat: 45.36, lng: -122.58, country: 'USA', region: 'Oregon' }, fell: false, composition: 'Iron-Nickel', scientificValue: 88, marketValue: 30 },
  { id: 'allende', name: 'Allende', classification: 'CV3', mass: 2000000, year: 1969, location: { lat: 26.97, lng: -105.32, country: 'Mexico', region: 'Chihuahua' }, fell: true, composition: 'Carbonaceous Chondrite', scientificValue: 98, marketValue: 80 },
  { id: 'murchison', name: 'Murchison', classification: 'CM2', mass: 100000, year: 1969, location: { lat: -36.62, lng: 145.2, country: 'Australia', region: 'Victoria' }, fell: true, composition: 'Carbonaceous Chondrite', scientificValue: 99, marketValue: 200 },
  { id: 'sikhote_alin', name: 'Sikhote-Alin', classification: 'Iron, IIAB', mass: 23000000, year: 1947, location: { lat: 46.16, lng: 134.65, country: 'Russia', region: 'Primorsky' }, fell: true, composition: 'Iron-Nickel', scientificValue: 82, marketValue: 3 },
  { id: 'chelyabinsk', name: 'Chelyabinsk', classification: 'LL5', mass: 654000, year: 2013, location: { lat: 54.82, lng: 61.12, country: 'Russia', region: 'Chelyabinsk' }, fell: true, composition: 'Ordinary Chondrite', scientificValue: 90, marketValue: 50 },
  { id: 'alh84001', name: 'ALH 84001', classification: 'Martian (SNC)', mass: 1931, year: 1984, location: { lat: -76.92, lng: 156.71, country: 'Antarctica', region: 'Allan Hills' }, fell: false, composition: 'Martian Orthopyroxenite', scientificValue: 100, marketValue: 1000 },
  { id: 'campo_del_cielo', name: 'Campo del Cielo', classification: 'Iron, IAB-MG', mass: 50000000, year: 1576, location: { lat: -27.63, lng: -61.7, country: 'Argentina', region: 'Chaco' }, fell: false, composition: 'Iron-Nickel', scientificValue: 70, marketValue: 1 },
  { id: 'nwa_7034', name: 'NWA 7034', classification: 'Martian', mass: 320, year: 2011, location: { lat: 32.0, lng: -5.0, country: 'Morocco', region: 'North Africa' }, fell: false, composition: 'Martian Breccia', scientificValue: 97, marketValue: 10000 },
  { id: 'fukang', name: 'Fukang', classification: 'Pallasite, PMG', mass: 1003000, year: 2000, location: { lat: 44.32, lng: 87.58, country: 'China', region: 'Xinjiang' }, fell: false, composition: 'Pallasite (Olivine-Metal)', scientificValue: 85, marketValue: 500 },
  { id: 'gibeon', name: 'Gibeon', classification: 'Iron, IVA', mass: 26000000, year: 1836, location: { lat: -25.52, lng: 18.0, country: 'Namibia', region: 'Hardap' }, fell: false, composition: 'Iron-Nickel', scientificValue: 78, marketValue: 5 },
  { id: 'tagish_lake', name: 'Tagish Lake', classification: 'C2', mass: 10000, year: 2000, location: { lat: 59.7, lng: -134.2, country: 'Canada', region: 'British Columbia' }, fell: true, composition: 'Carbonaceous Chondrite', scientificValue: 96, marketValue: 1500 },
  { id: 'peekskill', name: 'Peekskill', classification: 'H6', mass: 12570, year: 1992, location: { lat: 41.29, lng: -73.92, country: 'USA', region: 'New York' }, fell: true, composition: 'Ordinary Chondrite', scientificValue: 72, marketValue: 150 },
  { id: 'ensisheim', name: 'Ensisheim', classification: 'LL6', mass: 127000, year: 1492, location: { lat: 47.87, lng: 7.35, country: 'France', region: 'Alsace' }, fell: true, composition: 'Ordinary Chondrite', scientificValue: 80, marketValue: 2000 },
  { id: 'cape_york', name: 'Cape York', classification: 'Iron, IIIAB', mass: 58200000, year: 1818, location: { lat: 76.13, lng: -64.93, country: 'Greenland', region: 'Cape York' }, fell: false, composition: 'Iron-Nickel', scientificValue: 82, marketValue: 2 },
  { id: 'tissint', name: 'Tissint', classification: 'Martian Shergottite', mass: 7000, year: 2011, location: { lat: 29.48, lng: -7.61, country: 'Morocco', region: 'Tata' }, fell: true, composition: 'Martian Basalt', scientificValue: 95, marketValue: 800 },
  { id: 'winchcombe', name: 'Winchcombe', classification: 'CM2', mass: 602, year: 2021, location: { lat: 51.95, lng: -1.97, country: 'UK', region: 'Gloucestershire' }, fell: true, composition: 'Carbonaceous Chondrite', scientificValue: 94, marketValue: 3000 },
  { id: 'buzzard_coulee', name: 'Buzzard Coulee', classification: 'H4', mass: 41000, year: 2008, location: { lat: 52.99, lng: -109.85, country: 'Canada', region: 'Saskatchewan' }, fell: true, composition: 'Ordinary Chondrite', scientificValue: 68, marketValue: 30 },
];

// ─── EXOPLANET DATA ──────────────────────────
export const exoplanets: Exoplanet[] = [
  {
    id: 'proxima_b', name: 'Proxima Centauri b', starName: 'Proxima Centauri', starType: 'M',
    discoveryYear: 2016, discoveryMethod: 'Radial Velocity', distance: 4.24,
    orbital: { period: 11.186, semiMajorAxis: 0.0485, eccentricity: 0.11 },
    physical: { mass: 1.17, radius: 1.08, temperature: 234, gravity: 1.0 },
    habitability: { score: 68, inHabitableZone: true, hasAtmosphere: true, hasWater: true, tidallyLocked: true },
    atmosphere: ['CO2', 'N2'],
  },
  {
    id: 'trappist1e', name: 'TRAPPIST-1 e', starName: 'TRAPPIST-1', starType: 'M',
    discoveryYear: 2017, discoveryMethod: 'Transit', distance: 39.46,
    orbital: { period: 6.10, semiMajorAxis: 0.029, eccentricity: 0.005 },
    physical: { mass: 0.77, radius: 0.92, temperature: 246, gravity: 0.93 },
    habitability: { score: 85, inHabitableZone: true, hasAtmosphere: true, hasWater: true, tidallyLocked: true },
    atmosphere: ['N2', 'O2', 'H2O'],
  },
  {
    id: 'kepler442b', name: 'Kepler-442b', starName: 'Kepler-442', starType: 'K',
    discoveryYear: 2015, discoveryMethod: 'Transit', distance: 1206,
    orbital: { period: 112.3, semiMajorAxis: 0.409, eccentricity: 0.04 },
    physical: { mass: 2.36, radius: 1.34, temperature: 233, gravity: 1.31 },
    habitability: { score: 83, inHabitableZone: true, hasAtmosphere: true, hasWater: true, tidallyLocked: false },
    atmosphere: ['N2', 'O2', 'CO2'],
  },
  {
    id: 'kepler186f', name: 'Kepler-186f', starName: 'Kepler-186', starType: 'M',
    discoveryYear: 2014, discoveryMethod: 'Transit', distance: 582,
    orbital: { period: 129.9, semiMajorAxis: 0.432, eccentricity: 0.04 },
    physical: { mass: 1.44, radius: 1.17, temperature: 188, gravity: 1.05 },
    habitability: { score: 72, inHabitableZone: true, hasAtmosphere: true, hasWater: false, tidallyLocked: false },
    atmosphere: ['CO2', 'N2'],
  },
  {
    id: 'lhs1140b', name: 'LHS 1140 b', starName: 'LHS 1140', starType: 'M',
    discoveryYear: 2017, discoveryMethod: 'Transit', distance: 40.7,
    orbital: { period: 24.74, semiMajorAxis: 0.0946, eccentricity: 0.0 },
    physical: { mass: 6.98, radius: 1.73, temperature: 235, gravity: 2.33 },
    habitability: { score: 71, inHabitableZone: true, hasAtmosphere: true, hasWater: true, tidallyLocked: true },
    atmosphere: ['N2', 'H2O'],
  },
  {
    id: 'k2_18b', name: 'K2-18 b', starName: 'K2-18', starType: 'M',
    discoveryYear: 2015, discoveryMethod: 'Transit', distance: 124,
    orbital: { period: 32.94, semiMajorAxis: 0.143, eccentricity: 0.0 },
    physical: { mass: 8.63, radius: 2.61, temperature: 265, gravity: 1.27 },
    habitability: { score: 78, inHabitableZone: true, hasAtmosphere: true, hasWater: true, tidallyLocked: false },
    atmosphere: ['H2', 'He', 'H2O', 'CH4'],
  },
  {
    id: 'toi700d', name: 'TOI 700 d', starName: 'TOI 700', starType: 'M',
    discoveryYear: 2020, discoveryMethod: 'Transit', distance: 101.4,
    orbital: { period: 37.43, semiMajorAxis: 0.163, eccentricity: 0.0 },
    physical: { mass: 1.72, radius: 1.14, temperature: 268, gravity: 1.32 },
    habitability: { score: 80, inHabitableZone: true, hasAtmosphere: true, hasWater: true, tidallyLocked: true },
    atmosphere: ['CO2', 'N2', 'H2O'],
  },
  {
    id: 'gliese667cc', name: 'Gliese 667 Cc', starName: 'Gliese 667 C', starType: 'M',
    discoveryYear: 2011, discoveryMethod: 'Radial Velocity', distance: 23.62,
    orbital: { period: 28.14, semiMajorAxis: 0.125, eccentricity: 0.02 },
    physical: { mass: 3.8, radius: 1.5, temperature: 277, gravity: 1.69 },
    habitability: { score: 74, inHabitableZone: true, hasAtmosphere: true, hasWater: true, tidallyLocked: true },
    atmosphere: ['N2', 'CO2'],
  },
  {
    id: 'kepler22b', name: 'Kepler-22b', starName: 'Kepler-22', starType: 'G',
    discoveryYear: 2011, discoveryMethod: 'Transit', distance: 638,
    orbital: { period: 289.86, semiMajorAxis: 0.849, eccentricity: 0.0 },
    physical: { mass: 36.0, radius: 2.38, temperature: 262, gravity: 6.35 },
    habitability: { score: 55, inHabitableZone: true, hasAtmosphere: true, hasWater: false, tidallyLocked: false },
    atmosphere: ['H2', 'He'],
  },
  {
    id: 'ross128b', name: 'Ross 128 b', starName: 'Ross 128', starType: 'M',
    discoveryYear: 2017, discoveryMethod: 'Radial Velocity', distance: 11.01,
    orbital: { period: 9.87, semiMajorAxis: 0.0496, eccentricity: 0.036 },
    physical: { mass: 1.40, radius: 1.1, temperature: 280, gravity: 1.16 },
    habitability: { score: 76, inHabitableZone: true, hasAtmosphere: true, hasWater: true, tidallyLocked: true },
    atmosphere: ['N2', 'O2'],
  },
  {
    id: 'tau_ceti_e', name: 'Tau Ceti e', starName: 'Tau Ceti', starType: 'G',
    discoveryYear: 2012, discoveryMethod: 'Radial Velocity', distance: 11.91,
    orbital: { period: 162.87, semiMajorAxis: 0.538, eccentricity: 0.18 },
    physical: { mass: 3.93, radius: 1.59, temperature: 289, gravity: 1.55 },
    habitability: { score: 70, inHabitableZone: true, hasAtmosphere: true, hasWater: false, tidallyLocked: false },
    atmosphere: ['N2', 'CO2', 'Ar'],
  },
  {
    id: 'kepler452b', name: 'Kepler-452b', starName: 'Kepler-452', starType: 'G',
    discoveryYear: 2015, discoveryMethod: 'Transit', distance: 1402,
    orbital: { period: 384.84, semiMajorAxis: 1.046, eccentricity: 0.035 },
    physical: { mass: 5.0, radius: 1.63, temperature: 261, gravity: 1.88 },
    habitability: { score: 62, inHabitableZone: true, hasAtmosphere: true, hasWater: false, tidallyLocked: false },
    atmosphere: ['N2', 'CO2'],
  },
  {
    id: 'wolf1061c', name: 'Wolf 1061 c', starName: 'Wolf 1061', starType: 'M',
    discoveryYear: 2015, discoveryMethod: 'Radial Velocity', distance: 13.82,
    orbital: { period: 17.87, semiMajorAxis: 0.089, eccentricity: 0.11 },
    physical: { mass: 3.41, radius: 1.66, temperature: 223, gravity: 1.24 },
    habitability: { score: 66, inHabitableZone: true, hasAtmosphere: true, hasWater: true, tidallyLocked: true },
    atmosphere: ['CO2', 'N2'],
  },
  {
    id: 'trappist1f', name: 'TRAPPIST-1 f', starName: 'TRAPPIST-1', starType: 'M',
    discoveryYear: 2017, discoveryMethod: 'Transit', distance: 39.46,
    orbital: { period: 9.21, semiMajorAxis: 0.038, eccentricity: 0.01 },
    physical: { mass: 0.93, radius: 1.04, temperature: 219, gravity: 0.86 },
    habitability: { score: 77, inHabitableZone: true, hasAtmosphere: true, hasWater: true, tidallyLocked: true },
    atmosphere: ['N2', 'CO2', 'H2O'],
  },
  {
    id: 'trappist1g', name: 'TRAPPIST-1 g', starName: 'TRAPPIST-1', starType: 'M',
    discoveryYear: 2017, discoveryMethod: 'Transit', distance: 39.46,
    orbital: { period: 12.35, semiMajorAxis: 0.047, eccentricity: 0.002 },
    physical: { mass: 1.15, radius: 1.13, temperature: 198, gravity: 0.90 },
    habitability: { score: 69, inHabitableZone: true, hasAtmosphere: true, hasWater: true, tidallyLocked: true },
    atmosphere: ['CO2', 'N2'],
  },
];

// ─── SPACECRAFT TYPES ──────────────────────────
export const spacecraftTypes: SpacecraftType[] = [
  {
    id: 'probe', name: 'Explorer Probe', size: 'small', mass: 1000,
    deltavCapacity: 6.0, baseCost: 150e6, payloadCapacity: 50,
    instruments: ['Camera', 'Spectrometer', 'Magnetometer'],
  },
  {
    id: 'surveyor', name: 'Deep Space Surveyor', size: 'medium', mass: 5000,
    deltavCapacity: 9.0, baseCost: 800e6, payloadCapacity: 500,
    instruments: ['Camera', 'Spectrometer', 'Magnetometer', 'LIDAR', 'Drill', 'Mass Spectrometer'],
  },
  {
    id: 'harvester', name: 'Asteroid Harvester', size: 'large', mass: 20000,
    deltavCapacity: 12.0, baseCost: 3000e6, payloadCapacity: 5000,
    instruments: ['Camera', 'Spectrometer', 'Magnetometer', 'LIDAR', 'Drill', 'Refinery Module', 'Sample Return Capsule', 'Mining Laser'],
  },
];

// ─── HISTORICAL EVENTS ──────────────────────────
export const historicalEvents: HistoricalEvent[] = [
  { year: 1801, event: 'Ceres discovered by Giuseppe Piazzi - first asteroid ever found', category: 'discovery' },
  { year: 1898, event: '433 Eros discovered - first near-Earth asteroid', category: 'discovery' },
  { year: 1908, event: 'Tunguska event - largest impact in recorded history flattens 2,000 km² of forest', category: 'impact' },
  { year: 1930, event: 'Pluto discovered by Clyde Tombaugh', category: 'discovery' },
  { year: 1947, event: 'Sikhote-Alin meteorite fall in Russia - largest witnessed iron meteorite', category: 'impact' },
  { year: 1969, event: 'Allende & Murchison meteorites fall - contain amino acids, revolutionize astrobiology', category: 'discovery' },
  { year: 1991, event: '951 Gaspra first asteroid flyby by Galileo spacecraft', category: 'mission' },
  { year: 1992, event: 'First exoplanet detected orbiting a pulsar (PSR B1257+12)', category: 'discovery' },
  { year: 1995, event: '51 Pegasi b discovered - first exoplanet around sun-like star', category: 'discovery' },
  { year: 1997, event: 'NEAR Shoemaker launched to study Eros', category: 'mission' },
  { year: 2001, event: 'NEAR Shoemaker lands on Eros - first asteroid landing', category: 'mission' },
  { year: 2003, event: 'Hayabusa launched to asteroid Itokawa', category: 'mission' },
  { year: 2006, event: 'Stardust returns comet dust samples to Earth', category: 'mission' },
  { year: 2010, event: 'Hayabusa returns first asteroid samples from Itokawa', category: 'mission' },
  { year: 2013, event: 'Chelyabinsk meteor - 1,500 injuries from shockwave, 20m asteroid undetected', category: 'impact' },
  { year: 2014, event: 'Rosetta arrives at Comet 67P & deploys Philae lander', category: 'mission' },
  { year: 2016, event: 'Proxima Centauri b discovered - nearest exoplanet at 4.24 light years', category: 'discovery' },
  { year: 2017, event: 'TRAPPIST-1 system discovered with 7 Earth-sized planets', category: 'discovery' },
  { year: 2018, event: 'OSIRIS-REx arrives at asteroid Bennu', category: 'mission' },
  { year: 2019, event: 'Hayabusa2 collects subsurface samples from Ryugu', category: 'mission' },
  { year: 2020, event: 'OSIRIS-REx successfully collects sample from Bennu', category: 'mission' },
  { year: 2021, event: 'Lucy mission launches to explore Trojan asteroids', category: 'mission' },
  { year: 2022, event: 'DART mission impacts Dimorphos - first planetary defense test succeeds', category: 'mission' },
  { year: 2023, event: 'Psyche mission launches to metallic asteroid worth $10 quintillion', category: 'mission' },
  { year: 2023, event: 'OSIRIS-REx returns Bennu samples to Earth', category: 'mission' },
  { year: 2025, event: 'James Webb Space Telescope characterizes first exoplanet atmospheres', category: 'technology' },
  { year: 2026, event: 'Psyche spacecraft enters orbit around asteroid 16 Psyche', category: 'mission' },
  { year: 2029, event: 'Apophis close approach - visible to naked eye, passes within 31,000 km', category: 'prediction' },
  { year: 2031, event: 'First commercial asteroid prospecting mission (projected)', category: 'prediction' },
  { year: 2035, event: 'First in-situ resource utilization test on asteroid (projected)', category: 'prediction' },
  { year: 2040, event: 'Commercial asteroid mining operations begin (projected)', category: 'prediction' },
  { year: 2045, event: 'First human mission to near-Earth asteroid (projected)', category: 'prediction' },
  { year: 2050, event: 'Lunar mining operations established, asteroid supply chain (predicted)', category: 'prediction' },
  { year: 2060, event: 'Space manufacturing from asteroid materials becomes viable (predicted)', category: 'prediction' },
  { year: 2075, event: 'Permanent deep space mining stations operational (predicted)', category: 'prediction' },
  { year: 2100, event: 'Asteroid belt fully mapped and catalogued (predicted)', category: 'prediction' },
];

// ─── SAMPLE ANNOTATIONS ──────────────────────────
export const sampleAnnotations: Annotation[] = [
  {
    id: 1, dataPoint: 'psyche',
    user: { name: 'Dr. Sarah Chen', initials: 'SC', role: 'Planetary Scientist' },
    type: 'insight',
    content: 'The metal content of Psyche is likely differentiated core material from a proto-planet that was destroyed in the early solar system. This makes it an incredible window into planetary formation.',
    upvotes: 234, downvotes: 12, timestamp: new Date('2024-01-15'),
    replies: [
      { id: 101, user: { name: 'Mike Torres', initials: 'MT' }, content: 'This would explain the unusual density measurements!', timestamp: new Date('2024-01-16') },
      { id: 102, user: { name: 'Dr. Lisa Park', initials: 'LP' }, content: 'The recent spectral analysis supports this hypothesis. The surface appears to be 30-60% metal.', timestamp: new Date('2024-01-17') },
    ],
  },
  {
    id: 2, dataPoint: '2011_uw158',
    user: { name: 'James Liu', initials: 'JL', role: 'Mining Engineer' },
    type: 'question',
    content: 'Has anyone calculated the energy requirements for capturing and processing this asteroid? The delta-v looks favorable but what about the actual mining operations?',
    upvotes: 89, downvotes: 3, timestamp: new Date('2024-02-03'),
    replies: [
      { id: 201, user: { name: 'Anna Schmidt', initials: 'AS' }, content: 'Based on my calculations, you\'d need approximately 2.4 GW continuous power for 6 months to process the surface layer alone.', timestamp: new Date('2024-02-04') },
    ],
  },
  {
    id: 3, dataPoint: 'bennu',
    user: { name: 'Prof. Rodriguez', initials: 'PR', role: 'Astrobiologist' },
    type: 'insight',
    content: 'OSIRIS-REx found amino acids and other prebiotic molecules on Bennu. This supports the panspermia hypothesis — asteroids may have seeded life on Earth.',
    upvotes: 456, downvotes: 28, timestamp: new Date('2024-03-10'),
    replies: [
      { id: 301, user: { name: 'Yuki Tanaka', initials: 'YT' }, content: "The sample return was a game-changer. We're still analyzing and finding new compounds.", timestamp: new Date('2024-03-11') },
    ],
  },
  {
    id: 4, dataPoint: 'apophis',
    user: { name: 'Col. Marcus Reeves', initials: 'MR', role: 'Planetary Defense Lead' },
    type: 'issue',
    content: 'The 2029 flyby will pass through the geosynchronous satellite belt. We need to model potential impacts with operational satellites. This is an underreported risk.',
    upvotes: 312, downvotes: 5, timestamp: new Date('2024-04-22'),
    replies: [
      { id: 401, user: { name: 'Dr. Sarah Chen', initials: 'SC' }, content: 'ESA is working on this. The probability of satellite collision is low but non-zero. Great point.', timestamp: new Date('2024-04-23') },
    ],
  },
  {
    id: 5, dataPoint: 'eros',
    user: { name: 'Alex Petrov', initials: 'AP', role: 'Space Economist' },
    type: 'insight',
    content: 'Eros contains more gold than has ever been mined on Earth. At current prices, just the gold alone would be worth $20 trillion. The challenge is getting it back economically.',
    upvotes: 567, downvotes: 45, timestamp: new Date('2024-05-15'),
    replies: [],
  },
];

// ─── SIMULATED USERS ──────────────────────────
export const simulatedUsers: SimUser[] = [
  { name: 'Alex Chen', initials: 'AC', color: '#3B82F6' },
  { name: 'Maria Garcia', initials: 'MG', color: '#8B5CF6' },
  { name: 'James Park', initials: 'JP', color: '#10B981' },
  { name: 'Sophie Martin', initials: 'SM', color: '#F59E0B' },
  { name: 'Raj Patel', initials: 'RP', color: '#EF4444' },
  { name: 'Emma Wilson', initials: 'EW', color: '#EC4899' },
  { name: 'David Kim', initials: 'DK', color: '#06B6D4' },
  { name: 'Olivia Brown', initials: 'OB', color: '#F97316' },
];

// ─── DISCOVERY TREND DATA ──────────────────────────
export const discoveryTrendData = [
  { year: 1900, asteroids: 12, meteorites: 5, exoplanets: 0 },
  { year: 1910, asteroids: 18, meteorites: 8, exoplanets: 0 },
  { year: 1920, asteroids: 25, meteorites: 12, exoplanets: 0 },
  { year: 1930, asteroids: 30, meteorites: 15, exoplanets: 0 },
  { year: 1940, asteroids: 35, meteorites: 20, exoplanets: 0 },
  { year: 1950, asteroids: 50, meteorites: 35, exoplanets: 0 },
  { year: 1960, asteroids: 80, meteorites: 55, exoplanets: 0 },
  { year: 1970, asteroids: 120, meteorites: 80, exoplanets: 0 },
  { year: 1980, asteroids: 250, meteorites: 150, exoplanets: 0 },
  { year: 1990, asteroids: 500, meteorites: 320, exoplanets: 0 },
  { year: 1995, asteroids: 800, meteorites: 450, exoplanets: 6 },
  { year: 2000, asteroids: 1200, meteorites: 600, exoplanets: 30 },
  { year: 2005, asteroids: 2500, meteorites: 820, exoplanets: 155 },
  { year: 2010, asteroids: 5200, meteorites: 1100, exoplanets: 500 },
  { year: 2015, asteroids: 13000, meteorites: 1400, exoplanets: 2000 },
  { year: 2020, asteroids: 25000, meteorites: 1700, exoplanets: 4400 },
  { year: 2025, asteroids: 34000, meteorites: 1900, exoplanets: 5600 },
];

// ─── HELPER FUNCTIONS ──────────────────────────
export function formatValue(value: number): string {
  if (value >= 1e18) return `$${(value / 1e18).toFixed(1)}Q`;
  if (value >= 1e15) return `$${(value / 1e15).toFixed(1)}q`;
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export function formatNumber(n: number): string {
  if (n >= 1e18) return `${(n / 1e18).toFixed(2)} quintillion`;
  if (n >= 1e15) return `${(n / 1e15).toFixed(2)} quadrillion`;
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)} trillion`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} million`;
  return n.toLocaleString();
}

export function getCompositionColor(comp: 'M' | 'C' | 'S'): string {
  const colors = { M: '#FFD700', C: '#8B8B8B', S: '#CD5C5C' };
  return colors[comp];
}

export function getCompositionLabel(comp: 'M' | 'C' | 'S'): string {
  const labels = { M: 'Metallic', C: 'Carbonaceous', S: 'Silicaceous' };
  return labels[comp];
}

export function getStarTypeColor(type: string): string {
  const colors: Record<string, string> = {
    O: '#9BB0FF', B: '#AABFFF', A: '#CAD7FF', F: '#F8F7FF',
    G: '#FFF4EA', K: '#FFD2A1', M: '#FFAA6F',
  };
  return colors[type] || '#FFFFFF';
}

export function calculateDeltaV(
  r1AU: number, r2AU: number, transferType: 'hohmann' | 'fast' = 'hohmann'
): number {
  const mu = 1.327e20;
  const r1 = r1AU * 1.496e11;
  const r2 = r2AU * 1.496e11;
  const v1 = Math.sqrt(mu / r1);
  const vT1 = Math.sqrt(mu * (2 / r1 - 2 / (r1 + r2)));
  const dv1 = Math.abs(vT1 - v1);
  const v2 = Math.sqrt(mu / r2);
  const vT2 = Math.sqrt(mu * (2 / r2 - 2 / (r1 + r2)));
  const dv2 = Math.abs(v2 - vT2);
  const total = (dv1 + dv2) / 1000;
  return transferType === 'fast' ? total * 1.5 : total;
}

export function calculateMissionCost(
  spacecraftSize: 'small' | 'medium' | 'large',
  baseCost: number,
  duration: number,
  missionType: string
): { launch: number; spacecraft: number; operations: number; instruments: number; total: number } {
  const launchCosts: Record<string, number> = { small: 62e6, medium: 150e6, large: 500e6 };
  const launch = launchCosts[spacecraftSize];
  const spacecraft = baseCost;
  const operations = duration * 50e6;
  const instruments = missionType === 'sample-return' ? 100e6 : 50e6;
  return { launch, spacecraft, operations, instruments, total: launch + spacecraft + operations + instruments };
}
