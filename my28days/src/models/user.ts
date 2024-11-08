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
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient',
  },
  image: {
    type: String,
    default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
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

// Pre-save middleware to set the avatar based on the user's name
userSchema.pre('save', function(next) {
  if (this.name && (!this.image || this.image === 'https://api.dicebear.com/7.x/avataaars/svg?seed=default')) {
    this.image = `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.name}`;
  }
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
