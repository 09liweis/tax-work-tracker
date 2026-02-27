import { defineMongooseModel } from '#nuxt/mongoose';

export const Client = defineMongooseModel('Client', {
  name: { type: String, required: true },
  dob: { type: Date },
  sin: { type: String },
  telephone: { type: String },
  email: { type: String },
  address: { type: String },
  city: { type: String },
  province: { type: String },
  maritalStatus: { type: String },
  gender: { type: String },
  ts: { type: Date, required: true },
  lts: { type: Date, required: true },
});
