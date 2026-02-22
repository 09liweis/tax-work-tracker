import { defineMongooseModel } from '#nuxt/mongoose';

export const CorporationTax = defineMongooseModel('CorporationTax', {
  corpId: { type: String, required: true },
  taskType: { type: String }, // PMS / PFS etc
  category: { type: String },
  yearEnding: { type: String },
  taskDescription: { type: String },
  owner: { type: String },
  docsReceivedDate: { type: Date },
  channel: { type: String },
  hstDocStatus: { type: String },
  t2DocStatus: { type: String },
  missingItems: { type: String },
  startDate: { type: Date },
  dueDate: { type: Date },
  actualCompletedDate: { type: Date },
  status: { type: String },
  blockerWaitingFor: { type: String },
  priority: { type: String },
  invoice: { type: Boolean, default: false },
  receivableAmount: { type: Number },
  paid: { type: Boolean, default: false },
  payment: { type: Number },
  notes: { type: String },
  completed: { type: Boolean, default: false },
  ts: { type: Date, required: true, default: Date.now },
  lts: { type: Date, required: true, default: Date.now },
});
