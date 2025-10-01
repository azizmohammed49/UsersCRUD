const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const newFileName = uniqueSuffix + "-" + file.originalname;
    cb(null, newFileName); // Only set the filename here
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
