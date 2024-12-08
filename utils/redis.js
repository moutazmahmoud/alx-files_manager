import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Log any error
    this.client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });

    // Promisify the get, set, and del methods
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value;
    } catch (error) {
      console.error('Error getting value from Redis:', error);
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      await this.setAsync(key, value, 'EX', duration);
    } catch (error) {
      console.error('Error setting value in Redis:', error);
    }
  }

  async del(key) {
    try {
      await this.delAsync(key);
    } catch (error) {
      console.error('Error deleting value from Redis:', error);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
