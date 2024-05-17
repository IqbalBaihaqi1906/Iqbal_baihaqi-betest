const redis = require('ioredis');

const client = new redis.Redis(process.env.REDIS_URI);

client.on('error', (error) => {
  console.error('Error connecting to Redis:', error);
});

module.exports = client;