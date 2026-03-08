import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  editorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // The unique string identifying the file in Cloudflare R2
  fileKey: { type: String, required: true }, 
  
  status: { 
    type: String, 
    enum: ['pending_upload', 'processing', 'ready_for_review', 'approved', 'rejected'], 
    default: 'pending_upload' 
  },
  
  // Is this the raw upload, the watermarked preview, or the final HD delivery?
  fileType: {
    type: String,
    enum: ['raw_upload', 'preview', 'final'],
    required: true
  },
  
  iteration: { type: Number, default: 1 } // For tracking revision rounds
}, { timestamps: true });

export default mongoose.model('Delivery', deliverySchema);