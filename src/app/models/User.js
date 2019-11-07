import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    token: {
      type: Number,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    premium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model('User', UserSchema);
