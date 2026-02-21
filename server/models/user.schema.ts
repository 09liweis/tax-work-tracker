import { defineMongooseModel } from '#nuxt/mongoose';

export const User = defineMongooseModel('User', {
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
  },
  ts: {
    type: Date,
    required: true,
    default: Date.now,
  },
  lts: {
    type: Date,
    require: true,
    default: Date.now,
  },
});
