import { MongoClient } from 'mongodb';

class DBClient {
    host = process.env.DB_HOST;
    port = process.env.DB_PORT;
    database = process.env.DB_DATABASE;
    constructor() {
      if (!this.host) {
        this.host = '127.0.0.1';
      }
      if (!this.port) {
        this.port = 27017;
      }
      if (!this.database) {
        this.database = 'files_manager';
      }
      MongoClient(`mongodb://${this.host}:${this.port}`, (err, client) => {
        this.db = client.db(this.database);
        this.users = this.db.collection('users');
        this.files = this.db.collection('files');
      });
    }

    isAlive() {
      return Boolean(this.db);
    }

    async nbUsers() {
      return this.users.countDocuments();
    }

    async nbFiles () {
      return this.files.countDocuments();
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
