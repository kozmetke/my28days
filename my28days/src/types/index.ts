export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  role?: 'patient' | 'doctor' | 'admin';
  followers: string[];
  following: string[];
  flowWallet?: {
    address: string;
    publicKey: string;
  };
  medicalInfo?: {
    lastPeriod?: string;
    diagnosisDate?: string;
    symptoms?: string[];
    medications?: string[];
    treatments?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  _id: string;
  name: string;
  image: string;
}

export interface Comment {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: Author;
}

export interface Post {
  _id: string;
  content: string;
  author: Author;
  userId: string;
  images?: string[];
  likes: string[];
  comments: Comment[];
  category: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow';
  fromUserId: string;
  postId?: string;
  read: boolean;
  createdAt: string;
  fromUser?: Author;
  post?: Post;
}

export interface ValidationMessage {
  role: 'doctor' | 'patient';
  message: string;
}

export interface ValidationConversation {
  _id: string;
  subject: string;
  starScore: number;
  summary: string;
  fullConversation: ValidationMessage[];
  status: 'pending' | 'validated' | 'invalidated' | 'dismissed';
  createdAt: string;
}
