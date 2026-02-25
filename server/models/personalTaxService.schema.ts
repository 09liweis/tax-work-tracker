import { defineMongooseModel } from '#nuxt/mongoose';

export const PersonalTaxService = defineMongooseModel('PersonalTaxService', {
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  status: { type: String },
  ts: { type: Date },
  lts: { type: Date }
});
