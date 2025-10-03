import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { firestoreService } from '@/core/services/firebase/firestore.service';

export interface CommunityUser {
  id: string;
  displayName: string;
  email: string;
  profilePicture?: string;
  languagesLearning: string[];
  languagesTeaching: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  joinedAt: Date;
  lastActive?: Date;
  reputation: number;
  badges: string[];
  bio?: string;
  location?: string;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: CommunityUser;
  languageId: string;
  category: 'general' | 'grammar' | 'vocabulary' | 'culture' | 'practice' | 'resources';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  replies: Reply[];
  likes: number;
  views: number;
  isPinned: boolean;
  isClosed: boolean;
  likedBy: string[];
}

export interface Reply {
  id: string;
  content: string;
  authorId: string;
  author: CommunityUser;
  discussionId: string;
  parentReplyId?: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  likedBy: string[];
  isAccepted?: boolean;
}

export interface LanguageExchange {
  id: string;
  title: string;
  description: string;
  hostId: string;
  host: CommunityUser;
  nativeLanguage: string;
  targetLanguage: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  format: 'text' | 'voice' | 'video';
  scheduledAt?: Date;
  duration: number; // minutes
  maxParticipants: number;
  participants: string[];
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  tags: string[];
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  languageId: string;
  type: 'vocabulary' | 'pronunciation' | 'grammar' | 'translation' | 'cultural';
  difficulty: 'easy' | 'medium' | 'hard';
  startDate: Date;
  endDate: Date;
  participants: string[];
  submissions: ChallengeSubmission[];
  prizes: string[];
  status: 'upcoming' | 'active' | 'judging' | 'completed';
  createdBy: string;
  rules: string;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  userId: string;
  user: CommunityUser;
  content: string;
  audioUrl?: string;
  submittedAt: Date;
  votes: number;
  votedBy: string[];
  score?: number;
  feedback?: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  languageId: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  createdBy: string;
  moderators: string[];
  members: string[];
  maxMembers: number;
  isPrivate: boolean;
  schedules: GroupSchedule[];
  resources: GroupResource[];
  createdAt: Date;
  lastActivity: Date;
}

export interface GroupSchedule {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  meetingLink?: string;
  type: 'study' | 'practice' | 'review' | 'exam';
  participants: string[];
}

export interface GroupResource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'audio' | 'link';
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  tags: string[];
}

interface CommunityState {
  // Data
  discussions: Discussion[];
  currentDiscussion: Discussion | null;
  exchanges: LanguageExchange[];
  challenges: CommunityChallenge[];
  studyGroups: StudyGroup[];
  communityUsers: Record<string, CommunityUser>;
  
  // UI State
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  selectedLanguage: string | null;
  searchQuery: string;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedLanguage: (language: string | null) => void;
  
  // Discussion Management
  fetchDiscussions: (languageId?: string, category?: string) => Promise<void>;
  fetchDiscussionById: (id: string) => Promise<Discussion | null>;
  createDiscussion: (discussion: Omit<Discussion, 'id' | 'createdAt' | 'updatedAt' | 'replies' | 'likes' | 'views' | 'likedBy'>) => Promise<string>;
  updateDiscussion: (id: string, updates: Partial<Discussion>) => Promise<void>;
  deleteDiscussion: (id: string) => Promise<void>;
  
  // Reply Management
  addReply: (discussionId: string, reply: Omit<Reply, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'likedBy'>) => Promise<string>;
  updateReply: (replyId: string, updates: Partial<Reply>) => Promise<void>;
  deleteReply: (replyId: string) => Promise<void>;
  toggleReplyLike: (replyId: string, userId: string) => Promise<void>;
  acceptReply: (replyId: string) => Promise<void>;
  
  // Discussion Interactions
  toggleDiscussionLike: (discussionId: string, userId: string) => Promise<void>;
  incrementViews: (discussionId: string) => Promise<void>;
  pinDiscussion: (discussionId: string) => Promise<void>;
  closeDiscussion: (discussionId: string) => Promise<void>;
  
  // Language Exchange
  fetchExchanges: (languageId?: string) => Promise<void>;
  createExchange: (exchange: Omit<LanguageExchange, 'id' | 'createdAt' | 'participants' | 'status'>) => Promise<string>;
  joinExchange: (exchangeId: string, userId: string) => Promise<void>;
  leaveExchange: (exchangeId: string, userId: string) => Promise<void>;
  startExchange: (exchangeId: string) => Promise<void>;
  
  // Community Challenges
  fetchChallenges: (languageId?: string) => Promise<void>;
  createChallenge: (challenge: Omit<CommunityChallenge, 'id' | 'participants' | 'submissions' | 'status'>) => Promise<string>;
  joinChallenge: (challengeId: string, userId: string) => Promise<void>;
  submitToChallenge: (submission: Omit<ChallengeSubmission, 'id' | 'submittedAt' | 'votes' | 'votedBy'>) => Promise<string>;
  voteSubmission: (submissionId: string, userId: string) => Promise<void>;
  
  // Study Groups
  fetchStudyGroups: (languageId?: string) => Promise<void>;
  createStudyGroup: (group: Omit<StudyGroup, 'id' | 'members' | 'createdAt' | 'lastActivity'>) => Promise<string>;
  joinStudyGroup: (groupId: string, userId: string) => Promise<void>;
  leaveStudyGroup: (groupId: string, userId: string) => Promise<void>;
  addGroupSchedule: (groupId: string, schedule: Omit<GroupSchedule, 'id' | 'participants'>) => Promise<string>;
  addGroupResource: (groupId: string, resource: Omit<GroupResource, 'id' | 'uploadedAt'>) => Promise<string>;
  
  // User Management
  fetchCommunityUser: (userId: string) => Promise<CommunityUser | null>;
  updateCommunityProfile: (userId: string, profile: Partial<CommunityUser>) => Promise<void>;
  searchUsers: (query: string) => Promise<CommunityUser[]>;
  
  // Utility Functions
  getFilteredDiscussions: () => Discussion[];
  getPopularDiscussions: () => Discussion[];
  getRecentDiscussions: () => Discussion[];
  getUserParticipation: (userId: string) => {
    discussions: number;
    replies: number;
    exchanges: number;
    challenges: number;
    groups: number;
  };
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      // Initial State
      discussions: [],
      currentDiscussion: null,
      exchanges: [],
      challenges: [],
      studyGroups: [],
      communityUsers: {},
      loading: false,
      error: null,
      selectedCategory: null,
      selectedLanguage: null,
      searchQuery: '',

      // Basic Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
      setSelectedLanguage: (selectedLanguage) => set({ selectedLanguage }),

      // Discussion Management
      fetchDiscussions: async (languageId, category) => {
        set({ loading: true, error: null });
        try {
          const whereConditions: [string, any, unknown][] = [];
          
          if (languageId) {
            whereConditions.push(['languageId', '==', languageId]);
          }
          if (category) {
            whereConditions.push(['category', '==', category]);
          }
          
          const discussions = await firestoreService.getDocs<Discussion>('discussions', {
            where: whereConditions
          });
          
          set({ discussions, loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch discussions', loading: false });
        }
      },

      fetchDiscussionById: async (id) => {
        set({ loading: true, error: null });
        try {
          const discussion = await firestoreService.getDoc('discussions', id) as Discussion | null;
          
          if (discussion) {
            // Increment views
            await firestoreService.updateDoc('discussions', id, {
              views: (discussion.views || 0) + 1
            });
            discussion.views = (discussion.views || 0) + 1;
            
            set({ currentDiscussion: discussion, loading: false });
          }
          
          return discussion;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch discussion', loading: false });
          return null;
        }
      },

      createDiscussion: async (discussionData) => {
        set({ loading: true, error: null });
        try {
          const now = new Date();
          const discussion: Omit<Discussion, 'id'> = {
            ...discussionData,
            createdAt: now,
            updatedAt: now,
            replies: [],
            likes: 0,
            views: 0,
            isPinned: false,
            isClosed: false,
            likedBy: []
          };
          
          const id = await firestoreService.addDoc('discussions', discussion);
          
          // Update local state
          const newDiscussion = { ...discussion, id } as Discussion;
          set(state => ({
            discussions: [newDiscussion, ...state.discussions],
            loading: false
          }));
          
          return id;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create discussion', loading: false });
          throw error;
        }
      },

      updateDiscussion: async (id, updates) => {
        try {
          await firestoreService.updateDoc('discussions', id, {
            ...updates,
            updatedAt: new Date()
          });
          
          set(state => ({
            discussions: state.discussions.map(d => 
              d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
            ),
            currentDiscussion: state.currentDiscussion?.id === id 
              ? { ...state.currentDiscussion, ...updates, updatedAt: new Date() }
              : state.currentDiscussion
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update discussion' });
        }
      },

      deleteDiscussion: async (id) => {
        try {
          await firestoreService.deleteDoc('discussions', id);
          
          set(state => ({
            discussions: state.discussions.filter(d => d.id !== id),
            currentDiscussion: state.currentDiscussion?.id === id ? null : state.currentDiscussion
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete discussion' });
        }
      },

      // Reply Management
      addReply: async (discussionId, replyData) => {
        try {
          const now = new Date();
          const reply: Omit<Reply, 'id'> = {
            ...replyData,
            discussionId,
            createdAt: now,
            updatedAt: now,
            likes: 0,
            likedBy: []
          };
          
          const replyId = await firestoreService.addDoc('replies', reply);
          const newReply = { ...reply, id: replyId } as Reply;
          
          // Update discussion's reply count and last activity
          await firestoreService.updateDoc('discussions', discussionId, {
            updatedAt: now
          });
          
          // Update local state
          set(state => ({
            discussions: state.discussions.map(d => 
              d.id === discussionId 
                ? { ...d, replies: [...d.replies, newReply], updatedAt: now }
                : d
            ),
            currentDiscussion: state.currentDiscussion?.id === discussionId
              ? { ...state.currentDiscussion, replies: [...state.currentDiscussion.replies, newReply], updatedAt: now }
              : state.currentDiscussion
          }));
          
          return replyId;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add reply' });
          throw error;
        }
      },

      updateReply: async (replyId, updates) => {
        try {
          await firestoreService.updateDoc('replies', replyId, {
            ...updates,
            updatedAt: new Date()
          });
          
          const now = new Date();
          set(state => ({
            discussions: state.discussions.map(d => ({
              ...d,
              replies: d.replies.map(r => 
                r.id === replyId ? { ...r, ...updates, updatedAt: now } : r
              )
            })),
            currentDiscussion: state.currentDiscussion ? {
              ...state.currentDiscussion,
              replies: state.currentDiscussion.replies.map(r => 
                r.id === replyId ? { ...r, ...updates, updatedAt: now } : r
              )
            } : state.currentDiscussion
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update reply' });
        }
      },

      deleteReply: async (replyId) => {
        try {
          await firestoreService.deleteDoc('replies', replyId);
          
          set(state => ({
            discussions: state.discussions.map(d => ({
              ...d,
              replies: d.replies.filter(r => r.id !== replyId)
            })),
            currentDiscussion: state.currentDiscussion ? {
              ...state.currentDiscussion,
              replies: state.currentDiscussion.replies.filter(r => r.id !== replyId)
            } : state.currentDiscussion
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to delete reply' });
        }
      },

      toggleReplyLike: async (replyId, userId) => {
        try {
          const state = get();
          const reply = state.currentDiscussion?.replies.find(r => r.id === replyId);
          
          if (!reply) return;
          
          const isLiked = reply.likedBy.includes(userId);
          const newLikedBy = isLiked 
            ? reply.likedBy.filter(id => id !== userId)
            : [...reply.likedBy, userId];
          
          await firestoreService.updateDoc('replies', replyId, {
            likes: newLikedBy.length,
            likedBy: newLikedBy
          });
          
          set(state => ({
            discussions: state.discussions.map(d => ({
              ...d,
              replies: d.replies.map(r => 
                r.id === replyId 
                  ? { ...r, likes: newLikedBy.length, likedBy: newLikedBy }
                  : r
              )
            })),
            currentDiscussion: state.currentDiscussion ? {
              ...state.currentDiscussion,
              replies: state.currentDiscussion.replies.map(r => 
                r.id === replyId 
                  ? { ...r, likes: newLikedBy.length, likedBy: newLikedBy }
                  : r
              )
            } : state.currentDiscussion
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to toggle like' });
        }
      },

      acceptReply: async (replyId) => {
        try {
          await firestoreService.updateDoc('replies', replyId, {
            isAccepted: true
          });
          
          set(state => ({
            discussions: state.discussions.map(d => ({
              ...d,
              replies: d.replies.map(r => 
                r.id === replyId ? { ...r, isAccepted: true } : r
              )
            })),
            currentDiscussion: state.currentDiscussion ? {
              ...state.currentDiscussion,
              replies: state.currentDiscussion.replies.map(r => 
                r.id === replyId ? { ...r, isAccepted: true } : r
              )
            } : state.currentDiscussion
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to accept reply' });
        }
      },

      // Discussion Interactions
      toggleDiscussionLike: async (discussionId, userId) => {
        try {
          const state = get();
          const discussion = state.discussions.find(d => d.id === discussionId) || state.currentDiscussion;
          
          if (!discussion) return;
          
          const isLiked = discussion.likedBy.includes(userId);
          const newLikedBy = isLiked 
            ? discussion.likedBy.filter(id => id !== userId)
            : [...discussion.likedBy, userId];
          
          await firestoreService.updateDoc('discussions', discussionId, {
            likes: newLikedBy.length,
            likedBy: newLikedBy
          });
          
          set(state => ({
            discussions: state.discussions.map(d => 
              d.id === discussionId 
                ? { ...d, likes: newLikedBy.length, likedBy: newLikedBy }
                : d
            ),
            currentDiscussion: state.currentDiscussion?.id === discussionId
              ? { ...state.currentDiscussion, likes: newLikedBy.length, likedBy: newLikedBy }
              : state.currentDiscussion
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to toggle like' });
        }
      },

      incrementViews: async (discussionId) => {
        try {
          const state = get();
          const discussion = state.discussions.find(d => d.id === discussionId);
          
          if (!discussion) return;
          
          const newViews = discussion.views + 1;
          
          await firestoreService.updateDoc('discussions', discussionId, {
            views: newViews
          });
          
          set(state => ({
            discussions: state.discussions.map(d => 
              d.id === discussionId ? { ...d, views: newViews } : d
            )
          }));
        } catch (error) {
          console.error('Failed to increment views:', error);
        }
      },

      pinDiscussion: async (discussionId) => {
        try {
          await firestoreService.updateDoc('discussions', discussionId, {
            isPinned: true
          });
          
          set(state => ({
            discussions: state.discussions.map(d => 
              d.id === discussionId ? { ...d, isPinned: true } : d
            ),
            currentDiscussion: state.currentDiscussion?.id === discussionId
              ? { ...state.currentDiscussion, isPinned: true }
              : state.currentDiscussion
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to pin discussion' });
        }
      },

      closeDiscussion: async (discussionId) => {
        try {
          await firestoreService.updateDoc('discussions', discussionId, {
            isClosed: true
          });
          
          set(state => ({
            discussions: state.discussions.map(d => 
              d.id === discussionId ? { ...d, isClosed: true } : d
            ),
            currentDiscussion: state.currentDiscussion?.id === discussionId
              ? { ...state.currentDiscussion, isClosed: true }
              : state.currentDiscussion
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to close discussion' });
        }
      },

      // Language Exchange placeholder implementations
      fetchExchanges: async (languageId) => {
        set({ loading: true, error: null });
        try {
          const whereConditions: [string, any, unknown][] = [];
          
          if (languageId) {
            whereConditions.push(['nativeLanguage', '==', languageId]);
          }
          
          const exchanges = await firestoreService.getDocs<LanguageExchange>('languageExchanges', {
            where: whereConditions
          });
          
          set({ exchanges, loading: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch exchanges', loading: false });
        }
      },

      createExchange: async (exchangeData) => {
        try {
          const exchange: Omit<LanguageExchange, 'id'> = {
            ...exchangeData,
            createdAt: new Date(),
            participants: [],
            status: 'upcoming'
          };
          
          const id = await firestoreService.addDoc('languageExchanges', exchange);
          const newExchange = { ...exchange, id } as LanguageExchange;
          
          set(state => ({
            exchanges: [newExchange, ...state.exchanges]
          }));
          
          return id;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to create exchange' });
          throw error;
        }
      },

      joinExchange: async (exchangeId, userId) => {
        try {
          const state = get();
          const exchange = state.exchanges.find(e => e.id === exchangeId);
          
          if (!exchange || exchange.participants.includes(userId)) return;
          
          const newParticipants = [...exchange.participants, userId];
          
          await firestoreService.updateDoc('languageExchanges', exchangeId, {
            participants: newParticipants
          });
          
          set(state => ({
            exchanges: state.exchanges.map(e => 
              e.id === exchangeId ? { ...e, participants: newParticipants } : e
            )
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to join exchange' });
        }
      },

      leaveExchange: async (exchangeId, userId) => {
        try {
          const state = get();
          const exchange = state.exchanges.find(e => e.id === exchangeId);
          
          if (!exchange) return;
          
          const newParticipants = exchange.participants.filter(id => id !== userId);
          
          await firestoreService.updateDoc('languageExchanges', exchangeId, {
            participants: newParticipants
          });
          
          set(state => ({
            exchanges: state.exchanges.map(e => 
              e.id === exchangeId ? { ...e, participants: newParticipants } : e
            )
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to leave exchange' });
        }
      },

      startExchange: async (exchangeId) => {
        try {
          await firestoreService.updateDoc('languageExchanges', exchangeId, {
            status: 'active'
          });
          
          set(state => ({
            exchanges: state.exchanges.map(e => 
              e.id === exchangeId ? { ...e, status: 'active' as const } : e
            )
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to start exchange' });
        }
      },

      // Placeholder implementations for other features
      fetchChallenges: async () => {
        // TODO: Implement challenges fetching
        set({ challenges: [] });
      },

      createChallenge: async () => {
        // TODO: Implement challenge creation
        return 'challenge-id';
      },

      joinChallenge: async () => {
        // TODO: Implement challenge joining
      },

      submitToChallenge: async () => {
        // TODO: Implement challenge submission
        return 'submission-id';
      },

      voteSubmission: async () => {
        // TODO: Implement submission voting
      },

      fetchStudyGroups: async () => {
        // TODO: Implement study groups fetching
        set({ studyGroups: [] });
      },

      createStudyGroup: async () => {
        // TODO: Implement study group creation
        return 'group-id';
      },

      joinStudyGroup: async () => {
        // TODO: Implement study group joining
      },

      leaveStudyGroup: async () => {
        // TODO: Implement study group leaving
      },

      addGroupSchedule: async () => {
        // TODO: Implement group schedule addition
        return 'schedule-id';
      },

      addGroupResource: async () => {
        // TODO: Implement group resource addition
        return 'resource-id';
      },

      fetchCommunityUser: async (userId) => {
        try {
          const user = await firestoreService.getDoc('communityUsers', userId) as CommunityUser | null;
          
          if (user) {
            set(state => ({
              communityUsers: {
                ...state.communityUsers,
                [userId]: user
              }
            }));
          }
          
          return user;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch user' });
          return null;
        }
      },

      updateCommunityProfile: async (userId, profile) => {
        try {
          await firestoreService.updateDoc('communityUsers', userId, profile);
          
          set(state => ({
            communityUsers: {
              ...state.communityUsers,
              [userId]: {
                ...state.communityUsers[userId],
                ...profile
              }
            }
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to update profile' });
        }
      },

      searchUsers: async (query) => {
        try {
          // TODO: Implement proper user search with text search
          const users = await firestoreService.getDocs<CommunityUser>('communityUsers', {
            where: [
              ['displayName', '>=', query],
              ['displayName', '<=', query + '\uf8ff']
            ]
          });
          
          return users.slice(0, 10);
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to search users' });
          return [];
        }
      },

      // Utility Functions
      getFilteredDiscussions: () => {
        const state = get();
        let filtered = [...state.discussions];
        
        if (state.selectedCategory) {
          filtered = filtered.filter(d => d.category === state.selectedCategory);
        }
        
        if (state.selectedLanguage) {
          filtered = filtered.filter(d => d.languageId === state.selectedLanguage);
        }
        
        if (state.searchQuery) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(d => 
            d.title.toLowerCase().includes(query) ||
            d.content.toLowerCase().includes(query) ||
            d.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        return filtered;
      },

      getPopularDiscussions: () => {
        const state = get();
        return [...state.discussions]
          .sort((a, b) => (b.likes + b.replies.length) - (a.likes + a.replies.length))
          .slice(0, 10);
      },

      getRecentDiscussions: () => {
        const state = get();
        return [...state.discussions]
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 10);
      },

      getUserParticipation: (userId) => {
        const state = get();
        return {
          discussions: state.discussions.filter(d => d.authorId === userId).length,
          replies: state.discussions.reduce((total, d) => 
            total + d.replies.filter(r => r.authorId === userId).length, 0
          ),
          exchanges: state.exchanges.filter(e => 
            e.hostId === userId || e.participants.includes(userId)
          ).length,
          challenges: state.challenges.filter(c => c.participants.includes(userId)).length,
          groups: state.studyGroups.filter(g => g.members.includes(userId)).length
        };
      }
    }),
    {
      name: 'community-store',
      partialize: (state) => ({
        discussions: state.discussions,
        exchanges: state.exchanges,
        challenges: state.challenges,
        studyGroups: state.studyGroups,
        communityUsers: state.communityUsers
      })
    }
  )
);