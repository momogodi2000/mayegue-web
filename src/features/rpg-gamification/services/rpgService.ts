/**
 * RPG Service - Firebase service for RPG gamification data
 * 
 * @version 1.1.0
 * @author Ma'a yegue Team
 */

import { db } from '@/core/services/firebase/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch
} from 'firebase/firestore';
import { 
  Player, 
  Achievement, 
  Quest, 
  Competition, 
  League, 
  NgondoEconomy,
  NgondoShop,
  NgondoAuction,
  PlayerQuest,
  Reward,
  InventoryItem,
  EquipmentItem,
  PlayerSkill,
  SocialAchievement
} from '../types/rpg.types';

const PLAYERS_COLLECTION = 'rpg_players';
const ACHIEVEMENTS_COLLECTION = 'rpg_achievements';
const QUESTS_COLLECTION = 'rpg_quests';
const COMPETITIONS_COLLECTION = 'rpg_competitions';
const LEAGUES_COLLECTION = 'rpg_leagues';
const ECONOMY_COLLECTION = 'rpg_economy';
const SHOPS_COLLECTION = 'rpg_shops';
const AUCTIONS_COLLECTION = 'rpg_auctions';

export const rpgService = {
  // Player CRUD operations
  async getPlayer(userId: string): Promise<Player | null> {
    try {
      const q = query(collection(db, PLAYERS_COLLECTION), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        } as Player;
      }
      return null;
    } catch (error) {
      console.error('Error fetching player:', error);
      throw new Error('Failed to fetch player data');
    }
  },

  async createPlayer(player: Omit<Player, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, PLAYERS_COLLECTION), {
        ...player,
        createdAt: Timestamp.fromDate(player.createdAt),
        updatedAt: Timestamp.fromDate(player.updatedAt)
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating player:', error);
      throw new Error('Failed to create player');
    }
  },

  async updatePlayer(playerId: string, updates: Partial<Player>): Promise<void> {
    try {
      const docRef = doc(db, PLAYERS_COLLECTION, playerId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating player:', error);
      throw new Error('Failed to update player');
    }
  },

  // Player progression
  async addExperience(playerId: string, amount: number, source: string): Promise<void> {
    try {
      const docRef = doc(db, PLAYERS_COLLECTION, playerId);
      const playerDoc = await getDoc(docRef);
      
      if (playerDoc.exists()) {
        const player = playerDoc.data();
        const newExperience = player.experience + amount;
        const newTotalExperience = player.totalExperience + amount;
        
        // Check for level up
        let newLevel = player.level;
        let newExperienceToNext = player.experienceToNext;
        
        while (newExperience >= newExperienceToNext) {
          newLevel++;
          newExperience -= newExperienceToNext;
          newExperienceToNext = this.calculateExperienceToNext(newLevel);
        }
        
        await updateDoc(docRef, {
          level: newLevel,
          experience: newExperience,
          experienceToNext: newExperienceToNext,
          totalExperience: newTotalExperience,
          updatedAt: Timestamp.fromDate(new Date())
        });
        
        // Check for achievements
        await this.checkLevelUpAchievements(playerId, newLevel);
      }
    } catch (error) {
      console.error('Error adding experience:', error);
      throw new Error('Failed to add experience');
    }
  },

  async addNgondoCoins(playerId: string, amount: number, source: string): Promise<void> {
    try {
      const docRef = doc(db, PLAYERS_COLLECTION, playerId);
      await updateDoc(docRef, {
        ngondoCoins: increment(amount),
        updatedAt: Timestamp.fromDate(new Date())
      });
      
      // Check for coin-related achievements
      await this.checkCoinAchievements(playerId, amount);
    } catch (error) {
      console.error('Error adding Ngondo coins:', error);
      throw new Error('Failed to add Ngondo coins');
    }
  },

  async spendNgondoCoins(playerId: string, amount: number, purpose: string): Promise<boolean> {
    try {
      const docRef = doc(db, PLAYERS_COLLECTION, playerId);
      const playerDoc = await getDoc(docRef);
      
      if (playerDoc.exists()) {
        const player = playerDoc.data();
        
        if (player.ngondoCoins >= amount) {
          await updateDoc(docRef, {
            ngondoCoins: increment(-amount),
            updatedAt: Timestamp.fromDate(new Date())
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error spending Ngondo coins:', error);
      throw new Error('Failed to spend Ngondo coins');
    }
  },

  // Achievements
  async getAllAchievements(): Promise<Achievement[]> {
    try {
      const querySnapshot = await getDocs(collection(db, ACHIEVEMENTS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        unlockedAt: doc.data().unlockedAt?.toDate() || new Date()
      } as Achievement));
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw new Error('Failed to fetch achievements');
    }
  },

  async getAchievementById(id: string): Promise<Achievement | null> {
    try {
      const docRef = doc(db, ACHIEVEMENTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          unlockedAt: docSnap.data().unlockedAt?.toDate() || new Date()
        } as Achievement;
      }
      return null;
    } catch (error) {
      console.error('Error fetching achievement by ID:', error);
      throw new Error('Failed to fetch achievement');
    }
  },

  async unlockAchievement(playerId: string, achievementId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Add achievement to player
      const playerRef = doc(db, PLAYERS_COLLECTION, playerId);
      batch.update(playerRef, {
        achievements: arrayUnion(achievementId),
        updatedAt: Timestamp.fromDate(new Date())
      });
      
      // Add rewards
      const achievement = await this.getAchievementById(achievementId);
      if (achievement) {
        for (const reward of achievement.rewards) {
          await this.giveReward(playerId, reward);
        }
      }
      
      await batch.commit();
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      throw new Error('Failed to unlock achievement');
    }
  },

  async checkLevelUpAchievements(playerId: string, level: number): Promise<void> {
    try {
      const achievements = await this.getAllAchievements();
      const levelAchievements = achievements.filter(achievement => 
        achievement.requirements.some(req => req.type === 'level' && req.value === level)
      );
      
      for (const achievement of levelAchievements) {
        await this.unlockAchievement(playerId, achievement.id);
      }
    } catch (error) {
      console.error('Error checking level up achievements:', error);
    }
  },

  async checkCoinAchievements(playerId: string, amount: number): Promise<void> {
    try {
      const achievements = await this.getAllAchievements();
      const coinAchievements = achievements.filter(achievement => 
        achievement.requirements.some(req => req.type === 'ngondo_coins' && req.value <= amount)
      );
      
      for (const achievement of coinAchievements) {
        await this.unlockAchievement(playerId, achievement.id);
      }
    } catch (error) {
      console.error('Error checking coin achievements:', error);
    }
  },

  // Quests
  async getAllQuests(): Promise<Quest[]> {
    try {
      const querySnapshot = await getDocs(collection(db, QUESTS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as Quest));
    } catch (error) {
      console.error('Error fetching quests:', error);
      throw new Error('Failed to fetch quests');
    }
  },

  async getQuestById(id: string): Promise<Quest | null> {
    try {
      const docRef = doc(db, QUESTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
        } as Quest;
      }
      return null;
    } catch (error) {
      console.error('Error fetching quest by ID:', error);
      throw new Error('Failed to fetch quest');
    }
  },

  async startQuest(playerId: string, questId: string): Promise<void> {
    try {
      const playerRef = doc(db, PLAYERS_COLLECTION, playerId);
      const quest = await this.getQuestById(questId);
      
      if (quest) {
        const playerQuest: PlayerQuest = {
          id: `${playerId}-${questId}`,
          questId: quest.id,
          status: 'active',
          progress: {
            currentObjective: 0,
            completedObjectives: [],
            totalObjectives: quest.objectives.length,
            progress: 0,
            timeSpent: 0,
            attempts: 0,
            hintsUsed: 0
          },
          startedAt: new Date(),
          rewards: quest.rewards,
          objectives: quest.objectives.map(obj => ({
            ...obj,
            current: 0,
            completed: false
          }))
        };
        
        await updateDoc(playerRef, {
          quests: arrayUnion(playerQuest),
          updatedAt: Timestamp.fromDate(new Date())
        });
      }
    } catch (error) {
      console.error('Error starting quest:', error);
      throw new Error('Failed to start quest');
    }
  },

  async completeQuest(playerId: string, questId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      // Update quest status
      const playerRef = doc(db, PLAYERS_COLLECTION, playerId);
      const playerDoc = await getDoc(playerRef);
      
      if (playerDoc.exists()) {
        const player = playerDoc.data();
        const questIndex = player.quests.findIndex((q: PlayerQuest) => q.questId === questId);
        
        if (questIndex !== -1) {
          const updatedQuests = [...player.quests];
          updatedQuests[questIndex] = {
            ...updatedQuests[questIndex],
            status: 'completed',
            completedAt: new Date(),
            progress: {
              ...updatedQuests[questIndex].progress,
              progress: 100
            }
          };
          
          batch.update(playerRef, {
            quests: updatedQuests,
            updatedAt: Timestamp.fromDate(new Date())
          });
          
          // Give rewards
          const quest = updatedQuests[questIndex];
          for (const reward of quest.rewards) {
            await this.giveReward(playerId, reward);
          }
          
          await batch.commit();
        }
      }
    } catch (error) {
      console.error('Error completing quest:', error);
      throw new Error('Failed to complete quest');
    }
  },

  // Skills
  async addSkillExperience(playerId: string, skillId: string, amount: number): Promise<void> {
    try {
      const docRef = doc(db, PLAYERS_COLLECTION, playerId);
      const playerDoc = await getDoc(docRef);
      
      if (playerDoc.exists()) {
        const player = playerDoc.data();
        const skillIndex = player.skills.findIndex((s: PlayerSkill) => s.id === skillId);
        
        if (skillIndex !== -1) {
          const updatedSkills = [...player.skills];
          const skill = updatedSkills[skillIndex];
          
          const newExperience = skill.experience + amount;
          const newTotalExperience = skill.totalExperience + amount;
          
          // Check for skill level up
          let newLevel = skill.level;
          let newExperienceToNext = skill.experienceToNext;
          
          while (newExperience >= newExperienceToNext) {
            newLevel++;
            newExperience -= newExperienceToNext;
            newExperienceToNext = this.calculateSkillExperienceToNext(newLevel);
          }
          
          updatedSkills[skillIndex] = {
            ...skill,
            level: newLevel,
            experience: newExperience,
            experienceToNext: newExperienceToNext,
            totalExperience: newTotalExperience,
            lastUsed: new Date()
          };
          
          await updateDoc(docRef, {
            skills: updatedSkills,
            updatedAt: Timestamp.fromDate(new Date())
          });
        }
      }
    } catch (error) {
      console.error('Error adding skill experience:', error);
      throw new Error('Failed to add skill experience');
    }
  },

  // Inventory and Equipment
  async addItemToInventory(playerId: string, item: InventoryItem): Promise<void> {
    try {
      const docRef = doc(db, PLAYERS_COLLECTION, playerId);
      const playerDoc = await getDoc(docRef);
      
      if (playerDoc.exists()) {
        const player = playerDoc.data();
        const existingItemIndex = player.inventory.findIndex((i: InventoryItem) => i.id === item.id);
        
        let updatedInventory = [...player.inventory];
        
        if (existingItemIndex !== -1) {
          // Item exists, increase quantity
          updatedInventory[existingItemIndex] = {
            ...updatedInventory[existingItemIndex],
            quantity: updatedInventory[existingItemIndex].quantity + item.quantity
          };
        } else {
          // New item
          updatedInventory.push(item);
        }
        
        await updateDoc(docRef, {
          inventory: updatedInventory,
          updatedAt: Timestamp.fromDate(new Date())
        });
      }
    } catch (error) {
      console.error('Error adding item to inventory:', error);
      throw new Error('Failed to add item to inventory');
    }
  },

  async equipItem(playerId: string, item: EquipmentItem, slot: string): Promise<void> {
    try {
      const docRef = doc(db, PLAYERS_COLLECTION, playerId);
      const playerDoc = await getDoc(docRef);
      
      if (playerDoc.exists()) {
        const player = playerDoc.data();
        const updatedEquipment = { ...player.equipment };
        
        // Unequip current item in slot if exists
        if (updatedEquipment[slot]) {
          await this.addItemToInventory(playerId, updatedEquipment[slot] as InventoryItem);
        }
        
        // Equip new item
        updatedEquipment[slot] = item;
        
        // Remove from inventory
        const updatedInventory = player.inventory.filter((i: InventoryItem) => i.id !== item.id);
        
        await updateDoc(docRef, {
          equipment: updatedEquipment,
          inventory: updatedInventory,
          updatedAt: Timestamp.fromDate(new Date())
        });
      }
    } catch (error) {
      console.error('Error equipping item:', error);
      throw new Error('Failed to equip item');
    }
  },

  // Competitions
  async getAllCompetitions(): Promise<Competition[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COMPETITIONS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as Competition));
    } catch (error) {
      console.error('Error fetching competitions:', error);
      throw new Error('Failed to fetch competitions');
    }
  },

  async joinCompetition(playerId: string, competitionId: string): Promise<void> {
    try {
      const docRef = doc(db, COMPETITIONS_COLLECTION, competitionId);
      const competitionDoc = await getDoc(docRef);
      
      if (competitionDoc.exists()) {
        const competition = competitionDoc.data();
        const participant = {
          id: playerId,
          username: '', // Will be filled from player data
          avatar: '',
          level: 0,
          team: undefined,
          score: 0,
          rank: 0,
          status: 'active',
          joinedAt: new Date(),
          lastActivity: new Date()
        };
        
        await updateDoc(docRef, {
          participants: arrayUnion(participant),
          updatedAt: Timestamp.fromDate(new Date())
        });
      }
    } catch (error) {
      console.error('Error joining competition:', error);
      throw new Error('Failed to join competition');
    }
  },

  // Leagues
  async getAllLeagues(): Promise<League[]> {
    try {
      const querySnapshot = await getDocs(collection(db, LEAGUES_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as League));
    } catch (error) {
      console.error('Error fetching leagues:', error);
      throw new Error('Failed to fetch leagues');
    }
  },

  async joinLeague(playerId: string, leagueId: string): Promise<void> {
    try {
      const docRef = doc(db, LEAGUES_COLLECTION, leagueId);
      const leagueDoc = await getDoc(docRef);
      
      if (leagueDoc.exists()) {
        const league = leagueDoc.data();
        const participant = {
          id: playerId,
          username: '', // Will be filled from player data
          avatar: '',
          level: 0,
          points: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          winRate: 0,
          rank: 0,
          previousRank: 0,
          joinedAt: new Date(),
          lastActivity: new Date(),
          status: 'active'
        };
        
        await updateDoc(docRef, {
          participants: arrayUnion(participant),
          updatedAt: Timestamp.fromDate(new Date())
        });
      }
    } catch (error) {
      console.error('Error joining league:', error);
      throw new Error('Failed to join league');
    }
  },

  // Economy
  async getEconomy(): Promise<NgondoEconomy | null> {
    try {
      const querySnapshot = await getDocs(collection(db, ECONOMY_COLLECTION));
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
          lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
        } as NgondoEconomy;
      }
      return null;
    } catch (error) {
      console.error('Error fetching economy:', error);
      throw new Error('Failed to fetch economy data');
    }
  },

  async getAllShops(): Promise<NgondoShop[]> {
    try {
      const querySnapshot = await getDocs(collection(db, SHOPS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as NgondoShop));
    } catch (error) {
      console.error('Error fetching shops:', error);
      throw new Error('Failed to fetch shops');
    }
  },

  async purchaseItem(playerId: string, shopId: string, itemId: string, quantity: number): Promise<boolean> {
    try {
      const batch = writeBatch(db);
      
      // Get shop and item
      const shopRef = doc(db, SHOPS_COLLECTION, shopId);
      const shopDoc = await getDoc(shopRef);
      
      if (shopDoc.exists()) {
        const shop = shopDoc.data();
        const item = shop.items.find((i: any) => i.id === itemId);
        
        if (item && item.quantity >= quantity) {
          const totalCost = item.price * quantity;
          
          // Check if player has enough coins
          const canAfford = await this.spendNgondoCoins(playerId, totalCost, `Purchase: ${item.name}`);
          
          if (canAfford) {
            // Add item to player inventory
            const inventoryItem: InventoryItem = {
              ...item,
              quantity,
              obtainedAt: new Date(),
              obtainedFrom: shopId
            };
            await this.addItemToInventory(playerId, inventoryItem);
            
            // Update shop inventory
            const updatedItems = shop.items.map((i: any) => 
              i.id === itemId ? { ...i, quantity: i.quantity - quantity } : i
            );
            
            batch.update(shopRef, {
              items: updatedItems,
              updatedAt: Timestamp.fromDate(new Date())
            });
            
            await batch.commit();
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Error purchasing item:', error);
      throw new Error('Failed to purchase item');
    }
  },

  async getAllAuctions(): Promise<NgondoAuction[]> {
    try {
      const querySnapshot = await getDocs(collection(db, AUCTIONS_COLLECTION));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate() || new Date(),
        endDate: doc.data().endDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as NgondoAuction));
    } catch (error) {
      console.error('Error fetching auctions:', error);
      throw new Error('Failed to fetch auctions');
    }
  },

  async placeBid(playerId: string, auctionId: string, amount: number): Promise<boolean> {
    try {
      const docRef = doc(db, AUCTIONS_COLLECTION, auctionId);
      const auctionDoc = await getDoc(docRef);
      
      if (auctionDoc.exists()) {
        const auction = auctionDoc.data();
        
        if (amount > auction.currentBid) {
          // Check if player has enough coins
          const canAfford = await this.spendNgondoCoins(playerId, amount, `Bid on: ${auction.name}`);
          
          if (canAfford) {
            const bid = {
              id: `bid-${Date.now()}`,
              bidder: playerId,
              amount,
              timestamp: new Date(),
              isWinning: true,
              isRetracted: false
            };
            
            // Update auction
            await updateDoc(docRef, {
              currentBid: amount,
              bids: arrayUnion(bid),
              updatedAt: Timestamp.fromDate(new Date())
            });
            
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Error placing bid:', error);
      throw new Error('Failed to place bid');
    }
  },

  // Helper methods
  calculateExperienceToNext(level: number): number {
    // Exponential experience curve
    return Math.floor(100 * Math.pow(1.5, level - 1));
  },

  calculateSkillExperienceToNext(level: number): number {
    // Linear skill experience curve
    return level * 100;
  },

  async giveReward(playerId: string, reward: Reward): Promise<void> {
    try {
      switch (reward.type) {
        case 'experience':
          await this.addExperience(playerId, reward.amount, 'Reward');
          break;
        case 'ngondo_coins':
          await this.addNgondoCoins(playerId, reward.amount, 'Reward');
          break;
        case 'item':
          if (reward.item) {
            await this.addItemToInventory(playerId, reward.item);
          }
          break;
        case 'skill_point':
          // Handle skill points
          break;
        case 'achievement':
          // Handle achievement rewards
          break;
        case 'title':
          // Handle title rewards
          break;
        case 'access':
          // Handle access rewards
          break;
        case 'special':
          // Handle special rewards
          break;
      }
    } catch (error) {
      console.error('Error giving reward:', error);
      throw new Error('Failed to give reward');
    }
  },

  // Player statistics
  async getPlayerStats(playerId: string): Promise<any> {
    try {
      const player = await this.getPlayer(playerId);
      if (!player) return null;

      return {
        level: player.level,
        experience: player.experience,
        totalExperience: player.totalExperience,
        ngondoCoins: player.ngondoCoins,
        achievements: player.achievements.length,
        questsCompleted: player.quests.filter(q => q.status === 'completed').length,
        skillsMastered: player.skills.filter(s => s.proficiency === 'master').length,
        inventoryItems: player.inventory.length,
        playTime: player.progress.totalPlayTime,
        streak: player.progress.streak,
        longestStreak: player.progress.longestStreak
      };
    } catch (error) {
      console.error('Error fetching player stats:', error);
      throw new Error('Failed to fetch player statistics');
    }
  },

  // Leaderboards
  async getLeaderboard(type: 'level' | 'experience' | 'achievements' | 'coins', limit: number = 10): Promise<any[]> {
    try {
      let orderField = 'level';
      
      switch (type) {
        case 'level':
          orderField = 'level';
          break;
        case 'experience':
          orderField = 'totalExperience';
          break;
        case 'achievements':
          orderField = 'achievements';
          break;
        case 'coins':
          orderField = 'ngondoCoins';
          break;
      }
      
      const q = query(
        collection(db, PLAYERS_COLLECTION),
        orderBy(orderField, 'desc'),
        limit(limit)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        rank: querySnapshot.docs.indexOf(doc) + 1
      }));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error('Failed to fetch leaderboard');
    }
  }
};
