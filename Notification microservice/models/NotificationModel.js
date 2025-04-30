const mongoose = require('mongoose');
const moment = require('moment-timezone');

moment.tz.setDefault('Asia/Jerusalem');

const NotificationSchema = new mongoose.Schema({
  number_message: {
    type: Number,
    default: 1,
  },
  title: {
    type: String,
    required: [true, 'אנא השלם כותרת'],
  },
  message: {
    type: String,
    required: [true, 'אנא השלם הודעה'],
  },
  group: {
    type: String,
    required: [true, 'אנא השלם שם פלוגה'],
  },
  battalion: {
    type: String,
    required: [true, 'אנא השלם מספר גדוד'],
  },
  status_request: {
    type: String,
    enum: ['לא נקרא', 'בטיפול', 'טופל'],
    default: 'לא נקרא',
  },
  created_date: {
    type: Date,
    default: () => {
      const currentTimeUTC = new Date();
      currentTimeUTC.setUTCHours(currentTimeUTC.getUTCHours() + 3);
      return currentTimeUTC;
    },
  },
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
