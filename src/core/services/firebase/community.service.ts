/**
 * Community Service - Firebase Integration
 * Handles groups, posts, comments, and community interactions
 */

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/core/config/firebase.config';

export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  language: string;
  privacy: 'public' | 'private';
  tags: string[];
  maxMembers: number;
  createdBy: string;
  createdAt: Date;
  memberCount: number;
  members: string[];
  admins: string[];
  isActive: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  type: 'discussion' | 'question' | 'tip' | 'resource';
  language: string;
  tags: string[];
  authorId: string;
  authorName: string;
  groupId?: string;
  createdAt: Date;
  likes: number;
  comments: number;
  isResolved?: boolean;
  isPinned?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  likes: number;
  parentId?: string; // For nested comments
}

class CommunityService {
  
  // Groups
  async createGroup(groupData: Omit<Group, 'id' | 'createdAt' | 'memberCount' | 'members' | 'admins' | 'isActive'>): Promise<Group> {
    try {
      const docRef = await addDoc(collection(db, 'groups'), {
        ...groupData,
        createdAt: serverTimestamp(),
        memberCount: 1,
        members: [groupData.createdBy],
        admins: [groupData.createdBy],
        isActive: true
      });

      const newGroup: Group = {
        id: docRef.id,
        ...groupData,
        createdAt: new Date(),
        memberCount: 1,
        members: [groupData.createdBy],
        admins: [groupData.createdBy],
        isActive: true
      };

      return newGroup;
    } catch (error) {
      console.error('Error creating group:', error);
      throw new Error('Failed to create group');
    }
  }

  async getGroups(filters?: {
    category?: string;
    language?: string;
    privacy?: string;
    limit?: number;
  }): Promise<Group[]> {
    try {
      let q = query(collection(db, 'groups'), where('isActive', '==', true));

      if (filters?.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters?.language) {
        q = query(q, where('language', '==', filters.language));
      }
      if (filters?.privacy) {
        q = query(q, where('privacy', '==', filters.privacy));
      }

      q = query(q, orderBy('createdAt', 'desc'));
      if (filters?.limit) {
        q = query(q, limit(filters.limit));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Group[];
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw new Error('Failed to fetch groups');
    }
  }

  async joinGroup(groupId: string, userId: string): Promise<void> {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(userId),
        memberCount: increment(1)
      });
    } catch (error) {
      console.error('Error joining group:', error);
      throw new Error('Failed to join group');
    }
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayRemove(userId),
        memberCount: increment(-1)
      });
    } catch (error) {
      console.error('Error leaving group:', error);
      throw new Error('Failed to leave group');
    }
  }

  // Posts
  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<Post> {
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        ...postData,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: 0
      });

      const newPost: Post = {
        id: docRef.id,
        ...postData,
        createdAt: new Date(),
        likes: 0,
        comments: 0
      };

      return newPost;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post');
    }
  }

  async getPosts(filters?: {
    groupId?: string;
    type?: string;
    language?: string;
    authorId?: string;
    limit?: number;
  }): Promise<Post[]> {
    try {
      let q = query(collection(db, 'posts'));

      if (filters?.groupId) {
        q = query(q, where('groupId', '==', filters.groupId));
      }
      if (filters?.type) {
        q = query(q, where('type', '==', filters.type));
      }
      if (filters?.language) {
        q = query(q, where('language', '==', filters.language));
      }
      if (filters?.authorId) {
        q = query(q, where('authorId', '==', filters.authorId));
      }

      q = query(q, orderBy('createdAt', 'desc'));
      if (filters?.limit) {
        q = query(q, limit(filters.limit));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Post[];
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to fetch posts');
    }
  }

  async likePost(postId: string, userId: string): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: increment(1)
      });

      // Add to user's liked posts
      const userLikesRef = doc(db, 'userLikes', userId);
      await updateDoc(userLikesRef, {
        posts: arrayUnion(postId)
      });
    } catch (error) {
      console.error('Error liking post:', error);
      throw new Error('Failed to like post');
    }
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: increment(-1)
      });

      // Remove from user's liked posts
      const userLikesRef = doc(db, 'userLikes', userId);
      await updateDoc(userLikesRef, {
        posts: arrayRemove(postId)
      });
    } catch (error) {
      console.error('Error unliking post:', error);
      throw new Error('Failed to unlike post');
    }
  }

  // Comments
  async createComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'likes'>): Promise<Comment> {
    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        ...commentData,
        createdAt: serverTimestamp(),
        likes: 0
      });

      // Update post comment count
      const postRef = doc(db, 'posts', commentData.postId);
      await updateDoc(postRef, {
        comments: increment(1)
      });

      const newComment: Comment = {
        id: docRef.id,
        ...commentData,
        createdAt: new Date(),
        likes: 0
      };

      return newComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new Error('Failed to create comment');
    }
  }

  async getComments(postId: string): Promise<Comment[]> {
    try {
      const q = query(
        collection(db, 'comments'),
        where('postId', '==', postId),
        orderBy('createdAt', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Comment[];
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments');
    }
  }

  // Search
  async searchGroups(searchTerm: string): Promise<Group[]> {
    try {
      const q = query(
        collection(db, 'groups'),
        where('isActive', '==', true),
        orderBy('name')
      );

      const snapshot = await getDocs(q);
      const groups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Group[];

      // Filter by search term (client-side for now)
      return groups.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } catch (error) {
      console.error('Error searching groups:', error);
      throw new Error('Failed to search groups');
    }
  }

  async searchPosts(searchTerm: string): Promise<Post[]> {
    try {
      const q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Post[];

      // Filter by search term (client-side for now)
      return posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    } catch (error) {
      console.error('Error searching posts:', error);
      throw new Error('Failed to search posts');
    }
  }
}

export const communityService = new CommunityService();
