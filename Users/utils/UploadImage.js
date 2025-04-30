const multer = require('multer');

const uploadImage = multer({
  dest: 'images/',
});

module.exports = uploadImage;
