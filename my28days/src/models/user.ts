import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/placeholder-avatar.jpg',
  },
  bio: {
    type: String,
    default: '',
  },
  flowWallet: {
    address: {
      type: String,
      unique: true,
      sparse: true,
    },
    privateKey: {
      type: String,
      select: false, // This ensures the private key is not returned in queries
    },
    publicKey: {
      type: String,
    }
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
  communities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
  }],
  medicalInfo: {
    diagnosisDate: Date,
    symptoms: [String],
    treatments: [String],
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
