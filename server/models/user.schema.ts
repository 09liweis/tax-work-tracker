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
  },
  status: {
    type: String,
    required: true,
  },
  ts: {
    type: Date,
    required: true,
    default: Date.now()
  },
  lts: {
    type: Date,
    required: true,
    default: Date.now()
  },
});