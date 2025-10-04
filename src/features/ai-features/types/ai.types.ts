/**
 * AI Features Types - TypeScript interfaces for AI features
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

export interface AIMentor {
  id: string;
  userId: string;
  name: string;
  personality: MentorPersonality;
  expertise: string[];
  language: string;
  culturalBackground: string;
  availability: MentorAvailability;
  settings: MentorSettings;
  conversationHistory: ConversationMessage[];
  learningProgress: LearningProgress;
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorPersonality {
  type: 'patient' | 'encouraging' | 'challenging' | 'wise' | 'playful' | 'strict';
  traits: string[];
  communicationStyle: 'formal' | 'casual' | 'traditional' | 'modern';
  patience: number; // 1-10
  enthusiasm: number; // 1-10
  strictness: number; // 1-10
  humor: number; // 1-10
  wisdom: number; // 1-10
}

export interface MentorAvailability {
  timezone: string;
  workingHours: TimeSlot[];
  breakTimes: TimeSlot[];
  isOnline: boolean;
  lastSeen: Date;
  autoResponse: boolean;
  busyMessage: string;
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string; // HH:MM format
  days: number[]; // 0-6 (Sunday-Saturday)
}

export interface MentorSettings {
  responseSpeed: 'slow' | 'normal' | 'fast';
  detailLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  culturalSensitivity: boolean;
  adaptiveDifficulty: boolean;
  emotionalSupport: boolean;
  progressTracking: boolean;
  reminderFrequency: 'none' | 'daily' | 'weekly' | 'custom';
  language: string;
  voice: VoiceSettings;
  appearance: MentorAppearance;
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

export interface MentorAppearance {
  avatar: string;
  clothing: string[];
  accessories: string[];
  expressions: string[];
  gestures: string[];
  culturalElements: string[];
}

export interface ConversationMessage {
  id: string;
  type: 'user' | 'mentor' | 'system';
  content: string;
  timestamp: Date;
  language: string;
  emotion?: string;
  context?: ConversationContext;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
}

export interface ConversationContext {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  culturalContext?: string;
  learningObjective?: string;
  previousMessages?: string[];
}

export interface MessageAttachment {
  type: 'image' | 'audio' | 'video' | 'document' | 'link';
  url: string;
  name: string;
  size: number;
  description?: string;
}

export interface MessageReaction {
  type: 'like' | 'dislike' | 'helpful' | 'confusing' | 'interesting';
  count: number;
  userReacted: boolean;
}

export interface LearningProgress {
  currentLevel: number;
  experience: number;
  skills: SkillProgress[];
  achievements: AchievementProgress[];
  goals: LearningGoal[];
  challenges: LearningChallenge[];
  insights: LearningInsight[];
  recommendations: LearningRecommendation[];
  lastUpdated: Date;
}

export interface SkillProgress {
  skillId: string;
  skillName: string;
  level: number;
  experience: number;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lastPracticed: Date;
  improvement: number;
  challenges: string[];
  strengths: string[];
}

export interface AchievementProgress {
  achievementId: string;
  achievementName: string;
  progress: number;
  maxProgress: number;
  unlockedAt?: Date;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  type: 'skill' | 'language' | 'culture' | 'general';
  target: string;
  deadline?: Date;
  progress: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  milestones: GoalMilestone[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalMilestone {
  id: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  completedAt?: Date;
  rewards: Reward[];
}

export interface LearningChallenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  requirements: ChallengeRequirement[];
  rewards: Reward[];
  progress: number;
  status: 'available' | 'active' | 'completed' | 'expired';
  startDate: Date;
  endDate: Date;
  attempts: number;
  maxAttempts: number;
}

export interface ChallengeRequirement {
  type: 'skill' | 'activity' | 'time' | 'social' | 'cultural';
  target: string;
  value: number;
  current: number;
  completed: boolean;
}

export interface LearningInsight {
  id: string;
  type: 'strength' | 'weakness' | 'pattern' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  data: any;
  confidence: number; // 0-1
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface LearningRecommendation {
  id: string;
  type: 'content' | 'activity' | 'practice' | 'social' | 'cultural';
  title: string;
  description: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  resources: RecommendationResource[];
  prerequisites: string[];
  expectedOutcome: string;
  createdAt: Date;
}

export interface RecommendationResource {
  type: 'lesson' | 'exercise' | 'video' | 'article' | 'community' | 'mentor';
  title: string;
  url: string;
  description: string;
  duration?: number;
  difficulty?: string;
}

export interface VirtualGrandmother {
  id: string;
  userId: string;
  name: string;
  culturalBackground: string;
  region: string;
  language: string;
  personality: GrandmotherPersonality;
  stories: GrandmotherStory[];
  recipes: GrandmotherRecipe[];
  wisdom: GrandmotherWisdom[];
  memories: GrandmotherMemory[];
  relationships: FamilyRelationship[];
  settings: GrandmotherSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrandmotherPersonality {
  warmth: number; // 1-10
  wisdom: number; // 1-10
  storytelling: number; // 1-10
  cooking: number; // 1-10
  patience: number; // 1-10
  humor: number; // 1-10
  traditions: number; // 1-10
  modernity: number; // 1-10
  traits: string[];
  sayings: string[];
  values: string[];
}

export interface GrandmotherStory {
  id: string;
  title: string;
  content: string;
  type: 'folktale' | 'personal' | 'historical' | 'moral' | 'cultural';
  theme: string;
  characters: StoryCharacter[];
  moral?: string;
  culturalContext: string;
  language: string;
  audioUrl?: string;
  videoUrl?: string;
  images: string[];
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: 'children' | 'teens' | 'adults' | 'all';
  tags: string[];
  createdAt: Date;
}

export interface StoryCharacter {
  name: string;
  role: 'protagonist' | 'antagonist' | 'helper' | 'mentor' | 'villain';
  description: string;
  personality: string;
  culturalBackground: string;
  appearance: string;
}

export interface GrandmotherRecipe {
  id: string;
  name: string;
  description: string;
  culturalSignificance: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  cookingTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  nutritionalInfo?: NutritionalInfo;
  images: string[];
  videoUrl?: string;
  audioUrl?: string;
  tips: string[];
  variations: RecipeVariation[];
  history: string;
  createdAt: Date;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  unit: string;
  notes?: string;
  alternatives?: string[];
  culturalSignificance?: string;
}

export interface RecipeInstruction {
  step: number;
  description: string;
  duration?: number;
  temperature?: number;
  tips?: string[];
  images?: string[];
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  vitamins: { [key: string]: number };
  minerals: { [key: string]: number };
}

export interface RecipeVariation {
  name: string;
  description: string;
  modifications: string[];
  culturalOrigin: string;
  difficulty: string;
}

export interface GrandmotherWisdom {
  id: string;
  type: 'proverb' | 'advice' | 'life_lesson' | 'cultural_teaching' | 'moral';
  content: string;
  explanation: string;
  culturalContext: string;
  language: string;
  audioUrl?: string;
  relatedStories: string[];
  tags: string[];
  createdAt: Date;
}

export interface GrandmotherMemory {
  id: string;
  title: string;
  content: string;
  type: 'childhood' | 'family' | 'cultural' | 'historical' | 'personal';
  year?: number;
  location?: string;
  people: string[];
  emotions: string[];
  culturalSignificance: string;
  images: string[];
  audioUrl?: string;
  videoUrl?: string;
  createdAt: Date;
}

export interface FamilyRelationship {
  id: string;
  name: string;
  relation: 'child' | 'grandchild' | 'great-grandchild' | 'niece' | 'nephew' | 'cousin' | 'friend';
  age?: number;
  interests: string[];
  personality: string;
  culturalConnection: string;
  sharedMemories: string[];
  currentRelationship: number; // 1-10
  lastInteraction: Date;
}

export interface GrandmotherSettings {
  voice: VoiceSettings;
  appearance: GrandmotherAppearance;
  interaction: GrandmotherInteraction;
  content: GrandmotherContent;
  privacy: GrandmotherPrivacy;
}

export interface GrandmotherAppearance {
  avatar: string;
  clothing: string[];
  accessories: string[];
  expressions: string[];
  gestures: string[];
  culturalElements: string[];
  age: number;
  style: 'traditional' | 'modern' | 'mixed';
}

export interface GrandmotherInteraction {
  greetingStyle: 'formal' | 'casual' | 'affectionate' | 'traditional';
  storytellingStyle: 'animated' | 'calm' | 'dramatic' | 'conversational';
  teachingStyle: 'patient' | 'direct' | 'storytelling' | 'example-based';
  responseTime: 'slow' | 'normal' | 'fast';
  detailLevel: 'basic' | 'detailed' | 'comprehensive';
  culturalSensitivity: boolean;
  emotionalSupport: boolean;
  humor: boolean;
}

export interface GrandmotherContent {
  storyTypes: string[];
  recipeTypes: string[];
  wisdomTypes: string[];
  culturalFocus: string[];
  languageLevel: 'beginner' | 'intermediate' | 'advanced';
  ageAppropriate: boolean;
  educationalValue: boolean;
  entertainmentValue: boolean;
}

export interface GrandmotherPrivacy {
  shareStories: boolean;
  shareRecipes: boolean;
  shareWisdom: boolean;
  shareMemories: boolean;
  allowRecording: boolean;
  dataCollection: boolean;
  thirdPartySharing: boolean;
}

export interface AdaptiveLearning {
  id: string;
  userId: string;
  learningStyle: LearningStyle;
  performanceData: PerformanceData;
  adaptationRules: AdaptationRule[];
  personalizedContent: PersonalizedContent[];
  learningPath: LearningPath;
  progress: AdaptiveProgress;
  insights: AdaptiveInsight[];
  recommendations: AdaptiveRecommendation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningStyle {
  varkProfile: VARKProfile;
  cognitiveStyle: CognitiveStyle;
  motivationStyle: MotivationStyle;
  culturalPreferences: CulturalPreferences;
  accessibilityNeeds: AccessibilityNeeds;
}

export interface VARKProfile {
  visual: number; // 0-100
  auditory: number; // 0-100
  reading: number; // 0-100
  kinesthetic: number; // 0-100
  dominant: 'visual' | 'auditory' | 'reading' | 'kinesthetic' | 'multimodal';
  preferences: string[];
}

export interface CognitiveStyle {
  processing: 'sequential' | 'random' | 'balanced';
  perception: 'concrete' | 'abstract' | 'balanced';
  response: 'active' | 'reflective' | 'balanced';
  understanding: 'global' | 'analytical' | 'balanced';
}

export interface MotivationStyle {
  intrinsic: number; // 0-100
  extrinsic: number; // 0-100
  achievement: number; // 0-100
  affiliation: number; // 0-100
  power: number; // 0-100
  autonomy: number; // 0-100
  mastery: number; // 0-100
  purpose: number; // 0-100
}

export interface CulturalPreferences {
  culturalGroups: string[];
  regions: string[];
  languages: string[];
  traditions: string[];
  values: string[];
  communicationStyle: 'direct' | 'indirect' | 'contextual' | 'mixed';
  learningApproach: 'individual' | 'group' | 'community' | 'mixed';
}

export interface AccessibilityNeeds {
  visual: VisualAccessibility;
  auditory: AuditoryAccessibility;
  motor: MotorAccessibility;
  cognitive: CognitiveAccessibility;
  language: LanguageAccessibility;
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

export interface LanguageAccessibility {
  nativeLanguage: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
  translationSupport: boolean;
  culturalContext: boolean;
  simplifiedLanguage: boolean;
  visualAids: boolean;
}

export interface PerformanceData {
  accuracy: number; // 0-100
  speed: number; // items per minute
  consistency: number; // 0-100
  engagement: number; // 0-100
  retention: number; // 0-100
  application: number; // 0-100
  creativity: number; // 0-100
  collaboration: number; // 0-100
  culturalUnderstanding: number; // 0-100
  languageProficiency: number; // 0-100
  trends: PerformanceTrend[];
  patterns: PerformancePattern[];
  anomalies: PerformanceAnomaly[];
}

export interface PerformanceTrend {
  metric: string;
  direction: 'increasing' | 'decreasing' | 'stable';
  rate: number;
  confidence: number;
  timeframe: string;
  significance: 'low' | 'medium' | 'high';
}

export interface PerformancePattern {
  type: 'temporal' | 'behavioral' | 'cognitive' | 'emotional' | 'social';
  description: string;
  frequency: number;
  confidence: number;
  triggers: string[];
  effects: string[];
  recommendations: string[];
}

export interface PerformanceAnomaly {
  type: 'outlier' | 'spike' | 'drop' | 'inconsistency' | 'unexpected';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  duration: number;
  impact: string[];
  possibleCauses: string[];
  actions: string[];
}

export interface AdaptationRule {
  id: string;
  name: string;
  description: string;
  condition: AdaptationCondition;
  action: AdaptationAction;
  priority: number;
  enabled: boolean;
  effectiveness: number;
  lastTriggered: Date;
  triggerCount: number;
}

export interface AdaptationCondition {
  type: 'performance' | 'behavior' | 'time' | 'content' | 'social' | 'cultural';
  metric: string;
  operator: 'greater_than' | 'less_than' | 'equals' | 'contains' | 'matches';
  value: any;
  timeframe?: string;
  context?: string;
}

export interface AdaptationAction {
  type: 'content' | 'difficulty' | 'pace' | 'style' | 'support' | 'feedback';
  parameters: { [key: string]: any };
  intensity: 'low' | 'medium' | 'high';
  duration: number;
  reversibility: boolean;
}

export interface PersonalizedContent {
  id: string;
  type: 'lesson' | 'exercise' | 'story' | 'game' | 'video' | 'audio' | 'interactive';
  title: string;
  description: string;
  content: any;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  learningObjectives: string[];
  prerequisites: string[];
  culturalContext: string;
  language: string;
  personalizationFactors: PersonalizationFactor[];
  effectiveness: number;
  engagement: number;
  completionRate: number;
  createdAt: Date;
}

export interface PersonalizationFactor {
  type: 'learning_style' | 'performance' | 'interest' | 'cultural' | 'accessibility';
  weight: number;
  value: any;
  rationale: string;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  objectives: LearningObjective[];
  milestones: PathMilestone[];
  content: PathContent[];
  assessments: PathAssessment[];
  adaptations: PathAdaptation[];
  progress: PathProgress;
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  culturalFocus: string[];
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningObjective {
  id: string;
  title: string;
  description: string;
  type: 'knowledge' | 'skill' | 'attitude' | 'behavior';
  level: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  criteria: string[];
  assessment: string[];
  culturalContext: string;
  language: string;
}

export interface PathMilestone {
  id: string;
  title: string;
  description: string;
  position: number;
  objectives: string[];
  content: string[];
  assessments: string[];
  rewards: Reward[];
  prerequisites: string[];
  estimatedTime: number;
  completed: boolean;
  completedAt?: Date;
}

export interface PathContent {
  id: string;
  title: string;
  type: string;
  position: number;
  estimatedTime: number;
  difficulty: string;
  prerequisites: string[];
  learningObjectives: string[];
  culturalContext: string;
  language: string;
  completed: boolean;
  completedAt?: Date;
  score?: number;
}

export interface PathAssessment {
  id: string;
  title: string;
  type: 'quiz' | 'project' | 'presentation' | 'discussion' | 'reflection';
  position: number;
  objectives: string[];
  criteria: string[];
  weight: number;
  timeLimit?: number;
  attempts: number;
  maxAttempts: number;
  completed: boolean;
  completedAt?: Date;
  score?: number;
  feedback?: string;
}

export interface PathAdaptation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  parameters: { [key: string]: any };
  enabled: boolean;
  effectiveness: number;
}

export interface PathProgress {
  overall: number; // 0-100
  objectives: { [objectiveId: string]: number };
  milestones: { [milestoneId: string]: number };
  content: { [contentId: string]: number };
  assessments: { [assessmentId: string]: number };
  timeSpent: number;
  efficiency: number;
  quality: number;
  engagement: number;
  lastUpdated: Date;
}

export interface AdaptiveProgress {
  currentLevel: number;
  experience: number;
  skills: AdaptiveSkillProgress[];
  goals: AdaptiveGoal[];
  challenges: AdaptiveChallenge[];
  insights: AdaptiveInsight[];
  recommendations: AdaptiveRecommendation[];
  lastUpdated: Date;
}

export interface AdaptiveSkillProgress {
  skillId: string;
  skillName: string;
  level: number;
  experience: number;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  improvement: number;
  challenges: string[];
  strengths: string[];
  personalizedContent: string[];
  lastPracticed: Date;
}

export interface AdaptiveGoal {
  id: string;
  title: string;
  description: string;
  type: 'skill' | 'language' | 'culture' | 'general';
  target: string;
  deadline?: Date;
  progress: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  milestones: GoalMilestone[];
  personalizedApproach: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdaptiveChallenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  requirements: ChallengeRequirement[];
  rewards: Reward[];
  progress: number;
  status: 'available' | 'active' | 'completed' | 'expired';
  startDate: Date;
  endDate: Date;
  attempts: number;
  maxAttempts: number;
  personalizedContent: string[];
  adaptiveDifficulty: boolean;
}

export interface AdaptiveInsight {
  id: string;
  type: 'learning_style' | 'performance' | 'behavior' | 'cultural' | 'social';
  title: string;
  description: string;
  data: any;
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  recommendations: string[];
  createdAt: Date;
}

export interface AdaptiveRecommendation {
  id: string;
  type: 'content' | 'activity' | 'practice' | 'social' | 'cultural';
  title: string;
  description: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  resources: RecommendationResource[];
  prerequisites: string[];
  expectedOutcome: string;
  personalizationFactors: PersonalizationFactor[];
  effectiveness: number;
  createdAt: Date;
}

export interface Reward {
  type: 'experience' | 'points' | 'badge' | 'item' | 'access' | 'recognition';
  amount?: number;
  item?: any;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

// Constants
export const MENTOR_PERSONALITIES = [
  'patient',
  'encouraging',
  'challenging',
  'wise',
  'playful',
  'strict'
] as const;

export const LEARNING_STYLES = [
  'visual',
  'auditory',
  'reading',
  'kinesthetic',
  'multimodal'
] as const;

export const COGNITIVE_STYLES = [
  'sequential',
  'random',
  'balanced'
] as const;

export const MOTIVATION_TYPES = [
  'intrinsic',
  'extrinsic',
  'achievement',
  'affiliation',
  'power',
  'autonomy',
  'mastery',
  'purpose'
] as const;

export const ADAPTATION_TYPES = [
  'content',
  'difficulty',
  'pace',
  'style',
  'support',
  'feedback'
] as const;

export const CONTENT_TYPES = [
  'lesson',
  'exercise',
  'story',
  'game',
  'video',
  'audio',
  'interactive'
] as const;

export const ASSESSMENT_TYPES = [
  'quiz',
  'project',
  'presentation',
  'discussion',
  'reflection'
] as const;
