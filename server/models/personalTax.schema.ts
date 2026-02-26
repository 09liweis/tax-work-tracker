import { defineMongooseModel } from '#nuxt/mongoose';

export const PersonalTax = defineMongooseModel('PersonalTax', {
  clientId: { type: String, required: true },
  taskDescription: { type: String },
  taxYear: { type: Number },
  supervisorId: { type: String },
  caseWorker: { type: String },
  startDate: { type: Date },
  documentsFrom: { type: String },
  targetDueDate: { type: Date },
  actualCompletedDate: { type: Date },
  status: { type: String },
  blocker: { type: String },
  priority: { type: String },
  receivable: { type: Number },
  invoice: { type: Boolean, default: false },
  paid: { type: Boolean, default: false },
  payment: { type: Number },
  notes: { type: String },
  completed: { type: Boolean, default: false },
  ts: { type: Date, required: true, default: Date.now },
  lts: { type: Date, required: true, default: Date.now },
});
