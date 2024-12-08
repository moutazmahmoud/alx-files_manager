const redisClient = require('../utils/redisClient');

describe('Redis Client', () => {
  it('should verify Redis is alive', async () => {
    const alive = await redisClient.isAlive();
    expect(alive).toBe(true);
  });

  it('should retrieve a value by key', async () => {
    await redisClient.set('test-key', 'test-value', 10);
    const value = await redisClient.get('test-key');
    expect(value).toBe('test-value');
  });

  it('should delete a key', async () => {
    await redisClient.set('test-key', 'test-value', 10);
    await redisClient.del('test-key');
    const value = await redisClient.get('test-key');
    expect(value).toBe(null);
  });
});
