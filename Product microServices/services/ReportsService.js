const Reports = require('../models/ReportsModel');

exports.findReports = (group, battalion) => {
  return Reports.find({
    group: group,
    battalion: battalion,
  });
};

exports.findLastReports = (query) => {
  return Reports.findOne({
    group: query.group,
    battalion: query.battalion,
  });
  // .sort({ createdAt: -1 })
  // .exec();
  // .sort({ _id: -1 })
  // .limit(1);
};
exports.createReports = (query, number_Report) => {
  return Reports.create({
    group: query.group,
    number_Report: number_Report,
    battalion: query.battalion,
    reports: query.reports,
  });
};
