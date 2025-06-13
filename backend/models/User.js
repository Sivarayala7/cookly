import mongoose from 'mongoose';                       // ODM
import bcrypt from 'bcryptjs';                         // password hashing

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },        // display name
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    bio:      { type: String, default: '' },
    location: { type: String, default: '' },
    avatar:   { type: String, default: '' },
    settings: {                                         // privacy & display prefs
      showEmail:    { type: Boolean, default: false },
      showBio:      { type: Boolean, default: true },
      showLocation: { type: Boolean, default: true },
      profilePrivacy: { type: String, default: 'public' },
    },
  },
  { timestamps: true }
);

// Hash password on create / change
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password to hash
userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model('User', userSchema);
