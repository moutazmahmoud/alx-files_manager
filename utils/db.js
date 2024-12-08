import mongoDBCore from 'mongodb/lib/core';
const { MongoClient } = require('mongodb');

/**
 * MongoDB client class for managing database interactions.
 * @class DBClient
 */
class DBClient {
  /**
   * Initializes the MongoDB client.
   * Sets the connection parameters and connects to the database.
   */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const uri = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    this.client.connect((err) => {
      if (!err) {
        // Successfully connected to the database.
        this.dbAlive = true;
      } else {
        console.error(`MongoDB Connection Error: ${err.message}`);
        this.dbAlive = false;
      }
    });
  }

  /**
   * Checks if the MongoDB client is connected.
   * @returns {boolean} `true` if connected, `false` otherwise.
   */
  isAlive() {
    return !!this.dbAlive;
  }

  /**
   * Counts the number of documents in the `users` collection.
   * @returns {Promise<number>} The number of users.
   */
  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  /**
   * Counts the number of documents in the `files` collection.
   * @returns {Promise<number>} The number of files.
   */
  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  /**
   * Provides access to the `users` collection.
   * @returns {Promise<Collection>} The `users` collection.
   */
  async usersCollection() {
    return this.client.db().collection('users');
  }

  /**
   * Retrieves a user by email.
   * @param {string} email - The email of the user.
   * @returns {Promise<Document>} The user document.
   */
  async findUserByEmail(email) {
    const usersCollection = await this.usersCollection();
    return usersCollection.findOne({ email });
  }

  /**
   * Retrieves a user by ID.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Document>} The user document.
   */
  async findUserById(userId) {
    const usersCollection = await this.usersCollection();
    return usersCollection.findOne({ _id: new mongoDBCore.BSON.ObjectId(userId) });
  }

  /**
   * Provides access to the `files` collection.
   * @returns {Promise<Collection>} The `files` collection.
   */
  async filesCollection() {
    return this.client.db().collection('files');
  }

  /**
   * Retrieves a file by ID.
   * @param {string} fileId - The ID of the file.
   * @returns {Promise<Document>} The file document.
   */
  async getFileById(fileId) {
    const filesCollection = await this.filesCollection();
    return filesCollection.findOne({ _id: new mongoDBCore.BSON.ObjectId(fileId) });
  }

  /**
   * Retrieves a file by ID and associated User ID.
   * @param {string} fileId - The ID of the file.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Document>} The file document.
   */
  async getFileByIdAndUserId(fileId, userId) {
    const filesCollection = await this.filesCollection();
    return filesCollection.findOne({
      _id: new mongoDBCore.BSON.ObjectId(fileId),
      userId: new mongoDBCore.BSON.ObjectId(userId),
    });
  }

  /**
   * Retrieves files based on query filters using aggregation.
   * @param {object[]} pipeline - The aggregation pipeline.
   * @returns {Promise<Document[]>} The resulting file documents.
   */
  async getFilesByQueryFilters(pipeline) {
    const filesCollection = await this.filesCollection();
    return filesCollection.aggregate(pipeline).toArray();
  }
}

// Export an instance of DBClient for use throughout the application.
const dbClient = new DBClient();
module.exports = dbClient;
