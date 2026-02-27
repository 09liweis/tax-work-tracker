import { defineMongooseModel } from '#nuxt/mongoose';

export const PayrollService = defineMongooseModel('PayrollService', {
  name: { type: String, required: true },
  price: { type: Number, required: true },
  ts: { type: Date },
  lts: { type: Date }
});
