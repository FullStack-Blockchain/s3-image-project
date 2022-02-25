"use strict";
const AWS = require("aws-sdk");
var stream = require("stream");
var converter = new stream.Writable();


exports.handler = async ( event, context ) => {
    const res = new Array();
    const fileNames = event.queryStringParameters.fileNames;
    const keys = fileNames.split(",");
    AWS.config.update(
      {
        accessKeyId: "AKIAXERMTLGJMYGDR7VT",
        secretAccessKey: "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",
        region: "us-east-1"
      }
    );
    const s3 = new AWS.S3();
    for (let i = 0; i < keys.length; i++) {
      let options = {
        Bucket    : "yuwei-image",
        Key    : keys[i],
      };
      const fileStream = s3.getObject(options).createReadStream();
      const chunks = []
      for await (let chunk of fileStream) {
        chunks.push(chunk)
      }
      res[i] = Buffer.concat(chunks)
    }
    const response = {
        "statusCode": 200,
        "headers": {"access-control-allow-origin": "*",
                    "Content-Type": "multipart/form-data"},
        "body": JSON.stringify(res),
        "isBase64Encoded": false
    };
    return response;
}