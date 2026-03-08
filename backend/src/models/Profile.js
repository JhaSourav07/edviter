import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
      unique: true 
    },
    displayName: { 
      type: String, 
      required: true,
      trim: true
    },
    avatarUrl: { 
      type: String, 
      default: '' // We will update this when we connect Cloudflare R2
    },
    
    // --- EDITOR SPECIFIC FIELDS ---
    bio: { 
      type: String, 
      default: '',
      maxLength: 500
    },
    skills: [{ 
      type: String // e.g., ['Premiere Pro', 'After Effects', 'Color Grading']
    }],
    portfolioUrls: [{
      title: String,
      url: String // Links to YouTube/Vimeo for MVP, later we can host these on R2
    }],

    // --- BUSINESS SPECIFIC FIELDS ---
    companyName: { 
      type: String, 
      default: '' 
    },
  },
  { 
    timestamps: true 
  }
);

export default mongoose.model('Profile', profileSchema);