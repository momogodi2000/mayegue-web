/**
 * AR/VR Types - TypeScript interfaces for AR/VR module
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

export interface ARScene {
  id: string;
  name: string;
  description: string;
  type: 'market' | 'village' | 'ceremony' | 'conversation' | 'workshop' | 'museum';
  category: 'cultural' | 'educational' | 'entertainment' | 'social';
  language: string;
  culturalGroup: string;
  region: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  thumbnailUrl: string;
  previewVideoUrl?: string;
  arContent: ARContent;
  vrContent?: VRContent;
  interactions: ARInteraction[];
  learningObjectives: string[];
  prerequisites: string[];
  targetAudience: string[];
  accessibility: AccessibilityInfo;
  metadata: ARMetadata;
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  totalUsers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ARContent {
  sceneId: string;
  environment: AREnvironment;
  objects: ARObject[];
  characters: ARCharacter[];
  audio: ARAudio;
  lighting: ARLighting;
  physics: ARPhysics;
  tracking: ARTracking;
  rendering: ARRendering;
}

export interface AREnvironment {
  type: 'indoor' | 'outdoor' | 'mixed';
  location: string;
  weather?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  background: string;
  skybox?: string;
  terrain?: string;
  vegetation?: string[];
  buildings?: string[];
  culturalElements: string[];
}

export interface ARObject {
  id: string;
  name: string;
  type: 'static' | 'dynamic' | 'interactive';
  model: string;
  texture: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  physics: boolean;
  collidable: boolean;
  interactable: boolean;
  animation?: ARAnimation;
  sound?: string;
  description: string;
  culturalSignificance: string;
  learningContent?: string;
}

export interface ARAnimation {
  name: string;
  duration: number;
  loop: boolean;
  speed: number;
}

export interface ARCharacter {
  id: string;
  name: string;
  role: 'vendor' | 'elder' | 'teacher' | 'guide' | 'peer' | 'customer';
  appearance: CharacterAppearance;
  personality: CharacterPersonality;
  dialogue: Dialogue[];
  animations: CharacterAnimation[];
  voice: VoiceSettings;
  aiBehavior: AIBehavior;
  culturalBackground: string;
  language: string;
  expertise: string[];
}

export interface CharacterAppearance {
  gender: 'male' | 'female' | 'non-binary';
  age: 'child' | 'teen' | 'adult' | 'elder';
  clothing: string[];
  accessories: string[];
  hairstyle: string;
  skinTone: string;
  height: number;
  build: 'slim' | 'average' | 'muscular' | 'heavy';
}

export interface CharacterPersonality {
  traits: string[];
  mood: 'friendly' | 'serious' | 'playful' | 'wise' | 'curious';
  communicationStyle: 'formal' | 'casual' | 'traditional' | 'modern';
  patience: number; // 1-10
  enthusiasm: number; // 1-10
  knowledgeLevel: 'beginner' | 'intermediate' | 'expert';
}

export interface Dialogue {
  id: string;
  trigger: DialogueTrigger;
  text: string;
  audioUrl: string;
  language: string;
  emotion: 'neutral' | 'happy' | 'sad' | 'excited' | 'confused' | 'proud';
  gestures?: string[];
  responses?: DialogueResponse[];
  learningPoints?: string[];
}

export interface DialogueTrigger {
  type: 'onApproach' | 'onInteraction' | 'onQuestion' | 'onMistake' | 'onSuccess' | 'onTimer';
  conditions: string[];
  cooldown: number; // in seconds
}

export interface DialogueResponse {
  id: string;
  text: string;
  audioUrl: string;
  nextDialogueId?: string;
  action?: string;
  feedback?: string;
}

export interface CharacterAnimation {
  id: string;
  name: string;
  type: 'idle' | 'walking' | 'talking' | 'gesturing' | 'working' | 'celebrating';
  animationUrl: string;
  duration: number;
  loop: boolean;
  trigger: AnimationTrigger;
}

export interface AnimationTrigger {
  type: 'automatic' | 'onDialogue' | 'onInteraction' | 'onEmotion';
  conditions: string[];
}

export interface VoiceSettings {
  voiceId: string;
  language: string;
  accent: string;
  speed: number; // 0.5-2.0
  pitch: number; // 0.5-2.0
  volume: number; // 0.0-1.0
  emotion: string;
}

export interface AIBehavior {
  personality: string;
  knowledgeBase: string[];
  conversationMemory: boolean;
  adaptiveDifficulty: boolean;
  culturalSensitivity: boolean;
  teachingStyle: 'patient' | 'direct' | 'encouraging' | 'challenging';
}

export interface ARAudio {
  backgroundMusic?: string;
  ambientSounds: string[];
  soundEffects: string[];
  spatialAudio: boolean;
  volume: number;
  fadeIn: number;
  fadeOut: number;
}

export interface ARLighting {
  type: 'natural' | 'artificial' | 'mixed';
  intensity: number;
  color: string;
  shadows: boolean;
  reflections: boolean;
  mood: 'bright' | 'dim' | 'warm' | 'cool' | 'dramatic';
}

export interface ARPhysics {
  gravity: number;
  friction: number;
  bounce: number;
  wind?: number;
  water?: boolean;
  collisionDetection: boolean;
}

export interface ARTracking {
  planeDetection: boolean;
  faceTracking: boolean;
  handTracking: boolean;
  objectTracking: boolean;
  markerTracking: boolean;
  worldTracking: boolean;
}

export interface ARRendering {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  shadows: boolean;
  reflections: boolean;
  particles: boolean;
  postProcessing: boolean;
  antiAliasing: boolean;
}

export interface ARInteraction {
  id: string;
  type: 'touch' | 'voice' | 'gesture' | 'gaze' | 'movement';
  target: string; // Object or character ID
  action: InteractionAction;
  feedback: InteractionFeedback;
  learningObjective: string;
  difficulty: number; // 1-10
  timeLimit?: number; // in seconds
  attempts?: number;
  hints?: string[];
}

export interface InteractionAction {
  type: 'select' | 'move' | 'rotate' | 'scale' | 'activate' | 'deactivate' | 'custom';
  parameters: Record<string, any>;
  animation?: string;
  sound?: string;
  visualEffect?: string;
}

export interface InteractionFeedback {
  type: 'visual' | 'audio' | 'haptic' | 'text';
  message: string;
  color?: string;
  sound?: string;
  vibration?: number;
  duration: number;
}

export interface VRContent {
  sceneId: string;
  environment: VREnvironment;
  objects: VRObject[];
  characters: VRCharacter[];
  interactions: VRInteraction[];
  locomotion: VRLocomotion;
  ui: VRUI;
  comfort: VRComfort;
}

export interface VREnvironment {
  type: 'room-scale' | 'seated' | 'standing';
  size: [number, number, number]; // width, height, depth
  boundaries: VRBoundary[];
  lighting: VRLighting;
  audio: VRAudio;
  physics: VRPhysics;
}

export interface VRBoundary {
  type: 'wall' | 'floor' | 'ceiling' | 'obstacle';
  position: [number, number, number];
  size: [number, number, number];
  material: string;
  visible: boolean;
}

export interface VRLighting {
  type: 'natural' | 'artificial' | 'mixed';
  intensity: number;
  color: string;
  shadows: boolean;
  reflections: boolean;
  mood: 'bright' | 'dim' | 'warm' | 'cool' | 'dramatic';
}

export interface VRAudio {
  backgroundMusic?: string;
  ambientSounds: string[];
  soundEffects: string[];
  spatialAudio: boolean;
  volume: number;
  reverb: boolean;
}

export interface VRPhysics {
  gravity: number;
  friction: number;
  bounce: number;
  collisionDetection: boolean;
  objectPhysics: boolean;
}

export interface VRObject {
  id: string;
  name: string;
  type: 'static' | 'dynamic' | 'interactive';
  model: string;
  texture: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  physics: boolean;
  collidable: boolean;
  interactable: boolean;
  grabable: boolean;
  throwable: boolean;
  animation?: VRAnimation;
  sound?: string;
  description: string;
  culturalSignificance: string;
  learningContent?: string;
}

export interface VRAnimation {
  id: string;
  name: string;
  type: 'idle' | 'movement' | 'interaction' | 'destruction' | 'creation';
  animationUrl: string;
  duration: number;
  loop: boolean;
  trigger: AnimationTrigger;
}

export interface VRCharacter {
  id: string;
  name: string;
  role: 'vendor' | 'elder' | 'teacher' | 'guide' | 'peer' | 'customer';
  appearance: CharacterAppearance;
  personality: CharacterPersonality;
  dialogue: Dialogue[];
  animations: CharacterAnimation[];
  voice: VoiceSettings;
  aiBehavior: AIBehavior;
  culturalBackground: string;
  language: string;
  expertise: string[];
  vrSpecific: VRCharacterSpecific;
}

export interface VRCharacterSpecific {
  eyeContact: boolean;
  personalSpace: number; // in meters
  gestureRecognition: boolean;
  voiceRecognition: boolean;
  emotionDetection: boolean;
  adaptiveBehavior: boolean;
}

export interface VRInteraction {
  id: string;
  type: 'grab' | 'point' | 'gesture' | 'voice' | 'gaze' | 'teleport';
  target: string; // Object or character ID
  action: VRInteractionAction;
  feedback: VRInteractionFeedback;
  learningObjective: string;
  difficulty: number; // 1-10
  timeLimit?: number; // in seconds
  attempts?: number;
  hints?: string[];
}

export interface VRInteractionAction {
  type: 'select' | 'move' | 'rotate' | 'scale' | 'activate' | 'deactivate' | 'teleport' | 'custom';
  parameters: Record<string, any>;
  animation?: string;
  sound?: string;
  visualEffect?: string;
  hapticFeedback?: HapticFeedback;
}

export interface HapticFeedback {
  intensity: number; // 0.0-1.0
  duration: number; // in milliseconds
  pattern: 'single' | 'double' | 'triple' | 'continuous' | 'custom';
  frequency?: number; // in Hz
}

export interface VRInteractionFeedback {
  type: 'visual' | 'audio' | 'haptic' | 'text' | 'spatial';
  message: string;
  color?: string;
  sound?: string;
  vibration?: HapticFeedback;
  duration: number;
  position?: [number, number, number];
}

export interface VRLocomotion {
  type: 'teleport' | 'smooth' | 'room-scale' | 'seated';
  speed: number;
  acceleration: number;
  deceleration: number;
  comfort: 'high' | 'medium' | 'low';
  boundaries: boolean;
  snapTurn: boolean;
  smoothTurn: boolean;
}

export interface VRUI {
  type: 'world-space' | 'screen-space' | 'hand-attached' | 'head-attached';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  elements: VRUIElement[];
  interaction: VRUIInteraction;
}

export interface VRUIElement {
  id: string;
  type: 'button' | 'slider' | 'text' | 'image' | 'video' | 'panel';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  content: string;
  style: Record<string, any>;
  interaction: VRUIElementInteraction;
}

export interface VRUIElementInteraction {
  type: 'click' | 'hover' | 'drag' | 'scroll' | 'voice';
  action: string;
  feedback: VRInteractionFeedback;
}

export interface VRUIInteraction {
  type: 'raycast' | 'direct' | 'voice' | 'gesture';
  pointer: 'laser' | 'hand' | 'gaze';
  selection: 'click' | 'gaze' | 'voice' | 'gesture';
  feedback: VRInteractionFeedback;
}

export interface VRComfort {
  vignette: boolean;
  snapTurn: boolean;
  smoothTurn: boolean;
  teleport: boolean;
  heightAdjustment: boolean;
  seatedMode: boolean;
  comfortSettings: ComfortSettings;
}

export interface ComfortSettings {
  movementSpeed: number;
  turnSpeed: number;
  vignetteIntensity: number;
  heightOffset: number;
  seatedHeight: number;
}

export interface AccessibilityInfo {
  visual: VisualAccessibility;
  auditory: AuditoryAccessibility;
  motor: MotorAccessibility;
  cognitive: CognitiveAccessibility;
}

export interface VisualAccessibility {
  highContrast: boolean;
  largeText: boolean;
  colorBlindSupport: boolean;
  screenReader: boolean;
  magnification: boolean;
  audioDescription: boolean;
}

export interface AuditoryAccessibility {
  subtitles: boolean;
  signLanguage: boolean;
  visualIndicators: boolean;
  hapticFeedback: boolean;
  volumeControl: boolean;
  noiseReduction: boolean;
}

export interface MotorAccessibility {
  voiceControl: boolean;
  eyeTracking: boolean;
  switchControl: boolean;
  gestureControl: boolean;
  adaptiveInput: boolean;
  timeExtensions: boolean;
}

export interface CognitiveAccessibility {
  simplifiedUI: boolean;
  clearInstructions: boolean;
  progressIndicators: boolean;
  errorPrevention: boolean;
  memoryAids: boolean;
  distractionReduction: boolean;
}

export interface ARMetadata {
  version: string;
  author: string;
  contributors: string[];
  tags: string[];
  keywords: string[];
  description: string;
  instructions: string;
  troubleshooting: string[];
  systemRequirements: SystemRequirements;
  compatibility: CompatibilityInfo;
  performance: PerformanceMetrics;
  analytics: AnalyticsData;
}

export interface SystemRequirements {
  platform: 'iOS' | 'Android' | 'Web' | 'Windows' | 'macOS' | 'Linux';
  minVersion: string;
  recommendedVersion: string;
  hardware: HardwareRequirements;
  software: SoftwareRequirements;
  network: NetworkRequirements;
}

export interface HardwareRequirements {
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  camera: string;
  sensors: string[];
  display: string;
  audio: string;
}

export interface SoftwareRequirements {
  os: string;
  browser?: string;
  arFramework: string;
  vrFramework?: string;
  dependencies: string[];
  plugins: string[];
}

export interface NetworkRequirements {
  bandwidth: string;
  latency: string;
  stability: string;
  offline: boolean;
  cloudSync: boolean;
}

export interface CompatibilityInfo {
  devices: string[];
  browsers: string[];
  arFrameworks: string[];
  vrFrameworks: string[];
  operatingSystems: string[];
  hardware: string[];
}

export interface PerformanceMetrics {
  frameRate: number;
  latency: number;
  memoryUsage: number;
  cpuUsage: number;
  gpuUsage: number;
  batteryImpact: number;
  heatGeneration: number;
}

export interface AnalyticsData {
  totalSessions: number;
  averageSessionDuration: number;
  completionRate: number;
  userSatisfaction: number;
  errorRate: number;
  performanceScore: number;
  engagementMetrics: EngagementMetrics;
}

export interface EngagementMetrics {
  timeSpent: number;
  interactions: number;
  achievements: number;
  socialShares: number;
  returnVisits: number;
  recommendations: number;
}

export interface ARSession {
  id: string;
  userId: string;
  sceneId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  interactions: SessionInteraction[];
  progress: SessionProgress;
  performance: SessionPerformance;
  feedback: SessionFeedback;
  achievements: Achievement[];
  errors: SessionError[];
}

export interface SessionInteraction {
  id: string;
  timestamp: Date;
  type: string;
  target: string;
  action: string;
  result: string;
  duration: number;
  success: boolean;
}

export interface SessionProgress {
  currentStep: number;
  totalSteps: number;
  completedObjectives: string[];
  remainingObjectives: string[];
  score: number;
  timeSpent: number;
  efficiency: number;
}

export interface SessionPerformance {
  frameRate: number;
  latency: number;
  memoryUsage: number;
  cpuUsage: number;
  gpuUsage: number;
  batteryLevel: number;
  heatLevel: number;
  networkQuality: number;
}

export interface SessionFeedback {
  rating: number;
  comments: string;
  suggestions: string[];
  bugs: string[];
  improvements: string[];
  wouldRecommend: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: 'completion' | 'speed' | 'accuracy' | 'exploration' | 'social';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt: Date;
  progress: number;
  maxProgress: number;
}

export interface SessionError {
  id: string;
  timestamp: Date;
  type: 'technical' | 'user' | 'system' | 'network';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stackTrace?: string;
  context: Record<string, any>;
  resolved: boolean;
  resolution?: string;
}

export interface ARFilter {
  type?: string[];
  category?: string[];
  language?: string[];
  culturalGroup?: string[];
  region?: string[];
  difficulty?: string[];
  duration?: {
    min: number;
    max: number;
  };
  rating?: {
    min: number;
    max: number;
  };
  isActive?: boolean;
  isFeatured?: boolean;
  hasVR?: boolean;
  accessibility?: string[];
}

export interface ARSearchResult {
  id: string;
  name: string;
  type: string;
  category: string;
  language: string;
  culturalGroup: string;
  region: string;
  difficulty: string;
  duration: number;
  rating: number;
  thumbnailUrl: string;
  relevanceScore: number;
}

export interface ARStats {
  totalScenes: number;
  totalUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  completionRate: number;
  userSatisfaction: number;
  topScenes: SceneStats[];
  topLanguages: LanguageStats[];
  topRegions: RegionStats[];
  deviceStats: DeviceStats[];
  performanceStats: PerformanceStats[];
  lastUpdated: Date;
}

export interface SceneStats {
  sceneId: string;
  sceneName: string;
  sessions: number;
  completionRate: number;
  averageRating: number;
  averageDuration: number;
}

export interface LanguageStats {
  language: string;
  scenes: number;
  sessions: number;
  completionRate: number;
  averageRating: number;
}

export interface RegionStats {
  region: string;
  scenes: number;
  sessions: number;
  completionRate: number;
  averageRating: number;
}

export interface DeviceStats {
  device: string;
  sessions: number;
  averagePerformance: number;
  errorRate: number;
  userSatisfaction: number;
}

export interface PerformanceStats {
  metric: string;
  average: number;
  min: number;
  max: number;
  trend: 'improving' | 'stable' | 'declining';
}

// Constants
export const AR_SCENE_TYPES = [
  'market',
  'village',
  'ceremony',
  'conversation',
  'workshop',
  'museum'
] as const;

export const AR_CATEGORIES = [
  'cultural',
  'educational',
  'entertainment',
  'social'
] as const;

export const AR_DIFFICULTIES = [
  'beginner',
  'intermediate',
  'advanced'
] as const;

export const AR_INTERACTION_TYPES = [
  'touch',
  'voice',
  'gesture',
  'gaze',
  'movement'
] as const;

export const VR_INTERACTION_TYPES = [
  'grab',
  'point',
  'gesture',
  'voice',
  'gaze',
  'teleport'
] as const;

export const CHARACTER_ROLES = [
  'vendor',
  'elder',
  'teacher',
  'guide',
  'peer',
  'customer'
] as const;

export const ACHIEVEMENT_TYPES = [
  'completion',
  'speed',
  'accuracy',
  'exploration',
  'social'
] as const;

export const ACHIEVEMENT_RARITIES = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary'
] as const;
