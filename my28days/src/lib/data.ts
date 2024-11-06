import type { User, Post, Comment, Author, Notification } from '@/types';

// Static data for demo purposes
const users: User[] = [
  {
    _id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Navigating menopause with positivity and strength',
    followers: ['2', '3'],
    following: ['2'],
    medicalInfo: {
      lastPeriod: '2023-01-15',
      diagnosisDate: '2023-01-01',
      symptoms: ['Hot Flashes', 'Mood Changes'],
      medications: ['Vitamin D', 'Calcium'],
      treatments: ['Exercise', 'Meditation']
    },
    createdAt: new Date('2023-01-01').toISOString(),
    updatedAt: new Date('2023-01-01').toISOString(),
  },
  {
    _id: '2',
    name: 'Emily Davis',
    email: 'emily@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    bio: 'Supporting women through their journey',
    followers: ['1'],
    following: ['1', '3'],
    medicalInfo: {
      lastPeriod: '2023-02-01',
      diagnosisDate: '2023-01-15',
      symptoms: ['Insomnia', 'Joint Pain'],
      medications: ['Magnesium'],
      treatments: ['Yoga', 'Acupuncture']
    },
    createdAt: new Date('2023-01-02').toISOString(),
    updatedAt: new Date('2023-01-02').toISOString(),
  },
  {
    _id: '3',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    bio: 'Sharing experiences and wisdom',
    followers: ['2'],
    following: ['1'],
    medicalInfo: {
      lastPeriod: '2023-01-20',
      diagnosisDate: '2023-01-10',
      symptoms: ['Night Sweats', 'Anxiety'],
      medications: ['Evening Primrose Oil'],
      treatments: ['Mindfulness', 'Swimming']
    },
    createdAt: new Date('2023-01-03').toISOString(),
    updatedAt: new Date('2023-01-03').toISOString(),
  },
];

const posts: Post[] = [
  {
    _id: '1',
    userId: '1',
    content: 'Just started my journey with My28Days. Looking forward to connecting with others!',
    author: {
      _id: '1',
      name: 'Sarah Johnson',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    likes: ['2', '3'],
    comments: [],
    category: 'general',
    isAnonymous: false,
    images: [],
    createdAt: new Date('2023-01-01T12:00:00Z').toISOString(),
    updatedAt: new Date('2023-01-01T12:00:00Z').toISOString(),
  },
  {
    _id: '2',
    userId: '2',
    content: 'Found some great tips for managing hot flashes. Happy to share with anyone interested!',
    author: {
      _id: '2',
      name: 'Emily Davis',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    },
    likes: ['1'],
    comments: [],
    category: 'tips',
    isAnonymous: false,
    images: [],
    createdAt: new Date('2023-01-02T14:30:00Z').toISOString(),
    updatedAt: new Date('2023-01-02T14:30:00Z').toISOString(),
  },
];

const notifications: Notification[] = [
  {
    _id: '1',
    userId: '1',
    type: 'like',
    fromUserId: '2',
    postId: '1',
    read: false,
    createdAt: new Date('2023-01-02T15:00:00Z').toISOString(),
  },
  {
    _id: '2',
    userId: '1',
    type: 'follow',
    fromUserId: '3',
    read: false,
    createdAt: new Date('2023-01-03T10:00:00Z').toISOString(),
  },
];

export const db = {
  getUserByEmail: (email: string) => {
    return users.find(user => user.email === email);
  },
  getUserById: (id: string) => {
    return users.find(user => user._id === id);
  },
  getUsers: () => {
    return users;
  },
  getPosts: () => {
    return posts;
  },
  getPostById: (id: string) => {
    return posts.find(post => post._id === id);
  },
  getPostsByUserId: (userId: string) => {
    return posts.filter(post => post.userId === userId);
  },
  getNotifications: (userId: string) => {
    return notifications.filter(notification => notification.userId === userId);
  },
  searchUsers: (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) || 
      user.email.toLowerCase().includes(lowercaseQuery)
    );
  },
  searchPosts: (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return posts.filter(post => 
      post.content.toLowerCase().includes(lowercaseQuery)
    );
  },
};
