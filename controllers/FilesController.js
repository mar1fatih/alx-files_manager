import { ObjectId } from 'mongodb';
import { promises } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import atob from 'atob';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const typeList = ['folder', 'file', 'image'];

class FilesController {
  static async postUpload(req, res) {
    const token = req.get('X-Token');
    const userId = await redisClient.get(`auth_${token}`);
    if (!token || !userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const {
      name,
      type,
      data,
    } = req.body;
    let { parentId } = req.body;
    let { isPublic } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !typeList.includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (!data && type !== 'folder') {
      return res.status(400).json({ error: 'Missing data' });
    }
    if (parentId) {
      const fileid = await dbClient.files.findOne({ _id: new ObjectId(parentId) });
      if (!fileid) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (fileid.type !== 'folder') {
        console.log(fileid);
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    } else parentId = '0';
    if (!isPublic) isPublic = false;
    if (type === 'folder') {
      const resp = await dbClient.files.insertOne({
        userId: new ObjectId(userId),
        name,
        type,
        isPublic,
        parentId,
      });
      const doc = {
        id: resp.insertedId.toString(),
        userId,
        name,
        type,
        isPublic,
        parentId,
      };
      return res.status(201).json(doc);
    }
    const filePath = process.env.FOLDER_PATH || '/tmp/files_manager';
    const fileName = uuidv4();
    const decodedData = atob(data);
    promises.mkdir(filePath, { recursive: true });
    const folderPath = path.join(filePath, fileName);
    promises.writeFile(folderPath, decodedData);
    const userid = await dbClient.files.insertOne({
      userId: new ObjectId(userId),
      name,
      type,
      isPublic,
      parentId,
      localPath: `${filePath}/${fileName}`,
    });
    const fileDoc = {
      id: userid.insertedId.toString(),
      userId,
      name,
      type,
      isPublic,
      parentId,
    };
    return res.status(201).json(fileDoc);
  }
}
module.exports = FilesController;
