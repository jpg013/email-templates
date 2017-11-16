const redis   = require('redis');
const winston = require('winston');

const onConnectionRetry = options => {
  if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with an individual error
      return new Error('The redis server refused the connection');
  }
  if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands with an individual error
      return new Error('Redis retry time exhausted');
  }
  if (options.attempt > 10) {
    // End reconnecting after a specific timeout and flush all commands with an individual error
    return new Error('Redis retry attempts exhausted');
  }
  // reconnect after
  return Math.min(options.attempt * 100, 3000);
};

function connect(options, mediator) {
  const redisOptions = {
    url: options.connection,
    retry: onConnectionRetry
  }
  const redisClient = redis.createClient(redisOptions);
  const onRedisError = err => {
    winston.log('error', 'There was an error connecting to redis!', {
      errMsg: err
    })

    mediator.emit('cache.error')
  }

  const onRedisConnect = () => mediator.emit('cache.ready', redisClient)

  redisClient.on('error', onRedisError);
  redisClient.on('connect', onRedisConnect)
}

 module.exports = Object.create({ connect })
