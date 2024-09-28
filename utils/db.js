import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    let host = process.env.DB_HOST;
    let port = process.env.DB_PORT;
    let database = process.env.DB_DATABASE;
    if (!host) {
      host = '127.0.0.1';
    }
    if (!port) {
      port = 27017;
    }
    if (!database) {
      database = 'files_manager';
    }
    MongoClient(`mongodb://${host}:${port}`, (err, client) => {
      this.db = client.db(database);
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

  async nbFiles() {
    return this.files.countDocuments();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
