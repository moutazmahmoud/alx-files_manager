const dbClient = require('../utils/dbClient');

describe('Database Client', () => {
  it('should verify MongoDB is alive', async () => {
    const alive = await dbClient.isAlive();
    expect(alive).toBe(true);
  });

  it('should retrieve the number of users in the database', async () => {
    const usersCount = await dbClient.nbUsers();
    expect(usersCount).toBeGreaterThanOrEqual(0);
  });

  it('should retrieve the number of files in the database', async () => {
    const filesCount = await dbClient.nbFiles();
    expect(filesCount).toBeGreaterThanOrEqual(0);
  });
});
