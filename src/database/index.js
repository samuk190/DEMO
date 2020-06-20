import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import User from '../app/models/User';
import File from '../app/models/File';
import Request from '../app/models/Request';
import Userdevice from '../app/models/Userdevice';
import Message from '../app/models/Message';
import Appointment from '../app/models/Appointment';
import databaseConfig from '../config/database'; // importar conexão

const models = [User, File, Appointment, Request, Userdevice, Message];
class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
