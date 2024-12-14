const Redis = require('ioredis');

const createRedisClient = () => {
  const redisConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    tls: {
      rejectUnauthorized: false
    }
  };

  const client = new Redis(redisConfig);

  client.on('connect', () => {
    console.log('Connected to Redis successfully');
  });

  client.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  return client;
};

module.exports = createRedisClient;
