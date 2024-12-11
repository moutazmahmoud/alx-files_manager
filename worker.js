import Queue from 'bull';
import { ObjectId } from 'mongodb';
import { promises as fsPromises } from 'fs';
import fileUtils from './utils/file';
import userUtils from './utils/user';
import basicUtils from './utils/basic';

const imageThumbnail = require('image-thumbnail');

// Define queues
const fileQueue = new Queue('fileQueue');
const userQueue = new Queue('userQueue');

// Process the fileQueue
fileQueue.process(async (job) => {
  const { fileId, userId } = job.data;

  // Validate job data
  if (!userId) {
    console.error('Missing userId');
    throw new Error('Missing userId');
  }
  if (!fileId) {
    console.error('Missing fileId');
    throw new Error('Missing fileId');
  }
  if (!basicUtils.isValidId(fileId) || !basicUtils.isValidId(userId)) {
    throw new Error('Invalid fileId or userId');
  }

  // Fetch the file from the database
  const fileRecord = await fileUtils.getFile({
    _id: ObjectId(fileId),
    userId: ObjectId(userId),
  });

  if (!fileRecord) throw new Error('File not found');

  const { localPath } = fileRecord;
  const thumbnailWidths = [500, 250, 100];

  // Generate thumbnails
  for (const width of thumbnailWidths) {
    const options = { width };
    try {
      const thumbnail = await imageThumbnail(localPath, options);
      const thumbnailPath = `${localPath}_${width}`;
      await fsPromises.writeFile(thumbnailPath, thumbnail);
      console.log(`Thumbnail created: ${thumbnailPath}`);
    } catch (error) {
      console.error(`Error generating thumbnail for width ${width}: ${error.message}`);
    }
  }
});

// Process the userQueue
userQueue.process(async (job) => {
  const { userId } = job.data;

  // Validate job data
  if (!userId) {
    console.error('Missing userId');
    throw new Error('Missing userId');
  }
  if (!basicUtils.isValidId(userId)) {
    throw new Error('Invalid userId');
  }

  // Fetch the user from the database
  const userRecord = await userUtils.getUser({
    _id: ObjectId(userId),
  });

  if (!userRecord) throw new Error('User not found');

  console.log(`Welcome, ${userRecord.email}!`);
});
