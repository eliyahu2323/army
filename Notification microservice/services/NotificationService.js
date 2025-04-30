const Notification = require('../models/NotificationModel');

exports.findAllNotifications = (query) => {
  return Notification.find(query).sort({ created_date: -1 });
};

exports.findNotification = (query) => {
  return Notification.find(query).sort({ created_date: -1 });
};
exports.findLastNotification = async (query) => {
  return Notification.find(query).sort({ created_date: -1 }).limit(1);
};
exports.findOneNotification = async (query) => {
  return Notification.find(query);
};

exports.findNotificationByIdAndUpdateStatus = (id, query) => {
  return Notification.findByIdAndUpdate({ _id: id.id }, query);
};

exports.findNotificationAndDelete = async (id) => {
  let Notification = await Notification.find(id);
  return Notification.findByIdAndDelete(Notification);
};

exports.createNotification = (query) => {
  return Notification.create(query);
};
