export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  bio?: string;
  followers: string[];
  following: string[];
  medicalInfo?: {
    diagnosisDate: string;
    symptoms: string[];
    treatments: string[];
  };
}

export interface Comment {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
    image: string;
  };
  createdAt: string;
}

export interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    image: string;
  };
  images?: string[];
  likes: string[];
  comments: Comment[];
  category: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'follow';
  sender: {
    _id: string;
    name: string;
    image: string;
  };
  recipient: string;
  post?: {
    _id: string;
    content: string;
  };
  comment?: string;
  read: boolean;
  createdAt: string;
}
