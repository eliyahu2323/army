const catchAsync = require('../utils/AsyncMiddleware');
const AppError = require('../utils/AppError');
const {
  createReports,
  findReports,
  findLastReports,
} = require('../services/ReportsService');

exports.getLastReports = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const data = await findLastReports(req.query);
  console.log(data);
  if (!data) {
    next(new AppError('This Data is undefined. Please login again', 400));
  }
  res.status(200).json({
    status: 'success',
    data,
  });
});

exports.createReports = catchAsync(async (req, res, next) => {
  const rep = await findReports(req.body.group, req.body.battalion);
  console.log(rep);
  const report = await createReports(req.body, rep.length);
  if (!report) {
    next(new AppError('לא נוצר דוח אנא נסה שנית', 400));
  }

  res.status(200).json({
    status: 'success',
    report,
  });
});

// exports.deleteOneReports = catchAsync(async (req, res, next) => {
//   const currentUser = await findReports({ userId: req.user.id });
//   if (!currentUser) {
//     next(new AppError('This Data is undefined. Please login again', 400));
//   }
//   const afterDelete = [];
//   currentUser[0].jobs.forEach((j) => {
//     if (j != req.body.job) afterDelete.push(j);
//   });
//   console.log(afterDelete);

//   const data = await findUserAndUpdateJobs(afterDelete, currentUser);
//   res.status(200).json({
//     status: 'success',
//     data,
//   });
// });
