var AWS  = require('aws-sdk');

const s3 = new AWS.S3();

function connect({base_url, bucket_name}) {
  const headObject = key => {
    const args = {
      Bucket: bucket_name,
      Key: key
    };

    return new Promise((resolve, reject) => {
      s3.headObject(args, (err, resp) => {
        if (err && err.code !== 'NotFound') {
          return reject(err)
        }
        resolve(resp)
      })
    })
  }

  const putObject = (key, objectData) => {
    const args = {
      Bucket: bucket_name,
      Key: key,
      Body: objectData
    }

    return new Promise((resolve, reject) => {
      s3.putObject(args, (err, resp) => {
        if (err) {
          return re
        }
      })
    })
  }

  const makeObjectLink = key => `${base_url}/${bucket_name}/${key}`

  return {
    headObject,
    putObject,
    makeObjectLink
  }
}

 module.exports = Object.create({connect})
