var express = require("express");
var app = express();
const bodyParser = require("body-parser");
var cors = require('cors');
var file_system = require('fs');
var archiver = require('archiver');
app.use(cors());

app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

var image_dir = "C:\/Users\/DELL\/";
var image_zip_dir = "C:\/Users\/DELL\/Desktop\/ImageUpload\/uploadImageToServer\/imageZip\/";

app.get('/editor/index', function (req, res, next) {
  res.sendfile('index.html')
});

app.get('/editor/getimage', function (req, res, next) {
  var param = req.query;
  zipfile(req, function (error_msg) {
    if (error_msg) {
      res.status(200).send({ success: false, message: 'Không tìm thấy thư mục theo SKU' });
    } else {
      res.download(image_zip_dir + param.sku + ".zip", param.sku + ".zip");
    }
  });
});

zipfile = async (req, callback) => {
  var param = req.query;
  if (file_system.existsSync(image_dir + param.sku)) {
    var archive = archiver('zip');
    var output = file_system.createWriteStream(image_zip_dir + param.sku + '.zip');

    output.on('close', function () {
      console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.on('error', function (err) {
      throw err;
    });
    archive.pipe(output);
    archive.directory(image_dir + param.sku, param.sku);
    archive.finalize();
    setTimeout(function () {
      callback();
    }, 1000);
  } else {
    callback("NOT_DIRECTORY");
  }
}

app.listen(3000, () => {
  console.log("Server running on port 3000");
});