const mongoose = require('mongoose');
const tz = require('mongoose-timezone');

const saleSchema = new mongoose.Schema({
  entry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entry',
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    default: 0,
  },
  rate: {
    type: Number,
    default: 0,
  },
  amount: {
    type: Number,
    default: 0,
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  paid: {
    type: Number,
    required: true,
  },
  salesDate: {
    type: Date,
    default: Date.now,
  },
  comment: {
    type: String,
    default: '',
  },
  hypothication:{
    type: String,
    default: 'N/A',
  },
  deliverynote_no:{
    type: String,
    default: 'N/A',
  },

  booking_ref:{
    type: String,
    default: 'N/A',
  },
  booking_date:{
    type: String,
    default: 'N/A',
  },
  mode_payment:{
    type: String,
    default: 'N/A',
  },
  vin_number:{
    type: String,
    default: 'N/A',
  },
  motor_number:{
    type: String,
    default: 'N/A',
  },
  charger_number:{
    type: String,
    default: 'N/A',
  },
  battery_number:{
    type: String,
    default: 'N/A',
  },
  colour:{
    type: String,
    default: 'N/A',
  },
  amt_words:{
    type: String,
    default: 'N/A',
  },
  bank_details:{
    type: String,
    default: 'N/A',
  },
  account_no:{
    type: String,
    default: 'N/A',
  },
  bank:{
    type: String,
    default: 'N/A',
  },
  branch:{
    type: String,
    default: 'N/A',
  },
  ifsc:{
    type: String,
    default: 'N/A',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

saleSchema.plugin(tz);
module.exports = mongoose.model('Sale', saleSchema);
