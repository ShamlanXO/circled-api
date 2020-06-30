var fs = require("fs");
var AWS = require("aws-sdk");

// File

AWS.config.setPromisesDependency();
AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: "us-east-1",
});
// const config = {
//   bucketName: "dailymains-answer-edizvik",
//   region: "us-east-1",
//   accessKeyId: process.env.accessKeyId,
//   secretAccessKey: process.env.secretAccessKey,
// };
var s3 = new AWS.S3();

exports.multipartUpload = (req, res) => {
  console.log("getting call");
  // var params = {
  //   Bucket: "dailymains-answer-edizvik",
  //   Body: fs.createReadStream(req.file.path),
  //   Key: `${Date.now()}${req.file.originalname}`
  // };
  // s3.upload(params, (err, data) => {
  //   if (err) {
  //     return res.status(500).send({ ErrorOccured: err });
  //   }
  //   if (data) {
  //     fs.unlinkSync(req.file.path); // Empty temp folder
  //     const locationUrl = data.Location;
  //     return res.status(200).send({
  //       message: "File uploaded Successfully",
  //       Location: locationUrl,
  //       Key: params.Key
  //     });
  //   }
  // });

  ////////////////////////////////////

  var buffer = fs.readFileSync(req.file.path);
  // S3 Upload options
  var bucket = "lms-video-files";

  console.log("getting call2");
  // Upload
  var startTime = new Date();
  var partNum = 0;
  var Key = `${Date.now()}${req.file.originalname}`;
  var partSize = 1024 * 1024 * 5; // Minimum 5MB per chunk (except the last part) http://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadComplete.html
  var numPartsLeft = Math.ceil(buffer.length / partSize);
  console.log(numPartsLeft);
  var maxUploadTries = 3;
  var multiPartParams = {
    Bucket: "lms-video-files",
    Key: Key,
  };
  var multipartMap = {
    Parts: [],
  };

  console.log("Creating multipart upload for:");
  s3.createMultipartUpload(multiPartParams, function (mpErr, multipart) {
    if (mpErr) {
      console.log("Error!", mpErr);
      return;
    }
    console.log("Got upload ID", multipart.UploadId);

    // Grab each partSize chunk and upload it as a part
    for (
      var rangeStart = 0;
      rangeStart < buffer.length;
      rangeStart += partSize
    ) {
      partNum++;
      var end = Math.min(rangeStart + partSize, buffer.length),
        partParams = {
          Body: buffer.slice(rangeStart, end),
          Bucket: bucket,
          Key: Key,
          PartNumber: String(partNum),
          UploadId: multipart.UploadId,
        };

      // Send a single part
      console.log(
        "Uploading part: #",
        partParams.PartNumber,
        ", Range start:",
        rangeStart
      );
      uploadPart(s3, multipart, partParams);
    }
  });

  function completeMultipartUpload(s3, doneParams) {
    s3.completeMultipartUpload(doneParams, function (err, data) {
      if (err) {
        console.log("An error occurred while completing the multipart upload");
        console.log(err);
      } else {
        var delta = (new Date() - startTime) / 1000;
        console.log("Completed upload in", delta, "seconds");
        console.log("Final upload data:", data);
        res.send(data);
      }
    });
  }

  function uploadPart(s3, multipart, partParams, tryNum) {
    var tryNum = tryNum || 1;
    s3.uploadPart(partParams, function (multiErr, mData) {
      if (multiErr) {
        console.log("multiErr, upload part error:", multiErr);
        if (tryNum < maxUploadTries) {
          console.log("Retrying upload of part: #", partParams.PartNumber);
          uploadPart(s3, multipart, partParams, tryNum + 1);
        } else {
          console.log("Failed uploading part: #", partParams.PartNumber);
        }
        return;
      }
      multipartMap.Parts[this.request.params.PartNumber - 1] = {
        ETag: mData.ETag,
        PartNumber: Number(this.request.params.PartNumber),
      };
      console.log("Completed part", this.request.params.PartNumber);
      console.log("mData", mData);
      if (--numPartsLeft > 0) return; // complete only when all parts uploaded

      var doneParams = {
        Bucket: bucket,
        Key: Key,
        MultipartUpload: multipartMap,
        UploadId: multipart.UploadId,
      };

      console.log("Completing upload...");
      completeMultipartUpload(s3, doneParams);
    });
  }
};

exports.fetchList = (req, res) => {
  const params = {
    Bucket: "lms-video-files",
    Delimiter: "/",
  };

  var keys = [];

  s3.listObjects(params, (err, data) => {
    if (err) console.log(err);
    console.log("err", err);
    console.log(data);
    data.Contents.forEach((elem) => {
      keys = keys.concat(elem.Key);
    });
    return res.send(keys);
  });
};
