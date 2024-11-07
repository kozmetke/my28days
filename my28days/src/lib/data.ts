import type { User, Post, Comment, Author, Notification, ValidationConversation } from '@/types';

// Validation conversations data
const validationConversations: ValidationConversation[] = [
  {
    _id: '1',
    subject: 'Menopause Symptoms Discussion',
    starScore: 4.5,
    summary: 'Discussion about managing hot flashes and night sweats with lifestyle changes and potential treatments.',
    fullConversation: [
      { role: 'patient', message: "I've been experiencing severe hot flashes, especially at night. What can I do?" },
      { role: 'doctor', message: "Hot flashes can be challenging. Let's discuss some lifestyle modifications first. Are you keeping track of your triggers?" },
      { role: 'patient', message: "I notice they're worse after drinking coffee or wine." },
      { role: 'doctor', message: "That's good observation. Caffeine and alcohol are common triggers. I recommend reducing intake and trying these specific techniques..." }
    ],
    status: 'pending',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    _id: '2',
    subject: 'Sleep Issues Consultation',
    starScore: 5.0,
    summary: 'Consultation regarding insomnia and sleep disruption, discussing both behavioral and medical interventions.',
    fullConversation: [
      { role: 'patient', message: "I haven't had a good night's sleep in weeks. Is this normal during menopause?" },
      { role: 'doctor', message: "Sleep disruption is common during menopause. Can you tell me more about your sleep routine?" },
      { role: 'patient', message: "I try to go to bed at 10pm but keep waking up throughout the night." },
      { role: 'doctor', message: "Let's work on your sleep hygiene. Here are some evidence-based strategies..." }
    ],
    status: 'pending',
    createdAt: new Date('2024-01-16').toISOString()
  },
  {
    _id: '3',
    subject: 'Mood Changes Discussion',
    starScore: 4.8,
    summary: 'Detailed discussion about emotional well-being and strategies for managing mood changes during menopause.',
    fullConversation: [
      { role: 'patient', message: "I've been feeling more anxious and irritable lately. Is this related to menopause?" },
      { role: 'doctor', message: "Yes, mood changes are common during menopause. Are you noticing any specific patterns?" },
      { role: 'patient', message: "It seems worse in the mornings and during stressful situations at work." },
      { role: 'doctor', message: "Thank you for sharing. Let's explore some coping strategies and potential support options..." }
    ],
    status: 'pending',
    createdAt: new Date('2024-01-17').toISOString()
  }
];

// Static data for demo purposes
const users: User[] = [
  {
    _id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Navigating menopause with positivity and strength',
    role: 'admin',
    followers: ['2', '3'],
    following: ['2'],
    flowWallet: {
      address: '0x01cf0e2f2f715450',
      publicKey: '5a5b3e159b2ae22f3e64226f09c830b5440e85b9fb8332010b8c43a7c71c5c756f3f1dcc7af8f0d477c4c8c0b2f2c0c5f08c5c5c5c5c5c5c5c5c5c5c5c5c5c'
    },
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
    role: 'doctor',
    followers: ['1'],
    following: ['1', '3'],
    flowWallet: {
      address: '0x179b6b1cb6755e31',
      publicKey: '3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b'
    },
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
    role: 'patient',
    followers: ['2'],
    following: ['1'],
    flowWallet: {
      address: '0x3c3c3c3c3c3c3c3c',
      publicKey: '5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e'
    },
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

// Function to update user's Flow wallet
export const updateUserWallet = (userId: string, wallet: { address: string; publicKey: string; privateKey: string }) => {
  const userIndex = users.findIndex(user => user._id === userId);
  if (userIndex !== -1) {
    users[userIndex].flowWallet = {
      address: wallet.address,
      publicKey: wallet.publicKey
    };
    console.log(`Updated wallet for user ${users[userIndex].email}`);
    return true;
  }
  return false;
};

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
  getValidationConversations: () => {
    return validationConversations;
  },
  updateValidationStatus: (id: string, status: 'validated' | 'invalidated' | 'dismissed') => {
    const conversation = validationConversations.find(conv => conv._id === id);
    if (conversation) {
      conversation.status = status;
      return true;
    }
    return false;
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
  updateUserWallet,
};
