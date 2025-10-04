/**
 * RPG Gamification Types - TypeScript interfaces for RPG system
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

export interface Player {
  id: string;
  userId: string;
  username: string;
  avatar: PlayerAvatar;
  level: number;
  experience: number;
  experienceToNext: number;
  totalExperience: number;
  ngondoCoins: number;
  achievements: Achievement[];
  skills: PlayerSkill[];
  equipment: PlayerEquipment;
  inventory: InventoryItem[];
  quests: PlayerQuest[];
  stats: PlayerStats;
  preferences: PlayerPreferences;
  social: PlayerSocial;
  progress: PlayerProgress;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerAvatar {
  id: string;
  name: string;
  appearance: AvatarAppearance;
  customization: AvatarCustomization;
  animations: AvatarAnimation[];
  expressions: AvatarExpression[];
  isCustom: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

export interface AvatarAppearance {
  gender: 'male' | 'female' | 'non-binary';
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  facialFeatures: string[];
  bodyType: 'slim' | 'average' | 'muscular' | 'heavy';
  height: number;
  weight: number;
}

export interface AvatarCustomization {
  clothing: AvatarClothing;
  accessories: AvatarAccessory[];
  tattoos: AvatarTattoo[];
  scars: AvatarScar[];
  culturalElements: CulturalElement[];
  seasonalItems: SeasonalItem[];
}

export interface AvatarClothing {
  top: string;
  bottom: string;
  shoes: string;
  hat?: string;
  glasses?: string;
  jewelry: string[];
  color: string;
  pattern: string;
  material: string;
}

export interface AvatarAccessory {
  id: string;
  type: 'necklace' | 'bracelet' | 'ring' | 'earring' | 'piercing' | 'other';
  name: string;
  description: string;
  imageUrl: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stats: AccessoryStats;
  culturalSignificance: string;
  unlockConditions: string[];
}

export interface AccessoryStats {
  charisma: number;
  intelligence: number;
  wisdom: number;
  strength: number;
  dexterity: number;
  constitution: number;
}

export interface AvatarTattoo {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  placement: string;
  size: number;
  color: string;
  culturalMeaning: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface AvatarScar {
  id: string;
  name: string;
  description: string;
  placement: string;
  size: number;
  color: string;
  story: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface CulturalElement {
  id: string;
  type: 'clothing' | 'accessory' | 'tattoo' | 'scarf' | 'jewelry';
  name: string;
  description: string;
  culturalGroup: string;
  region: string;
  significance: string;
  imageUrl: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockConditions: string[];
}

export interface SeasonalItem {
  id: string;
  name: string;
  description: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  event: string;
  imageUrl: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  availableUntil: Date;
}

export interface AvatarAnimation {
  id: string;
  name: string;
  type: 'idle' | 'walking' | 'running' | 'dancing' | 'celebrating' | 'thinking' | 'speaking';
  animationUrl: string;
  duration: number;
  loop: boolean;
  trigger: AnimationTrigger;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface AnimationTrigger {
  type: 'automatic' | 'manual' | 'achievement' | 'level_up' | 'quest_complete';
  conditions: string[];
}

export interface AvatarExpression {
  id: string;
  name: string;
  type: 'happy' | 'sad' | 'angry' | 'surprised' | 'confused' | 'proud' | 'shy' | 'excited';
  imageUrl: string;
  animationUrl?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface PlayerSkill {
  id: string;
  name: string;
  category: 'language' | 'culture' | 'history' | 'art' | 'music' | 'craft' | 'cooking' | 'medicine';
  level: number;
  experience: number;
  experienceToNext: number;
  totalExperience: number;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  specializations: SkillSpecialization[];
  achievements: SkillAchievement[];
  unlockedAt: Date;
  lastUsed: Date;
}

export interface SkillSpecialization {
  id: string;
  name: string;
  description: string;
  level: number;
  experience: number;
  benefits: string[];
  requirements: string[];
  unlockedAt: Date;
}

export interface SkillAchievement {
  id: string;
  name: string;
  description: string;
  type: 'milestone' | 'mastery' | 'specialization' | 'challenge';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  rewards: Reward[];
  unlockedAt: Date;
}

export interface PlayerEquipment {
  weapon: EquipmentItem | null;
  armor: EquipmentItem[];
  accessories: EquipmentItem[];
  tools: EquipmentItem[];
  cultural: EquipmentItem[];
  totalStats: AccessoryStats;
}

export interface EquipmentItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'tool' | 'cultural';
  category: string;
  description: string;
  imageUrl: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  stats: AccessoryStats;
  requirements: EquipmentRequirements;
  durability: number;
  maxDurability: number;
  enchantments: Enchantment[];
  culturalSignificance: string;
  unlockConditions: string[];
  equippedAt: Date;
}

export interface EquipmentRequirements {
  level: number;
  skills: { [skillId: string]: number };
  achievements: string[];
  ngondoCoins: number;
}

export interface Enchantment {
  id: string;
  name: string;
  description: string;
  type: 'stat_boost' | 'special_ability' | 'resistance' | 'enhancement';
  effect: string;
  value: number;
  duration: number; // -1 for permanent
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'consumable' | 'material' | 'tool' | 'book' | 'artifact' | 'currency';
  category: string;
  description: string;
  imageUrl: string;
  quantity: number;
  maxStack: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  value: number;
  effects: ItemEffect[];
  usage: ItemUsage;
  culturalSignificance: string;
  obtainedAt: Date;
  obtainedFrom: string;
}

export interface ItemEffect {
  type: 'experience_boost' | 'skill_boost' | 'health_restore' | 'mana_restore' | 'stat_boost' | 'special';
  value: number;
  duration: number;
  target: 'self' | 'party' | 'all';
}

export interface ItemUsage {
  type: 'consumable' | 'equipment' | 'material' | 'readable' | 'decorative';
  cooldown: number;
  requirements: string[];
  effects: ItemEffect[];
}

export interface PlayerQuest {
  id: string;
  questId: string;
  status: 'available' | 'active' | 'completed' | 'failed' | 'expired';
  progress: QuestProgress;
  startedAt?: Date;
  completedAt?: Date;
  rewards: Reward[];
  objectives: QuestObjective[];
}

export interface QuestProgress {
  currentObjective: number;
  completedObjectives: number[];
  totalObjectives: number;
  progress: number;
  timeSpent: number;
  attempts: number;
  hintsUsed: number;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'kill' | 'collect' | 'explore' | 'learn' | 'craft' | 'social' | 'challenge';
  target: string;
  quantity: number;
  current: number;
  completed: boolean;
  rewards: Reward[];
  hints: string[];
}

export interface PlayerStats {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stamina: number;
  maxStamina: number;
  attributes: PlayerAttributes;
  resistances: PlayerResistances;
  bonuses: PlayerBonuses;
}

export interface PlayerAttributes {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface PlayerResistances {
  fire: number;
  water: number;
  earth: number;
  air: number;
  light: number;
  dark: number;
  physical: number;
  magical: number;
}

export interface PlayerBonuses {
  experience: number;
  skillExperience: number;
  ngondoCoins: number;
  dropRate: number;
  criticalChance: number;
  criticalDamage: number;
  movementSpeed: number;
  attackSpeed: number;
  castingSpeed: number;
}

export interface PlayerPreferences {
  language: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  autoSave: boolean;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  ui: UISettings;
}

export interface NotificationSettings {
  achievements: boolean;
  quests: boolean;
  social: boolean;
  events: boolean;
  reminders: boolean;
  sound: boolean;
  vibration: boolean;
}

export interface PrivacySettings {
  profileVisible: boolean;
  progressVisible: boolean;
  achievementsVisible: boolean;
  onlineStatus: boolean;
  allowFriendRequests: boolean;
  allowMessages: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  colorBlindSupport: boolean;
  reducedMotion: boolean;
  keyboardNavigation: boolean;
}

export interface UISettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  compactMode: boolean;
  showTooltips: boolean;
  showAnimations: boolean;
  showParticles: boolean;
}

export interface PlayerSocial {
  friends: Friend[];
  guild?: Guild;
  reputation: Reputation;
  socialRank: SocialRank;
  achievements: SocialAchievement[];
  events: SocialEvent[];
}

export interface Friend {
  id: string;
  username: string;
  avatar: string;
  level: number;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen: Date;
  friendshipLevel: number;
  gifts: Gift[];
  sharedProgress: SharedProgress;
}

export interface Gift {
  id: string;
  type: 'item' | 'currency' | 'experience' | 'special';
  item?: InventoryItem;
  amount: number;
  message: string;
  sentAt: Date;
  receivedAt?: Date;
  opened: boolean;
}

export interface SharedProgress {
  quests: string[];
  achievements: string[];
  skills: string[];
  lastShared: Date;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  level: number;
  experience: number;
  members: GuildMember[];
  ranks: GuildRank[];
  permissions: GuildPermissions;
  treasury: GuildTreasury;
  activities: GuildActivity[];
  createdAt: Date;
}

export interface GuildMember {
  id: string;
  username: string;
  avatar: string;
  rank: string;
  joinedAt: Date;
  contribution: number;
  status: 'active' | 'inactive' | 'banned';
  permissions: string[];
}

export interface GuildRank {
  id: string;
  name: string;
  level: number;
  permissions: string[];
  requirements: string[];
  color: string;
  icon: string;
}

export interface GuildPermissions {
  invite: string[];
  kick: string[];
  promote: string[];
  demote: string[];
  treasury: string[];
  events: string[];
  announcements: string[];
}

export interface GuildTreasury {
  ngondoCoins: number;
  items: InventoryItem[];
  contributions: TreasuryContribution[];
  lastUpdated: Date;
}

export interface TreasuryContribution {
  memberId: string;
  amount: number;
  type: 'currency' | 'item';
  item?: InventoryItem;
  timestamp: Date;
  purpose: string;
}

export interface GuildActivity {
  id: string;
  type: 'quest' | 'event' | 'challenge' | 'social';
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  participants: string[];
  rewards: Reward[];
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

export interface Reputation {
  total: number;
  categories: { [category: string]: number };
  rank: string;
  benefits: string[];
  penalties: string[];
  lastUpdated: Date;
}

export interface SocialRank {
  level: number;
  title: string;
  description: string;
  benefits: string[];
  requirements: string[];
  nextRank: string;
  progress: number;
}

export interface SocialAchievement {
  id: string;
  name: string;
  description: string;
  type: 'social' | 'leadership' | 'cooperation' | 'mentorship';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  rewards: Reward[];
  unlockedAt: Date;
}

export interface SocialEvent {
  id: string;
  name: string;
  description: string;
  type: 'party' | 'competition' | 'celebration' | 'learning';
  startDate: Date;
  endDate: Date;
  participants: string[];
  rewards: Reward[];
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

export interface PlayerProgress {
  totalPlayTime: number;
  sessionsCompleted: number;
  questsCompleted: number;
  achievementsUnlocked: number;
  skillsMastered: number;
  languagesLearned: number;
  culturalGroupsExplored: number;
  regionsVisited: number;
  artifactsCollected: number;
  socialInteractions: number;
  lastActivity: Date;
  streak: number;
  longestStreak: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'general' | 'language' | 'culture' | 'social' | 'exploration' | 'mastery' | 'special';
  type: 'milestone' | 'collection' | 'skill' | 'social' | 'challenge' | 'secret';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  icon: string;
  imageUrl: string;
  requirements: AchievementRequirement[];
  rewards: Reward[];
  unlockedAt: Date;
  progress: number;
  maxProgress: number;
  isSecret: boolean;
  isHidden: boolean;
}

export interface AchievementRequirement {
  type: 'level' | 'skill' | 'quest' | 'item' | 'social' | 'time' | 'custom';
  target: string;
  value: number;
  current: number;
  completed: boolean;
}

export interface Reward {
  type: 'experience' | 'ngondo_coins' | 'item' | 'skill_point' | 'achievement' | 'title' | 'access' | 'special';
  amount: number;
  item?: InventoryItem;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  category: 'main' | 'side' | 'daily' | 'weekly' | 'event' | 'special';
  type: 'story' | 'exploration' | 'combat' | 'social' | 'crafting' | 'learning' | 'challenge';
  difficulty: 'easy' | 'normal' | 'hard' | 'expert' | 'legendary';
  level: number;
  requirements: QuestRequirement[];
  objectives: QuestObjective[];
  rewards: Reward[];
  timeLimit?: number;
  repeatable: boolean;
  cooldown?: number;
  prerequisites: string[];
  unlocks: string[];
  story: QuestStory;
  metadata: QuestMetadata;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestRequirement {
  type: 'level' | 'skill' | 'achievement' | 'quest' | 'item' | 'social' | 'time';
  target: string;
  value: number;
  description: string;
}

export interface QuestStory {
  background: string;
  introduction: string;
  conclusion: string;
  characters: QuestCharacter[];
  locations: QuestLocation[];
  events: QuestEvent[];
  choices: QuestChoice[];
  consequences: QuestConsequence[];
}

export interface QuestCharacter {
  id: string;
  name: string;
  role: 'quest_giver' | 'ally' | 'enemy' | 'neutral' | 'mentor';
  description: string;
  imageUrl: string;
  dialogue: QuestDialogue[];
  personality: string;
  culturalBackground: string;
  relationship: number;
}

export interface QuestDialogue {
  id: string;
  text: string;
  emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'confused';
  conditions: string[];
  responses: QuestResponse[];
}

export interface QuestResponse {
  id: string;
  text: string;
  consequences: string[];
  nextDialogueId?: string;
  questAction?: string;
}

export interface QuestLocation {
  id: string;
  name: string;
  description: string;
  type: 'village' | 'city' | 'forest' | 'mountain' | 'river' | 'market' | 'temple' | 'home';
  region: string;
  culturalGroup: string;
  imageUrl: string;
  coordinates: [number, number];
  accessible: boolean;
  requirements: string[];
}

export interface QuestEvent {
  id: string;
  name: string;
  description: string;
  type: 'ceremony' | 'festival' | 'meeting' | 'conflict' | 'celebration' | 'learning';
  date: Date;
  location: string;
  participants: string[];
  outcomes: string[];
  choices: QuestChoice[];
}

export interface QuestChoice {
  id: string;
  text: string;
  description: string;
  consequences: QuestConsequence[];
  requirements: string[];
  rewards: Reward[];
  penalties: Penalty[];
}

export interface QuestConsequence {
  type: 'story' | 'relationship' | 'reputation' | 'reward' | 'penalty' | 'unlock';
  target: string;
  value: number;
  description: string;
  permanent: boolean;
}

export interface Penalty {
  type: 'experience_loss' | 'item_loss' | 'reputation_loss' | 'time_penalty' | 'access_denial';
  amount: number;
  description: string;
  duration?: number;
}

export interface QuestMetadata {
  estimatedDuration: number;
  difficulty: number;
  culturalSignificance: string;
  learningObjectives: string[];
  tags: string[];
  author: string;
  version: string;
  lastModified: Date;
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  type: 'tournament' | 'league' | 'challenge' | 'event';
  category: 'language' | 'culture' | 'skill' | 'social' | 'general';
  format: '1v1' | 'team' | 'individual' | 'battle_royale';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  level: number;
  requirements: CompetitionRequirement[];
  rules: CompetitionRule[];
  prizes: Prize[];
  schedule: CompetitionSchedule;
  participants: CompetitionParticipant[];
  brackets: CompetitionBracket[];
  status: 'upcoming' | 'registration' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface CompetitionRequirement {
  type: 'level' | 'skill' | 'achievement' | 'registration_fee' | 'team_size';
  target: string;
  value: number;
  description: string;
}

export interface CompetitionRule {
  id: string;
  description: string;
  type: 'scoring' | 'time' | 'attempts' | 'behavior' | 'technical';
  value: any;
  penalty: string;
}

export interface Prize {
  id: string;
  name: string;
  description: string;
  type: 'currency' | 'item' | 'title' | 'access' | 'special';
  amount: number;
  item?: InventoryItem;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  position: number;
}

export interface CompetitionSchedule {
  registrationStart: Date;
  registrationEnd: Date;
  competitionStart: Date;
  competitionEnd: Date;
  rounds: CompetitionRound[];
  timezone: string;
}

export interface CompetitionRound {
  id: string;
  name: string;
  type: 'qualification' | 'elimination' | 'final';
  startDate: Date;
  endDate: Date;
  duration: number;
  participants: number;
  winners: number;
}

export interface CompetitionParticipant {
  id: string;
  username: string;
  avatar: string;
  level: number;
  team?: string;
  score: number;
  rank: number;
  status: 'active' | 'eliminated' | 'disqualified' | 'withdrawn';
  joinedAt: Date;
  lastActivity: Date;
}

export interface CompetitionBracket {
  id: string;
  name: string;
  type: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  rounds: BracketRound[];
  participants: string[];
  winners: string[];
  status: 'upcoming' | 'active' | 'completed';
}

export interface BracketRound {
  id: string;
  name: string;
  matches: BracketMatch[];
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed';
}

export interface BracketMatch {
  id: string;
  participants: string[];
  winner?: string;
  score: { [participantId: string]: number };
  startDate: Date;
  endDate: Date;
  duration: number;
  status: 'upcoming' | 'active' | 'completed' | 'forfeit';
}

export interface League {
  id: string;
  name: string;
  description: string;
  category: 'language' | 'culture' | 'skill' | 'social' | 'general';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster';
  season: string;
  startDate: Date;
  endDate: Date;
  participants: LeagueParticipant[];
  standings: LeagueStanding[];
  promotions: LeaguePromotion[];
  relegations: LeagueRelegation[];
  rewards: LeagueReward[];
  rules: LeagueRule[];
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface LeagueParticipant {
  id: string;
  username: string;
  avatar: string;
  level: number;
  points: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  rank: number;
  previousRank: number;
  joinedAt: Date;
  lastActivity: Date;
  status: 'active' | 'inactive' | 'banned';
}

export interface LeagueStanding {
  position: number;
  participantId: string;
  points: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  lastUpdated: Date;
}

export interface LeaguePromotion {
  id: string;
  participantId: string;
  fromTier: string;
  toTier: string;
  date: Date;
  reason: string;
  rewards: Reward[];
}

export interface LeagueRelegation {
  id: string;
  participantId: string;
  fromTier: string;
  toTier: string;
  date: Date;
  reason: string;
  penalties: Penalty[];
}

export interface LeagueReward {
  id: string;
  name: string;
  description: string;
  type: 'currency' | 'item' | 'title' | 'access' | 'special';
  amount: number;
  item?: InventoryItem;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  position: number;
  tier: string;
}

export interface LeagueRule {
  id: string;
  description: string;
  type: 'scoring' | 'time' | 'attempts' | 'behavior' | 'technical';
  value: any;
  penalty: string;
}

export interface NgondoEconomy {
  id: string;
  name: string;
  description: string;
  currency: NgondoCurrency;
  shops: NgondoShop[];
  auctions: NgondoAuction[];
  exchanges: NgondoExchange[];
  events: NgondoEvent[];
  inflation: number;
  deflation: number;
  lastUpdated: Date;
}

export interface NgondoCurrency {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  circulatingSupply: number;
  exchangeRate: number;
  lastUpdated: Date;
}

export interface NgondoShop {
  id: string;
  name: string;
  description: string;
  type: 'general' | 'specialized' | 'seasonal' | 'event';
  category: 'equipment' | 'consumables' | 'materials' | 'cosmetics' | 'special';
  owner: string;
  items: ShopItem[];
  discounts: ShopDiscount[];
  promotions: ShopPromotion[];
  reputation: number;
  level: number;
  isActive: boolean;
  location: string;
  hours: ShopHours;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'equipment' | 'consumable' | 'material' | 'cosmetic' | 'special';
  category: string;
  imageUrl: string;
  price: number;
  currency: string;
  quantity: number;
  maxQuantity: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  requirements: ShopItemRequirement[];
  effects: ItemEffect[];
  culturalSignificance: string;
  unlockConditions: string[];
  isLimited: boolean;
  limitedUntil?: Date;
  isNew: boolean;
  isPopular: boolean;
  sales: number;
  rating: number;
  reviews: number;
}

export interface ShopItemRequirement {
  type: 'level' | 'skill' | 'achievement' | 'quest' | 'item' | 'social';
  target: string;
  value: number;
  description: string;
}

export interface ShopDiscount {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'buy_one_get_one' | 'bundle';
  value: number;
  target: string;
  conditions: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface ShopPromotion {
  id: string;
  name: string;
  description: string;
  type: 'sale' | 'event' | 'seasonal' | 'special';
  items: string[];
  discounts: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  imageUrl: string;
  banner: string;
}

export interface ShopHours {
  monday: TimeSlot;
  tuesday: TimeSlot;
  wednesday: TimeSlot;
  thursday: TimeSlot;
  friday: TimeSlot;
  saturday: TimeSlot;
  sunday: TimeSlot;
  holidays: TimeSlot;
}

export interface TimeSlot {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface NgondoAuction {
  id: string;
  name: string;
  description: string;
  item: InventoryItem;
  seller: string;
  startingBid: number;
  currentBid: number;
  buyoutPrice?: number;
  bids: AuctionBid[];
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  watchers: string[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuctionBid {
  id: string;
  bidder: string;
  amount: number;
  timestamp: Date;
  isWinning: boolean;
  isRetracted: boolean;
}

export interface NgondoExchange {
  id: string;
  name: string;
  description: string;
  type: 'currency' | 'item' | 'service';
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  fees: ExchangeFee[];
  limits: ExchangeLimit[];
  isActive: boolean;
  location: string;
  hours: ShopHours;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExchangeFee {
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  conditions: string[];
}

export interface ExchangeLimit {
  type: 'daily' | 'weekly' | 'monthly' | 'transaction';
  value: number;
  description: string;
  resetDate: Date;
}

export interface NgondoEvent {
  id: string;
  name: string;
  description: string;
  type: 'economic' | 'social' | 'cultural' | 'seasonal' | 'special';
  category: 'inflation' | 'deflation' | 'bonus' | 'discount' | 'auction' | 'exchange';
  effects: EconomicEffect[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  participants: string[];
  rewards: Reward[];
  requirements: string[];
  imageUrl: string;
  banner: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EconomicEffect {
  type: 'price_change' | 'exchange_rate' | 'bonus' | 'discount' | 'inflation' | 'deflation';
  target: string;
  value: number;
  description: string;
  duration: number;
}

// Constants
export const PLAYER_LEVELS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50
] as const;

export const SKILL_CATEGORIES = [
  'language',
  'culture',
  'history',
  'art',
  'music',
  'craft',
  'cooking',
  'medicine'
] as const;

export const ACHIEVEMENT_CATEGORIES = [
  'general',
  'language',
  'culture',
  'social',
  'exploration',
  'mastery',
  'special'
] as const;

export const QUEST_CATEGORIES = [
  'main',
  'side',
  'daily',
  'weekly',
  'event',
  'special'
] as const;

export const COMPETITION_TYPES = [
  'tournament',
  'league',
  'challenge',
  'event'
] as const;

export const LEAGUE_TIERS = [
  'bronze',
  'silver',
  'gold',
  'platinum',
  'diamond',
  'master',
  'grandmaster'
] as const;

export const RARITY_LEVELS = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary'
] as const;
