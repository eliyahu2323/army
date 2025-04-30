const express = require('express');
const {
  addReport,
  getLastReports,
  createReports,
} = require('../controllers/ReportsController');

const router = express.Router();

router.post('/createReports', createReports);
router.get('/getLastReports', getLastReports);
// router.delete('/', deleteOneReport);

module.exports = router;
