import { defineMongooseModel } from '#nuxt/mongoose';

export const Client = defineMongooseModel('Client', {
  clientId: { type: String },
  relationShipToClient: { type: String },
  name: { type: String, required: true },
  dob: { type: String },
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

export const RELATIONSHIP_OPTIONS = [
  { label: 'Son', value: 'son' },
  { label: 'Daughter', value: 'daughter' },
  { label: 'Father', value: 'father' },
  { label: 'Mother', value: 'mother' },
  { label: 'Husband', value: 'husband' },
  { label: 'Wife', value: 'wife' },
  { label: 'Brother', value: 'brother' },
  { label: 'Sister', value: 'sister' },
  { label: 'Other', value: 'other' }
];
