const mongoose = require('mongoose');
const moment = require('moment-timezone');

moment.tz.setDefault('Asia/Jerusalem');

const ReportsSchema = new mongoose.Schema({
  number_report: {
    type: Number,
  },
  group: { type: String, required: [true, 'אנא השלם פלוגה'] },
  battalion: {
    type: String,
    required: [true, 'אנא השלם גדוד'],
  },
  createdAt: {
    type: Date,
    default: () => {
      const currentTimeUTC = new Date();
      currentTimeUTC.setUTCHours(currentTimeUTC.getUTCHours() + 3);
      return currentTimeUTC;
    },
  },
  reports: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
  ],
});

ReportsSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'reports',
    select: 'id_product product_name status_product locationProduct group_name',
  });
  next();
});

const Report = mongoose.model('Reports', ReportsSchema);

module.exports = Report;
