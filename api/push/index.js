"use strict";

const express = require("express");
const router = express.Router();

var AWS = require("aws-sdk");


//AWS access details
console.log(AWS.config.region);
AWS.config.update({
  accessKeyId: "AKIAITMOVVWH2F5ZXWKQ",
  secretAccessKey: "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",
  region: "us-east-2",
});

const client = new AWS.Rekognition();
const bucket = "skywindimages";

const s3 = new AWS.S3({
  accessKeyId: "AKIAITMOVVWH2F5ZXWKQ",
  secretAccessKey: "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",
});

router.post("/upload", function (req, res) {
  const { image } = req.body;
  const { name } = req.body;

  // Setting up S3 upload parameters
  const uploadImage = {
    Bucket: bucket,
    Key: `${name}.jpg`, // File name you want to save as in S3
    Body: image,
  };

  // Uploading files to the bucket
  s3.upload(uploadImage, function (err, data) {
    if (err) {
      res.json({
        error: err,
      });
    }
    console.log(`File uploaded successfully. ${data.Location}`);
    res.json({
      result: data.Location,
    });
  });
});



router.post("/match", async function (req, res) {
  const { originName, targetName } = req.body;

  const photo_source = `${originName}.jpg`;
  const photo_target = `${targetName}.jpg`;

  const params = {
    QualityFilter: "NONE",
    SourceImage: {
      S3Object: {
        Bucket: bucket,
        Name: photo_source,
      },
    },
    TargetImage: {
      S3Object: {
        Bucket: bucket,
        Name: photo_target,
      },
    },
  };
  console.log(params);
  client.compareFaces(params, function (err, response) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      res.json({
        error: err,
      });
    } else {
      let temp = { result: [] };
      response.FaceMatches.forEach((data) => {
        temp = { ...temp, result: [...temp.result, data] };
      });
      res.json({
        result: temp,
      });
    } // if
  });
});

module.exports = router;
