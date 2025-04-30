const express = require('express');

const {
  getAllNotifications,
  getNotificationById,
  createNotification,
  deleteNotification,
  updateStatusNotification,
  getAllNotificationsByBattalionGroup,
  getLastNotification,
  getNotificationByNumberMessage,
} = require('../controllers/NotificationController.js');
const { createNotificationValidations } = require('../validations/business.js');
const validate = require('../utils/ValidateResource.js');
const router = express.Router();

router.get('/getLastNotification', getLastNotification);
router.get('/getNotificationByNumberMessage', getNotificationByNumberMessage);

router.get('/getAllNotifications', getAllNotifications);
router.get(
  '/getAllNotificationsByBattalionGroup',
  getAllNotificationsByBattalionGroup
);

router.patch('/updateStatusNotification', updateStatusNotification);

router.post(
  '/createNotification',
  createNotificationValidations,
  validate(),
  createNotification
);
router.delete('/deleteNotification', deleteNotification);

module.exports = router;
