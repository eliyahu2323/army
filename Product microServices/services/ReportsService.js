const Reports = require('../models/ReportsModel');

exports.findReports = (group, battalion) => {
  return Reports.find({
    group: group,
    battalion: battalion,
  });
};

exports.findLastReports = (query) => {
  return Reports.findOne(query).sort({ createdAt: -1 }).exec();
};
exports.createReports = (query, number_Report) => {
  return Reports.create({
    group: query.group,
    number_Report: number_Report,
    battalion: query.battalion,
    reports: query.reports,
  });
};
