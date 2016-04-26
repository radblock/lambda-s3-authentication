// this is notes/junk
// here be dragons

var aws = require('aws-sdk')

module.exports = function authenticator (options) {
  let s3 = new aws.S3()
  let { bucket } = options
  let new_user = function (input) {
    return bucket
  }
  return Object.freeze({
    go_create_or_find: true,
    go_verify: true
  })
}

function s3_promise (method, opts) {
  return new Promise(function (resolve, reject) {
    s3.call(method, opts, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = function User (input) {
  return new Promise(function (resolve, reject) {
    api = {}
    s3_promise('getObject', {
      Bucket: 'radblock-users',
      Key: input.email
    }).then(get_body)
      .then(resolve)
      .catch(new_user)
  })
  function get_body (s3_object) {
    return new Promise(function (resolve, reject) {
      resolve(s3_object)
    })
  }
  function new_user (s3_object) {
    return new Promise(function (resolve, reject) {
      var code = generate_code()
      var salt = generate_salt()
      var user = {
        "email": input.email,
        "password_hash": hash(input.password, salt),
        "password_salt": "something",
        "state": "pending",
        "pending_gif": input.gif,
        "code": code
      }
      s3_promise ('putObject', {
        Bucket: 'radblock-users',
        Key: input.email,
        ContentType: 'application/json',
        Body: JSON.stringify(user)
      })
      .then(function () { resolve(user) })
    })
  }
}

