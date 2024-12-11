const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class FilesController {
  static async postUpload(req, res) {
    const {
      name, type, parentId = 0, isPublic = false, data,
    } = req.body;

    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!['folder', 'file', 'image'].includes(type)) { return res.status(400).json({ error: 'Missing type' }); }
    if (type !== 'folder' && !data) { return res.status(400).json({ error: 'Missing data' }); }

    const { userId } = req;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    if (parentId !== 0) {
      const parentFile = await dbClient.db
        .collection('files')
        .findOne({ _id: new ObjectId(parentId) });
      if (!parentFile) { return res.status(400).json({ error: 'Parent not found' }); }
      if (parentFile.type !== 'folder') { return res.status(400).json({ error: 'Parent is not a folder' }); }
    }

    const fileDocument = {
      userId: new ObjectId(userId),
      name,
      type,
      parentId,
      isPublic,
    };

    if (type !== 'folder') {
      const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
      if (!fs.existsSync(folderPath)) { fs.mkdirSync(folderPath, { recursive: true }); }

      const localPath = path.join(folderPath, uuidv4());
      fs.writeFileSync(localPath, Buffer.from(data, 'base64'));

      fileDocument.localPath = localPath;
    }

    const result = await dbClient.db
      .collection('files')
      .insertOne(fileDocument);

    res.status(201).json({
      id: result.insertedId,
      userId,
      name,
      type,
      isPublic,
      parentId,
    });
  }

  static async getShow(req, res) {
    // Implementation for GET /files/:id
  }

  static async getIndex(req, res) {
    // Implementation for GET /files
  }
}

module.exports = FilesController;
