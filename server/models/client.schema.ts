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
  status: { type: String, required: true },
  ts: { type: Date, required: true },
  lts: { type: Date, required: true },
});
