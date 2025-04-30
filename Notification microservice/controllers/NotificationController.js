const catchAsync = require('../utils/AsyncMiddleware');
const AppError = require('../utils/AppError');
const {
  findAllNotifications,
  findNotification,
  findNotificationByIdAndUpdateStatus,
  findLastNotification,
  findNotificationAndDelete,
  createNotification,
  findOneNotification,
} = require('../services/NotificationService');

exports.getNotificationByNumberMessage = catchAsync(async (req, res, next) => {
  const notifications = await findOneNotification(req.query);
  if (!notifications) {
    next(new AppError('לא נמצא הודעה!!', 400));
  }
  res.status(200).json({
    status: 'success',
    notifications,
  });
});
exports.getLastNotification = catchAsync(async (req, res, next) => {
  const notifications = await findLastNotification(req.query);
  if (!notifications) {
    next(new AppError('This Data is undefined.', 400));
  }
  res.status(200).json({
    status: 'success',
    notifications,
  });
});
exports.getAllNotifications = catchAsync(async (req, res, next) => {
  const notifications = await findAllNotifications(req.query);
  if (!notifications) {
    next(new AppError('This Data is undefined.', 400));
  }
  res.status(200).json({
    status: 'success',
    notifications,
  });
});

exports.getAllNotificationsByBattalionGroup = catchAsync(
  async (req, res, next) => {
    const notifications = await findNotification(req.query);
    if (!notifications) {
      next(new AppError('This Data is undefined.', 400));
    }
    res.status(200).json({
      status: 'success',
      notifications,
    });
  }
);

exports.updateStatusNotification = catchAsync(async (req, res, next) => {
  await findNotificationByIdAndUpdateStatus(req.query, req.body);

  res.status(200).json({
    status: 'success',
  });
});

exports.createNotification = catchAsync(async (req, res, next) => {
  const notification = await createNotification(req.body);
  if (!notification) {
    next(new AppError('This Data is undefined.', 400));
  }

  res.status(200).json({
    status: 'success',
    notification,
  });
});

exports.deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await findNotificationAndDelete(req.body);
  if (!Notification) {
    next(new AppError('This Data is undefined.', 400));
  }
  res.status(200).json({
    status: 'success',
    notification,
  });
});
