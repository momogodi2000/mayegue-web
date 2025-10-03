import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCommunityStore } from './communityStore';
import { firestoreService } from '@/core/services/firebase/firestore.service';

// Mock the firestore service
vi.mock('@/core/services/firebase/firestore.service', () => ({
  firestoreService: {
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
  },
}));

// Mock data
const mockDiscussion = {
  id: 'discussion-1',
  title: 'Test Discussion',
  content: 'Test content',
  authorId: 'user-1',
  author: {
    id: 'user-1',
    displayName: 'Test User',
    email: 'test@example.com',
    languagesLearning: [],
    languagesTeaching: [],
    level: 'beginner' as const,
    joinedAt: new Date(),
    reputation: 0,
    badges: [],
  },
  languageId: 'ewondo',
  category: 'general',
  tags: ['test'],
  likes: 0,
  likedBy: [],
  replies: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockLanguageExchange = {
  id: 'exchange-1',
  title: 'Test Exchange',
  description: 'Test description',
  hostId: 'user-1',
  host: {
    id: 'user-1',
    displayName: 'Test User',
    email: 'test@example.com',
    languagesLearning: [],
    languagesTeaching: [],
    level: 'beginner' as const,
    joinedAt: new Date(),
    reputation: 0,
    badges: [],
  },
  nativeLanguage: 'ewondo',
  targetLanguage: 'french',
  level: 'beginner' as const,
  format: 'online' as const,
  duration: 60,
  maxParticipants: 4,
  participants: [],
  status: 'active' as const,
  tags: ['test'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockStudyGroup = {
  id: 'group-1',
  name: 'Test Group',
  description: 'Test description',
  languageId: 'ewondo',
  level: 'beginner' as const,
  createdBy: 'user-1',
  moderators: ['user-1'],
  members: [],
  maxMembers: 10,
  isPrivate: false,
  schedules: [],
  resources: [],
  lastActivity: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockChallenge = {
  id: 'challenge-1',
  title: 'Test Challenge',
  description: 'Test description',
  createdBy: 'user-1',
  languageId: 'ewondo',
  difficulty: 'beginner' as const,
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  type: 'pronunciation' as const,
  rules: ['Rule 1', 'Rule 2'],
  prizes: ['Prize 1'],
  submissions: [],
  participants: [],
  status: 'active' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CommunityStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useCommunityStore.setState({
      discussions: [],
      languageExchanges: [],
      studyGroups: [],
      challenges: [],
      users: [],
      loading: false,
      error: null,
    });
  });

  describe('fetchDiscussions', () => {
    it('should fetch discussions successfully', async () => {
      vi.mocked(firestoreService.getDocs).mockResolvedValue([mockDiscussion]);

      const { result } = renderHook(() => useCommunityStore());

      await act(async () => {
        await result.current.fetchDiscussions('ewondo', 'general');
      });

      expect(firestoreService.getDocs).toHaveBeenCalledWith('discussions', {
        where: [
          ['languageId', '==', 'ewondo'],
          ['category', '==', 'general']
        ]
      });
      expect(result.current.discussions).toEqual([mockDiscussion]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch discussions error', async () => {
      const errorMessage = 'Failed to fetch discussions';
      vi.mocked(firestoreService.getDocs).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCommunityStore());

      await act(async () => {
        await result.current.fetchDiscussions();
      });

      expect(result.current.discussions).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe('fetchExchanges', () => {
    it('should fetch language exchanges successfully', async () => {
      vi.mocked(firestoreService.getDocs).mockResolvedValue([mockLanguageExchange]);

      const { result } = renderHook(() => useCommunityStore());

      await act(async () => {
        await result.current.fetchExchanges('ewondo', 'french');
      });

      expect(firestoreService.getDocs).toHaveBeenCalledWith('languageExchanges', {
        where: [
          ['nativeLanguage', '==', 'ewondo'],
          ['targetLanguage', '==', 'french']
        ]
      });
      expect(result.current.languageExchanges).toEqual([mockLanguageExchange]);
    });
  });

  describe('fetchStudyGroups', () => {
    it('should fetch study groups successfully', async () => {
      vi.mocked(firestoreService.getDocs).mockResolvedValue([mockStudyGroup]);

      const { result } = renderHook(() => useCommunityStore());

      await act(async () => {
        await result.current.fetchStudyGroups('ewondo', 'beginner');
      });

      expect(firestoreService.getDocs).toHaveBeenCalledWith('studyGroups', {
        where: [
          ['languageId', '==', 'ewondo'],
          ['level', '==', 'beginner']
        ]
      });
      expect(result.current.studyGroups).toEqual([mockStudyGroup]);
    });
  });

  describe('fetchChallenges', () => {
    it('should fetch challenges successfully', async () => {
      vi.mocked(firestoreService.getDocs).mockResolvedValue([mockChallenge]);

      const { result } = renderHook(() => useCommunityStore());

      await act(async () => {
        await result.current.fetchChallenges('ewondo', 'beginner');
      });

      expect(firestoreService.getDocs).toHaveBeenCalledWith('challenges', {
        where: [
          ['languageId', '==', 'ewondo'],
          ['difficulty', '==', 'beginner']
        ]
      });
      expect(result.current.challenges).toEqual([mockChallenge]);
    });
  });

  describe('createDiscussion', () => {
    it('should create discussion successfully', async () => {
      const newDiscussion = {
        title: 'New Discussion',
        content: 'New content',
        authorId: 'user-1',
        author: mockDiscussion.author,
        languageId: 'ewondo',
        category: 'general',
        tags: ['new'],
      };

      vi.mocked(firestoreService.addDoc).mockResolvedValue('new-discussion-id');

      const { result } = renderHook(() => useCommunityStore());

      await act(async () => {
        await result.current.createDiscussion(newDiscussion);
      });

      expect(firestoreService.addDoc).toHaveBeenCalledWith('discussions', expect.objectContaining({
        title: 'New Discussion',
        content: 'New content',
        authorId: 'user-1',
        languageId: 'ewondo',
        category: 'general',
        tags: ['new'],
      }));
    });
  });

  describe('joinStudyGroup', () => {
    it('should join study group successfully', async () => {
      vi.mocked(firestoreService.updateDoc).mockResolvedValue(undefined);

      const { result } = renderHook(() => useCommunityStore());

      await act(async () => {
        await result.current.joinStudyGroup('group-1', 'user-1');
      });

      expect(firestoreService.updateDoc).toHaveBeenCalledWith('studyGroups', 'group-1', {
        members: ['user-1'],
        lastActivity: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('submitChallengeEntry', () => {
    it('should submit challenge entry successfully', async () => {
      const entry = {
        challengeId: 'challenge-1',
        userId: 'user-1',
        user: mockDiscussion.author,
        content: 'Test submission',
        audioUrl: 'https://example.com/audio.mp3',
      };

      vi.mocked(firestoreService.addDoc).mockResolvedValue('entry-id');

      const { result } = renderHook(() => useCommunityStore());

      await act(async () => {
        await result.current.submitChallengeEntry(entry);
      });

      expect(firestoreService.addDoc).toHaveBeenCalledWith('challengeSubmissions', expect.objectContaining({
        challengeId: 'challenge-1',
        userId: 'user-1',
        content: 'Test submission',
        audioUrl: 'https://example.com/audio.mp3',
      }));
    });
  });

  describe('searchUsers', () => {
    it('should search users successfully', async () => {
      const mockUser = {
        id: 'user-1',
        displayName: 'Test User',
        email: 'test@example.com',
        languagesLearning: ['ewondo'],
        languagesTeaching: ['french'],
        level: 'beginner' as const,
        joinedAt: new Date(),
        reputation: 0,
        badges: [],
      };

      vi.mocked(firestoreService.getDocs).mockResolvedValue([mockUser]);

      const { result } = renderHook(() => useCommunityStore());

      await act(async () => {
        await result.current.searchUsers('test');
      });

      expect(firestoreService.getDocs).toHaveBeenCalledWith('users', {
        where: [
          ['displayName', '>=', 'test'],
          ['displayName', '<=', 'test\uf8ff']
        ]
      });
      expect(result.current.users).toEqual([mockUser]);
    });
  });
});
