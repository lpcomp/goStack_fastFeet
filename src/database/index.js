import Sequelize from 'sequelize';

import User from '../app/models/User';
import Encomenda from '../app/models/Encomenda';
import Entregador from '../app/models/Entregador';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import Problem from '../app/models/Problem';

import databaseConfig from '../config/database';

const models = [User, Encomenda, Recipient, Entregador, File, Problem];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
