var AWS  = require('aws-sdk');

function connect({base_url, bucket_name, region}) {
  console.log(region)

  AWS.config.update({region});
  const s3 = new AWS.S3();

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

  const putObject = (key, objectData, opts={}) => {
    const args = {
      Bucket: bucket_name,
      Key: key,
      Body: objectData,
      ...opts
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
